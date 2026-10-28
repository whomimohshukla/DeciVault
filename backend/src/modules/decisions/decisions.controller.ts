import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { createDecisionSchema, updateDecisionSchema } from '../../validators/decision.js';
import {
  createDecision,
  listDecisions,
  getDecision,
  updateDecision,
  deleteDecision,
} from './decisions.service.js';

export async function create(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const organizationId = req.params.organizationId as string;
    const parsed = createDecisionSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: parsed.error.flatten(),
      });
    }

    const decision = await createDecision(req.userId, organizationId, parsed.data);
    return res.status(201).json({ status: 'success', data: { decision } });
  } catch (error: any) {
    if (
      error.message === 'Decision status cannot be set during creation' ||
      error.message === 'User is not a member of this organization' ||
      error.message === 'Project not found in organization'
    ) {
      return res.status(400).json({ status: 'error', message: error.message });
    }

    return res.status(500).json({ status: 'error', message: 'Failed to create decision' });
  }
}

export async function list(req: AuthRequest, res: Response) {
  try {
    const organizationId = req.params.organizationId as string;
    const decisions = await listDecisions(organizationId);
    return res.status(200).json({ status: 'success', data: { decisions } });
  } catch {
    return res.status(500).json({ status: 'error', message: 'Failed to list decisions' });
  }
}

export async function get(req: AuthRequest, res: Response) {
  try {
    const organizationId = req.params.organizationId as string;
    const decisionId = req.params.decisionId as string;
    const decision = await getDecision(organizationId, decisionId);

    if (!decision) {
      return res.status(404).json({ status: 'error', message: 'Decision not found' });
    }

    return res.status(200).json({ status: 'success', data: { decision } });
  } catch {
    return res.status(500).json({ status: 'error', message: 'Failed to get decision' });
  }
}

export async function update(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const organizationId = req.params.organizationId as string;
    const decisionId = req.params.decisionId as string;
    const parsed = updateDecisionSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: parsed.error.flatten(),
      });
    }

    const decision = await updateDecision(organizationId, decisionId, parsed.data);
    return res.status(200).json({ status: 'success', data: { decision } });
  } catch (error: any) {
    if (error.message === 'Decision not found') {
      return res.status(404).json({ status: 'error', message: error.message });
    }

    if (
      error.message === 'User is not a member of this organization' ||
      error.message === 'Project not found in organization' ||
      error.message === 'Invalid date'
    ) {
      return res.status(400).json({ status: 'error', message: error.message });
    }

    return res.status(500).json({ status: 'error', message: 'Failed to update decision' });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    const organizationId = req.params.organizationId as string;
    const decisionId = req.params.decisionId as string;
    await deleteDecision(organizationId, decisionId);
    return res.status(200).json({ status: 'success', message: 'Decision deleted' });
  } catch (error: any) {
    if (error.message === 'Decision not found') {
      return res.status(404).json({ status: 'error', message: error.message });
    }

    return res.status(500).json({ status: 'error', message: 'Failed to delete decision' });
  }
}
