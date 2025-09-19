import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import Joi from 'joi';
import db from '@/config/database';
import { asyncHandler } from '@/middleware/errorHandler';
import { adminMiddleware } from '@/middleware/auth';
import { AuthRequest, Invitation, ApiResponse } from '@/types';

const router = express.Router();

// Validation schemas
const createInvitationSchema = Joi.object({
  email: Joi.string().email().required(),
  expiryDays: Joi.number().min(1).max(30).default(7),
  note: Joi.string().optional()
});

const createSuperAccountSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  note: Joi.string().optional()
});

// Get all invitations (admin only)
router.get('/', adminMiddleware, asyncHandler(async (req: AuthRequest, res) => {
  const invitations = await db('invitations')
    .select('*')
    .orderBy('created_at', 'desc');

  const response: ApiResponse<Invitation[]> = {
    success: true,
    data: invitations
  };

  res.json(response);
}));

// Create invitation (admin only)
router.post('/', adminMiddleware, asyncHandler(async (req: AuthRequest, res) => {
  const { error } = createInvitationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, expiryDays, note } = req.body;

  // Check if user already exists
  const existingUser = await db('users').where({ email }).first();
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists with this email' });
  }

  // Check if pending invitation already exists
  const existingInvitation = await db('invitations')
    .where({ email, status: 'pending' })
    .where('expires_at', '>', new Date())
    .first();

  if (existingInvitation) {
    return res.status(400).json({ error: 'Pending invitation already exists for this email' });
  }

  const invitationId = uuidv4();
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiryDays);

  const invitation = {
    id: invitationId,
    email,
    invited_by: req.user!.id,
    invited_by_name: `${req.user!.first_name} ${req.user!.last_name}`,
    status: 'pending',
    token,
    expires_at: expiresAt,
    created_at: new Date(),
    updated_at: new Date()
  };

  await db('invitations').insert(invitation);

  // In a real implementation, you would send an email here
  console.log(`Invitation sent to ${email} with token: ${token}`);

  const response: ApiResponse<Invitation> = {
    success: true,
    data: invitation,
    message: 'Invitation sent successfully'
  };

  res.status(201).json(response);
}));

// Create super free account (admin only)
router.post('/super-account', adminMiddleware, asyncHandler(async (req: AuthRequest, res) => {
  const { error } = createSuperAccountSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, firstName, lastName, note } = req.body;

  // Check if user already exists
  const existingUser = await db('users').where({ email }).first();
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists with this email' });
  }

  const userId = uuidv4();
  const user = {
    id: userId,
    email,
    password_hash: '', // Super free accounts don't need a password hash
    first_name: firstName,
    last_name: lastName,
    role: 'user',
    account_type: 'super_free',
    subscription_status: 'free',
    invited_by: req.user!.id,
    created_at: new Date(),
    updated_at: new Date()
  };

  await db('users').insert(user);

  const response: ApiResponse<Omit<typeof user, 'password_hash'>> = {
    success: true,
    data: {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      account_type: user.account_type,
      subscription_status: user.subscription_status,
      invited_by: user.invited_by,
      created_at: user.created_at,
      updated_at: user.updated_at
    },
    message: 'Super free account created successfully'
  };

  res.status(201).json(response);
}));

// Resend invitation (admin only)
router.post('/:invitationId/resend', adminMiddleware, asyncHandler(async (req: AuthRequest, res) => {
  const invitation = await db('invitations')
    .where({ id: req.params.invitationId })
    .first();

  if (!invitation) {
    return res.status(404).json({ error: 'Invitation not found' });
  }

  if (invitation.status !== 'pending') {
    return res.status(400).json({ error: 'Can only resend pending invitations' });
  }

  // Extend expiry by 7 days
  const newExpiresAt = new Date();
  newExpiresAt.setDate(newExpiresAt.getDate() + 7);

  await db('invitations')
    .where({ id: req.params.invitationId })
    .update({ 
      expires_at: newExpiresAt,
      updated_at: new Date()
    });

  // In a real implementation, you would resend the email here
  console.log(`Invitation resent to ${invitation.email}`);

  const response: ApiResponse = {
    success: true,
    message: 'Invitation resent successfully'
  };

  res.json(response);
}));

// Delete invitation (admin only)
router.delete('/:invitationId', adminMiddleware, asyncHandler(async (req: AuthRequest, res) => {
  const invitation = await db('invitations')
    .where({ id: req.params.invitationId })
    .first();

  if (!invitation) {
    return res.status(404).json({ error: 'Invitation not found' });
  }

  await db('invitations')
    .where({ id: req.params.invitationId })
    .del();

  const response: ApiResponse = {
    success: true,
    message: 'Invitation deleted successfully'
  };

  res.json(response);
}));

// Validate invitation token (public endpoint)
router.get('/validate/:token', asyncHandler(async (req, res) => {
  const invitation = await db('invitations')
    .where({ 
      token: req.params.token, 
      status: 'pending' 
    })
    .where('expires_at', '>', new Date())
    .first();

  if (!invitation) {
    return res.status(404).json({ error: 'Invalid or expired invitation' });
  }

  const response: ApiResponse<{ email: string; invitedBy: string }> = {
    success: true,
    data: {
      email: invitation.email,
      invitedBy: invitation.invited_by_name
    }
  };

  res.json(response);
}));

export default router;