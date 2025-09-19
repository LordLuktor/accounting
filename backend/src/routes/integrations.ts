import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import db from '@/config/database';
import { asyncHandler } from '@/middleware/errorHandler';
import { businessOwnerMiddleware } from '@/middleware/auth';
import { AuthRequest, Integration, ApiResponse } from '@/types';

const router = express.Router();

// Validation schemas
const createIntegrationSchema = Joi.object({
  business_id: Joi.string().required(),
  provider: Joi.string().valid('stripe', 'square', 'paypal', 'venmo', 'cashapp', 'nmi', 'paysley', 'bank').required(),
  provider_account_id: Joi.string().optional(),
  access_token: Joi.string().optional(),
  refresh_token: Joi.string().optional(),
  webhook_secret: Joi.string().optional(),
  settings: Joi.object().default({})
});

// Get integrations for business
router.get('/business/:businessId', businessOwnerMiddleware, asyncHandler(async (req: AuthRequest, res) => {
  const integrations = await db('integrations')
    .where({ business_id: req.params.businessId })
    .orderBy('created_at', 'desc');

  const response: ApiResponse<Integration[]> = {
    success: true,
    data: integrations
  };

  res.json(response);
}));

// Get single integration
router.get('/:integrationId', asyncHandler(async (req: AuthRequest, res) => {
  const integration = await db('integrations')
    .join('businesses', 'integrations.business_id', 'businesses.id')
    .where({ 
      'integrations.id': req.params.integrationId,
      'businesses.user_id': req.user!.id 
    })
    .select('integrations.*')
    .first();

  if (!integration) {
    return res.status(404).json({ error: 'Integration not found' });
  }

  const response: ApiResponse<Integration> = {
    success: true,
    data: integration
  };

  res.json(response);
}));

// Create integration
router.post('/', asyncHandler(async (req: AuthRequest, res) => {
  const { error } = createIntegrationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Verify business ownership
  const business = await db('businesses')
    .where({ id: req.body.business_id, user_id: req.user!.id })
    .first();

  if (!business) {
    return res.status(403).json({ error: 'Access denied' });
  }

  // Check if integration already exists for this provider
  const existingIntegration = await db('integrations')
    .where({ 
      business_id: req.body.business_id, 
      provider: req.body.provider 
    })
    .first();

  if (existingIntegration) {
    return res.status(400).json({ error: 'Integration already exists for this provider' });
  }

  const integrationId = uuidv4();
  const integration = {
    id: integrationId,
    business_id: req.body.business_id,
    provider: req.body.provider,
    provider_account_id: req.body.provider_account_id,
    access_token: req.body.access_token,
    refresh_token: req.body.refresh_token,
    webhook_secret: req.body.webhook_secret,
    settings: JSON.stringify(req.body.settings),
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  };

  await db('integrations').insert(integration);

  const response: ApiResponse<Integration> = {
    success: true,
    data: { ...integration, settings: JSON.parse(integration.settings) }
  };

  res.status(201).json(response);
}));

// Update integration
router.put('/:integrationId', asyncHandler(async (req: AuthRequest, res) => {
  // Verify integration ownership
  const integration = await db('integrations')
    .join('businesses', 'integrations.business_id', 'businesses.id')
    .where({ 
      'integrations.id': req.params.integrationId,
      'businesses.user_id': req.user!.id 
    })
    .select('integrations.*')
    .first();

  if (!integration) {
    return res.status(404).json({ error: 'Integration not found' });
  }

  const updates = {
    provider_account_id: req.body.provider_account_id,
    access_token: req.body.access_token,
    refresh_token: req.body.refresh_token,
    webhook_secret: req.body.webhook_secret,
    settings: req.body.settings ? JSON.stringify(req.body.settings) : integration.settings,
    is_active: req.body.is_active !== undefined ? req.body.is_active : integration.is_active,
    last_sync: req.body.last_sync ? new Date(req.body.last_sync) : integration.last_sync,
    updated_at: new Date()
  };

  await db('integrations')
    .where({ id: req.params.integrationId })
    .update(updates);

  const updatedIntegration = await db('integrations')
    .where({ id: req.params.integrationId })
    .first();

  const response: ApiResponse<Integration> = {
    success: true,
    data: { ...updatedIntegration, settings: JSON.parse(updatedIntegration.settings) }
  };

  res.json(response);
}));

