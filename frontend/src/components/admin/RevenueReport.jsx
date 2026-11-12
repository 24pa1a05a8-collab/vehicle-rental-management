import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import LoadingSpinner from '../common/LoadingSpinner';
import ReceiptModal from '../common/ReceiptModal';
import {
  DollarSign,
  CreditCard,
  Wallet,
  Coins,
  FileText,
  TrendingUp,
  Download,
  Calendar,
} from 'lucide-react';

const RevenueReport = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [receiptData, setReceiptData] = useState(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get('/dashboard/revenue-report');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  const handleOpenReceipt = (payment) => {
    setReceiptData(payment);
    setReceiptModalOpen(true);
  };

  if (loading) {
    return <LoadingSpinner text="Generating financial revenue audit..." size="md" />;
  }

  const { totalRevenue, totalTransactions, byPaymentMethod, payments } = data || {};

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-1">
            Financial Ledger & Settlement
          </p>
          <h2 className="text-4xl font-black tracking-tight">
            ₹{(totalRevenue || 0).toLocaleString('en-IN')}
          </h2>
          <p className="text-xs text-slate-300 mt-2">
            Net realized earnings across {totalTransactions || 0} successfully settled transactions.
          </p>
        </div>

        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 hidden sm:block">
          <DollarSign className="w-56 h-56" />
        </div>
      </div>

      {/* Breakdown by Payment Channel */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
          Revenue Breakdown by Payment Channel
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(byPaymentMethod || {}).map(([method, amt]) => (
            <div
              key={method}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-slate-400">{method}</p>
                <h4 className="text-xl font-black text-slate-900 mt-1">
                  ₹{amt.toLocaleString('en-IN')}
                </h4>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Records Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Settled Transactions</h3>
            <p className="text-xs text-slate-500">Historical transaction log and receipt vouchers</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Payment ID</th>
                <th className="py-3.5 px-6">Receipt #</th>
                <th className="py-3.5 px-6">Payer / User</th>
                <th className="py-3.5 px-6">Method</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Settled Date</th>
                <th className="py-3.5 px-6 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {payments?.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-slate-900">{p.paymentId}</td>
                  <td className="py-4 px-6 font-mono text-purple-700 font-bold">{p.receiptNumber}</td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-slate-800">{p.user?.name}</div>
                    <div className="text-[11px] text-slate-400">{p.user?.email}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {p.paymentMethod}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-black text-slate-900 text-sm">
                    ₹{p.amount?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-4 px-6 text-slate-500">
                    {new Date(p.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleOpenReceipt(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receiptData={receiptData}
      />
    </div>
  );
};

export default RevenueReport;
