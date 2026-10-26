import apiClient from '../lib/axios';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  id: string;
  userId: string;
  organizationId: string;
  role: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  token?: string;
}

export async function createOrganization(data: { name: string; slug: string }) {
  const res = await apiClient.post('/organizations', data);
  return res.data;
}

export async function listOrganizations() {
  const res = await apiClient.get('/organizations');
  return res.data;
}

export async function getOrganization(id: string) {
  const res = await apiClient.get(`/organizations/${id}`);
  return res.data;
}

export async function updateOrganization(id: string, data: { name?: string; slug?: string }) {
  const res = await apiClient.patch(`/organizations/${id}`, data);
  return res.data;
}

export async function deleteOrganization(id: string) {
  const res = await apiClient.delete(`/organizations/${id}`);
  return res.data;
}

export async function listMembers(orgId: string) {
  const res = await apiClient.get(`/organizations/${orgId}/members`);
  return res.data;
}

export async function updateMemberRole(orgId: string, userId: string, role: string) {
  const res = await apiClient.patch(`/organizations/${orgId}/members/${userId}`, { role });
  return res.data;
}

export async function removeMember(orgId: string, userId: string) {
  const res = await apiClient.delete(`/organizations/${orgId}/members/${userId}`);
  return res.data;
}

export async function leaveOrganization(orgId: string) {
  const res = await apiClient.post(`/organizations/${orgId}/leave`);
  return res.data;
}

export async function inviteMember(orgId: string, data: { email: string; role?: string }) {
  const res = await apiClient.post(`/organizations/${orgId}/invitations`, data);
  return res.data;
}

export async function listInvitations(orgId: string) {
  const res = await apiClient.get(`/organizations/${orgId}/invitations`);
  return res.data;
}

export async function acceptInvitation(token: string) {
  const res = await apiClient.post(`/api/invitations/${token}/accept`);
  return res.data;
}

export async function declineInvitation(token: string) {
  const res = await apiClient.post(`/api/invitations/${token}/decline`);
  return res.data;
}

export async function cancelInvitation(orgId: string, invitationId: string) {
  const res = await apiClient.delete(`/organizations/${orgId}/invitations/${invitationId}`);
  return res.data;
}
