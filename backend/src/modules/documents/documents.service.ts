import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { prisma } from '../../lib/prisma.js';

const DOCUMENT_STORAGE_ROOT = path.resolve(process.cwd(), 'uploads');

async function ensureStorageRoot() {
  await fs.mkdir(DOCUMENT_STORAGE_ROOT, { recursive: true });
}

function sanitizeStorageKey(input?: string) {
  const candidate = input || randomUUID();
  return candidate.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export function getDocumentStoragePath(storageKey: string) {
  return path.join(DOCUMENT_STORAGE_ROOT, sanitizeStorageKey(storageKey));
}

export async function storeDocumentContent(storageKey: string, contentBase64?: string) {
  if (!contentBase64) return;

  await ensureStorageRoot();
  const target = getDocumentStoragePath(storageKey);
  const buffer = Buffer.from(contentBase64, 'base64');
  await fs.writeFile(target, buffer);
}

export async function readDocumentContent(storageKey: string) {
  const target = getDocumentStoragePath(storageKey);
  try {
    return await fs.readFile(target);
  } catch {
    return null;
  }
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
    where: { id: projectId, organizationId },
  });

  if (!project) {
    throw new Error('Project not found in organization');
  }
}

export async function listDocuments(organizationId: string) {
  return prisma.document.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
    include: {
      uploadedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      project: { select: { id: true, name: true } },
    },
  });
}

export async function createDocument(
  userId: string,
  organizationId: string,
  data: {
    filename: string;
    mimeType?: string;
    fileSize: number;
    storageKey?: string;
    projectId?: string | null;
    contentBase64?: string;
  }
) {
  await assertOrganizationMember(organizationId, userId);
  await assertProjectInOrganization(organizationId, data.projectId ?? null);

  const finalStorageKey = sanitizeStorageKey(data.storageKey || randomUUID());

  if (data.contentBase64) {
    await storeDocumentContent(finalStorageKey, data.contentBase64);
  }

  const document = await prisma.document.create({
    data: {
      filename: data.filename,
      mimeType: data.mimeType || 'application/octet-stream',
      fileSize: data.fileSize,
      storageKey: finalStorageKey,
      organizationId,
      projectId: data.projectId || null,
      uploadedById: userId,
    },
    include: {
      uploadedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      project: { select: { id: true, name: true } },
    },
  });

  return document;
}

export async function getDocument(organizationId: string, documentId: string) {
  return prisma.document.findFirst({
    where: { id: documentId, organizationId },
    include: {
      uploadedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      project: { select: { id: true, name: true } },
      _count: { select: { decisionEvidence: true } },
    },
  });
}

export async function deleteDocumentRecord(organizationId: string, documentId: string) {
  const document = await prisma.document.findFirst({
    where: { id: documentId, organizationId },
  });

  if (!document) {
    throw new Error('Document not found');
  }

  await prisma.document.delete({ where: { id: documentId } });
  return { success: true };
}
