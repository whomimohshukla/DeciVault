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
