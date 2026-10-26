import { Response } from 'express';
import { updateProfileSchema } from '../../validators/auth.js';
import { updateUserProfile } from '../auth/auth.service.js';
import { AuthRequest } from '../../middleware/auth.js';

export async function updateMe(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const parsed = updateProfileSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: parsed.error.flatten(),
      });
    }

    const user = await updateUserProfile(req.userId, parsed.data);

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    return res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update profile',
    });
  }
}
