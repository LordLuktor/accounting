export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'user';
  account_type: 'paid' | 'free' | 'invited' | 'super_free';
  subscription_status: 'active' | 'inactive' | 'trial' | 'free';
  invited_by?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Business {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  industry: string;
  tax_id?: string;
  address?: string;
  settings: BusinessSettings;
  created_at: Date;
  updated_at: Date;
}

export interface BusinessSettings {
  fiscal_year_end: string;
  currency: string;
  timezone: string;
  auto_categorization: boolean;
  integration_settings: IntegrationSettings;
}

export interface IntegrationSettings {
  stripe_enabled: boolean;
  square_enabled: boolean;
  paypal_enabled: boolean;
  venmo_enabled: boolean;
  cashapp_enabled: boolean;
  nmi_enabled: boolean;
  paysley_enabled: boolean;
  bank_sync_enabled: boolean;
}

export interface Account {
  id: string;
  business_id: string;
  parent_account_id?: string;
  name: string;
  account_type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  account_code: string;
  description?: string;
  is_active: boolean;
  auto_generated: boolean;
  created_at: Date;
  updated_at: Date;
}

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
  transaction_date: Date;
  reconciled: boolean;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface Integration {
  id: string;
  business_id: string;
  provider: string;
  provider_account_id?: string;
  access_token?: string;
  refresh_token?: string;
  webhook_secret?: string;
  settings: Record<string, any>;
  is_active: boolean;
  last_sync?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Invitation {
  id: string;
  email: string;
  invited_by: string;
  invited_by_name: string;
  status: 'pending' | 'accepted' | 'expired';
  token: string;
  expires_at: Date;
  used_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}