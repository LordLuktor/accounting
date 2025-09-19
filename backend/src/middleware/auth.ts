import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '@/config/database';
import { User, AuthRequest } from '@/types';

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { userId: string };
    
    const user = await db('users')
      .where({ id: decoded.userId })
      .first() as User;

    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  next();
};

export const businessOwnerMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const businessId = req.params.businessId || req.body.business_id;
    
    if (!businessId) {
      return res.status(400).json({ error: 'Business ID required.' });
    }

    const business = await db('businesses')
      .where({ id: businessId, user_id: req.user?.id })
      .first();

    if (!business && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. You do not own this business.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error checking business ownership.' });
  }
};