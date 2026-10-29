import apiClient from '../lib/axios';

export interface Decision {
  id: string;
  title: string;
  description: string;
  problemContext?: string | null;
  rationale?: string | null;
  alternatives?: string[] | null;
  status: 'PROPOSED' | 'APPROVED' | 'REJECTED' | 'SUPERSEDED';
  decisionDate?: string | null;
  effectiveDate?: string | null;
  organizationId: string;
  projectId?: string | null;
  createdById: string;
  ownerId: string;
  approverId?: string | null;
  createdAt: string;
  updatedAt: string;
  project?: { id: string; name: string } | null;
  owner?: { id: string; firstName?: string | null; lastName?: string | null; email: string } | null;
  approver?: { id: string; firstName?: string | null; lastName?: string | null; email: string } | null;
}

export const relationshipTypeLabels: Record<string, string> = {
  RELATED_TO: 'Related to',
  DEPENDS_ON: 'Depends on',
  SUPERSEDES: 'Supersedes',
};

export async function listDecisions(organizationId: string) {
  const response = await apiClient.get(`/organizations/${organizationId}/decisions`);
  return response.data;
}

export async function getDecision(organizationId: string, decisionId: string) {
  const response = await apiClient.get(`/organizations/${organizationId}/decisions/${decisionId}`);
  return response.data;
}

export async function createDecision(organizationId: string, data: any) {
  const response = await apiClient.post(`/organizations/${organizationId}/decisions`, data);
  return response.data;
}

export async function updateDecision(organizationId: string, decisionId: string, data: any) {
  const response = await apiClient.patch(`/organizations/${organizationId}/decisions/${decisionId}`, data);
  return response.data;
}

export async function deleteDecision(organizationId: string, decisionId: string) {
  const response = await apiClient.delete(`/organizations/${organizationId}/decisions/${decisionId}`);
  return response.data;
}

export async function listDecisionEvidence(organizationId: string, decisionId: string) {
  const response = await apiClient.get(`/organizations/${organizationId}/decisions/${decisionId}/evidence`);
  return response.data;
}

export async function addDecisionEvidence(organizationId: string, decisionId: string, data: { documentId: string; note?: string | null }) {
  const response = await apiClient.post(`/organizations/${organizationId}/decisions/${decisionId}/evidence`, data);
  return response.data;
}

export async function removeDecisionEvidence(organizationId: string, decisionId: string, documentId: string) {
  const response = await apiClient.delete(`/organizations/${organizationId}/decisions/${decisionId}/evidence/${documentId}`);
  return response.data;
}

export async function listDecisionHistory(organizationId: string, decisionId: string, params?: { limit?: number; offset?: number }) {
  const response = await apiClient.get(`/organizations/${organizationId}/decisions/${decisionId}/history`, {
    params,
  });
  return response.data;
}

export async function listDecisionRelationships(organizationId: string, decisionId: string) {
  const response = await apiClient.get(`/organizations/${organizationId}/decisions/${decisionId}/relationships`);
  return response.data;
}

export async function createDecisionRelationship(
  organizationId: string,
  decisionId: string,
  data: { relatedDecisionId: string; relationType: 'RELATED_TO' | 'DEPENDS_ON' | 'SUPERSEDES'; note?: string | null }
) {
  const response = await apiClient.post(`/organizations/${organizationId}/decisions/${decisionId}/relationships`, data);
  return response.data;
}

export async function removeDecisionRelationship(
  organizationId: string,
  decisionId: string,
  relatedDecisionId: string,
  relationType: 'RELATED_TO' | 'DEPENDS_ON' | 'SUPERSEDES'
) {
  const response = await apiClient.delete(
    `/organizations/${organizationId}/decisions/${decisionId}/relationships/${relatedDecisionId}/${relationType}`
  );
  return response.data;
}
