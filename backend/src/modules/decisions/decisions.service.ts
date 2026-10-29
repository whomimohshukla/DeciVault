import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';

export type DecisionInput = {
  title: string;
  description: string;
  problemContext?: string | null;
  rationale?: string | null;
  alternatives?: string | null;
  status?: 'PROPOSED' | 'APPROVED' | 'REJECTED' | 'SUPERSEDED';
  projectId?: string | null;
  ownerId?: string | null;
  approverId?: string | null;
  decisionDate?: string | null;
  effectiveDate?: string | null;
  approvalNotes?: string | null;
  rejectionNotes?: string | null;
};

export const decisionRelationshipTypes = ['RELATED_TO', 'DEPENDS_ON', 'SUPERSEDES'] as const;
export type DecisionRelationshipType = (typeof decisionRelationshipTypes)[number];

export const relationshipLabels: Record<DecisionRelationshipType, string> = {
  RELATED_TO: 'Related to',
  DEPENDS_ON: 'Depends on',
  SUPERSEDES: 'Supersedes',
};

function parseOptionalDate(value?: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Invalid date');
  }
  return parsed;
}

function normalizeAlternatives(value?: string | null) {
  if (!value) return null;
  const options = value
    .split(/\r?\n|\s*,\s*/)
    .map((option) => option.trim())
    .filter(Boolean);
  return options.length > 0 ? options : null;
}

function normalizeDecisionRelationshipType(value: string): DecisionRelationshipType {
  const normalized = value.trim().toUpperCase();
  const match = decisionRelationshipTypes.find((type) => type === normalized);
  if (!match) {
    throw new Error('Unsupported relationship type');
  }
  return match;
}

function serializeValue(value: unknown) {
  if (value === undefined || value === null) return value;
  return typeof value === 'string' ? value : JSON.parse(JSON.stringify(value));
}

function summarizeDecisionChanges(before: Record<string, unknown>, after: Record<string, unknown>) {
  const changes: Record<string, { before: unknown; after: unknown }> = {};

  for (const [key, value] of Object.entries(after)) {
    const beforeValue = before[key];
    if (JSON.stringify(serializeValue(beforeValue)) !== JSON.stringify(serializeValue(value))) {
      changes[key] = { before: beforeValue, after: value };
    }
  }

  return changes;
}

async function recordDecisionAudit({
  organizationId,
  decisionId,
  actorId,
  action,
  summary,
  metadata,
}: {
  organizationId: string;
  decisionId: string;
  actorId?: string | null;
  action: string;
  summary: string;
  metadata?: Record<string, unknown>;
}) {
  return prisma.auditLog.create({
    data: {
      actorId: actorId ?? null,
      organizationId,
      action,
      entityType: 'Decision',
      entityId: decisionId,
      metadata: {
        summary,
        ...(metadata ?? {}),
      },
    },
  });
}

async function assertOrganizationMember(organizationId: string, userId: string) {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (!membership) {
    throw new Error('User is not a member of this organization');
  }
}

async function assertProjectInOrganization(organizationId: string, projectId?: string | null) {
  if (!projectId) return;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
    },
  });

  if (!project) {
    throw new Error('Project not found in organization');
  }
}

async function hasDependencyPath(startDecisionId: string, targetDecisionId: string, seen = new Set<string>()) {
  if (startDecisionId === targetDecisionId) {
    return true;
  }

  if (seen.has(startDecisionId)) {
    return false;
  }

  seen.add(startDecisionId);

  const links = await prisma.decisionLink.findMany({
    where: {
      fromId: startDecisionId,
      relationType: 'DEPENDS_ON',
    },
    select: { toId: true },
  });

  for (const link of links) {
    if (await hasDependencyPath(link.toId, targetDecisionId, seen)) {
      return true;
    }
  }

  return false;
}

