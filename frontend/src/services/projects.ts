import api from './api';

export async function listProjects(organizationId: string) {
  const response = await api.get(`/organizations/${organizationId}/projects`);
  return response.data;
}

export async function getProject(organizationId: string, projectId: string) {
  const response = await api.get(`/organizations/${organizationId}/projects/${projectId}`);
  return response.data;
}

export async function createProject(organizationId: string, data: { name: string; description?: string; status?: string }) {
  const response = await api.post(`/organizations/${organizationId}/projects`, data);
  return response.data;
}

export async function updateProject(organizationId: string, projectId: string, data: any) {
  const response = await api.patch(`/organizations/${organizationId}/projects/${projectId}`, data);
  return response.data;
}

export async function deleteProject(organizationId: string, projectId: string) {
  const response = await api.delete(`/organizations/${organizationId}/projects/${projectId}`);
  return response.data;
}
