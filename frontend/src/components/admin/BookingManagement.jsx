import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import LoadingSpinner from '../common/LoadingSpinner';
import ReceiptModal from '../common/ReceiptModal';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Car,
  Calendar,
  AlertCircle,
  Eye,
} from 'lucide-react';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [receiptData, setReceiptData] = useState(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/bookings?status=${statusFilter}&limit=100`);
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await axiosClient.patch(`/bookings/${id}/status`, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      alert(err.message || 'Failed to update booking status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewReceipt = async (bookingId) => {
    try {
      const res = await axiosClient.get(`/payments/receipt/${bookingId}`);
      setReceiptData(res.data.receipt);
      setReceiptModalOpen(true);
    } catch (err) {
      alert(err.message || 'Payment receipt not found for this booking.');
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

  const filteredBookings = bookings.filter(
    (b) =>
      b.bookingId.toLowerCase().includes(search.toLowerCase()) ||
      b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.vehicle?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by booking ID, customer or car..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <LoadingSpinner text="Fetching reservation records..." size="md" />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {filteredBookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-6">Booking Reference</th>
                    <th className="py-3.5 px-6">Customer</th>
                    <th className="py-3.5 px-6">Vehicle Reserved</th>
                    <th className="py-3.5 px-6">Schedule</th>
                    <th className="py-3.5 px-6">Total Amount</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Change Status / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">
                        {b.bookingId}
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800">{b.user?.name || 'Customer'}</div>
                        <div className="text-[11px] text-slate-400">{b.user?.email}</div>
                        <div className="text-[11px] text-slate-400">{b.user?.phone || 'N/A'}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-800">{b.vehicle?.name}</div>
                        <div className="text-[11px] font-mono text-purple-700">
                          {b.vehicle?.registrationNumber}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-500">
                        <div>
                          {new Date(b.pickupDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}{' '}
                          →{' '}
                          {new Date(b.returnDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400">
                          ({b.totalDays} day{b.totalDays > 1 ? 's' : ''})
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">
                          ₹{b.totalAmount?.toLocaleString('en-IN')}
                        </div>
                        <span
                          className={`text-[10px] font-bold ${
                            b.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'
                          }`}
                        >
                          Payment: {b.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getStatusBadge(
                            b.status
                          )}`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Status Select */}
                          <select
                            disabled={updatingId === b._id}
                            value={b.status}
                            onChange={(e) => handleStatusChange(b._id, e.target.value)}
                            className="text-[11px] font-semibold py-1 px-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-purple-500"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirm</option>
                            <option value="Active">Mark Active</option>
                            <option value="Completed">Mark Completed</option>
                            <option value="Cancelled">Cancel / Reject</option>
                          </select>

                          {/* View Receipt */}
                          <button
                            onClick={() => handleViewReceipt(b._id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                            title="View Payment Receipt / Invoice"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm">
              No bookings matching the current filter.
            </div>
          )}
        </div>
      )}

      {/* Printable Receipt Modal */}
      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receiptData={receiptData}
      />
    </div>
  );
};

export default BookingManagement;
