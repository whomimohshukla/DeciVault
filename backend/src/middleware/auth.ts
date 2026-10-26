import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.js';
import { prisma } from '../lib/prisma.js';

export interface AuthRequest extends Request {
  userId?: string;
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies?.token || (req.headers.authorization?.replace('Bearer ', ''));

    if (!token) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, status: true },
    });

    if (!user || user.status !== 'ACTIVE') {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    req.userId = user.id;
    next();
  } catch {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
}
