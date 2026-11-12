import React from 'react';
import { X, Printer, CheckCircle2, Car, ShieldCheck } from 'lucide-react';

const ReceiptModal = ({ isOpen, onClose, receiptData }) => {
  if (!isOpen || !receiptData) return null;

  const {
    receiptNumber,
    paymentId,
    transactionId,
    amount,
    paymentMethod,
    paymentStatus,
    paidAt,
    booking,
    user,
    billingDetails,
  } = receiptData;

  const vehicle = booking?.vehicle;
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header Actions (Excluded in Print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h3 className="text-sm font-bold text-slate-800">Payment Invoice & Receipt</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-brand-600" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-receipt" className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                  <Car className="w-4 h-4" />
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tight">VRMS Rentals</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Vehicle Rental Management System</p>
              <p className="text-xs text-slate-400">Cyber City Hub, Outer Ring Road, Bengaluru</p>
              <p className="text-xs text-slate-400">GSTIN: 29AAAAA0000A1Z5</p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {paymentStatus || 'Completed'}
              </span>
              <p className="text-xs font-bold text-slate-800 mt-2">Receipt #{receiptNumber || 'RCP-001'}</p>
              <p className="text-xs text-slate-500">Date: {formatDate(paidAt || new Date())}</p>
            </div>
          </div>

          {/* Booking & Transaction Identifiers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Booking Reference</span>
              <span className="font-bold text-slate-800">{booking?.bookingId || 'VRMS-0000'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Transaction ID</span>
              <span className="font-bold text-slate-800">{transactionId || 'TXN-0000'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Payment Method</span>
              <span className="font-bold text-brand-600">{paymentMethod || 'Online'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Rental Duration</span>
              <span className="font-bold text-slate-800">{booking?.totalDays || 1} Day(s)</span>
            </div>
          </div>

          {/* Two Columns: Customer & Vehicle Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Customer Details */}
            <div className="space-y-1.5 p-4 rounded-2xl border border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm mb-2 text-brand-700">Customer Details</h4>
              <p><span className="text-slate-400">Name:</span> <strong className="text-slate-800">{billingDetails?.name || user?.name}</strong></p>
              <p><span className="text-slate-400">Email:</span> <strong className="text-slate-800">{billingDetails?.email || user?.email}</strong></p>
              <p><span className="text-slate-400">Phone:</span> <strong className="text-slate-800">{billingDetails?.phone || user?.phone || 'N/A'}</strong></p>
              <p><span className="text-slate-400">Address:</span> <strong className="text-slate-800">{billingDetails?.address || user?.address || 'N/A'}</strong></p>
            </div>

            {/* Vehicle Details */}
            <div className="space-y-1.5 p-4 rounded-2xl border border-slate-100">
              <h4 className="font-bold text-slate-900 text-sm mb-2 text-brand-700">Vehicle Reserved</h4>
              <p><span className="text-slate-400">Vehicle:</span> <strong className="text-slate-800">{vehicle?.name}</strong></p>
              <p><span className="text-slate-400">Reg Plate:</span> <strong className="text-slate-800 font-mono">{vehicle?.registrationNumber}</strong></p>
              <p><span className="text-slate-400">Type / Specs:</span> <strong className="text-slate-800">{vehicle?.vehicleType} • {vehicle?.fuelType}</strong></p>
              <p><span className="text-slate-400">Pickup Date:</span> <strong className="text-slate-800">{formatDate(booking?.pickupDate)}</strong></p>
              <p><span className="text-slate-400">Return Date:</span> <strong className="text-slate-800">{formatDate(booking?.returnDate)}</strong></p>
            </div>
          </div>

          {/* Cost Breakdown Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-center">Rate</th>
                  <th className="py-3 px-4 text-center">Days</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    Vehicle Rental: {vehicle?.name} ({vehicle?.brand} {vehicle?.model})
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600">₹{booking?.pricePerDay?.toLocaleString('en-IN')}/day</td>
                  <td className="py-3 px-4 text-center text-slate-600">{booking?.totalDays}</td>
                  <td className="py-3 px-4 text-right font-medium text-slate-800">
                    ₹{(booking?.rentalCost || (booking?.pricePerDay * booking?.totalDays))?.toLocaleString('en-IN')}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-slate-600">GST & Regulatory Transit Surcharge (12%)</td>
                  <td className="py-3 px-4 text-center text-slate-400">-</td>
                  <td className="py-3 px-4 text-center text-slate-400">-</td>
                  <td className="py-3 px-4 text-right font-medium text-slate-800">
                    ₹{booking?.taxesAndFees?.toLocaleString('en-IN') || 0}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 border-t border-slate-200 font-bold">
                <tr>
                  <td colSpan="3" className="py-3 px-4 text-slate-900 text-sm">Grand Total Paid</td>
                  <td className="py-3 px-4 text-right text-brand-600 text-base">
                    ₹{amount?.toLocaleString('en-IN') || booking?.totalAmount?.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer Terms */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full Comprehensive Insurance Included • 24/7 Road Assistance: 1800-425-VRMS</span>
            </div>
            <p>Computer generated invoice, no physical signature required.</p>
          </div>
        </div>

        {/* Modal Bottom Close */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
