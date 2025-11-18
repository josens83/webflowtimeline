import express from 'express';
import passport from 'passport';
import { register, login, getProfile, updateProfile, changePassword, refreshToken, logout, logoutAll } from '../controllers/authController';
import { handleOAuthCallback, handleOAuthFailure } from '../controllers/oauthController';
import {
  getAllTrends,
  getTrendsByDecade,
  getTrendsByCountry,
  compareTrends
} from '../controllers/trendsController';
import {
  createCheckoutSession,
  createPortalSession,
  webhookHandler
} from '../controllers/stripeController';
import {
  submitContact,
  getAllContacts,
  getContact,
  updateContactStatus,
  deleteContact,
  getContactStats
} from '../controllers/contactController';
import { authenticateToken, requirePremium } from '../middleware/auth';
import adminRoutes from './admin';
import {
  authLimiter,
  signupLimiter,
  paymentLimiter,
  contactLimiter,
  passwordResetLimiter
} from '../middleware/rateLimiter';
import { cacheMiddleware } from '../config/redis';

const router = express.Router();

// Auth routes with rate limiting
router.post('/auth/register', signupLimiter, register);
router.post('/auth/login', authLimiter, login);
router.post('/auth/refresh', authLimiter, refreshToken); // Refresh access token
router.post('/auth/logout', logout); // Logout single session
router.post('/auth/logout-all', authenticateToken, logoutAll); // Logout all sessions
router.get('/auth/profile', authenticateToken, getProfile);
router.put('/auth/profile', authenticateToken, updateProfile);
router.put('/auth/password', authenticateToken, passwordResetLimiter, changePassword);

// OAuth routes - Google
router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/api/auth/oauth/failure' }),
  handleOAuthCallback
);

// OAuth routes - Kakao
router.get(
  '/auth/kakao',
  passport.authenticate('kakao')
);

router.get(
  '/auth/kakao/callback',
  passport.authenticate('kakao', { session: false, failureRedirect: '/api/auth/oauth/failure' }),
  handleOAuthCallback
);

// OAuth failure handler
router.get('/auth/oauth/failure', handleOAuthFailure);

// Trends routes (with caching for better performance)
router.get('/trends', authenticateToken, cacheMiddleware('trends:all', 600), getAllTrends);
router.get('/trends/decade/:decade', authenticateToken, cacheMiddleware('trends:decade', 600), getTrendsByDecade);
router.get('/trends/country/:country', authenticateToken, cacheMiddleware('trends:country', 600), getTrendsByCountry);
router.get('/trends/compare', authenticateToken, requirePremium, cacheMiddleware('trends:compare', 300), compareTrends);

// Stripe routes with payment rate limiting
router.post('/stripe/create-checkout-session', authenticateToken, paymentLimiter, createCheckoutSession);
router.post('/stripe/create-portal-session', authenticateToken, paymentLimiter, createPortalSession);
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), webhookHandler);

// Contact routes with spam protection
router.post('/contact', contactLimiter, submitContact); // Public endpoint with rate limiting

// Admin routes
router.use('/admin', adminRoutes);

export default router;
