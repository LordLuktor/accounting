export interface Business {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  industry: string;
  tax_id?: string;
  address?: string;
  created_at: string;
  updated_at: string;
  settings: BusinessSettings;
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
  created_at: string;
  updated_at: string;
}