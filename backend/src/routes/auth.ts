import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import db from '@/config/database';
import { asyncHandler } from '@/middleware/errorHandler';
import { User, ApiResponse } from '@/types';

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  invitationToken: Joi.string().optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Register
router.post('/register', asyncHandler(async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, password, firstName, lastName, invitationToken } = req.body;

  // Check if user already exists
  const existingUser = await db('users').where({ email }).first();
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists with this email' });
  }

  let accountType = 'paid';
  let invitedBy = null;

  // Check invitation token if provided
  if (invitationToken) {
    const invitation = await db('invitations')
      .where({ token: invitationToken, status: 'pending' })
      .where('expires_at', '>', new Date())
      .first();

    if (!invitation) {
      return res.status(400).json({ error: 'Invalid or expired invitation token' });
    }

    if (invitation.email !== email) {
      return res.status(400).json({ error: 'Email does not match invitation' });
    }

    accountType = 'free';
    invitedBy = invitation.invited_by;

    // Mark invitation as accepted
    await db('invitations')
      .where({ id: invitation.id })
      .update({ 
        status: 'accepted', 
        used_at: new Date(),
        updated_at: new Date()
      });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  const userId = uuidv4();
  const user = {
    id: userId,
    email,
    password_hash: passwordHash,
    first_name: firstName,
    last_name: lastName,
    role: 'user',
    account_type: accountType,
    subscription_status: accountType === 'free' ? 'free' : 'trial',
    invited_by: invitedBy,
    created_at: new Date(),
    updated_at: new Date()
  };

  await db('users').insert(user);

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  );

  const response: ApiResponse<{ user: Omit<User, 'password_hash'>, token: string }> = {
    success: true,
    data: {
      user: {
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
      } as User,
      token
    }
  };

  res.status(201).json(response);
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { email, password } = req.body;

  // Find user
  const user = await db('users').where({ email }).first() as User;
  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Check password (allow any password for super_free accounts)
  let validPassword = false;
  if (user.account_type === 'super_free') {
    validPassword = true;
  } else {
    validPassword = await bcrypt.compare(password, user.password_hash);
  }

  if (!validPassword) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Generate JWT
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  );

  const response: ApiResponse<{ user: Omit<User, 'password_hash'>, token: string }> = {
    success: true,
    data: {
      user: {
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
      } as User,
      token
    }
  };

  res.json(response);
}));

// Get current user
router.get('/me', asyncHandler(async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string };
    const user = await db('users').where({ id: decoded.userId }).first() as User;

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const response: ApiResponse<Omit<User, 'password_hash'>> = {
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
      } as User
    };

    res.json(response);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}));

export default router;