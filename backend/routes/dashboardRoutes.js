import express from 'express';
import {
  getAdminDashboardStats,
  getUserDashboardStats,
  getRevenueReport,
} from '../controllers/dashboardController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin', protect, adminOnly, getAdminDashboardStats);
router.get('/user', protect, getUserDashboardStats);
router.get('/revenue-report', protect, adminOnly, getRevenueReport);

export default router;
