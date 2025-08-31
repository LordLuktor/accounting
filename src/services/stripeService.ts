export interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface SubscriptionData {
  id: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  plan: {
    id: string;
    nickname: string;
    amount: number;
    currency: string;
    interval: string;
  };
}

export class StripeService {
  private static instance: StripeService;
  private config: StripeConfig | null = null;

  public static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  initialize(config: StripeConfig) {
    this.config = config;
  }

  async createSubscription(customerId: string, priceId: string): Promise<SubscriptionData> {
    // In real implementation, this would call Stripe API
    const mockSubscription: SubscriptionData = {
      id: `sub_${Math.random().toString(36).substr(2, 9)}`,
      status: 'active',
      current_period_start: Date.now() / 1000,
      current_period_end: (Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000,
      plan: {
        id: priceId,
        nickname: this.getPlanName(priceId),
        amount: this.getPlanAmount(priceId),
        currency: 'usd',
        interval: 'month'
      }
    };

    return mockSubscription;
  }

  async updateSubscription(subscriptionId: string, newPriceId: string): Promise<SubscriptionData> {
    // In real implementation, this would update the Stripe subscription
    const mockSubscription: SubscriptionData = {
      id: subscriptionId,
      status: 'active',
      current_period_start: Date.now() / 1000,
      current_period_end: (Date.now() + 30 * 24 * 60 * 60 * 1000) / 1000,
      plan: {
        id: newPriceId,
        nickname: this.getPlanName(newPriceId),
        amount: this.getPlanAmount(newPriceId),
        currency: 'usd',
        interval: 'month'
      }
    };

    return mockSubscription;
  }

  async attachPaymentMethod(customerId: string, paymentMethodId: string): Promise<PaymentMethod> {
    // In real implementation, this would attach payment method to customer
    const mockPaymentMethod: PaymentMethod = {
      id: paymentMethodId,
      type: 'card',
      card: {
        brand: 'visa',
        last4: '4242',
        exp_month: 12,
        exp_year: 2025
      }
    };

    return mockPaymentMethod;
  }

  async createSetupIntent(customerId: string): Promise<{ client_secret: string }> {
    // In real implementation, this would create a Stripe SetupIntent
    return {
      client_secret: `seti_${Math.random().toString(36).substr(2, 20)}_secret_${Math.random().toString(36).substr(2, 20)}`
    };
  }

  private getPlanName(priceId: string): string {
    const planNames: Record<string, string> = {
      'price_starter': 'Starter',
      'price_starter_2k': 'Starter 2K',
      'price_starter_5k': 'Starter 5K',
      'price_growth': 'Growth',
      'price_professional': 'Professional',
      'price_enterprise': 'Enterprise'
    };
    return planNames[priceId] || 'Unknown Plan';
  }

  private getPlanAmount(priceId: string): number {
    const planAmounts: Record<string, number> = {
      'price_starter': 900,
      'price_starter_2k': 1200,
      'price_starter_5k': 1500,
      'price_growth': 1900,
      'price_professional': 2900,
      'price_enterprise': 9900
    };
    return planAmounts[priceId] || 0;
  }

  async setupWebhook(endpoint: string): Promise<{ id: string; secret: string }> {
    // In real implementation, this would create a Stripe webhook
    return {
      id: `we_${Math.random().toString(36).substr(2, 9)}`,
      secret: `whsec_${Math.random().toString(36).substr(2, 32)}`
    };
  }
}

export const stripeService = StripeService.getInstance();