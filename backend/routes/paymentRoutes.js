import express from 'express';
import {
  processPayment,
  getPaymentReceipt,
  getAllPayments,
} from '../controllers/paymentController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, processPayment)
  .get(protect, adminOnly, getAllPayments);

router.get('/receipt/:id', protect, getPaymentReceipt);

export default router;
