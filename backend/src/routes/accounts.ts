import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import db from '@/config/database';
import { asyncHandler } from '@/middleware/errorHandler';
import { businessOwnerMiddleware } from '@/middleware/auth';
import { AuthRequest, Account, ApiResponse } from '@/types';

const router = express.Router();

// Validation schemas
const createAccountSchema = Joi.object({
  business_id: Joi.string().required(),
  name: Joi.string().required(),
  account_type: Joi.string().valid('asset', 'liability', 'equity', 'revenue', 'expense').required(),
  account_code: Joi.string().required(),
  description: Joi.string().optional(),
  parent_account_id: Joi.string().optional()
});

// Get accounts for business
router.get('/business/:businessId', businessOwnerMiddleware, asyncHandler(async (req: AuthRequest, res) => {
  const accounts = await db('accounts')
    .where({ business_id: req.params.businessId, is_active: true })
    .orderBy('account_code', 'asc');

  const response: ApiResponse<Account[]> = {
    success: true,
    data: accounts
  };

  res.json(response);
}));

// Get single account
router.get('/:accountId', asyncHandler(async (req: AuthRequest, res) => {
  const account = await db('accounts')
    .join('businesses', 'accounts.business_id', 'businesses.id')
    .where({ 
      'accounts.id': req.params.accountId,
      'businesses.user_id': req.user!.id 
    })
    .select('accounts.*')
    .first();

  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  const response: ApiResponse<Account> = {
    success: true,
    data: account
  };

  res.json(response);
}));

// Create account
router.post('/', asyncHandler(async (req: AuthRequest, res) => {
  const { error } = createAccountSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Verify business ownership
  const business = await db('businesses')
    .where({ id: req.body.business_id, user_id: req.user!.id })
    .first();

  if (!business) {
    return res.status(403).json({ error: 'Access denied' });
  }

  // Check if account code already exists for this business
  const existingAccount = await db('accounts')
    .where({ 
      business_id: req.body.business_id, 
      account_code: req.body.account_code 
    })
    .first();

  if (existingAccount) {
    return res.status(400).json({ error: 'Account code already exists for this business' });
  }

  const accountId = uuidv4();
  const account = {
    id: accountId,
    business_id: req.body.business_id,
    parent_account_id: req.body.parent_account_id,
    name: req.body.name,
    account_type: req.body.account_type,
    account_code: req.body.account_code,
    description: req.body.description,
    is_active: true,
    auto_generated: false,
    created_at: new Date(),
    updated_at: new Date()
  };

  await db('accounts').insert(account);

  const response: ApiResponse<Account> = {
    success: true,
    data: account
  };

  res.status(201).json(response);
}));

// Update account
router.put('/:accountId', asyncHandler(async (req: AuthRequest, res) => {
  // Verify account ownership
  const account = await db('accounts')
    .join('businesses', 'accounts.business_id', 'businesses.id')
    .where({ 
      'accounts.id': req.params.accountId,
      'businesses.user_id': req.user!.id 
    })
    .select('accounts.*')
    .first();

  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  if (account.auto_generated && req.body.account_code !== account.account_code) {
    return res.status(400).json({ error: 'Cannot change account code for auto-generated accounts' });
  }

  const updates = {
    name: req.body.name,
    description: req.body.description,
    updated_at: new Date()
  };

  await db('accounts')
    .where({ id: req.params.accountId })
    .update(updates);

  const updatedAccount = await db('accounts')
    .where({ id: req.params.accountId })
    .first();

  const response: ApiResponse<Account> = {
    success: true,
    data: updatedAccount
  };

  res.json(response);
}));

// Delete account
router.delete('/:accountId', asyncHandler(async (req: AuthRequest, res) => {
  // Verify account ownership
  const account = await db('accounts')
    .join('businesses', 'accounts.business_id', 'businesses.id')
    .where({ 
      'accounts.id': req.params.accountId,
      'businesses.user_id': req.user!.id 
    })
    .select('accounts.*')
    .first();

  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  if (account.auto_generated) {
    return res.status(400).json({ error: 'Cannot delete auto-generated accounts' });
  }

  // Check if account has transactions
  const transactionCount = await db('transactions')
    .where({ account_id: req.params.accountId })
    .count('id as count')
    .first();

  if (parseInt(transactionCount?.count as string || '0') > 0) {
    return res.status(400).json({ error: 'Cannot delete account with existing transactions' });
  }

  await db('accounts')
    .where({ id: req.params.accountId })
    .update({ is_active: false, updated_at: new Date() });

  const response: ApiResponse = {
    success: true,
    message: 'Account deleted successfully'
  };

  res.json(response);
}));

export default router;