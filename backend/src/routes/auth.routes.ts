import { Router } from 'express';
import { register, login, logout, me, verifyEmail, resendVerificationEmail } from '../modules/auth/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification', requireAuth, resendVerificationEmail);

export default router;
