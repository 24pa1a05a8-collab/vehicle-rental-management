import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Cash', 'Credit Card', 'Debit Card', 'UPI / NetBanking', 'Online Wallet'],
      default: 'Credit Card',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
      default: 'Completed',
    },
    transactionId: {
      type: String,
      required: true,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    billingDetails: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      country: { type: String, default: 'India' },
    },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
