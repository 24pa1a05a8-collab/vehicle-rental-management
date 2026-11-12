import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ReceiptModal from '../components/common/ReceiptModal';
import {
  Car,
  CreditCard,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ArrowRight,
  FileText,
  User,
  Phone,
  Lock,
} from 'lucide-react';

const BookingCheckoutPage = () => {
  const { vehicleId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const pickupDate = searchParams.get('pickup') || new Date().toISOString().split('T')[0];
  const returnDate =
    searchParams.get('return') ||
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Driver details
  const [driverInfo, setDriverInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    licenseNumber: user?.driverLicense || 'DL-2024-88992',
    notes: '',
  });

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4532 •••• •••• 8892',
    cardName: user?.name || 'Cardholder Name',
    expiry: '12/28',
    cvv: '892',
  });

  // Success state & receipt
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/vehicles/${vehicleId}`);
        setVehicle(res.data.vehicle);
      } catch (err) {
        setError(err.message || 'Failed to load vehicle details');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [vehicleId]);

  const start = new Date(pickupDate);
  const end = new Date(returnDate);
  const diffTime = end - start;
  const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const rentalCost = totalDays * (vehicle?.rentalPricePerDay || 0);
  const taxesAndFees = Math.round(rentalCost * 0.12);
  const totalAmount = rentalCost + taxesAndFees;

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        vehicleId,
        pickupDate,
        returnDate,
        pickupLocation: vehicle.location,
        returnLocation: vehicle.location,
        notes: driverInfo.notes,
        paymentMethod,
        driverInfo: {
          fullName: driverInfo.fullName,
          email: driverInfo.email,
          phone: driverInfo.phone,
          licenseNumber: driverInfo.licenseNumber,
        },
      };

      const res = await axiosClient.post('/bookings', payload);
      setBookingSuccess(res.data.booking);

      // Fetch payment receipt details
      try {
        const receiptRes = await axiosClient.get(`/payments/receipt/${res.data.booking._id}`);
        setReceiptData(receiptRes.data.receipt);
      } catch (rErr) {
        console.error(rErr);
      }
    } catch (err) {
      setError(err.message || 'Booking failed. The vehicle may be reserved for these dates.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Preparing secure reservation..." size="lg" />;
  }

  // Booking Confirmation View
  if (bookingSuccess) {
    return (
      <div className="max-w-2xl mx-auto my-12 px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Reservation Confirmed!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Your Vehicle is Reserved
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Booking Reference:{' '}
              <span className="font-mono font-bold text-slate-800">{bookingSuccess.bookingId}</span>
            </p>
          </div>

          {/* Reserved Summary Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={vehicle?.images?.[0]}
                alt={vehicle?.name}
                className="w-16 h-11 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{vehicle?.name}</h4>
                <p className="text-slate-400 font-mono">{vehicle?.registrationNumber}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200">
              <div>
                <span className="text-slate-400 block">Pickup Date</span>
                <strong className="text-slate-800">
                  {new Date(bookingSuccess.pickupDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">Return Date</span>
                <strong className="text-slate-800">
                  {new Date(bookingSuccess.returnDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </strong>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold">
              <span>Total Rental Paid:</span>
              <span className="text-brand-600 text-sm">
                ₹{bookingSuccess.totalAmount?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => setReceiptModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>View & Print Receipt</span>
            </button>
            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all"
            >
              <span>Go to My Bookings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <ReceiptModal
          isOpen={receiptModalOpen}
          onClose={() => setReceiptModalOpen(false)}
          receiptData={receiptData}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Checkout & Finalize Booking
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your reservation, driver details and select payment method.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmitBooking} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Driver Details + Payment Method */}
        <div className="lg:col-span-2 space-y-6">
          {/* Driver Details Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <User className="w-5 h-5 text-brand-600" />
              <h3 className="text-base font-bold text-slate-900">1. Primary Driver Information</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={driverInfo.fullName}
                  onChange={(e) => setDriverInfo({ ...driverInfo, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={driverInfo.email}
                  onChange={(e) => setDriverInfo({ ...driverInfo, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={driverInfo.phone}
                  onChange={(e) => setDriverInfo({ ...driverInfo, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Driver's License Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="DL-IND-2024-XXXXX"
                  value={driverInfo.licenseNumber}
                  onChange={(e) => setDriverInfo({ ...driverInfo, licenseNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-mono font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Special Requests or Flight Info (Optional)
              </label>
              <textarea
                rows="2"
                placeholder="Airport arrival flight number, child booster seat request..."
                value={driverInfo.notes}
                onChange={(e) => setDriverInfo({ ...driverInfo, notes: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
              <CreditCard className="w-5 h-5 text-brand-600" />
              <h3 className="text-base font-bold text-slate-900">2. Select Payment Method</h3>
            </div>

            {/* Methods Selection Tabs */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('Credit Card')}
                className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'Credit Card'
                    ? 'border-brand-600 bg-brand-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <CreditCard className="w-5 h-5 text-brand-600" />
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-brand-600 flex items-center justify-center p-0.5">
                    {paymentMethod === 'Credit Card' && (
                      <span className="w-full h-full bg-brand-600 rounded-full" />
                    )}
                  </span>
                </div>
                <strong className="text-xs font-bold text-slate-900">Online Card / UPI</strong>
                <p className="text-[10px] text-slate-400 mt-0.5">Instant confirmation</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Cash')}
                className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between transition-all ${
                  paymentMethod === 'Cash'
                    ? 'border-brand-600 bg-brand-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-brand-600 flex items-center justify-center p-0.5">
                    {paymentMethod === 'Cash' && (
                      <span className="w-full h-full bg-brand-600 rounded-full" />
                    )}
                  </span>
                </div>
                <strong className="text-xs font-bold text-slate-900">Pay on Pickup (Cash)</strong>
                <p className="text-[10px] text-slate-400 mt-0.5">Pay at vehicle pickup desk</p>
              </button>
            </div>

            {/* Simulated Card Gateway Form */}
            {paymentMethod === 'Credit Card' && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 animate-in fade-in">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted Mock Payment Gateway</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">CVV</label>
                    <input
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Booking Summary & Final Button */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl sticky top-24 space-y-6">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Booking Summary
            </h3>

            {/* Vehicle preview */}
            <div className="flex items-center gap-3">
              <img
                src={vehicle?.images?.[0]}
                alt={vehicle?.name}
                className="w-20 h-14 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{vehicle?.name}</h4>
                <p className="text-[11px] text-slate-400 font-mono">
                  {vehicle?.registrationNumber}
                </p>
                <p className="text-[11px] font-semibold text-brand-600">{vehicle?.vehicleType}</p>
              </div>
            </div>

            {/* Schedule */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Pickup Date</span>
                <span className="font-bold text-slate-800">
                  {new Date(pickupDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Return Date</span>
                <span className="font-bold text-slate-800">
                  {new Date(returnDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-600">
                <span>Total Duration</span>
                <span className="font-bold text-brand-600">{totalDays} Day(s)</span>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>
                  Base Rate (₹{vehicle?.rentalPricePerDay?.toLocaleString('en-IN')} × {totalDays}d)
                </span>
                <span className="font-bold text-slate-800">
                  ₹{rentalCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST & Highway Transit Fee (12%)</span>
                <span className="font-bold text-slate-800">
                  ₹{taxesAndFees.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
                <span>Grand Total</span>
                <span className="text-brand-600 text-xl">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Submit Confirmation */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{submitting ? 'Confirming Reservation...' : 'Confirm & Book Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Full insurance coverage included automatically</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookingCheckoutPage;
