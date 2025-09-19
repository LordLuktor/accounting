import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import db from '@/config/database';
import { asyncHandler } from '@/middleware/errorHandler';
import { businessOwnerMiddleware } from '@/middleware/auth';
import { AuthRequest, Transaction, ApiResponse } from '@/types';

const router = express.Router();

// Validation schemas
const createTransactionSchema = Joi.object({
  business_id: Joi.string().required(),
  account_id: Joi.string().required(),
  transaction_type: Joi.string().valid('debit', 'credit').required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().default('USD'),
  description: Joi.string().required(),
  reference_number: Joi.string().optional(),
  transaction_date: Joi.date().required(),
  integration_source: Joi.string().optional(),
  external_transaction_id: Joi.string().optional(),
  metadata: Joi.object().optional()
});

// Get transactions for business
router.get('/business/:businessId', businessOwnerMiddleware, asyncHandler(async (req: AuthRequest, res) => {
  const { page = 1, limit = 50, type, search, startDate, endDate } = req.query;
  
  let query = db('transactions')
    .join('accounts', 'transactions.account_id', 'accounts.id')
    .where({ 'transactions.business_id': req.params.businessId })
    .select(
      'transactions.*',
      'accounts.name as account_name',
      'accounts.account_code'
    )
    .orderBy('transactions.transaction_date', 'desc')
    .orderBy('transactions.created_at', 'desc');

  // Apply filters
  if (type && type !== 'all') {
    query = query.where('transactions.transaction_type', type);
  }

  if (search) {
    query = query.where(function() {
      this.where('transactions.description', 'ilike', `%${search}%`)
          .orWhere('transactions.reference_number', 'ilike', `%${search}%`);
    });
  }

  if (startDate) {
    query = query.where('transactions.transaction_date', '>=', startDate);
  }

  if (endDate) {
    query = query.where('transactions.transaction_date', '<=', endDate);
  }

  // Pagination
  const offset = (Number(page) - 1) * Number(limit);
  const transactions = await query.limit(Number(limit)).offset(offset);

  // Get total count
  const totalQuery = db('transactions')
    .where({ business_id: req.params.businessId })
    .count('id as count');

  if (type && type !== 'all') {
    totalQuery.where('transaction_type', type);
  }

  const totalResult = await totalQuery.first();
  const total = parseInt(totalResult?.count as string || '0');

  const response: ApiResponse<{
    transactions: Transaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> = {
    success: true,
    data: {
      transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  };

  res.json(response);
}));

// Get single transaction
router.get('/:transactionId', asyncHandler(async (req: AuthRequest, res) => {
  const transaction = await db('transactions')
    .join('businesses', 'transactions.business_id', 'businesses.id')
    .join('accounts', 'transactions.account_id', 'accounts.id')
    .where({ 
      'transactions.id': req.params.transactionId,
      'businesses.user_id': req.user!.id 
    })
    .select(
      'transactions.*',
      'accounts.name as account_name',
      'accounts.account_code'
    )
    .first();

  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  const response: ApiResponse<Transaction> = {
    success: true,
    data: transaction
  };

  res.json(response);
}));

// Create transaction
router.post('/', asyncHandler(async (req: AuthRequest, res) => {
  const { error } = createTransactionSchema.validate(req.body);
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

  // Verify account exists and belongs to business
  const account = await db('accounts')
    .where({ 
      id: req.body.account_id, 
      business_id: req.body.business_id,
      is_active: true 
    })
    .first();

  if (!account) {
    return res.status(400).json({ error: 'Invalid account' });
  }

  // Check transaction limits for free accounts
  if (req.user!.account_type === 'free') {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const monthlyTransactions = await db('transactions')
      .join('businesses', 'transactions.business_id', 'businesses.id')
      .where({ 'businesses.user_id': req.user!.id })
      .where('transactions.created_at', '>=', currentMonth)
      .count('transactions.id as count')
      .first();

    const count = parseInt(monthlyTransactions?.count as string || '0');
    if (count >= 500) {
      return res.status(403).json({ error: 'Monthly transaction limit reached for free account' });
    }
  }

  const transactionId = uuidv4();
  const transaction = {
    id: transactionId,
    business_id: req.body.business_id,
    account_id: req.body.account_id,
    integration_source: req.body.integration_source,
    external_transaction_id: req.body.external_transaction_id,
    transaction_type: req.body.transaction_type,
    amount: req.body.amount,
    currency: req.body.currency || 'USD',
    description: req.body.description,
    reference_number: req.body.reference_number,
    transaction_date: new Date(req.body.transaction_date),
    reconciled: false,
    metadata: req.body.metadata ? JSON.stringify(req.body.metadata) : null,
    created_at: new Date(),
    updated_at: new Date()
  };

  await db('transactions').insert(transaction);

  const response: ApiResponse<Transaction> = {
    success: true,
    data: transaction
  };

  res.status(201).json(response);
}));

// Update transaction
router.put('/:transactionId', asyncHandler(async (req: AuthRequest, res) => {
  // Verify transaction ownership
  const transaction = await db('transactions')
    .join('businesses', 'transactions.business_id', 'businesses.id')
    .where({ 
      'transactions.id': req.params.transactionId,
      'businesses.user_id': req.user!.id 
    })
    .select('transactions.*')
    .first();

  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  const updates = {
    description: req.body.description,
    reference_number: req.body.reference_number,
    reconciled: req.body.reconciled,
    updated_at: new Date()
  };

  await db('transactions')
    .where({ id: req.params.transactionId })
    .update(updates);

  const updatedTransaction = await db('transactions')
    .where({ id: req.params.transactionId })
    .first();

  const response: ApiResponse<Transaction> = {
    success: true,
    data: updatedTransaction
  };

  res.json(response);
}));

// Delete transaction
router.delete('/:transactionId', asyncHandler(async (req: AuthRequest, res) => {
  // Verify transaction ownership
  const transaction = await db('transactions')
    .join('businesses', 'transactions.business_id', 'businesses.id')
    .where({ 
      'transactions.id': req.params.transactionId,
      'businesses.user_id': req.user!.id 
    })
    .select('transactions.*')
    .first();

  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  if (transaction.integration_source) {
    return res.status(400).json({ error: 'Cannot delete transactions from integrations' });
  }

  await db('transactions')
    .where({ id: req.params.transactionId })
    .del();

  const response: ApiResponse = {
    success: true,
    message: 'Transaction deleted successfully'
  };

  res.json(response);
}));

// Bulk reconcile transactions
router.post('/reconcile', asyncHandler(async (req: AuthRequest, res) => {
  const { transactionIds, reconciled = true } = req.body;

  if (!Array.isArray(transactionIds) || transactionIds.length === 0) {
    return res.status(400).json({ error: 'Transaction IDs required' });
  }

  // Verify all transactions belong to user
  const transactions = await db('transactions')
    .join('businesses', 'transactions.business_id', 'businesses.id')
    .whereIn('transactions.id', transactionIds)
    .where({ 'businesses.user_id': req.user!.id })
    .select('transactions.id');

  if (transactions.length !== transactionIds.length) {
    return res.status(403).json({ error: 'Some transactions not found or access denied' });
  }

  await db('transactions')
    .whereIn('id', transactionIds)
    .update({ reconciled, updated_at: new Date() });

  const response: ApiResponse = {
    success: true,
    message: `${transactions.length} transactions updated`
  };

  res.json(response);
}));

export default router;