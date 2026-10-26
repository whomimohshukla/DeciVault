import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
import { prisma } from '../lib/prisma.js';
import { Role } from '@prisma/client';

export function requireRole(allowedRoles: Role[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }

      const organizationId = req.headers['x-organization-id'] as string;

      if (!organizationId) {
        res.status(400).json({ status: 'error', message: 'Organization context required' });
        return;
      }

      const membership = await prisma.membership.findUnique({
        where: {
          userId_organizationId: {
            userId: req.userId,
            organizationId,
          },
        },
      });

      if (!membership) {
        res.status(403).json({ status: 'error', message: 'Forbidden' });
        return;
      }

      if (!allowedRoles.includes(membership.role)) {
        res.status(403).json({ status: 'error', message: 'Forbidden' });
        return;
      }

      next();
    } catch {
      res.status(403).json({ status: 'error', message: 'Forbidden' });
    }
  };
}
