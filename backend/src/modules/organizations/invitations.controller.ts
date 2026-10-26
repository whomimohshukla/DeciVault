import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { inviteSchema } from '../../validators/organization.js';
import {
  createInvitation,
  listInvitations,
  acceptInvitation,
  declineInvitation,
  cancelInvitation,
} from './invitations.service.js';

export async function invite(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const parsed = inviteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: parsed.error.flatten(),
      });
    }

    const result = await createInvitation(req.params.organizationId, req.userId, {
      email: parsed.data.email,
      role: parsed.data.role,
    });

    // Return token for local dev testing only
    return res.status(201).json({
      status: 'success',
      data: { invitation: result.invitation, token: result.token },
    });
  } catch (error: any) {
    if (
      error.message === 'User is already a member' ||
      error.message === 'Invitation already sent'
    ) {
      return res.status(409).json({ status: 'error', message: error.message });
    }
    return res.status(500).json({ status: 'error', message: 'Failed to send invitation' });
  }
}

export async function list(req: AuthRequest, res: Response) {
  try {
    const invitations = await listInvitations(req.params.organizationId);
    return res.status(200).json({ status: 'success', data: { invitations } });
  } catch {
    return res.status(500).json({ status: 'error', message: 'Failed to list invitations' });
  }
}

export async function accept(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    await acceptInvitation(req.params.token, req.userId);
    return res.status(200).json({ status: 'success', message: 'Invitation accepted' });
  } catch (error: any) {
    if (
      error.message === 'Invitation not found' ||
      error.message === 'Invitation is no longer valid' ||
      error.message === 'Invitation expired' ||
      error.message === 'Invitation email does not match' ||
      error.message === 'Already a member'
    ) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
    return res.status(500).json({ status: 'error', message: 'Failed to accept invitation' });
  }
}

export async function decline(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    await declineInvitation(req.params.token, req.userId);
    return res.status(200).json({ status: 'success', message: 'Invitation declined' });
  } catch (error: any) {
    if (
      error.message === 'Invitation not found' ||
      error.message === 'Invitation email does not match'
    ) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
    return res.status(500).json({ status: 'error', message: 'Failed to decline invitation' });
  }
}

export async function cancel(req: AuthRequest, res: Response) {
  try {
    await cancelInvitation(req.params.organizationId, req.params.invitationId);
    return res.status(200).json({ status: 'success', message: 'Invitation cancelled' });
  } catch {
    return res.status(500).json({ status: 'error', message: 'Failed to cancel invitation' });
  }
}
