import { prisma } from '../../lib/prisma.js';
import { Role } from '@prisma/client';
import crypto from 'crypto';

export async function createInvitation(
  organizationId: string,
  inviterId: string,
  data: { email: string; role?: Role }
) {
  // Check if user already member
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    const existingMembership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: existingUser.id,
          organizationId,
        },
      },
    });

    if (existingMembership) {
      throw new Error('User is already a member');
    }
  }

  // Check duplicate active invitation
  const existingInvite = await prisma.invitation.findFirst({
    where: {
      email: data.email,
      organizationId,
      status: 'PENDING',
      expiresAt: { gt: new Date() },
    },
  });

  if (existingInvite) {
    throw new Error('Invitation already sent');
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const invitation = await prisma.invitation.create({
    data: {
      email: data.email,
      organizationId,
      role: data.role || 'MEMBER',
      token,
      inviterId,
      expiresAt,
      status: 'PENDING',
    },
  });

  // Return token for local dev testing as requested
  return { invitation, token };
}

export async function listInvitations(organizationId: string) {
  const invitations = await prisma.invitation.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
  });

  return invitations;
}

export async function acceptInvitation(token: string, userId: string) {
  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  if (!invitation) {
    throw new Error('Invitation not found');
  }

  if (invitation.status !== 'PENDING') {
    throw new Error('Invitation is no longer valid');
  }

  if (invitation.expiresAt < new Date()) {
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: 'EXPIRED' },
    });
    throw new Error('Invitation expired');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.email !== invitation.email) {
    throw new Error('Invitation email does not match');
  }

  // Check if already member
  const existingMembership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: invitation.organizationId,
      },
    },
  });

  if (existingMembership) {
    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: 'ACCEPTED' },
    });
    throw new Error('Already a member');
  }

  await prisma.$transaction([
    prisma.membership.create({
      data: {
        userId,
        organizationId: invitation.organizationId,
        role: invitation.role,
      },
    }),
    prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: 'ACCEPTED' },
    }),
  ]);

  return { success: true };
}

export async function declineInvitation(token: string, userId: string) {
  const invitation = await prisma.invitation.findUnique({
    where: { token },
  });

  if (!invitation) {
    throw new Error('Invitation not found');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.email !== invitation.email) {
    throw new Error('Invitation email does not match');
  }

  await prisma.invitation.update({
    where: { id: invitation.id },
    data: { status: 'REVOKED' },
  });

  return { success: true };
}

export async function cancelInvitation(_organizationId: string, invitationId: string) {
  await prisma.invitation.delete({
    where: { id: invitationId },
  });

  return { success: true };
}
