import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { updateMemberRoleSchema } from '../../validators/organization.js';
import { listMembers, updateMemberRole, removeMember, leaveOrganization } from './members.service.js';

export async function list(req: AuthRequest, res: Response) {
  try {
    const members = await listMembers(req.params.organizationId);
    return res.status(200).json({ status: 'success', data: { members } });
  } catch {
    return res.status(500).json({ status: 'error', message: 'Failed to list members' });
  }
}

export async function updateRole(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const parsed = updateMemberRoleSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: parsed.error.flatten(),
      });
    }

    const member = await updateMemberRole(
      req.params.organizationId,
      req.params.userId,
      parsed.data.role,
      req.userId
    );
    return res.status(200).json({ status: 'success', data: { member } });
  } catch (error: any) {
    if (
      error.message === 'Only owners can change roles' ||
      error.message === 'Cannot change owner role' ||
      error.message === 'Cannot assign owner role'
    ) {
      return res.status(403).json({ status: 'error', message: error.message });
    }
    if (error.message === 'Member not found') {
      return res.status(404).json({ status: 'error', message: error.message });
    }
    return res.status(500).json({ status: 'error', message: 'Failed to update role' });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    await removeMember(req.params.organizationId, req.params.userId, req.userId);
    return res.status(200).json({ status: 'success', message: 'Member removed' });
  } catch (error: any) {
    if (error.message === 'Only owners can remove members' || error.message === 'Cannot remove the owner') {
      return res.status(403).json({ status: 'error', message: error.message });
    }
    if (error.message === 'Member not found') {
      return res.status(404).json({ status: 'error', message: error.message });
    }
    return res.status(500).json({ status: 'error', message: 'Failed to remove member' });
  }
}

export async function leave(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    await leaveOrganization(req.params.organizationId, req.userId);
    return res.status(200).json({ status: 'success', message: 'Left organization' });
  } catch (error: any) {
    if (error.message === 'Cannot leave as the last owner') {
      return res.status(403).json({ status: 'error', message: error.message });
    }
    if (error.message === 'Member not found') {
      return res.status(404).json({ status: 'error', message: error.message });
    }
    return res.status(500).json({ status: 'error', message: 'Failed to leave organization' });
  }
}
