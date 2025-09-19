import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import db from '@/config/database';
import { asyncHandler } from '@/middleware/errorHandler';
import { businessOwnerMiddleware } from '@/middleware/auth';
import { AuthRequest, Business, ApiResponse } from '@/types';

const router = express.Router();

// Validation schemas
const createBusinessSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  industry: Joi.string().required(),
  tax_id: Joi.string().optional(),
  address: Joi.string().optional(),
  settings: Joi.object({
    fiscal_year_end: Joi.string().default('12-31'),
    currency: Joi.string().default('USD'),
    timezone: Joi.string().default('America/Los_Angeles'),
    auto_categorization: Joi.boolean().default(true),
    integration_settings: Joi.object().default({})
  }).optional()
});

// Get all businesses for user
router.get('/', asyncHandler(async (req: AuthRequest, res) => {
  const businesses = await db('businesses')
    .where({ user_id: req.user!.id })
    .orderBy('created_at', 'desc');

  const response: ApiResponse<Business[]> = {
    success: true,
    data: businesses
  };

  res.json(response);
}));

// Get single business
router.get('/:businessId', businessOwnerMiddleware, asyncHandler(async (req: AuthRequest, res) => {
  const business = await db('businesses')
    .where({ id: req.params.businessId })
    .first();

  if (!business) {
    return res.status(404).json({ error: 'Business not found' });
  }

  const response: ApiResponse<Business> = {
    success: true,
    data: business
  };

  res.json(response);
}));

// Create business
router.post('/', asyncHandler(async (req: AuthRequest, res) => {
  const { error } = createBusinessSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Check account limits
  const existingBusinesses = await db('businesses')
    .where({ user_id: req.user!.id })
    .count('id as count')
    .first();

  const businessCount = parseInt(existingBusinesses?.count as string || '0');
  
  // Enforce limits based on account type
  if (req.user!.account_type === 'free' && businessCount >= 1) {
    return res.status(403).json({ error: 'Free accounts are limited to 1 business' });
  }

  const businessId = uuidv4();
  const defaultSettings = {
    fiscal_year_end: '12-31',
    currency: 'USD',
    timezone: 'America/Los_Angeles',
    auto_categorization: true,
    integration_settings: {
      stripe_enabled: false,
      square_enabled: false,
      paypal_enabled: false,
      venmo_enabled: false,
      cashapp_enabled: false,
      nmi_enabled: false,
      paysley_enabled: false,
      bank_sync_enabled: false
    }
  };

  const business = {
    id: businessId,
    user_id: req.user!.id,
    name: req.body.name,
    description: req.body.description,
    industry: req.body.industry,
    tax_id: req.body.tax_id,
    address: req.body.address,
    settings: JSON.stringify({ ...defaultSettings, ...req.body.settings }),
    created_at: new Date(),
    updated_at: new Date()
  };

  await db('businesses').insert(business);

  // Generate default chart of accounts
  await generateDefaultAccounts(businessId, req.body.industry);

  const response: ApiResponse<Business> = {
    success: true,
    data: { ...business, settings: JSON.parse(business.settings) }
  };

  res.status(201).json(response);
}));

// Update business
router.put('/:businessId', businessOwnerMiddleware, asyncHandler(async (req: AuthRequest, res) => {
  const updates = {
    ...req.body,
    settings: req.body.settings ? JSON.stringify(req.body.settings) : undefined,
    updated_at: new Date()
  };

  await db('businesses')
    .where({ id: req.params.businessId })
    .update(updates);

  const business = await db('businesses')
    .where({ id: req.params.businessId })
    .first();

  const response: ApiResponse<Business> = {
    success: true,
    data: { ...business, settings: JSON.parse(business.settings) }
  };

  res.json(response);
}));

// Delete business
router.delete('/:businessId', businessOwnerMiddleware, asyncHandler(async (req: AuthRequest, res) => {
  await db.transaction(async (trx) => {
    // Delete related records first
    await trx('transactions').where({ business_id: req.params.businessId }).del();
    await trx('accounts').where({ business_id: req.params.businessId }).del();
    await trx('integrations').where({ business_id: req.params.businessId }).del();
    await trx('businesses').where({ id: req.params.businessId }).del();
  });

  const response: ApiResponse = {
    success: true,
    message: 'Business deleted successfully'
  };

  res.json(response);
}));

// Helper function to generate default accounts
async function generateDefaultAccounts(businessId: string, industry: string) {
  const baseAccounts = [
    // Assets
    { name: 'Cash and Cash Equivalents', type: 'asset', code: '1100' },
    { name: 'Accounts Receivable', type: 'asset', code: '1200' },
    { name: 'Inventory', type: 'asset', code: '1300' },
    { name: 'Prepaid Expenses', type: 'asset', code: '1400' },
    { name: 'Fixed Assets', type: 'asset', code: '1500' },

    // Liabilities
    { name: 'Accounts Payable', type: 'liability', code: '2100' },
    { name: 'Accrued Expenses', type: 'liability', code: '2200' },
    { name: 'Short-term Debt', type: 'liability', code: '2300' },
    { name: 'Long-term Debt', type: 'liability', code: '2400' },

    // Equity
    { name: 'Owner\'s Equity', type: 'equity', code: '3100' },
    { name: 'Retained Earnings', type: 'equity', code: '3200' },

    // Revenue
    { name: 'Sales Revenue', type: 'revenue', code: '4100' },
    { name: 'Service Revenue', type: 'revenue', code: '4200' },
    { name: 'Other Income', type: 'revenue', code: '4900' },

    // Expenses
    { name: 'Cost of Goods Sold', type: 'expense', code: '5100' },
    { name: 'Advertising & Marketing', type: 'expense', code: '5200' },
    { name: 'Office Expenses', type: 'expense', code: '5300' },
    { name: 'Professional Services', type: 'expense', code: '5400' },
    { name: 'Rent', type: 'expense', code: '5500' },
    { name: 'Utilities', type: 'expense', code: '5600' },
    { name: 'Insurance', type: 'expense', code: '5700' },
    { name: 'Travel & Entertainment', type: 'expense', code: '5800' }
  ];

  const accounts = baseAccounts.map(account => ({
    id: uuidv4(),
    business_id: businessId,
    name: account.name,
    account_type: account.type,
    account_code: account.code,
    is_active: true,
    auto_generated: true,
    created_at: new Date(),
    updated_at: new Date()
  }));

  await db('accounts').insert(accounts);
}

export default router;