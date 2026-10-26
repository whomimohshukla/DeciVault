import { prisma } from '../../lib/prisma.js';
import { Role } from '@prisma/client';

export async function listMembers(organizationId: string) {
  const members = await prisma.membership.findMany({
    where: { organizationId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return members;
}

export async function updateMemberRole(
  organizationId: string,
  userId: string,
  role: Role,
  actorId: string
) {
  // Only owner can change roles? Or admin+owner - rule says only owners can transfer ownership or perform owner-only ops
  // For changing roles, require owner
  const actorMembership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: actorId,
        organizationId,
      },
    },
  });

  if (!actorMembership || actorMembership.role !== 'OWNER') {
    throw new Error('Only owners can change roles');
  }

  const targetMembership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (!targetMembership) {
    throw new Error('Member not found');
  }

  // Cannot change owner role
  if (targetMembership.role === 'OWNER') {
    throw new Error('Cannot change owner role');
  }

  if (role === 'OWNER') {
    throw new Error('Cannot assign owner role');
  }

  const updated = await prisma.membership.update({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
    data: { role },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return updated;
}

export async function removeMember(organizationId: string, userId: string, actorId: string) {
  const actorMembership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: actorId,
        organizationId,
      },
    },
  });

  if (!actorMembership || actorMembership.role !== 'OWNER') {
    throw new Error('Only owners can remove members');
  }

  const targetMembership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (!targetMembership) {
    throw new Error('Member not found');
  }

  if (targetMembership.role === 'OWNER') {
    throw new Error('Cannot remove the owner');
  }

  await prisma.membership.delete({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  return { success: true };
}

export async function leaveOrganization(organizationId: string, userId: string) {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (!membership) {
    throw new Error('Member not found');
  }

  if (membership.role === 'OWNER') {
    // Check if there are other owners? only one owner per membership role in general, but check count
    const ownerCount = await prisma.membership.count({
      where: {
        organizationId,
        role: 'OWNER',
      },
    });

    if (ownerCount <= 1) {
      throw new Error('Cannot leave as the last owner');
    }
  }

  await prisma.membership.delete({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  return { success: true };
}
