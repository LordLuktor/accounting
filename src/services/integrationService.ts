export interface IntegrationConfig {
  id: string;
  name: string;
  apiKey?: string;
  secretKey?: string;
  environment: 'sandbox' | 'production';
  webhookUrl?: string;
  isActive: boolean;
}

export interface TransactionData {
  id: string;
  amount: number;
  currency: string;
  description: string;
  timestamp: string;
  source: string;
  metadata?: Record<string, any>;
}

export class IntegrationService {
  private static instance: IntegrationService;
  private integrations: Map<string, IntegrationConfig> = new Map();

  public static getInstance(): IntegrationService {
    if (!IntegrationService.instance) {
      IntegrationService.instance = new IntegrationService();
    }
    return IntegrationService.instance;
  }

  async connectStripe(apiKey: string, webhookSecret: string): Promise<boolean> {
    try {
      // In real implementation, this would validate the Stripe keys
      const config: IntegrationConfig = {
        id: 'stripe',
        name: 'Stripe',
        apiKey,
        secretKey: webhookSecret,
        environment: 'production',
        isActive: true
      };
      
      this.integrations.set('stripe', config);
      return true;
    } catch (error) {
      console.error('Stripe connection failed:', error);
      return false;
    }
  }

  async connectSquare(applicationId: string, accessToken: string): Promise<boolean> {
    try {
      const config: IntegrationConfig = {
        id: 'square',
        name: 'Square',
        apiKey: applicationId,
        secretKey: accessToken,
        environment: 'production',
        isActive: true
      };
      
      this.integrations.set('square', config);
      return true;
    } catch (error) {
      console.error('Square connection failed:', error);
      return false;
    }
  }

  async connectPayPal(clientId: string, clientSecret: string): Promise<boolean> {
    try {
      const config: IntegrationConfig = {
        id: 'paypal',
        name: 'PayPal',
        apiKey: clientId,
        secretKey: clientSecret,
        environment: 'production',
        isActive: true
      };
      
      this.integrations.set('paypal', config);
      return true;
    } catch (error) {
      console.error('PayPal connection failed:', error);
      return false;
    }
  }

  async syncTransactions(integrationId: string): Promise<TransactionData[]> {
    const integration = this.integrations.get(integrationId);
    if (!integration || !integration.isActive) {
      throw new Error(`Integration ${integrationId} not found or inactive`);
    }

    // In real implementation, this would call the actual APIs
    const mockTransactions: TransactionData[] = [
      {
        id: `${integrationId}_tx_1`,
        amount: 2500,
        currency: 'USD',
        description: `${integration.name} Payment - Customer Purchase`,
        timestamp: new Date().toISOString(),
        source: integration.name,
        metadata: { customer_id: 'cus_123', invoice_id: 'inv_456' }
      },
      {
        id: `${integrationId}_tx_2`,
        amount: 1250,
        currency: 'USD',
        description: `${integration.name} Payment - Service Fee`,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        source: integration.name,
        metadata: { fee_type: 'service' }
      }
    ];

    return mockTransactions;
  }

  async setupWebhook(integrationId: string, webhookUrl: string): Promise<boolean> {
    const integration = this.integrations.get(integrationId);
    if (!integration) {
      return false;
    }

    integration.webhookUrl = webhookUrl;
    this.integrations.set(integrationId, integration);
    return true;
  }

  getActiveIntegrations(): IntegrationConfig[] {
    return Array.from(this.integrations.values()).filter(config => config.isActive);
  }

  async testConnection(integrationId: string): Promise<boolean> {
    const integration = this.integrations.get(integrationId);
    if (!integration) {
      return false;
    }

    // In real implementation, this would test the actual API connection
    return true;
  }
}

export const integrationService = IntegrationService.getInstance();