import { Router } from 'express';
import { register, login, logout, me, verifyEmail, resendVerificationEmail, forgotPasswordHandler, resetPasswordHandler } from '../modules/auth/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', requireAuth, resendVerificationEmail);
router.post('/forgot-password', forgotPasswordHandler);
router.post('/reset-password', resetPasswordHandler);

export default router;
