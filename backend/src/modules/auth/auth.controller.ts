import { Request, Response } from 'express';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../../validators/auth.js';
import {
  createUser,
  validateUser,
  getUserById,
  verifyEmailToken,
  resendVerification,
  forgotPassword,
  resetPassword,
} from './auth.service.js';
import { signToken } from '../../utils/auth.js';
import { AuthRequest } from '../../middleware/auth.js';

export async function register(req: Request, res: Response) {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: parsed.error.flatten(),
      });
    }

    const user = await createUser(parsed.data);
    const token = signToken(user.id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      status: 'success',
      data: { user },
    });
  } catch (error: any) {
    if (error.message === 'Email already registered') {
      return res.status(409).json({
        status: 'error',
        message: error.message,
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Registration failed',
    });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: parsed.error.flatten(),
      });
    }

    const user = await validateUser(parsed.data.email, parsed.data.password);
    const token = signToken(user.id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error: any) {
    if (
      error.message === 'Invalid credentials' ||
      error.message === 'Account is not active'
    ) {
      return res.status(401).json({
        status: 'error',
        message: error.message,
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Login failed',
    });
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('token');
  return res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
}

export async function me(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    const user = await getUserById(req.userId);

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    return res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch {
    return res.status(500).json({
      status: 'error',
      message: 'Failed to get user',
    });
  }
}

export async function verifyEmail(req: Request, res: Response) {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        status: 'error',
        message: 'Verification token is required',
      });
    }

    await verifyEmailToken(token);

    return res.status(200).json({
      status: 'success',
      message: 'Email verified successfully',
    });
  } catch (error: any) {
    if (
      error.message === 'Invalid verification token' ||
      error.message === 'Token already used' ||
      error.message === 'Token expired'
    ) {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Email verification failed',
    });
  }
}

export async function resendVerificationEmail(req: AuthRequest, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    await resendVerification(req.userId);

    return res.status(200).json({
      status: 'success',
      message: 'Verification email sent',
    });
  } catch (error: any) {
    if (error.message === 'Email already verified') {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Failed to resend verification email',
    });
  }
}

export async function forgotPasswordHandler(req: Request, res: Response) {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: parsed.error.flatten(),
      });
    }

    await forgotPassword(parsed.data.email);

    return res.status(200).json({
      status: 'success',
      message: 'If an account exists, a password reset link has been sent',
    });
  } catch {
    return res.status(200).json({
      status: 'success',
      message: 'If an account exists, a password reset link has been sent',
    });
  }
}

export async function resetPasswordHandler(req: Request, res: Response) {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: parsed.error.flatten(),
      });
    }

    await resetPassword(parsed.data.token, parsed.data.password);

    return res.status(200).json({
      status: 'success',
      message: 'Password reset successfully',
    });
  } catch (error: any) {
    if (
      error.message === 'Invalid reset token' ||
      error.message === 'Token already used' ||
      error.message === 'Token expired'
    ) {
      return res.status(400).json({
        status: 'error',
        message: error.message,
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Password reset failed',
    });
  }
}
