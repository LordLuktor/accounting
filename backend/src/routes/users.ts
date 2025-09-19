import express from 'express';
import bcrypt from 'bcryptjs';
import Joi from 'joi';
import db from '@/config/database';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthRequest, ApiResponse } from '@/types';

const router = express.Router();

// Validation schemas
const updateProfileSchema = Joi.object({
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  email: Joi.string().email().optional()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

// Get current user profile
router.get('/profile', asyncHandler(async (req: AuthRequest, res) => {
  const user = await db('users')
    .where({ id: req.user!.id })
    .select('id', 'email', 'first_name', 'last_name', 'role', 'account_type', 'subscription_status', 'created_at', 'updated_at')
    .first();

  const response: ApiResponse<typeof user> = {
    success: true,
    data: user
  };

  res.json(response);
}));

// Update user profile
router.put('/profile', asyncHandler(async (req: AuthRequest, res) => {
  const { error } = updateProfileSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { first_name, last_name, email } = req.body;

  // Check if email is already taken by another user
  if (email && email !== req.user!.email) {
    const existingUser = await db('users')
      .where({ email })
      .whereNot({ id: req.user!.id })
      .first();

    if (existingUser) {
      return res.status(400).json({ error: 'Email already taken' });
    }
  }

  const updates = {
    first_name: first_name || req.user!.first_name,
    last_name: last_name || req.user!.last_name,
    email: email || req.user!.email,
    updated_at: new Date()
  };

  await db('users')
    .where({ id: req.user!.id })
    .update(updates);

  const updatedUser = await db('users')
    .where({ id: req.user!.id })
    .select('id', 'email', 'first_name', 'last_name', 'role', 'account_type', 'subscription_status', 'created_at', 'updated_at')
    .first();

  const response: ApiResponse<typeof updatedUser> = {
    success: true,
    data: updatedUser,
    message: 'Profile updated successfully'
  };

  res.json(response);
}));

// Change password
router.put('/password', asyncHandler(async (req: AuthRequest, res) => {
  const { error } = changePasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { currentPassword, newPassword } = req.body;

  // Super free accounts don't need password verification
  if (req.user!.account_type !== 'super_free') {
    // Verify current password
    const user = await db('users')
      .where({ id: req.user!.id })
      .first();

    const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  await db('users')
    .where({ id: req.user!.id })
    .update({ 
      password_hash: passwordHash,
      updated_at: new Date()
    });

  const response: ApiResponse = {
    success: true,
    message: 'Password updated successfully'
  };

  res.json(response);
}));

// Get user statistics
router.get('/stats', asyncHandler(async (req: AuthRequest, res) => {
  const businessCount = await db('businesses')
    .where({ user_id: req.user!.id })
    .count('id as count')
    .first();

  const transactionCount = await db('transactions')
    .join('businesses', 'transactions.business_id', 'businesses.id')
    .where({ 'businesses.user_id': req.user!.id })
    .count('transactions.id as count')
    .first();

  const integrationCount = await db('integrations')
    .join('businesses', 'integrations.business_id', 'businesses.id')
    .where({ 
      'businesses.user_id': req.user!.id,
      'integrations.is_active': true
    })
    .count('integrations.id as count')
    .first();

  // Get monthly transaction count for current month
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const monthlyTransactionCount = await db('transactions')
    .join('businesses', 'transactions.business_id', 'businesses.id')
    .where({ 'businesses.user_id': req.user!.id })
    .where('transactions.created_at', '>=', currentMonth)
    .count('transactions.id as count')
    .first();

  const stats = {
    businesses: parseInt(businessCount?.count as string || '0'),
    totalTransactions: parseInt(transactionCount?.count as string || '0'),
    activeIntegrations: parseInt(integrationCount?.count as string || '0'),
    monthlyTransactions: parseInt(monthlyTransactionCount?.count as string || '0'),
    accountLimits: {
      businesses: req.user!.account_type === 'free' ? 1 : 
                  req.user!.account_type === 'super_free' ? -1 : 5,
      monthlyTransactions: req.user!.account_type === 'free' ? 500 : 
                          req.user!.account_type === 'super_free' ? -1 : 25000
    }
  };

  const response: ApiResponse<typeof stats> = {
    success: true,
    data: stats
  };

  res.json(response);
}));

export default router;