import apiClient from '../lib/axios';

export interface DocumentRecord {
  id: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  storageKey: string;
  organizationId: string;
  projectId?: string | null;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
  uploadedBy?: { id: string; firstName?: string | null; lastName?: string | null; email: string } | null;
  project?: { id: string; name: string } | null;
}

export async function listDocuments(organizationId: string) {
  const response = await apiClient.get(`/organizations/${organizationId}/documents`);
  return response.data;
}

export async function createDocument(organizationId: string, data: {
  filename: string;
  mimeType?: string;
  fileSize: number;
  storageKey?: string;
  projectId?: string | null;
  contentBase64?: string;
}) {
  const response = await apiClient.post(`/organizations/${organizationId}/documents`, data);
  return response.data;
}

export async function getDocument(organizationId: string, documentId: string) {
  const response = await apiClient.get(`/organizations/${organizationId}/documents/${documentId}`);
  return response.data;
}

export async function downloadDocument(organizationId: string, documentId: string) {
  const response = await apiClient.get(`/organizations/${organizationId}/documents/${documentId}/download`, {
    responseType: 'blob',
  });
  return response;
}
