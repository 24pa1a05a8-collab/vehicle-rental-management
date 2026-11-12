import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  Car,
  CalendarCheck,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Eye,
  RefreshCw,
} from 'lucide-react';

const AdminOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosClient.get('/dashboard/admin');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Compiling fleet analytics & statistics..." size="lg" />;
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700">
        <p className="font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" /> Error loading overview:
        </p>
        <p className="text-sm mt-1">{error}</p>
        <button
          onClick={fetchStats}
          className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { stats, recentBookings, revenueByMonth } = data || {};

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      sub: 'All-time completed rentals',
      icon: DollarSign,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Fleet Vehicles',
      value: stats?.totalVehicles || 0,
      sub: `${stats?.availableVehicles || 0} Available for rent`,
      icon: Car,
      color: 'bg-brand-500',
      lightColor: 'bg-brand-50 text-brand-700 border-brand-200',
    },
    {
      title: 'Active Rentals',
      value: stats?.activeRentals || 0,
      sub: `${stats?.pendingBookings || 0} Pending approvals`,
      icon: TrendingUp,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      sub: `${stats?.completedRentals || 0} Trips completed`,
      icon: CalendarCheck,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      title: 'Registered Users',
      value: stats?.totalUsers || 0,
      sub: 'Active customer accounts',
      icon: Users,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      title: 'Fleet Utilization',
      value: `${stats?.utilizationRate || 0}%`,
      sub: 'Currently engaged vehicles',
      icon: RefreshCw,
      color: 'bg-cyan-500',
      lightColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    },
  ];

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
    <div className="space-y-8">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Platform Performance Summary</h2>
        <button
          onClick={fetchStats}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* 6 Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {card.title}
                  </p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{card.value}</h3>
                  <p className="text-xs font-medium text-slate-500 mt-1.5">{card.sub}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md ${card.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              {/* Decorative accent bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Updated in real-time</span>
                <span className="font-semibold text-slate-600">Live</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fleet Utilization Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-base font-bold text-slate-900">Fleet Availability & Capacity</h3>
            <p className="text-xs text-slate-500">
              {stats?.availableVehicles} of {stats?.totalVehicles} vehicles available for immediate pickup
            </p>
          </div>
          <span className="text-sm font-black text-slate-900">{stats?.utilizationRate}% Booked</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{
              width: `${
                stats?.totalVehicles
                  ? ((stats.availableVehicles / stats.totalVehicles) * 100).toFixed(0)
                  : 100
              }%`,
            }}
            title="Available"
          />
          <div
            className="h-full bg-amber-500 transition-all duration-500"
            style={{
              width: `${stats?.utilizationRate || 0}%`,
            }}
            title="Active / Booked"
          />
        </div>
        <div className="flex items-center gap-6 mt-3 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Available ({stats?.availableVehicles})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Engaged / Booked ({stats?.unavailableVehicles})</span>
          </div>
        </div>
      </div>

      {/* Recent Bookings List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Customer Bookings</h3>
            <p className="text-xs text-slate-500">Latest reservation requests and current status</p>
          </div>
          <Link
            to="/admin/bookings"
            className="flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700"
          >
            <span>View All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentBookings && recentBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Booking ID</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Vehicle</th>
                  <th className="py-3.5 px-6">Pickup Date</th>
                  <th className="py-3.5 px-6">Total Amount</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 font-mono">
                      {b.bookingId}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">{b.user?.name || 'Customer'}</div>
                      <div className="text-[11px] text-slate-400">{b.user?.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">{b.vehicle?.name}</div>
                      <div className="text-[11px] text-slate-400">{b.vehicle?.brand}</div>
                    </td>
                    <td className="py-4 px-6 text-slate-600">
                      {new Date(b.pickupDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      ₹{b.totalAmount?.toLocaleString('en-IN')}
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
                      <Link
                        to="/admin/bookings"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-sm">No bookings recorded yet.</div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
