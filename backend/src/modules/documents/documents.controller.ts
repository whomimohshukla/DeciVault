import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.js';
import { createDocumentSchema } from '../../validators/document.js';
import {
  createDocument,
  deleteDocumentRecord,
  getDocument,
  listDocuments,
  readDocumentContent,
} from './documents.service.js';

export async function list(req: AuthRequest, res: Response) {
  try {
    const organizationId = req.params.organizationId as string;
    const documents = await listDocuments(organizationId);
    return res.status(200).json({ status: 'success', data: { documents } });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: 'Failed to list documents' });
  }
}

export async function create(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const organizationId = req.params.organizationId as string;
    const parsed = createDocumentSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: parsed.error.flatten(),
      });
    }

    const document = await createDocument(req.userId, organizationId, parsed.data);
    return res.status(201).json({ status: 'success', data: { document } });
  } catch (error: any) {
    if (
      error.message === 'User is not a member of this organization' ||
      error.message === 'Project not found in organization'
    ) {
      return res.status(400).json({ status: 'error', message: error.message });
    }

    return res.status(500).json({ status: 'error', message: 'Failed to create document' });
  }
}

export async function get(req: AuthRequest, res: Response) {
  try {
    const organizationId = req.params.organizationId as string;
    const documentId = req.params.documentId as string;
    const document = await getDocument(organizationId, documentId);

    if (!document) {
      return res.status(404).json({ status: 'error', message: 'Document not found' });
    }

    return res.status(200).json({ status: 'success', data: { document } });
  } catch {
    return res.status(500).json({ status: 'error', message: 'Failed to get document' });
  }
}

export async function download(req: AuthRequest, res: Response) {
  try {
    const organizationId = req.params.organizationId as string;
    const documentId = req.params.documentId as string;
    const document = await getDocument(organizationId, documentId);

    if (!document) {
      return res.status(404).json({ status: 'error', message: 'Document not found' });
    }

    const content = await readDocumentContent(document.storageKey);
    if (!content) {
      return res.status(404).json({ status: 'error', message: 'Document file not found' });
    }

    res.setHeader('Content-Type', document.mimeType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(document.filename)}"`);
    return res.status(200).send(content);
  } catch {
    return res.status(500).json({ status: 'error', message: 'Failed to download document' });
  }
}

export async function remove(req: AuthRequest, res: Response) {
  try {
    const organizationId = req.params.organizationId as string;
    const documentId = req.params.documentId as string;
    const result = await deleteDocumentRecord(organizationId, documentId);
    return res.status(200).json({ status: 'success', data: result });
  } catch (error: any) {
    if (error.message === 'Document not found') {
      return res.status(404).json({ status: 'error', message: error.message });
    }

    return res.status(500).json({ status: 'error', message: 'Failed to delete document' });
  }
}
