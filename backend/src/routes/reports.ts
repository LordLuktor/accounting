import express from 'express';
import db from '@/config/database';
import { asyncHandler } from '@/middleware/errorHandler';
import { businessOwnerMiddleware } from '@/middleware/auth';
import { AuthRequest, ApiResponse } from '@/types';

const router = express.Router();

// Get profit & loss report
router.get('/profit-loss/:businessId', businessOwnerMiddleware, asyncHandler(async (req: AuthRequest, res) => {
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Start date and end date are required' });
  }

  // Get revenue transactions
  const revenueData = await db('transactions')
    .join('accounts', 'transactions.account_id', 'accounts.id')
    .where({
      'transactions.business_id': req.params.businessId,
      'accounts.account_type': 'revenue'
    })
    .whereBetween('transactions.transaction_date', [startDate, endDate])
    .select(
      'accounts.name as account_name',
      'accounts.account_code',
      db.raw('SUM(CASE WHEN transactions.transaction_type = \'credit\' THEN transactions.amount ELSE -transactions.amount END) as balance'),
      db.raw('COUNT(transactions.id) as transaction_count')
    )
    .groupBy('accounts.id', 'accounts.name', 'accounts.account_code')
    .orderBy('accounts.account_code');

  // Get expense transactions
  const expenseData = await db('transactions')
    .join('accounts', 'transactions.account_id', 'accounts.id')
    .where({
      'transactions.business_id': req.params.businessId,
      'accounts.account_type': 'expense'
    })
    .whereBetween('transactions.transaction_date', [startDate, endDate])
    .select(
      'accounts.name as account_name',
      'accounts.account_code',
      db.raw('SUM(CASE WHEN transactions.transaction_type = \'debit\' THEN transactions.amount ELSE -transactions.amount END) as balance'),
      db.raw('COUNT(transactions.id) as transaction_count')
    )
    .groupBy('accounts.id', 'accounts.name', 'accounts.account_code')
    .orderBy('accounts.account_code');

  const totalRevenue = revenueData.reduce((sum, account) => sum + parseFloat(account.balance || '0'), 0);
  const totalExpenses = expenseData.reduce((sum, account) => sum + parseFloat(account.balance || '0'), 0);
  const netIncome = totalRevenue - totalExpenses;

  const report = {
    title: 'Profit & Loss Statement',
    dateRange: `${startDate} to ${endDate}`,
    currency: 'USD',
    sections: [
      {
        name: 'Revenue',
        accounts: revenueData.map(account => ({
          name: account.account_name,
          code: account.account_code,
          balance: parseFloat(account.balance || '0'),
          transactions: parseInt(account.transaction_count || '0')
        })),
        total: totalRevenue
      },
      {
        name: 'Expenses',
        accounts: expenseData.map(account => ({
          name: account.account_name,
          code: account.account_code,
          balance: parseFloat(account.balance || '0'),
          transactions: parseInt(account.transaction_count || '0')
        })),
        total: totalExpenses
      }
    ],
    totals: {
      revenue: totalRevenue,
      expenses: totalExpenses,
      netIncome
    }
  };

  const response: ApiResponse<typeof report> = {
    success: true,
    data: report
  };

  res.json(response);
}));

