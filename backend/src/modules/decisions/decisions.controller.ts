import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { createDecisionSchema, updateDecisionSchema, decisionRelationshipSchema } from '../../validators/decision.js';
import { decisionEvidenceSchema } from '../../validators/document.js';
import {
  addDecisionEvidence,
  createDecision,
  createDecisionRelationship,
  listDecisions,
  getDecision,
  updateDecision,
  deleteDecision,
  listDecisionEvidence,
  removeDecisionEvidence,
  listDecisionAuditHistory,
  listDecisionRelationships,
  removeDecisionRelationship,
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

    const decision = await updateDecision(organizationId, decisionId, parsed.data, req.userId);
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
    const actorId = req.userId ?? null;
    await deleteDecision(organizationId, decisionId, actorId);
    return res.status(200).json({ status: 'success', message: 'Decision deleted' });
  } catch (error: any) {
    if (error.message === 'Decision not found') {
      return res.status(404).json({ status: 'error', message: error.message });
    }

    return res.status(500).json({ status: 'error', message: 'Failed to delete decision' });
  }
}

export async function listEvidence(req: AuthRequest, res: Response) {
  try {
    const organizationId = req.params.organizationId as string;
    const decisionId = req.params.decisionId as string;
    const evidence = await listDecisionEvidence(organizationId, decisionId);
    return res.status(200).json({ status: 'success', data: { evidence } });
  } catch (error: any) {
    if (error.message === 'Decision not found') {
      return res.status(404).json({ status: 'error', message: error.message });
    }

    return res.status(500).json({ status: 'error', message: 'Failed to list decision evidence' });
  }
}

export async function addEvidence(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const organizationId = req.params.organizationId as string;
    const decisionId = req.params.decisionId as string;
    const parsed = decisionEvidenceSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: parsed.error.flatten(),
      });
    }

    const link = await addDecisionEvidence(organizationId, decisionId, req.userId, parsed.data);
    return res.status(201).json({ status: 'success', data: { evidence: link } });
  } catch (error: any) {
    if (
      error.message === 'Decision not found' ||
      error.message === 'Document not found in organization' ||
      error.message === 'Document project does not match decision project' ||
      error.message === 'User is not a member of this organization' ||
      error.message === 'Document is already linked to this decision'
    ) {
      return res.status(400).json({ status: 'error', message: error.message });
    }

    return res.status(500).json({ status: 'error', message: 'Failed to add decision evidence' });
  }
}

export async function removeEvidence(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const organizationId = req.params.organizationId as string;
    const decisionId = req.params.decisionId as string;
    const documentId = req.params.documentId as string;
    const result = await removeDecisionEvidence(organizationId, decisionId, documentId, req.userId);
    return res.status(200).json({ status: 'success', data: result });
  } catch (error: any) {
    if (
      error.message === 'Decision not found' ||
      error.message === 'Document not found in organization' ||
      error.message === 'Evidence link not found' ||
      error.message === 'User is not a member of this organization'
    ) {
      return res.status(400).json({ status: 'error', message: error.message });
    }

    return res.status(500).json({ status: 'error', message: 'Failed to remove decision evidence' });
  }
}

export async function listHistory(req: AuthRequest, res: Response) {
  try {
    const organizationId = req.params.organizationId as string;
    const decisionId = req.params.decisionId as string;
    const limit = Number(req.query.limit ?? 20);
    const offset = Number(req.query.offset ?? 0);

    const history = await listDecisionAuditHistory(organizationId, decisionId, {
      limit: Number.isFinite(limit) ? limit : 20,
      offset: Number.isFinite(offset) ? offset : 0,
    });

    return res.status(200).json({ status: 'success', data: { history } });
  } catch (error: any) {
    if (error.message === 'Decision not found') {
      return res.status(404).json({ status: 'error', message: error.message });
    }

    return res.status(500).json({ status: 'error', message: 'Failed to list decision history' });
  }
}

export async function listRelationships(req: AuthRequest, res: Response) {
  try {
    const organizationId = req.params.organizationId as string;
    const decisionId = req.params.decisionId as string;
    const relationships = await listDecisionRelationships(organizationId, decisionId);
    return res.status(200).json({ status: 'success', data: { relationships } });
  } catch (error: any) {
    if (error.message === 'Decision not found') {
      return res.status(404).json({ status: 'error', message: error.message });
    }

    return res.status(500).json({ status: 'error', message: 'Failed to list decision relationships' });
  }
}

export async function addRelationship(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const organizationId = req.params.organizationId as string;
    const decisionId = req.params.decisionId as string;
    const parsed = decisionRelationshipSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: parsed.error.flatten(),
      });
    }

    const relationship = await createDecisionRelationship(
      organizationId,
      decisionId,
      parsed.data.relatedDecisionId,
      parsed.data.relationType,
      req.userId,
      parsed.data.note
    );

    return res.status(201).json({ status: 'success', data: { relationship } });
  } catch (error: any) {
    if (
      error.message === 'Decision not found' ||
      error.message === 'A decision cannot relate to itself' ||
      error.message === 'Decision relationship already exists' ||
      error.message === 'Decision is already superseded by another decision' ||
      error.message === 'This dependency would create a circular dependency' ||
      error.message === 'Unsupported relationship type' ||
      error.message === 'User is not a member of this organization'
    ) {
      return res.status(400).json({ status: 'error', message: error.message });
    }

    return res.status(500).json({ status: 'error', message: 'Failed to add decision relationship' });
  }
}

export async function removeRelationship(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const organizationId = req.params.organizationId as string;
    const decisionId = req.params.decisionId as string;
    const relatedDecisionId = req.params.relatedDecisionId as string;
    const relationType = req.params.relationType as string;

    const result = await removeDecisionRelationship(
      organizationId,
      decisionId,
      relatedDecisionId,
      relationType,
      req.userId
    );

    return res.status(200).json({ status: 'success', data: result });
  } catch (error: any) {
    if (
      error.message === 'Decision relationship not found' ||
      error.message === 'Unsupported relationship type' ||
      error.message === 'User is not a member of this organization'
    ) {
      return res.status(400).json({ status: 'error', message: error.message });
    }

    return res.status(500).json({ status: 'error', message: 'Failed to remove decision relationship' });
  }
}