export async function createDecision(userId: string, organizationId: string, data: DecisionInput) {
  if (data.status && data.status !== 'PROPOSED') {
    throw new Error('Decision status cannot be set during creation');
  }

  await assertOrganizationMember(organizationId, userId);
  await assertProjectInOrganization(organizationId, data.projectId);

  const ownerId = data.ownerId || userId;
  await assertOrganizationMember(organizationId, ownerId);

  if (data.approverId) {
    await assertOrganizationMember(organizationId, data.approverId);
  }

  const normalizedAlternatives = normalizeAlternatives(data.alternatives);
  const decision = await prisma.decision.create({
    data: {
      title: data.title,
      description: data.description,
      problemContext: data.problemContext ?? null,
      rationale: data.rationale ?? null,
      alternatives: normalizedAlternatives === null ? Prisma.JsonNull : normalizedAlternatives,
      status: 'PROPOSED',
      decisionDate: parseOptionalDate(data.decisionDate),
      effectiveDate: parseOptionalDate(data.effectiveDate),
      approvalNotes: data.approvalNotes ?? null,
      rejectionNotes: data.rejectionNotes ?? null,
      organizationId,
      projectId: data.projectId || null,
      createdById: userId,
      ownerId,
      approverId: data.approverId ?? null,
    },
    include: {
      organization: { select: { id: true, name: true } },
      project: { select: { id: true, name: true } },
      createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      owner: { select: { id: true, firstName: true, lastName: true, email: true } },
      approver: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
  });

  await recordDecisionAudit({
    organizationId,
    decisionId: decision.id,
    actorId: userId,
    action: 'DECISION_CREATED',
    summary: 'Decision created',
    metadata: {
      createdBy: userId,
      title: decision.title,
    },
  });

  return decision;
}

export async function listDecisions(organizationId: string) {
  return prisma.decision.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
    include: {
      organization: { select: { id: true, name: true } },
      project: { select: { id: true, name: true } },
      createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      owner: { select: { id: true, firstName: true, lastName: true, email: true } },
      approver: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
  });
}