// Delete integration
router.delete('/:integrationId', asyncHandler(async (req: AuthRequest, res) => {
  // Verify integration ownership
  const integration = await db('integrations')
    .join('businesses', 'integrations.business_id', 'businesses.id')
    .where({ 
      'integrations.id': req.params.integrationId,
      'businesses.user_id': req.user!.id 
    })
    .select('integrations.*')
    .first();

  if (!integration) {
    return res.status(404).json({ error: 'Integration not found' });
  }

  await db('integrations')
    .where({ id: req.params.integrationId })
    .del();

  const response: ApiResponse = {
    success: true,
    message: 'Integration deleted successfully'
  };

  res.json(response);
}));

// Sync integration
router.post('/:integrationId/sync', asyncHandler(async (req: AuthRequest, res) => {
  // Verify integration ownership
  const integration = await db('integrations')
    .join('businesses', 'integrations.business_id', 'businesses.id')
    .where({ 
      'integrations.id': req.params.integrationId,
      'businesses.user_id': req.user!.id 
    })
    .select('integrations.*')
    .first();

  if (!integration) {
    return res.status(404).json({ error: 'Integration not found' });
  }

  if (!integration.is_active) {
    return res.status(400).json({ error: 'Integration is not active' });
  }

  // Update last sync time
  await db('integrations')
    .where({ id: req.params.integrationId })
    .update({ last_sync: new Date(), updated_at: new Date() });

  // In a real implementation, this would trigger the actual sync process
  // For now, we'll just simulate it
  const mockTransactions = await simulateIntegrationSync(integration);

  const response: ApiResponse<{ synced: number; transactions: any[] }> = {
    success: true,
    data: {
      synced: mockTransactions.length,
      transactions: mockTransactions
    },
    message: `Synced ${mockTransactions.length} transactions from ${integration.provider}`
  };

  res.json(response);
}));

// Simulate integration sync (replace with real implementation)
async function simulateIntegrationSync(integration: Integration) {
  const mockTransactions = [];
  const transactionCount = Math.floor(Math.random() * 5) + 1;

  for (let i = 0; i < transactionCount; i++) {
    const transactionId = uuidv4();
    const amount = Math.floor(Math.random() * 1000) + 10;
    const isCredit = Math.random() > 0.3;

    // Get a random account for this business
    const accounts = await db('accounts')
      .where({ business_id: integration.business_id, is_active: true })
      .select('id');

    if (accounts.length === 0) continue;

    const randomAccount = accounts[Math.floor(Math.random() * accounts.length)];

    const transaction = {
      id: transactionId,
      business_id: integration.business_id,
      account_id: randomAccount.id,
      integration_source: integration.provider,
      external_transaction_id: `${integration.provider}_${Math.random().toString(36).substr(2, 9)}`,
      transaction_type: isCredit ? 'credit' : 'debit',
      amount,
      currency: 'USD',
      description: `${integration.provider} ${isCredit ? 'Payment' : 'Fee'} - ${new Date().toLocaleDateString()}`,
      reference_number: `REF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      transaction_date: new Date(),
      reconciled: false,
      metadata: JSON.stringify({ 
        integration_id: integration.id,
        sync_date: new Date().toISOString()
      }),
      created_at: new Date(),
      updated_at: new Date()
    };

    await db('transactions').insert(transaction);
    mockTransactions.push(transaction);
  }

  return mockTransactions;
}

export default router;