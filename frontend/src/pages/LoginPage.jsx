import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldAlert, UserCheck } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const data = await login(email, password);
      if (data.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirectUrl);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFillAdmin = () => {
    setEmail('admin@vrms.com');
    setPassword('admin123');
    setError('');
  };

  const handleQuickFillCustomer = () => {
    setEmail('john@example.com');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        {/* Brand Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Car className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">VRMS</span>
          </Link>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign in to your account</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your reservation schedule, invoices and profile
          </p>
        </div>

        {/* Demo Viva Helper Buttons */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
            Demo Viva Quick-Fill
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickFillAdmin}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={handleQuickFillCustomer}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>User Demo</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <span className="text-[11px] text-brand-600 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-2xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In to Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
