import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';

// @desc    Process / Record payment for a booking
// @route   POST /api/payments
// @access  Private
export const processPayment = async (req, res, next) => {
  try {
    const { bookingId, paymentMethod, billingDetails, cardNumberLast4 } = req.body;

    const booking = await Booking.findById(bookingId).populate('vehicle');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.paymentStatus === 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been paid for.',
      });
    }

    const paymentId = `PAY-${Date.now().toString().slice(-8)}`;
    const receiptNumber = `RCP-${Date.now().toString().slice(-6)}`;
    const transactionId =
      paymentMethod === 'Cash'
        ? `CASH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
        : `TXN-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;

    const payment = await Payment.create({
      paymentId,
      receiptNumber,
      booking: booking._id,
      user: req.user._id,
      amount: booking.totalAmount,
      paymentMethod: paymentMethod || 'Credit Card',
      paymentStatus: paymentMethod === 'Cash' ? 'Pending' : 'Completed',
      transactionId,
      paidAt: paymentMethod === 'Cash' ? null : new Date(),
      billingDetails: billingDetails || {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '',
        address: req.user.address || '',
      },
    });

    if (paymentMethod !== 'Cash') {
      booking.paymentStatus = 'Paid';
      if (booking.status === 'Pending') {
        booking.status = 'Confirmed';
      }
      await booking.save();
    }

    res.status(201).json({
      success: true,
      message: 'Payment processed successfully.',
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment receipt by Booking ID or Payment ID
// @route   GET /api/payments/receipt/:id
// @access  Private
export const getPaymentReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Search by paymentId, booking ObjectId, or receiptNumber
    let payment = await Payment.findOne({
      $or: [
        { paymentId: id },
        { receiptNumber: id },
        ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }, { booking: id }] : []),
      ],
    })
      .populate('user', 'name email phone address')
      .populate({
        path: 'booking',
        populate: { path: 'vehicle' },
      });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Receipt not found.' });
    }

    // Access control check
    if (
      payment.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this receipt.',
      });
    }

    res.status(200).json({
      success: true,
      receipt: payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all payments (Admin only)
// @route   GET /api/payments
// @access  Private/Admin
export const getAllPayments = async (req, res, next) => {
  try {
    const { paymentStatus, paymentMethod } = req.query;
    const query = {};

    if (paymentStatus && paymentStatus !== 'All') {
      query.paymentStatus = paymentStatus;
    }
    if (paymentMethod && paymentMethod !== 'All') {
      query.paymentMethod = paymentMethod;
    }

    const payments = await Payment.find(query)
      .populate('user', 'name email')
      .populate({
        path: 'booking',
        select: 'bookingId totalAmount pickupDate returnDate',
        populate: { path: 'vehicle', select: 'name brand' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    next(error);
  }
};
