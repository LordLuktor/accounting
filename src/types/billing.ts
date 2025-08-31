export interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  trial_end?: string;
  amount: number;
  currency: string;
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BillingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billing_interval: 'monthly' | 'yearly';
  features: string[];
  max_businesses: number;
  max_transactions_per_month: number;
  is_active: boolean;
}