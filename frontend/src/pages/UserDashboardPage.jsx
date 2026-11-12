import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ReceiptModal from '../components/common/ReceiptModal';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Car,
  AlertCircle,
  Plus,
  RefreshCw,
  TrendingUp,
  DollarSign,
} from 'lucide-react';

const UserDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [cancellingId, setCancellingId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes] = await Promise.all([
        axiosClient.get('/dashboard/user'),
        axiosClient.get(`/bookings/my-bookings?status=${statusFilter}`),
      ]);
      setStats(statsRes.data.stats);
      setBookings(bookingsRes.data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [statusFilter]);

  const handleOpenCancelModal = (booking) => {
    setCancellingId(booking._id);
    setCancellationReason('');
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingId) return;
    try {
      await axiosClient.patch(`/bookings/${cancellingId}/cancel`, {
        cancellationReason,
      });
      setCancelModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    }
  };

  const handleOpenReceipt = async (bookingId) => {
    try {
      const res = await axiosClient.get(`/payments/receipt/${bookingId}`);
      setReceiptData(res.data.receipt);
      setReceiptModalOpen(true);
    } catch (err) {
      alert(err.message || 'Payment receipt not found.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Active':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your active bookings, trip schedule, invoices and cancellation requests.
          </p>
        </div>

        <Link
          to="/vehicles"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Book Another Vehicle</span>
        </Link>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Bookings
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {stats?.totalBookings || 0}
            </h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active Rentals
            </p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">
              {stats?.activeRentals || 0}
            </h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Completed Trips
            </p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              {stats?.completedRentals || 0}
            </h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Amount Spent
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              ₹{(stats?.totalSpent || 0).toLocaleString('en-IN')}
            </h3>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Bookings List Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900">My Rental History & Reservations</h2>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Confirmed', 'Active', 'Completed', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Fetching your bookings..." size="md" />
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Vehicle & Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={b.vehicle?.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=200&q=80'}
                    alt={b.vehicle?.name}
                    className="w-24 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{b.vehicle?.name}</h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      Ref: {b.bookingId} • Plate: {b.vehicle?.registrationNumber}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {new Date(b.pickupDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      →{' '}
                      {new Date(b.returnDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      <span className="text-slate-400">({b.totalDays} day{b.totalDays > 1 ? 's' : ''})</span>
                    </p>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="md:text-right">
                    <span className="text-xs text-slate-400 block font-medium">Total Paid</span>
                    <strong className="text-lg font-black text-slate-900">
                      ₹{b.totalAmount?.toLocaleString('en-IN')}
                    </strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* View Receipt */}
                    <button
                      onClick={() => handleOpenReceipt(b._id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                      title="View / Print Payment Receipt"
                    >
                      <FileText className="w-3.5 h-3.5 text-brand-600" />
                      <span>Receipt</span>
                    </button>

                    {/* Cancel Booking (Allowed if Pending or Confirmed) */}
                    {['Pending', 'Confirmed'].includes(b.status) && (
                      <button
                        onClick={() => handleOpenCancelModal(b)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
            <Car className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Reservations Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't made any bookings in this category yet. Find your dream car today!
            </p>
            <Link
              to="/vehicles"
              className="inline-block px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700"
            >
              Browse Cars
            </Link>
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Cancel Reservation?</h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel this booking? If you have completed payment online, a full
              refund will be credited back to your original payment method within 2-3 business days.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for cancellation (Optional)
              </label>
              <textarea
                rows="2"
                placeholder="Change of travel plans, found another transport..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700"
              >
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Receipt Modal */}
      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receiptData={receiptData}
      />
    </div>
  );
};

export default UserDashboardPage;
