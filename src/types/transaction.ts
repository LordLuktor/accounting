export interface Transaction {
  id: string;
  business_id: string;
  account_id: string;
  integration_source?: string;
  external_transaction_id?: string;
  transaction_type: 'debit' | 'credit';
  amount: number;
  currency: string;
  description: string;
  reference_number?: string;
  transaction_date: string;
  reconciled: boolean;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface TransactionCategory {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  account_id: string;
  auto_rules: CategoryRule[];
  created_at: string;
}

export interface CategoryRule {
  field: 'description' | 'amount' | 'source';
  operator: 'contains' | 'equals' | 'greater_than' | 'less_than';
  value: string | number;
}