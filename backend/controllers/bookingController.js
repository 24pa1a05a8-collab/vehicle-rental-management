import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';
import Payment from '../models/Payment.js';

// Helper to generate unique booking ID
const generateBookingId = () => {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VRMS-${dateStr}-${randomChars}`;
};

// @desc    Create a new booking with automatic cost calculation & overlap prevention
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  try {
    const {
      vehicleId,
      pickupDate,
      returnDate,
      pickupLocation,
      returnLocation,
      notes,
      driverInfo,
      paymentMethod,
    } = req.body;

    if (!vehicleId || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide vehicleId, pickupDate, and returnDate.',
      });
    }

    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return res.status(400).json({
        success: false,
        message: 'Pickup date cannot be in the past.',
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'Return date must be at least one day after pickup date.',
      });
    }

    // Check vehicle exists and is active
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found.',
      });
    }

    if (!vehicle.availabilityStatus) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle is currently unavailable for rental.',
      });
    }

    // Overlapping booking prevention logic
    const overlapping = await Booking.findOne({
      vehicle: vehicleId,
      status: { $in: ['Pending', 'Confirmed', 'Active'] },
      $or: [
        { pickupDate: { $lt: end }, returnDate: { $gt: start } },
      ],
    });

    if (overlapping) {
      return res.status(400).json({
        success: false,
        message:
          'This vehicle is already reserved for the selected date range. Please select different dates or browse other vehicles.',
      });
    }

    // Calculate total days (minimum 1 day)
    const diffTime = Math.abs(end - start);
    const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const rentalCost = totalDays * vehicle.rentalPricePerDay;
    const taxesAndFees = Math.round(rentalCost * 0.12); // 12% GST/Platform charges
    const totalAmount = rentalCost + taxesAndFees;

    const bookingId = generateBookingId();

    const booking = await Booking.create({
      bookingId,
      user: req.user._id,
      vehicle: vehicleId,
      pickupDate: start,
      returnDate: end,
      pickupLocation: pickupLocation || vehicle.location || 'Central City Hub',
      returnLocation: returnLocation || vehicle.location || 'Central City Hub',
      totalDays,
      pricePerDay: vehicle.rentalPricePerDay,
      rentalCost,
      taxesAndFees,
      totalAmount,
      status: 'Confirmed', // Automatically confirm on reservation (or pending approval if desired)
      paymentStatus: paymentMethod === 'Cash' ? 'Pending' : 'Paid',
      notes: notes || '',
      driverInfo: driverInfo || {
        fullName: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        licenseNumber: req.user.driverLicense,
      },
    });

    // Create corresponding payment record
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
      amount: totalAmount,
      paymentMethod: paymentMethod || 'Credit Card',
      paymentStatus: paymentMethod === 'Cash' ? 'Pending' : 'Completed',
      transactionId,
      billingDetails: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '',
        address: req.user.address || '',
        city: 'Metropolis',
        country: 'India',
      },
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('vehicle')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Vehicle booking created successfully!',
      booking: populatedBooking,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('vehicle')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('vehicle')
      .populate('user', 'name email phone address avatar');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Ensure only the booking owner or an admin can view the booking
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking details.',
      });
    }

    const payment = await Payment.findOne({ booking: booking._id });

    res.status(200).json({
      success: true,
      booking,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking (User or Admin)
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const { cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id).populate('vehicle');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Check ownership or admin
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking.',
      });
    }

    // Cancellation rule check: can only cancel if Pending or Confirmed
    if (['Completed', 'Cancelled'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a booking that is already ${booking.status}.`,
      });
    }

    booking.status = 'Cancelled';
    booking.cancellationReason = cancellationReason || 'Cancelled by user request.';
    booking.cancelledAt = new Date();

    // If paid, mark payment as refunded
    if (booking.paymentStatus === 'Paid') {
      booking.paymentStatus = 'Refunded';
      await Payment.findOneAndUpdate(
        { booking: booking._id },
        { paymentStatus: 'Refunded' }
      );
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking has been cancelled successfully.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { bookingId: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalBookings = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('vehicle', 'name brand model registrationNumber images rentalPricePerDay')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: bookings.length,
      totalBookings,
      totalPages: Math.ceil(totalBookings / limitNum),
      currentPage: pageNum,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Approve, Reject, Complete, Activate)
// @route   PATCH /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    booking.status = status;
    if (notes) booking.notes = notes;

    if (status === 'Completed' && booking.paymentStatus === 'Pending') {
      // If paying cash on completion
      booking.paymentStatus = 'Paid';
      await Payment.findOneAndUpdate(
        { booking: booking._id },
        { paymentStatus: 'Completed' }
      );
    }

    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate('vehicle')
      .populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}.`,
      booking: populated,
    });
  } catch (error) {
    next(error);
  }
};
