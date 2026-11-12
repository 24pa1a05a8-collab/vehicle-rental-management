import User from '../models/User.js';
import Booking from '../models/Booking.js';

// @desc    Get all registered users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    // Attach total bookings count for each user
    const usersWithBookings = await Promise.all(
      users.map(async (u) => {
        const bookingsCount = await Booking.countDocuments({ user: u._id });
        return {
          ...u.toObject(),
          totalBookings: bookingsCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: users.length,
      users: usersWithBookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (Active / Deactivated)
// @route   PATCH /api/users/:id/toggle-status
// @access  Private/Admin
export const toggleUserStatus = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own active admin account.',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.name} has been ${user.isActive ? 'activated' : 'deactivated'}.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Admin / User)
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified.' });
    }

    if (req.params.id === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'You cannot remove your own admin privileges.',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}.`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account.',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Check if user has active bookings
    const activeBookings = await Booking.countDocuments({
      user: user._id,
      status: { $in: ['Active', 'Pending'] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete user: They currently have ${activeBookings} active/pending booking(s).`,
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
