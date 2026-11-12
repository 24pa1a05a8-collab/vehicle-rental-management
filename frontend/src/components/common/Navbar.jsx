import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Car,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  CalendarDays,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Vehicles', path: '/vehicles' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                  VRMS
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-brand-50 text-brand-700 border border-brand-200 rounded">
                  Rental
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 tracking-wide uppercase">
                Premium Fleet Management
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? 'text-brand-600 bg-brand-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated && isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  location.pathname.startsWith('/admin')
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-purple-600 hover:bg-purple-50/60'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                Admin Panel
              </Link>
            )}

            {isAuthenticated && !isAdmin && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  location.pathname.startsWith('/dashboard')
                    ? 'text-brand-600 bg-brand-50/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                My Bookings
              </Link>
            )}
          </nav>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-slate-100/80 transition-all focus:outline-none"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                      {user?.name}
                    </p>
                    <p className="text-[10px] font-semibold text-brand-600 capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      {isAdmin ? (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                        >
                          <LayoutDashboard className="w-4 h-4 text-purple-600" />
                          Admin Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                        >
                          <LayoutDashboard className="w-4 h-4 text-brand-600" />
                          User Dashboard
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        Profile Settings
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 shadow-md shadow-brand-500/20 hover:shadow-lg transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-base font-semibold ${
                  isActive(link.path)
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {isAuthenticated && isAdmin && (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-semibold text-purple-700 bg-purple-50"
              >
                <ShieldAlert className="w-5 h-5" />
                Admin Dashboard
              </Link>
            )}

            {isAuthenticated && !isAdmin && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-semibold text-brand-600 bg-brand-50"
              >
                <CalendarDays className="w-5 h-5" />
                My Bookings & Dashboard
              </Link>
            )}

            {isAuthenticated && (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
              >
                <UserIcon className="w-5 h-5" />
                Profile Settings
              </Link>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-2">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                    alt={user?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
