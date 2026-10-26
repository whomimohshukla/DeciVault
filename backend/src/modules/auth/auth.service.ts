import { prisma } from '../../lib/prisma.js';
import { hashPassword, comparePassword } from '../../utils/auth.js';
import { generateVerificationToken } from '../../utils/verification.js';
import { emailQueue } from '../../queues/email.queue.js';
import { env } from '../../config/env.js';

export async function createUser(data: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    throw new Error('Email already registered');
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      emailVerified: false,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      status: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const token = generateVerificationToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.emailVerificationToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  const verifyUrl = `${env.APP_URL}/verify-email?token=${token}`;
  console.log('\n========== EMAIL VERIFICATION ==========');
  console.log('To:', user.email);
  console.log('Verification URL:', verifyUrl);
  console.log('Token:', token);
  console.log('========================================\n');

  try {
    await emailQueue.add('send-verification', {
      to: user.email,
      subject: 'Verify your email for DeciVault',
      html: `
        <h2>Verify your email</h2>
        <p>Click the link below to verify your email address:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
        <p>This link expires in 24 hours.</p>
      `,
    });
  } catch {
    // Queue not available, skip silently
  }

  return user;
}

export async function validateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (user.status !== 'ACTIVE') {
    throw new Error('Account is not active');
  }

  const isValid = await comparePassword(password, user.passwordHash);

  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    status: user.status,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      status: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function updateUserProfile(
  userId: string,
  data: { firstName?: string; lastName?: string }
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      firstName: data.firstName !== undefined ? data.firstName || null : undefined,
      lastName: data.lastName !== undefined ? data.lastName || null : undefined,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      status: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
}

export async function verifyEmailToken(token: string) {
  const record = await prisma.emailVerificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record) {
    throw new Error('Invalid verification token');
  }

  if (record.used) {
    throw new Error('Token already used');
  }

  if (record.expiresAt < new Date()) {
    throw new Error('Token expired');
  }

  await prisma.$transaction([
    prisma.emailVerificationToken.update({
      where: { id: record.id },
      data: { used: true },
    }),
    prisma.user.update({
      where: { id: record.userId },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    }),
  ]);

  return { success: true };
}

export async function resendVerification(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.emailVerified) {
    throw new Error('Email already verified');
  }

  await prisma.emailVerificationToken.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  const token = generateVerificationToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.emailVerificationToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt,
    },
  });

  const verifyUrl = `${env.APP_URL}/verify-email?token=${token}`;
  console.log('\n========== EMAIL VERIFICATION ==========');
  console.log('To:', user.email);
  console.log('Verification URL:', verifyUrl);
  console.log('Token:', token);
  console.log('========================================\n');

  try {
    await emailQueue.add('send-verification', {
      to: user.email,
      subject: 'Verify your email for DeciVault',
      html: `
        <h2>Verify your email</h2>
        <p>Click the link below to verify your email address:</p>
        <a href="${verifyUrl}">${verifyUrl}</a>
        <p>This link expires in 24 hours.</p>
      `,
    });
  } catch {
    // Skip if queue unavailable
  }

  return { success: true };
}
