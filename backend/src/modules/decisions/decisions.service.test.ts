import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    membership: { findUnique: vi.fn() },
    decision: { findFirst: vi.fn() },
    document: { findFirst: vi.fn() },
    decisionEvidence: {
      findFirst: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock('../../lib/prisma.js', () => ({
  prisma: mockPrisma,
}));

import { addDecisionEvidence, removeDecisionEvidence } from './decisions.service.js';

describe('decision evidence linking', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects duplicate link attempts', async () => {
    mockPrisma.membership.findUnique.mockResolvedValue({ id: 'membership-1', role: 'MEMBER' });
    mockPrisma.decision.findFirst.mockResolvedValue({ id: 'decision-1', organizationId: 'org-1', projectId: null });
    mockPrisma.document.findFirst.mockResolvedValue({ id: 'doc-1', organizationId: 'org-1', projectId: null });
    mockPrisma.decisionEvidence.findFirst.mockResolvedValue({ id: 'link-1', decisionId: 'decision-1', documentId: 'doc-1' });

    await expect(
      addDecisionEvidence('org-1', 'decision-1', 'user-1', { documentId: 'doc-1' })
    ).rejects.toThrow('Document is already linked to this decision');
  });

  it('rejects documents from a different organization', async () => {
    mockPrisma.membership.findUnique.mockResolvedValue({ id: 'membership-1', role: 'MEMBER' });
    mockPrisma.decision.findFirst.mockResolvedValue({ id: 'decision-1', organizationId: 'org-1', projectId: null });
    mockPrisma.document.findFirst.mockResolvedValue(null);

    await expect(
      addDecisionEvidence('org-1', 'decision-1', 'user-1', { documentId: 'doc-1' })
    ).rejects.toThrow('Document not found in organization');
  });

  it('links a valid document to a decision', async () => {
    mockPrisma.membership.findUnique.mockResolvedValue({ id: 'membership-1', role: 'MEMBER' });
    mockPrisma.decision.findFirst.mockResolvedValue({ id: 'decision-1', organizationId: 'org-1', projectId: null });
    mockPrisma.document.findFirst.mockResolvedValue({ id: 'doc-1', organizationId: 'org-1', projectId: null });
    mockPrisma.decisionEvidence.findFirst.mockResolvedValue(null);
    mockPrisma.decisionEvidence.create.mockResolvedValue({
      id: 'link-1',
      decisionId: 'decision-1',
      documentId: 'doc-1',
      note: null,
      document: { id: 'doc-1', filename: 'brief.pdf', mimeType: 'application/pdf' },
    });
    mockPrisma.auditLog.create.mockResolvedValue({ id: 'audit-1' });

    await expect(
      addDecisionEvidence('org-1', 'decision-1', 'user-1', { documentId: 'doc-1' })
    ).resolves.toMatchObject({ id: 'link-1', documentId: 'doc-1' });
  });

  it('removes an existing evidence link without deleting the source document', async () => {
    mockPrisma.membership.findUnique.mockResolvedValue({ id: 'membership-1', role: 'MEMBER' });
    mockPrisma.decision.findFirst.mockResolvedValue({ id: 'decision-1', organizationId: 'org-1' });
    mockPrisma.document.findFirst.mockResolvedValue({ id: 'doc-1', organizationId: 'org-1' });
    mockPrisma.decisionEvidence.findFirst.mockResolvedValue({ id: 'link-1', decisionId: 'decision-1', documentId: 'doc-1' });
    mockPrisma.decisionEvidence.delete.mockResolvedValue({ id: 'link-1' });
    mockPrisma.auditLog.create.mockResolvedValue({ id: 'audit-1' });

    await expect(removeDecisionEvidence('org-1', 'decision-1', 'doc-1', 'user-1')).resolves.toEqual({ success: true });
  });
});
