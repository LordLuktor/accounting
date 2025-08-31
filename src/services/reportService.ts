import { Transaction } from '../types/transaction';
import { Account } from '../types/business';

export interface ReportData {
  title: string;
  dateRange: string;
  currency: string;
  sections: ReportSection[];
  totals: Record<string, number>;
}

export interface ReportSection {
  name: string;
  accounts: ReportAccount[];
  total: number;
}

export interface ReportAccount {
  name: string;
  code: string;
  balance: number;
  transactions: number;
}

export class ReportService {
  private static instance: ReportService;

  public static getInstance(): ReportService {
    if (!ReportService.instance) {
      ReportService.instance = new ReportService();
    }
    return ReportService.instance;
  }

  async generateProfitLossReport(
    businessId: string, 
    startDate: string, 
    endDate: string,
    transactions: Transaction[],
    accounts: Account[]
  ): Promise<ReportData> {
    const filteredTransactions = transactions.filter(t => 
      t.business_id === businessId && 
      t.transaction_date >= startDate && 
      t.transaction_date <= endDate
    );

    const revenueAccounts = accounts.filter(a => a.account_type === 'revenue');
    const expenseAccounts = accounts.filter(a => a.account_type === 'expense');

    const revenueSection = this.calculateAccountBalances(revenueAccounts, filteredTransactions);
    const expenseSection = this.calculateAccountBalances(expenseAccounts, filteredTransactions);

    const totalRevenue = revenueSection.reduce((sum, acc) => sum + acc.balance, 0);
    const totalExpenses = expenseSection.reduce((sum, acc) => sum + acc.balance, 0);

    return {
      title: 'Profit & Loss Statement',
      dateRange: `${startDate} to ${endDate}`,
      currency: 'USD',
      sections: [
        {
          name: 'Revenue',
          accounts: revenueSection,
          total: totalRevenue
        },
        {
          name: 'Expenses',
          accounts: expenseSection,
          total: totalExpenses
        }
      ],
      totals: {
        revenue: totalRevenue,
        expenses: totalExpenses,
        netIncome: totalRevenue - totalExpenses
      }
    };
  }

  async generateBalanceSheetReport(
    businessId: string, 
    asOfDate: string,
    transactions: Transaction[],
    accounts: Account[]
  ): Promise<ReportData> {
    const filteredTransactions = transactions.filter(t => 
      t.business_id === businessId && 
      t.transaction_date <= asOfDate
    );

    const assetAccounts = accounts.filter(a => a.account_type === 'asset');
    const liabilityAccounts = accounts.filter(a => a.account_type === 'liability');
    const equityAccounts = accounts.filter(a => a.account_type === 'equity');

    const assets = this.calculateAccountBalances(assetAccounts, filteredTransactions);
    const liabilities = this.calculateAccountBalances(liabilityAccounts, filteredTransactions);
    const equity = this.calculateAccountBalances(equityAccounts, filteredTransactions);

    const totalAssets = assets.reduce((sum, acc) => sum + acc.balance, 0);
    const totalLiabilities = liabilities.reduce((sum, acc) => sum + acc.balance, 0);
    const totalEquity = equity.reduce((sum, acc) => sum + acc.balance, 0);

    return {
      title: 'Balance Sheet',
      dateRange: `As of ${asOfDate}`,
      currency: 'USD',
      sections: [
        { name: 'Assets', accounts: assets, total: totalAssets },
        { name: 'Liabilities', accounts: liabilities, total: totalLiabilities },
        { name: 'Equity', accounts: equity, total: totalEquity }
      ],
      totals: {
        assets: totalAssets,
        liabilities: totalLiabilities,
        equity: totalEquity
      }
    };
  }

  private calculateAccountBalances(accounts: Account[], transactions: Transaction[]): ReportAccount[] {
    return accounts.map(account => {
      const accountTransactions = transactions.filter(t => t.account_id === account.id);
      
      const balance = accountTransactions.reduce((sum, t) => {
        return sum + (t.transaction_type === 'credit' ? t.amount : -t.amount);
      }, 0);

      return {
        name: account.name,
        code: account.account_code,
        balance: Math.abs(balance),
        transactions: accountTransactions.length
      };
    });
  }

  async generateCashFlowReport(
    businessId: string,
    startDate: string,
    endDate: string,
    transactions: Transaction[]
  ): Promise<ReportData> {
    const filteredTransactions = transactions.filter(t => 
      t.business_id === businessId && 
      t.transaction_date >= startDate && 
      t.transaction_date <= endDate
    );

    // Group transactions by month
    const monthlyData = this.groupTransactionsByMonth(filteredTransactions);
    
    return {
      title: 'Cash Flow Statement',
      dateRange: `${startDate} to ${endDate}`,
      currency: 'USD',
      sections: [],
      totals: monthlyData
    };
  }

  private groupTransactionsByMonth(transactions: Transaction[]): Record<string, number> {
    const monthlyTotals: Record<string, number> = {};

    transactions.forEach(transaction => {
      const month = transaction.transaction_date.substring(0, 7); // YYYY-MM
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = 0;
      }
      
      monthlyTotals[month] += transaction.transaction_type === 'credit' 
        ? transaction.amount 
        : -transaction.amount;
    });

    return monthlyTotals;
  }

  async exportReport(reportData: ReportData, format: 'pdf' | 'csv' | 'excel'): Promise<Blob> {
    // In real implementation, this would generate actual file formats
    const content = JSON.stringify(reportData, null, 2);
    return new Blob([content], { type: 'application/json' });
  }
}

export const reportService = ReportService.getInstance();