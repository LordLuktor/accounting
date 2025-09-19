import express from 'express';
import db from '@/config/database';
import { asyncHandler } from '@/middleware/errorHandler';
import { adminMiddleware } from '@/middleware/auth';
import { AuthRequest, ApiResponse } from '@/types';

const router = express.Router();

// All admin routes require admin middleware
router.use(adminMiddleware);

// Get admin dashboard stats
router.get('/stats', asyncHandler(async (req: AuthRequest, res) => {
  const totalUsers = await db('users').count('id as count').first();
  const totalBusinesses = await db('businesses').count('id as count').first();
  const totalTransactions = await db('transactions').count('id as count').first();
  const activeIntegrations = await db('integrations').where({ is_active: true }).count('id as count').first();

  // Get user counts by account type
  const usersByType = await db('users')
    .select('account_type')
    .count('id as count')
    .groupBy('account_type');

  // Get monthly growth
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const monthlyUsers = await db('users')
    .where('created_at', '>=', currentMonth)
    .count('id as count')
    .first();

  const monthlyBusinesses = await db('businesses')
    .where('created_at', '>=', currentMonth)
    .count('id as count')
    .first();

  const monthlyTransactions = await db('transactions')
    .where('created_at', '>=', currentMonth)
    .count('id as count')
    .first();

  const stats = {
    totals: {
      users: parseInt(totalUsers?.count as string || '0'),
      businesses: parseInt(totalBusinesses?.count as string || '0'),
      transactions: parseInt(totalTransactions?.count as string || '0'),
      activeIntegrations: parseInt(activeIntegrations?.count as string || '0')
    },
    usersByType: usersByType.reduce((acc, row) => {
      acc[row.account_type] = parseInt(row.count as string || '0');
      return acc;
    }, {} as Record<string, number>),
    monthlyGrowth: {
      users: parseInt(monthlyUsers?.count as string || '0'),
      businesses: parseInt(monthlyBusinesses?.count as string || '0'),
      transactions: parseInt(monthlyTransactions?.count as string || '0')
    }
  };

  const response: ApiResponse<typeof stats> = {
    success: true,
    data: stats
  };

  res.json(response);
}));

// Get all users with pagination
router.get('/users', asyncHandler(async (req: AuthRequest, res) => {
  const { page = 1, limit = 50, search, accountType } = req.query;

  let query = db('users')
    .select('id', 'email', 'first_name', 'last_name', 'role', 'account_type', 'subscription_status', 'created_at')
    .orderBy('created_at', 'desc');

  // Apply filters
  if (search) {
    query = query.where(function() {
      this.where('email', 'ilike', `%${search}%`)
          .orWhere('first_name', 'ilike', `%${search}%`)
          .orWhere('last_name', 'ilike', `%${search}%`);
    });
  }

  if (accountType && accountType !== 'all') {
    query = query.where('account_type', accountType);
  }

  // Pagination
  const offset = (Number(page) - 1) * Number(limit);
  const users = await query.limit(Number(limit)).offset(offset);

  // Get total count
  let countQuery = db('users').count('id as count');
  
  if (search) {
    countQuery = countQuery.where(function() {
      this.where('email', 'ilike', `%${search}%`)
          .orWhere('first_name', 'ilike', `%${search}%`)
          .orWhere('last_name', 'ilike', `%${search}%`);
    });
  }

  if (accountType && accountType !== 'all') {
    countQuery = countQuery.where('account_type', accountType);
  }

  const totalResult = await countQuery.first();
  const total = parseInt(totalResult?.count as string || '0');

  const response: ApiResponse<{
    users: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> = {
    success: true,
    data: {
      users,
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

// Get user details with businesses and stats
router.get('/users/:userId', asyncHandler(async (req: AuthRequest, res) => {
  const user = await db('users')
    .where({ id: req.params.userId })
    .select('id', 'email', 'first_name', 'last_name', 'role', 'account_type', 'subscription_status', 'created_at', 'updated_at')
    .first();

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Get user's businesses
  const businesses = await db('businesses')
    .where({ user_id: req.params.userId })
    .select('id', 'name', 'industry', 'created_at');

  // Get user's transaction count
  const transactionCount = await db('transactions')
    .join('businesses', 'transactions.business_id', 'businesses.id')
    .where({ 'businesses.user_id': req.params.userId })
    .count('transactions.id as count')
    .first();

  // Get user's integration count
  const integrationCount = await db('integrations')
    .join('businesses', 'integrations.business_id', 'businesses.id')
    .where({ 'businesses.user_id': req.params.userId })
    .count('integrations.id as count')
    .first();

  const userDetails = {
    ...user,
    businesses,
    stats: {
      businessCount: businesses.length,
      transactionCount: parseInt(transactionCount?.count as string || '0'),
      integrationCount: parseInt(integrationCount?.count as string || '0')
    }
  };

  const response: ApiResponse<typeof userDetails> = {
    success: true,
    data: userDetails
  };

  res.json(response);
}));

// Update user account type (admin only)
router.put('/users/:userId/account-type', asyncHandler(async (req: AuthRequest, res) => {
  const { accountType } = req.body;

  if (!['paid', 'free', 'invited', 'super_free'].includes(accountType)) {
    return res.status(400).json({ error: 'Invalid account type' });
  }

  const user = await db('users')
    .where({ id: req.params.userId })
    .first();

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  await db('users')
    .where({ id: req.params.userId })
    .update({ 
      account_type: accountType,
      subscription_status: accountType === 'free' || accountType === 'super_free' ? 'free' : 'active',
      updated_at: new Date()
    });

  const response: ApiResponse = {
    success: true,
    message: 'User account type updated successfully'
  };

  res.json(response);
}));

// Get system activity logs
router.get('/activity', asyncHandler(async (req: AuthRequest, res) => {
  const { page = 1, limit = 50 } = req.query;

  // Get recent user registrations
  const recentUsers = await db('users')
    .select('email', 'first_name', 'last_name', 'account_type', 'created_at')
    .orderBy('created_at', 'desc')
    .limit(10);

  // Get recent businesses
  const recentBusinesses = await db('businesses')
    .join('users', 'businesses.user_id', 'users.id')
    .select('businesses.name', 'businesses.industry', 'businesses.created_at', 'users.email as user_email')
    .orderBy('businesses.created_at', 'desc')
    .limit(10);

  // Get recent transactions
  const recentTransactions = await db('transactions')
    .join('businesses', 'transactions.business_id', 'businesses.id')
    .join('users', 'businesses.user_id', 'users.id')
    .select('transactions.amount', 'transactions.description', 'transactions.created_at', 'businesses.name as business_name', 'users.email as user_email')
    .orderBy('transactions.created_at', 'desc')
    .limit(10);

  const activity = {
    recentUsers,
    recentBusinesses,
    recentTransactions
  };

  const response: ApiResponse<typeof activity> = {
    success: true,
    data: activity
  };

  res.json(response);
}));

export default router;