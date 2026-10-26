import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { createOrgSchema, updateOrgSchema } from '../../validators/organization.js';
import {
  createOrganization,
  listUserOrganizations,
  getOrganization,
  updateOrganization,
  deleteOrganization,
} from './organizations.service.js';

export async function create(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const parsed = createOrgSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: parsed.error.flatten(),
      });
    }

    const org = await createOrganization(req.userId, parsed.data);
    return res.status(201).json({ status: 'success', data: { organization: org } });
  } catch (error: any) {
    if (error.message === 'Slug already exists') {
      return res.status(409).json({ status: 'error', message: error.message });
    }
    return res.status(500).json({ status: 'error', message: 'Failed to create organization' });
  }
}

export async function list(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const orgs = await listUserOrganizations(req.userId);
    return res.status(200).json({ status: 'success', data: { organizations: orgs } });
  } catch {
    return res.status(500).json({ status: 'error', message: 'Failed to list organizations' });
  }
}

export async function get(req: AuthRequest, res: Response) {
  try {
    const org = await getOrganization(req.params.organizationId);
    if (!org) {
      return res.status(404).json({ status: 'error', message: 'Organization not found' });
    }
    return res.status(200).json({ status: 'success', data: { organization: org } });
  } catch {
    return res.status(500).json({ status: 'error', message: 'Failed to get organization' });
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    const parsed = updateOrgSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: parsed.error.flatten(),
      });
    }

    const org = await updateOrganization(req.params.organizationId, parsed.data);
    return res.status(200).json({ status: 'success', data: { organization: org } });
  } catch (error: any) {
    if (error.message === 'Slug already exists') {
      return res.status(409).json({ status: 'error', message: error.message });
    }
    return res.status(500).json({ status: 'error', message: 'Failed to update organization' });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    await deleteOrganization(req.params.organizationId);
    return res.status(200).json({ status: 'success', message: 'Organization deleted' });
  } catch {
    return res.status(500).json({ status: 'error', message: 'Failed to delete organization' });
  }
}
