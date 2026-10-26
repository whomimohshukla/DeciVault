import { prisma } from '../../lib/prisma.js';

export async function createOrganization(userId: string, data: { name: string; slug: string }) {
  const existing = await prisma.organization.findUnique({
    where: { slug: data.slug },
  });

  if (existing) {
    throw new Error('Slug already exists');
  }

  const org = await prisma.organization.create({
    data: {
      name: data.name,
      slug: data.slug,
      memberships: {
        create: {
          userId,
          role: 'OWNER',
        },
      },
    },
  });

  return org;
}

export async function listUserOrganizations(userId: string) {
  const memberships = await prisma.membership.findMany({
    where: { userId },
    include: {
      organization: true,
    },
  });

  return memberships.map((m) => ({
    ...m.organization,
    role: m.role,
  }));
}

export async function getOrganization(organizationId: string) {
  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  return org;
}

export async function updateOrganization(organizationId: string, data: { name?: string; slug?: string }) {
  if (data.slug) {
    const existing = await prisma.organization.findUnique({
      where: { slug: data.slug },
    });

    if (existing && existing.id !== organizationId) {
      throw new Error('Slug already exists');
    }
  }

  const org = await prisma.organization.update({
    where: { id: organizationId },
    data,
  });

  return org;
}

export async function deleteOrganization(organizationId: string) {
  // Delete related records safely
  await prisma.$transaction(async (tx) => {
    await tx.membership.deleteMany({ where: { organizationId } });
    await tx.invitation.deleteMany({ where: { organizationId } });
    await tx.project.deleteMany({ where: { organizationId } });
    await tx.document.deleteMany({ where: { organizationId } });
    await tx.decision.deleteMany({ where: { organizationId } });
    await tx.task.deleteMany({ where: { organizationId } });
    await tx.notification.deleteMany({ where: { organizationId } });
    await tx.auditLog.deleteMany({ where: { organizationId } });
    await tx.integration.deleteMany({ where: { organizationId } });
    await tx.conversation.deleteMany({ where: { organizationId } });

    await tx.organization.delete({
      where: { id: organizationId },
    });
  });
}
