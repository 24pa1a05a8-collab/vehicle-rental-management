import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import Category from '../models/Category.js';

// @desc    Get Admin Dashboard Stats & Metrics
// @route   GET /api/dashboard/admin
// @access  Private/Admin
export const getAdminDashboardStats = async (req, res, next) => {
  try {
    const [
      totalVehicles,
      availableVehicles,
      totalUsers,
      totalBookings,
      activeRentals,
      completedRentals,
      pendingBookings,
      categoriesCount,
      allPayments,
      recentBookings,
      revenueByMonth,
    ] = await Promise.all([
      Vehicle.countDocuments(),
      Vehicle.countDocuments({ availabilityStatus: true }),
      User.countDocuments({ role: 'user' }),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'Active' }),
      Booking.countDocuments({ status: 'Completed' }),
      Booking.countDocuments({ status: 'Pending' }),
      Category.countDocuments(),
      Payment.find({ paymentStatus: 'Completed' }),
      Booking.find()
        .populate('vehicle', 'name brand images rentalPricePerDay')
        .populate('user', 'name email avatar')
        .sort({ createdAt: -1 })
        .limit(6),
      // Aggregate revenue grouped by month for the last 6 months
      Payment.aggregate([
        { $match: { paymentStatus: 'Completed' } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            totalRevenue: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Calculate total revenue from completed payments
    const totalRevenue = allPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    // Fleet utilization rate
    const utilizationRate =
      totalVehicles > 0 ? Math.round(((totalVehicles - availableVehicles) / totalVehicles) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalVehicles,
        availableVehicles,
        unavailableVehicles: totalVehicles - availableVehicles,
        totalUsers,
        totalBookings,
        activeRentals,
        completedRentals,
        pendingBookings,
        categoriesCount,
        totalRevenue,
        utilizationRate,
      },
      recentBookings,
      revenueByMonth,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get User Dashboard Overview Stats
// @route   GET /api/dashboard/user
// @access  Private
export const getUserDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [
      totalBookings,
      activeRentals,
      completedRentals,
      cancelledBookings,
      pendingBookings,
      userBookings,
    ] = await Promise.all([
      Booking.countDocuments({ user: userId }),
      Booking.countDocuments({ user: userId, status: 'Active' }),
      Booking.countDocuments({ user: userId, status: 'Completed' }),
      Booking.countDocuments({ user: userId, status: 'Cancelled' }),
      Booking.countDocuments({ user: userId, status: 'Pending' }),
      Booking.find({ user: userId })
        .populate('vehicle')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    // Calculate total spent by user on confirmed/active/completed bookings
    const successfulBookings = await Booking.find({
      user: userId,
      status: { $in: ['Confirmed', 'Active', 'Completed'] },
      paymentStatus: 'Paid',
    });
    const totalSpent = successfulBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        activeRentals,
        completedRentals,
        cancelledBookings,
        pendingBookings,
        totalSpent,
      },
      recentBookings: userBookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Detailed Revenue Report (Admin)
// @route   GET /api/dashboard/revenue-report
// @access  Private/Admin
export const getRevenueReport = async (req, res, next) => {
  try {
    const payments = await Payment.find({ paymentStatus: 'Completed' })
      .populate('user', 'name email')
      .populate({
        path: 'booking',
        populate: { path: 'vehicle', select: 'name brand vehicleType' },
      })
      .sort({ createdAt: -1 });

    const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

    // Grouping by payment method
    const byPaymentMethod = payments.reduce((acc, p) => {
      acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + p.amount;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      totalRevenue,
      totalTransactions: payments.length,
      byPaymentMethod,
      payments,
    });
  } catch (error) {
    next(error);
  }
};
