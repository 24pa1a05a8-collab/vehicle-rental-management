import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Car,
  CalendarCheck,
  Layers,
  Users,
  DollarSign,
  ArrowLeft,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

const AdminLayout = ({ children, title = 'Admin Dashboard' }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Vehicle Inventory', path: '/admin/vehicles', icon: Car },
    { name: 'Bookings Management', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Vehicle Categories', path: '/admin/categories', icon: Layers },
    { name: 'Registered Users', path: '/admin/users', icon: Users },
    { name: 'Revenue & Reports', path: '/admin/revenue', icon: DollarSign },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 select-none">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">VRMS Admin</h2>
              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                Control Center
              </p>
            </div>
          </Link>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Operations
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Back to Client Site & User Profile */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-purple-400" />
            <span>Return to Public Website</span>
          </Link>

          <div className="pt-2 flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5 truncate">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover border border-purple-500/30"
              />
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <p className="text-[10px] text-purple-400 uppercase font-semibold">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-purple-400" />
          <span className="font-bold text-base">VRMS Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Dropdown */}
      {sidebarOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                  active ? 'bg-purple-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <Link
              to="/"
              className="text-xs text-purple-400 font-semibold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
            </Link>
            <button onClick={handleLogout} className="text-xs text-rose-400 font-semibold">
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Live Fleet Management System & Control Panel
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              API Online
            </span>
            <Link
              to="/admin/vehicles"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Inventory</span>
            </Link>
          </div>
        </header>

        {/* Child Page Content */}
        <main className="p-6 sm:p-8 flex-1 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