export async function getDecision(organizationId: string, decisionId: string) {
  return prisma.decision.findFirst({
    where: {
      id: decisionId,
      organizationId,
    },
    include: {
      organization: { select: { id: true, name: true } },
      project: { select: { id: true, name: true } },
      createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      owner: { select: { id: true, firstName: true, lastName: true, email: true } },
      approver: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
  });
}

export async function updateDecision(
  organizationId: string,
  decisionId: string,
  data: Partial<DecisionInput>,
  actorId?: string | null
) {
  const existing = await prisma.decision.findFirst({
    where: { id: decisionId, organizationId },
  });

  if (!existing) {
    throw new Error('Decision not found');
  }

  if (data.projectId !== undefined) {
    await assertProjectInOrganization(organizationId, data.projectId ?? null);
  }

  if (data.ownerId !== undefined && data.ownerId !== null) {
    await assertOrganizationMember(organizationId, data.ownerId);
  }

  if (data.approverId !== undefined && data.approverId !== null) {
    await assertOrganizationMember(organizationId, data.approverId);
  }

  const nextStatus = data.status ?? existing.status;
  const normalizedAlternatives =
    data.alternatives !== undefined ? normalizeAlternatives(data.alternatives) : undefined;

  const updatePayload: any = {
    title: data.title,
    description: data.description,
    problemContext: data.problemContext,
    rationale: data.rationale,
    alternatives:
      normalizedAlternatives === undefined
        ? undefined
        : normalizedAlternatives === null
          ? Prisma.JsonNull
          : normalizedAlternatives,
    status: nextStatus,
    projectId: data.projectId !== undefined ? data.projectId || null : undefined,
    ownerId: data.ownerId !== undefined ? data.ownerId : undefined,
    approverId: data.approverId !== undefined ? data.approverId || null : undefined,
    decisionDate: data.decisionDate !== undefined ? parseOptionalDate(data.decisionDate) : undefined,
    effectiveDate: data.effectiveDate !== undefined ? parseOptionalDate(data.effectiveDate) : undefined,
    approvalNotes: data.approvalNotes !== undefined ? data.approvalNotes ?? null : undefined,
    rejectionNotes: data.rejectionNotes !== undefined ? data.rejectionNotes ?? null : undefined,
  };

  if (nextStatus === 'APPROVED') {
    updatePayload.approvedAt = new Date();
    updatePayload.rejectedAt = null;
    if (!updatePayload.approverId) {
      updatePayload.approverId = existing.ownerId;
    }
  } else if (nextStatus === 'REJECTED') {
    updatePayload.rejectedAt = new Date();
    updatePayload.approvedAt = null;
  } else {
    updatePayload.approvedAt = null;
    updatePayload.rejectedAt = null;
  }

  const decision = await prisma.decision.update({
    where: { id: decisionId },
    data: updatePayload,
    include: {
      organization: { select: { id: true, name: true } },
      project: { select: { id: true, name: true } },
      createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      owner: { select: { id: true, firstName: true, lastName: true, email: true } },
      approver: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
  });

  const changes = summarizeDecisionChanges(existing as Record<string, unknown>, decision as Record<string, unknown>);
  if (Object.keys(changes).length > 0) {
    const action =
      existing.status !== decision.status
        ? decision.status === 'APPROVED'
          ? 'DECISION_APPROVED'
          : decision.status === 'REJECTED'
            ? 'DECISION_REJECTED'
            : 'DECISION_STATUS_CHANGED'
        : 'DECISION_UPDATED';

    await recordDecisionAudit({
      organizationId,
      decisionId,
      actorId: actorId ?? null,
      action,
      summary: action === 'DECISION_APPROVED' ? 'Decision approved' : action === 'DECISION_REJECTED' ? 'Decision rejected' : 'Decision updated',
      metadata: {
        changedFields: Object.keys(changes),
        changes,
      },
    });
  }

  return decision;
}

export async function deleteDecision(organizationId: string, decisionId: string, actorId?: string | null) {
  const decision = await prisma.decision.findFirst({
    where: { id: decisionId, organizationId },
  });

  if (!decision) {
    throw new Error('Decision not found');
  }

  await recordDecisionAudit({
    organizationId,
    decisionId,
    actorId: actorId ?? null,
    action: 'DECISION_DELETED',
    summary: 'Decision deleted',
    metadata: {
      deletedTitle: decision.title,
    },
  });

  await prisma.decision.delete({ where: { id: decisionId } });
  return { success: true };
}

export async function listDecisionEvidence(organizationId: string, decisionId: string) {
  const decision = await prisma.decision.findFirst({
    where: { id: decisionId, organizationId },
    include: {
      evidence: {
        orderBy: { createdAt: 'desc' },
        include: {
          document: {
            include: {
              uploadedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
              project: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });

  if (!decision) {
    throw new Error('Decision not found');
  }

  return decision.evidence.map((entry) => ({
    id: entry.id,
    decisionId: entry.decisionId,
    documentId: entry.documentId,
    note: entry.note,
    createdAt: entry.createdAt,
    document: entry.document,
  }));
}

export async function addDecisionEvidence(
  organizationId: string,
  decisionId: string,
  userId: string,
  data: { documentId: string; note?: string | null }
) {
  await assertOrganizationMember(organizationId, userId);

  const decision = await prisma.decision.findFirst({
    where: { id: decisionId, organizationId },
    include: { project: true },
  });

  if (!decision) {
    throw new Error('Decision not found');
  }

  const document = await prisma.document.findFirst({
    where: { id: data.documentId, organizationId },
    include: { project: true },
  });

  if (!document) {
    throw new Error('Document not found in organization');
  }

  if (decision.projectId && document.projectId && decision.projectId !== document.projectId) {
    throw new Error('Document project does not match decision project');
  }

  const existing = await prisma.decisionEvidence.findFirst({
    where: { decisionId, documentId: data.documentId },
  });

  if (existing) {
    throw new Error('Document is already linked to this decision');
  }

  const link = await prisma.decisionEvidence.create({
    data: {
      decisionId,
      documentId: data.documentId,
      note: data.note ?? null,
    },
    include: {
      document: {
        include: {
          uploadedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
          project: { select: { id: true, name: true } },
        },
      },
    },
  });

  await recordDecisionAudit({
    organizationId,
    decisionId,
    actorId: userId,
    action: 'DECISION_EVIDENCE_LINKED',
    summary: 'Evidence linked to decision',
    metadata: {
      documentId: data.documentId,
      note: data.note ?? null,
    },
  });

  return link;
}

export async function removeDecisionEvidence(
  organizationId: string,
  decisionId: string,
  documentId: string,
  userId: string
) {
  await assertOrganizationMember(organizationId, userId);

  const decision = await prisma.decision.findFirst({
    where: { id: decisionId, organizationId },
  });

  if (!decision) {
    throw new Error('Decision not found');
  }

  const document = await prisma.document.findFirst({
    where: { id: documentId, organizationId },
  });

  if (!document) {
    throw new Error('Document not found in organization');
  }

  const link = await prisma.decisionEvidence.findFirst({
    where: { decisionId, documentId },
  });

  if (!link) {
    throw new Error('Evidence link not found');
  }

  await prisma.decisionEvidence.delete({ where: { id: link.id } });

  await recordDecisionAudit({
    organizationId,
    decisionId,
    actorId: userId,
    action: 'DECISION_EVIDENCE_UNLINKED',
    summary: 'Evidence unlinked from decision',
    metadata: {
      documentId,
      evidenceId: link.id,
    },
  });

  return { success: true };
}

export async function listDecisionAuditHistory(
  organizationId: string,
  decisionId: string,
  options: { limit?: number; offset?: number } = {}
) {
  const decision = await prisma.decision.findFirst({
    where: { id: decisionId, organizationId },
    select: { id: true },
  });

  if (!decision) {
    throw new Error('Decision not found');
  }

  const limit = Math.min(100, Math.max(1, Number(options.limit ?? 20))) || 20;
  const offset = Math.max(0, Number(options.offset ?? 0)) || 0;

  const [items, total] = await prisma.$transaction([
    prisma.auditLog.findMany({
      where: {
        organizationId,
        entityType: 'Decision',
        entityId: decisionId,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        actor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    }),
    prisma.auditLog.count({
      where: {
        organizationId,
        entityType: 'Decision',
        entityId: decisionId,
      },
    }),
  ]);

  return {
    items: items.map((item) => ({
      id: item.id,
      action: item.action,
      actor: item.actor,
      createdAt: item.createdAt,
      metadata: item.metadata as Record<string, unknown> | null,
    })),
    pagination: {
      limit,
      offset,
      total,
      hasMore: offset + items.length < total,
    },
  };
}

export async function listDecisionRelationships(organizationId: string, decisionId: string) {
  const decision = await prisma.decision.findFirst({
    where: { id: decisionId, organizationId },
    select: { id: true },
  });

  if (!decision) {
    throw new Error('Decision not found');
  }

  const outgoing = await prisma.decisionLink.findMany({
    where: { fromId: decisionId },
    orderBy: { createdAt: 'desc' },
    include: {
      toDecision: {
        select: {
          id: true,
          title: true,
          status: true,
          organizationId: true,
          project: { select: { id: true, name: true } },
        },
      },
    },
  });

  const incoming = await prisma.decisionLink.findMany({
    where: { toId: decisionId },
    orderBy: { createdAt: 'desc' },
    include: {
      fromDecision: {
        select: {
          id: true,
          title: true,
          status: true,
          organizationId: true,
          project: { select: { id: true, name: true } },
        },
      },
    },
  });

  return {
    outgoing: outgoing.map((item) => ({
      id: item.id,
      relationType: item.relationType,
      note: item.note,
      createdAt: item.createdAt,
      relatedDecision: item.toDecision,
    })),
    incoming: incoming.map((item) => ({
      id: item.id,
      relationType: item.relationType,
      note: item.note,
      createdAt: item.createdAt,
      relatedDecision: item.fromDecision,
    })),
  };
}

export async function createDecisionRelationship(
  organizationId: string,
  fromDecisionId: string,
  toDecisionId: string,
  relationType: string,
  actorId?: string | null,
  note?: string | null
) {
  const normalizedType = normalizeDecisionRelationshipType(relationType);

  const [fromDecision, toDecision] = await Promise.all([
    prisma.decision.findFirst({
      where: { id: fromDecisionId, organizationId },
      select: { id: true, organizationId: true, status: true, supersededById: true },
    }),
    prisma.decision.findFirst({
      where: { id: toDecisionId, organizationId },
      select: { id: true, organizationId: true, status: true, supersededById: true },
    }),
  ]);

  if (!fromDecision || !toDecision) {
    throw new Error('Decision not found');
  }

  if (fromDecisionId === toDecisionId) {
    throw new Error('A decision cannot relate to itself');
  }

  const existing = await prisma.decisionLink.findFirst({
    where: {
      fromId: fromDecisionId,
      toId: toDecisionId,
      relationType: normalizedType,
    },
  });

  if (existing) {
    throw new Error('Decision relationship already exists');
  }

  if (normalizedType === 'DEPENDS_ON') {
    const wouldCreateCycle = await hasDependencyPath(toDecisionId, fromDecisionId);
    if (wouldCreateCycle) {
      throw new Error('This dependency would create a circular dependency');
    }
  }

  if (normalizedType === 'SUPERSEDES') {
    if (toDecision.supersededById && toDecision.supersededById !== fromDecisionId) {
      throw new Error('Decision is already superseded by another decision');
    }
  }

  const relationship = await prisma.$transaction(async (tx) => {
    const created = await tx.decisionLink.create({
      data: {
        fromId: fromDecisionId,
        toId: toDecisionId,
        relationType: normalizedType,
        note: note ?? null,
      },
    });

    if (normalizedType === 'SUPERSEDES') {
      await tx.decision.update({
        where: { id: toDecisionId },
        data: {
          supersededById: fromDecisionId,
        },
      });
    }

    return created;
  });

  await recordDecisionAudit({
    organizationId,
    decisionId: fromDecisionId,
    actorId: actorId ?? null,
    action: normalizedType === 'SUPERSEDES' ? 'DECISION_SUPERSEDED' : 'DECISION_RELATIONSHIP_CREATED',
    summary:
      normalizedType === 'SUPERSEDES'
        ? 'Decision superseded another decision'
        : `Decision linked with ${relationshipLabels[normalizedType].toLowerCase()}`,
    metadata: {
      relationType: normalizedType,
      relatedDecisionId: toDecisionId,
      note: note ?? null,
    },
  });

  return {
    ...relationship,
    relationType: normalizedType,
  };
}

export async function removeDecisionRelationship(
  organizationId: string,
  fromDecisionId: string,
  toDecisionId: string,
  relationType: string,
  actorId?: string | null
) {
  const normalizedType = normalizeDecisionRelationshipType(relationType);

  const relationship = await prisma.decisionLink.findFirst({
    where: {
      fromId: fromDecisionId,
      toId: toDecisionId,
      relationType: normalizedType,
    },
  });

  if (!relationship) {
    throw new Error('Decision relationship not found');
  }

  await prisma.$transaction(async (tx) => {
    await tx.decisionLink.deleteMany({
      where: {
        fromId: fromDecisionId,
        toId: toDecisionId,
        relationType: normalizedType,
      },
    });

    if (normalizedType === 'SUPERSEDES') {
      const targetDecision = await tx.decision.findFirst({
        where: { id: toDecisionId, organizationId },
        select: { id: true, supersededById: true },
      });

      if (targetDecision?.supersededById === fromDecisionId) {
        await tx.decision.update({
          where: { id: toDecisionId },
          data: { supersededById: null },
        });
      }
    }
  });

  await recordDecisionAudit({
    organizationId,
    decisionId: fromDecisionId,
    actorId: actorId ?? null,
    action: normalizedType === 'SUPERSEDES' ? 'DECISION_RELATIONSHIP_REMOVED' : 'DECISION_RELATIONSHIP_REMOVED',
    summary: 'Decision relationship removed',
    metadata: {
      relationType: normalizedType,
      relatedDecisionId: toDecisionId,
      removedNote: relationship.note,
    },
  });

  return { success: true };
}
