import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    pickupDate: {
      type: Date,
      required: [true, 'Please specify pickup date'],
    },
    returnDate: {
      type: Date,
      required: [true, 'Please specify return date'],
    },
    pickupLocation: {
      type: String,
      default: 'Main City Center Station',
    },
    returnLocation: {
      type: String,
      default: 'Main City Center Station',
    },
    totalDays: {
      type: Number,
      required: true,
      min: [1, 'Minimum booking duration is 1 day'],
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    rentalCost: {
      type: Number,
      required: true,
    },
    taxesAndFees: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [1, 'Total amount must be greater than 0'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Refunded'],
      default: 'Pending',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    cancelledAt: {
      type: Date,
    },
    notes: {
      type: String,
      default: '',
    },
    driverInfo: {
      fullName: String,
      email: String,
      phone: String,
      licenseNumber: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ vehicle: 1, pickupDate: 1, returnDate: 1, status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
