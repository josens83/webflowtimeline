import express from 'express';
import { register, login, getProfile, updateProfile, changePassword } from '../controllers/authController';
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

const router = express.Router();

// Auth routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/profile', authenticateToken, getProfile);
router.put('/auth/profile', authenticateToken, updateProfile);
router.put('/auth/password', authenticateToken, changePassword);

// Trends routes (some require authentication for premium features)
router.get('/trends', authenticateToken, getAllTrends);
router.get('/trends/decade/:decade', authenticateToken, getTrendsByDecade);
router.get('/trends/country/:country', authenticateToken, getTrendsByCountry);
router.get('/trends/compare', authenticateToken, requirePremium, compareTrends);

// Stripe routes
router.post('/stripe/create-checkout-session', authenticateToken, createCheckoutSession);
router.post('/stripe/create-portal-session', authenticateToken, createPortalSession);
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), webhookHandler);

// Contact routes
router.post('/contact', submitContact); // Public endpoint (can be used by non-logged-in users)

// Admin routes
router.use('/admin', adminRoutes);

export default router;
