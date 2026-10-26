import apiClient from '../lib/axios';

export async function listProjects(organizationId: string) {
  const response = await apiClient.get(`/organizations/${organizationId}/projects`);
  return response.data;
}

export async function getProject(organizationId: string, projectId: string) {
  const response = await apiClient.get(`/organizations/${organizationId}/projects/${projectId}`);
  return response.data;
}

export async function createProject(organizationId: string, data: { name: string; description?: string; status?: string }) {
  const response = await apiClient.post(`/organizations/${organizationId}/projects`, data);
  return response.data;
}

export async function updateProject(organizationId: string, projectId: string, data: any) {
  const response = await apiClient.patch(`/organizations/${organizationId}/projects/${projectId}`, data);
  return response.data;
}

export async function deleteProject(organizationId: string, projectId: string) {
  const response = await apiClient.delete(`/organizations/${organizationId}/projects/${projectId}`);
  return response.data;
}