// Get balance sheet report
router.get('/balance-sheet/:businessId', businessOwnerMiddleware, asyncHandler(async (req: AuthRequest, res) => {
  const { asOfDate } = req.query;
  
  if (!asOfDate) {
    return res.status(400).json({ error: 'As of date is required' });
  }

  // Get asset balances
  const assetData = await db('transactions')
    .join('accounts', 'transactions.account_id', 'accounts.id')
    .where({
      'transactions.business_id': req.params.businessId,
      'accounts.account_type': 'asset'
    })
    .where('transactions.transaction_date', '<=', asOfDate)
    .select(
      'accounts.name as account_name',
      'accounts.account_code',
      db.raw('SUM(CASE WHEN transactions.transaction_type = \'debit\' THEN transactions.amount ELSE -transactions.amount END) as balance'),
      db.raw('COUNT(transactions.id) as transaction_count')
    )
    .groupBy('accounts.id', 'accounts.name', 'accounts.account_code')
    .orderBy('accounts.account_code');

  // Get liability balances
  const liabilityData = await db('transactions')
    .join('accounts', 'transactions.account_id', 'accounts.id')
    .where({
      'transactions.business_id': req.params.businessId,
      'accounts.account_type': 'liability'
    })
    .where('transactions.transaction_date', '<=', asOfDate)
    .select(
      'accounts.name as account_name',
      'accounts.account_code',
      db.raw('SUM(CASE WHEN transactions.transaction_type = \'credit\' THEN transactions.amount ELSE -transactions.amount END) as balance'),
      db.raw('COUNT(transactions.id) as transaction_count')
    )
    .groupBy('accounts.id', 'accounts.name', 'accounts.account_code')
    .orderBy('accounts.account_code');

  // Get equity balances
  const equityData = await db('transactions')
    .join('accounts', 'transactions.account_id', 'accounts.id')
    .where({
      'transactions.business_id': req.params.businessId,
      'accounts.account_type': 'equity'
    })
    .where('transactions.transaction_date', '<=', asOfDate)
    .select(
      'accounts.name as account_name',
      'accounts.account_code',
      db.raw('SUM(CASE WHEN transactions.transaction_type = \'credit\' THEN transactions.amount ELSE -transactions.amount END) as balance'),
      db.raw('COUNT(transactions.id) as transaction_count')
    )
    .groupBy('accounts.id', 'accounts.name', 'accounts.account_code')
    .orderBy('accounts.account_code');

  const totalAssets = assetData.reduce((sum, account) => sum + parseFloat(account.balance || '0'), 0);
  const totalLiabilities = liabilityData.reduce((sum, account) => sum + parseFloat(account.balance || '0'), 0);
  const totalEquity = equityData.reduce((sum, account) => sum + parseFloat(account.balance || '0'), 0);

  const report = {
    title: 'Balance Sheet',
    dateRange: `As of ${asOfDate}`,
    currency: 'USD',
    sections: [
      {
        name: 'Assets',
        accounts: assetData.map(account => ({
          name: account.account_name,
          code: account.account_code,
          balance: parseFloat(account.balance || '0'),
          transactions: parseInt(account.transaction_count || '0')
        })),
        total: totalAssets
      },
      {
        name: 'Liabilities',
        accounts: liabilityData.map(account => ({
          name: account.account_name,
          code: account.account_code,
          balance: parseFloat(account.balance || '0'),
          transactions: parseInt(account.transaction_count || '0')
        })),
        total: totalLiabilities
      },
      {
        name: 'Equity',
        accounts: equityData.map(account => ({
          name: account.account_name,
          code: account.account_code,
          balance: parseFloat(account.balance || '0'),
          transactions: parseInt(account.transaction_count || '0')
        })),
        total: totalEquity
      }
    ],
    totals: {
      assets: totalAssets,
      liabilities: totalLiabilities,
      equity: totalEquity
    }
  };

  const response: ApiResponse<typeof report> = {
    success: true,
    data: report
  };

  res.json(response);
}));

// Get cash flow report
router.get('/cash-flow/:businessId', businessOwnerMiddleware, asyncHandler(async (req: AuthRequest, res) => {
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Start date and end date are required' });
  }

  // Get cash account transactions grouped by month
  const cashFlowData = await db('transactions')
    .join('accounts', 'transactions.account_id', 'accounts.id')
    .where({
      'transactions.business_id': req.params.businessId,
      'accounts.account_type': 'asset'
    })
    .where('accounts.name', 'ilike', '%cash%')
    .whereBetween('transactions.transaction_date', [startDate, endDate])
    .select(
      db.raw('DATE_TRUNC(\'month\', transactions.transaction_date) as month'),
      db.raw('SUM(CASE WHEN transactions.transaction_type = \'debit\' THEN transactions.amount ELSE -transactions.amount END) as net_flow')
    )
    .groupBy(db.raw('DATE_TRUNC(\'month\', transactions.transaction_date)'))
    .orderBy('month');

  const monthlyTotals: Record<string, number> = {};
  cashFlowData.forEach(row => {
    const month = new Date(row.month).toISOString().substring(0, 7);
    monthlyTotals[month] = parseFloat(row.net_flow || '0');
  });

  const report = {
    title: 'Cash Flow Statement',
    dateRange: `${startDate} to ${endDate}`,
    currency: 'USD',
    sections: [],
    totals: monthlyTotals
  };

  const response: ApiResponse<typeof report> = {
    success: true,
    data: report
  };

  res.json(response);
}));

// Get transaction summary report
router.get('/transaction-summary/:businessId', businessOwnerMiddleware, asyncHandler(async (req: AuthRequest, res) => {
  const { startDate, endDate } = req.query;
  
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Start date and end date are required' });
  }

  const summaryData = await db('transactions')
    .where({
      business_id: req.params.businessId
    })
    .whereBetween('transaction_date', [startDate, endDate])
    .select(
      db.raw('COUNT(*) as total_transactions'),
      db.raw('AVG(amount) as average_amount'),
      db.raw('MAX(amount) as largest_amount'),
      db.raw('MIN(amount) as smallest_amount'),
      db.raw('SUM(CASE WHEN transaction_type = \'credit\' THEN amount ELSE 0 END) as total_credits'),
      db.raw('SUM(CASE WHEN transaction_type = \'debit\' THEN amount ELSE 0 END) as total_debits')
    )
    .first();

  const report = {
    title: 'Transaction Summary',
    dateRange: `${startDate} to ${endDate}`,
    currency: 'USD',
    data: {
      totalTransactions: parseInt(summaryData?.total_transactions || '0'),
      averageAmount: parseFloat(summaryData?.average_amount || '0'),
      largestAmount: parseFloat(summaryData?.largest_amount || '0'),
      smallestAmount: parseFloat(summaryData?.smallest_amount || '0'),
      totalCredits: parseFloat(summaryData?.total_credits || '0'),
      totalDebits: parseFloat(summaryData?.total_debits || '0')
    }
  };

  const response: ApiResponse<typeof report> = {
    success: true,
    data: report
  };

  res.json(response);
}));

export default router;