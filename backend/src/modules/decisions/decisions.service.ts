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
    .split(/\n+/)
    .map((option) => option.trim())
    .filter(Boolean);
  return options.length > 0 ? options : null;
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
      alternatives:
        normalizedAlternatives === null ? Prisma.JsonNull : normalizedAlternatives,
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
  data: Partial<DecisionInput>
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

  return decision;
}

export async function deleteDecision(organizationId: string, decisionId: string) {
  const decision = await prisma.decision.findFirst({
    where: { id: decisionId, organizationId },
  });

  if (!decision) {
    throw new Error('Decision not found');
  }

  await prisma.decision.delete({ where: { id: decisionId } });
  return { success: true };
}
