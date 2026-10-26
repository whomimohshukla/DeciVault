import { prisma } from '../../lib/prisma.js';

export async function createProject(
  userId: string,
  organizationId: string,
  data: { name: string; description?: string; status?: any }
) {
  const project = await prisma.project.create({
    data: {
      name: data.name,
      description: data.description,
      status: data.status || 'ACTIVE',
      organizationId,
      createdById: userId,
    },
    include: {
      organization: { select: { id: true, name: true } },
      createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
  });
  return project;
}

export async function listProjects(organizationId: string) {
  const projects = await prisma.project.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
    include: {
      organization: { select: { id: true, name: true } },
      createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      _count: { select: { documents: true, decisions: true, tasks: true } },
    },
  });
  return projects;
}

export async function getProject(organizationId: string, projectId: string) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organizationId,
    },
    include: {
      organization: { select: { id: true, name: true } },
      createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      _count: { select: { documents: true, decisions: true, tasks: true } },
    },
  });
  return project;
}

export async function updateProject(
  organizationId: string,
  projectId: string,
  data: { name?: string; description?: string | null; status?: any }
) {
  const project = await prisma.project.update({
    where: { id: projectId },
    data,
    include: {
      organization: { select: { id: true, name: true } },
      createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
  });
  if (project.organizationId !== organizationId) {
    throw new Error('Forbidden');
  }
  return project;
}

export async function deleteProject(organizationId: string, projectId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, organizationId },
  });
  if (!project) {
    throw new Error('Not found');
  }
  await prisma.project.delete({ where: { id: projectId } });
  return { success: true };
}
