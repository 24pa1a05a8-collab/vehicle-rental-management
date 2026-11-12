import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, adminOnly, getAllBookings);

router.get('/my-bookings', protect, getMyBookings);

router.route('/:id')
  .get(protect, getBookingById);

router.patch('/:id/cancel', protect, cancelBooking);
router.patch('/:id/status', protect, adminOnly, updateBookingStatus);

export default router;
