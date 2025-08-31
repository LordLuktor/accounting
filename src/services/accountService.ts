import { Account } from '../types/business';

export interface AccountTemplate {
  name: string;
  account_type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  account_code: string;
  description?: string;
  parent_code?: string;
}

export class AccountService {
  private static instance: AccountService;

  public static getInstance(): AccountService {
    if (!AccountService.instance) {
      AccountService.instance = new AccountService();
    }
    return AccountService.instance;
  }

  // Standard chart of accounts templates by industry
  getAccountTemplates(industry: string): AccountTemplate[] {
    const baseTemplate: AccountTemplate[] = [
      // Assets
      { name: 'Cash and Cash Equivalents', account_type: 'asset', account_code: '1100' },
      { name: 'Accounts Receivable', account_type: 'asset', account_code: '1200' },
      { name: 'Inventory', account_type: 'asset', account_code: '1300' },
      { name: 'Prepaid Expenses', account_type: 'asset', account_code: '1400' },
      { name: 'Fixed Assets', account_type: 'asset', account_code: '1500' },

      // Liabilities
      { name: 'Accounts Payable', account_type: 'liability', account_code: '2100' },
      { name: 'Accrued Expenses', account_type: 'liability', account_code: '2200' },
      { name: 'Short-term Debt', account_type: 'liability', account_code: '2300' },
      { name: 'Long-term Debt', account_type: 'liability', account_code: '2400' },

      // Equity
      { name: 'Owner\'s Equity', account_type: 'equity', account_code: '3100' },
      { name: 'Retained Earnings', account_type: 'equity', account_code: '3200' },

      // Revenue
      { name: 'Sales Revenue', account_type: 'revenue', account_code: '4100' },
      { name: 'Service Revenue', account_type: 'revenue', account_code: '4200' },
      { name: 'Other Income', account_type: 'revenue', account_code: '4900' },

      // Expenses
      { name: 'Cost of Goods Sold', account_type: 'expense', account_code: '5100' },
      { name: 'Advertising & Marketing', account_type: 'expense', account_code: '5200' },
      { name: 'Office Expenses', account_type: 'expense', account_code: '5300' },
      { name: 'Professional Services', account_type: 'expense', account_code: '5400' },
      { name: 'Rent', account_type: 'expense', account_code: '5500' },
      { name: 'Utilities', account_type: 'expense', account_code: '5600' },
      { name: 'Insurance', account_type: 'expense', account_code: '5700' },
      { name: 'Travel & Entertainment', account_type: 'expense', account_code: '5800' },
    ];

    // Industry-specific additions
    const industryTemplates: Record<string, AccountTemplate[]> = {
      'Technology': [
        { name: 'Software Licenses', account_type: 'expense', account_code: '5250' },
        { name: 'Development Tools', account_type: 'expense', account_code: '5260' },
        { name: 'Cloud Services', account_type: 'expense', account_code: '5270' },
        { name: 'Intellectual Property', account_type: 'asset', account_code: '1600' },
      ],
      'Professional Services': [
        { name: 'Professional Development', account_type: 'expense', account_code: '5250' },
        { name: 'Client Entertainment', account_type: 'expense', account_code: '5810' },
        { name: 'Work in Progress', account_type: 'asset', account_code: '1350' },
      ],
      'Retail': [
        { name: 'Merchandise Inventory', account_type: 'asset', account_code: '1310' },
        { name: 'Store Equipment', account_type: 'asset', account_code: '1510' },
        { name: 'Point of Sale Fees', account_type: 'expense', account_code: '5250' },
      ]
    };

    const industrySpecific = industryTemplates[industry] || [];
    return [...baseTemplate, ...industrySpecific];
  }

  async generateAccountsForBusiness(businessId: string, industry: string): Promise<Account[]> {
    const templates = this.getAccountTemplates(industry);
    
    const accounts: Account[] = templates.map(template => ({
      id: `acc_${Math.random().toString(36).substr(2, 9)}`,
      business_id: businessId,
      parent_account_id: template.parent_code ? this.findAccountByCode(templates, template.parent_code)?.account_code : undefined,
      name: template.name,
      account_type: template.account_type,
      account_code: template.account_code,
      description: template.description,
      is_active: true,
      auto_generated: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    return accounts;
  }

  private findAccountByCode(templates: AccountTemplate[], code: string): AccountTemplate | undefined {
    return templates.find(t => t.account_code === code);
  }

  async createManualAccount(businessId: string, accountData: Partial<Account>): Promise<Account> {
    const account: Account = {
      id: `acc_${Math.random().toString(36).substr(2, 9)}`,
      business_id: businessId,
      parent_account_id: accountData.parent_account_id,
      name: accountData.name || '',
      account_type: accountData.account_type || 'expense',
      account_code: accountData.account_code || '',
      description: accountData.description,
      is_active: true,
      auto_generated: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return account;
  }

  async categorizeTansaction(description: string, amount: number, source: string): Promise<string | null> {
    // Simple rule-based categorization - in real app, this would be more sophisticated
    const rules = [
      { keywords: ['office', 'supplies', 'staples'], category: 'Office Expenses' },
      { keywords: ['software', 'subscription', 'saas'], category: 'Software' },
      { keywords: ['marketing', 'advertising', 'ads'], category: 'Marketing' },
      { keywords: ['rent', 'lease'], category: 'Rent' },
      { keywords: ['utility', 'electric', 'gas', 'water'], category: 'Utilities' },
      { keywords: ['travel', 'flight', 'hotel'], category: 'Travel' },
      { keywords: ['meal', 'restaurant', 'food'], category: 'Meals & Entertainment' },
    ];

    const lowerDescription = description.toLowerCase();
    
    for (const rule of rules) {
      if (rule.keywords.some(keyword => lowerDescription.includes(keyword))) {
        return rule.category;
      }
    }

    return null;
  }

  validateAccountCode(code: string, existingCodes: string[]): boolean {
    // Ensure unique and properly formatted account codes
    if (!/^\d{4}$/.test(code)) {
      return false;
    }
    
    return !existingCodes.includes(code);
  }

  generateAccountCode(accountType: string, existingCodes: string[]): string {
    const ranges = {
      asset: { start: 1000, end: 1999 },
      liability: { start: 2000, end: 2999 },
      equity: { start: 3000, end: 3999 },
      revenue: { start: 4000, end: 4999 },
      expense: { start: 5000, end: 5999 }
    };

    const range = ranges[accountType as keyof typeof ranges];
    if (!range) {
      throw new Error('Invalid account type');
    }

    for (let code = range.start; code <= range.end; code += 10) {
      const codeStr = code.toString();
      if (!existingCodes.includes(codeStr)) {
        return codeStr;
      }
    }

    throw new Error('No available account codes in range');
  }
}

export const accountService = AccountService.getInstance();