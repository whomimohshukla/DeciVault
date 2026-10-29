import { z } from 'zod';

export const createDocumentSchema = z.object({
  filename: z.string().trim().min(1, 'Filename is required').max(255),
  mimeType: z.string().trim().min(1).max(200).default('application/octet-stream'),
  fileSize: z.number().int().nonnegative().max(50 * 1024 * 1024),
  storageKey: z.string().trim().min(1).max(255).optional(),
  projectId: z.string().trim().min(1).optional().nullable(),
  contentBase64: z.string().trim().max(50 * 1024 * 1024 * 4).optional(),
});

export const decisionEvidenceSchema = z.object({
  documentId: z.string().trim().min(1, 'Document ID is required'),
  note: z.string().trim().max(2000).optional().nullable(),
});
