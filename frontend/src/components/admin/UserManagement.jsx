import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  Power,
  Trash2,
  Calendar,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/users');
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await axiosClient.patch(`/users/${id}/toggle-status`);
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, isActive: !currentStatus } : u))
      );
    } catch (err) {
      alert(err.message || 'Failed to update user status');
    }
  };

  const handleRoleChange = async (id, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${nextRole.toUpperCase()}?`))
      return;
    try {
      await axiosClient.patch(`/users/${id}/role`, { role: nextRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: nextRole } : u))
      );
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Permanently remove user "${name}"?`)) return;
    try {
      await axiosClient.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="text-xs font-bold text-slate-500">
          Total Registered Users: <span className="text-slate-900">{users.length}</span>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingSpinner text="Fetching user accounts..." size="md" />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">User / Account</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Contact & License</th>
                  <th className="py-3.5 px-6">Total Bookings</th>
                  <th className="py-3.5 px-6">Account Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          u.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {u.role === 'admin' ? (
                          <ShieldAlert className="w-3 h-3 text-purple-600" />
                        ) : (
                          <Users className="w-3 h-3 text-slate-400" />
                        )}
                        <span className="capitalize">{u.role}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      <div>Phone: {u.phone || 'N/A'}</div>
                      <div className="text-[10px] text-slate-400">
                        License: {u.driverLicense || 'Not provided'}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {u.totalBookings || 0} reservation(s)
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(u._id, u.isActive)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                          u.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        <span>{u.isActive ? 'Active' : 'Deactivated'}</span>
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleRoleChange(u._id, u.role)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                          title="Toggle Admin Privilege"
                        >
                          Make {u.role === 'admin' ? 'Customer' : 'Admin'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
