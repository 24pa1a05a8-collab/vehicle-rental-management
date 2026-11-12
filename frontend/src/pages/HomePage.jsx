import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import VehicleCard from '../components/common/VehicleCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Car,
  Search,
  Calendar,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Award,
  Zap,
  Star,
  Users,
} from 'lucide-react';

const HomePage = () => {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    search: '',
    category: '',
    pickupDate: '',
    returnDate: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [vRes, cRes] = await Promise.all([
          axiosClient.get('/vehicles?limit=6&sortBy=rating_desc'),
          axiosClient.get('/categories'),
        ]);
        setFeaturedVehicles(vRes.data.vehicles || []);
        setCategories(cRes.data.categories || []);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchParams.search) query.append('search', searchParams.search);
    if (searchParams.category) query.append('category', searchParams.category);
    if (searchParams.pickupDate) query.append('pickupDate', searchParams.pickupDate);
    if (searchParams.returnDate) query.append('returnDate', searchParams.returnDate);
    navigate(`/vehicles?${query.toString()}`);
  };

  const steps = [
    {
      num: '01',
      title: 'Select Your Vehicle',
      desc: 'Browse our diverse fleet of luxury sedans, electric cars, SUVs and compact runabouts.',
      icon: Car,
    },
    {
      num: '02',
      title: 'Choose Dates & Location',
      desc: 'Pick your travel dates with transparent daily rates, zero hidden fees, and full insurance.',
      icon: Calendar,
    },
    {
      num: '03',
      title: 'Instant Confirmation & Drive',
      desc: 'Complete secure checkout, grab your keys at any terminal hub, and hit the open road!',
      icon: Zap,
    },
  ];

  const perks = [
    {
      title: 'Zero Security Deposit',
      desc: 'Rent with peace of mind. No exorbitant deposits blocked on your credit card.',
      icon: ShieldCheck,
      color: 'text-emerald-500 bg-emerald-50',
    },
    {
      title: '24/7 Roadside Assistance',
      desc: 'Round-the-clock emergency support, towing, and flat-tire dispatch nationwide.',
      icon: Clock,
      color: 'text-brand-500 bg-brand-50',
    },
    {
      title: 'Sanitized & Inspected Fleet',
      desc: 'Every vehicle undergoes a 45-point mechanical inspection and deep sanitization before dispatch.',
      icon: Award,
      color: 'text-purple-500 bg-purple-50',
    },
    {
      title: 'Flexible Cancellation',
      desc: 'Plans change? Cancel or modify your reservation anytime with 100% swift refunds.',
      icon: Sparkles,
      color: 'text-amber-500 bg-amber-50',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-b-[3rem] shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,140,233,0.25),rgba(255,255,255,0))]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold tracking-wide uppercase backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premium Self-Drive Fleet in India</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              Drive the Car You Love,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-brand-300 to-sky-200">
                Anytime & Anywhere
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              Experience the ultimate freedom of travel with VRMS. Enjoy brand new luxury sedans,
              rugged 4x4 SUVs, and smart electric vehicles at unbeatable daily prices.
            </p>
          </div>

          {/* Quick Search Widget */}
          <div className="mt-12 max-w-4xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white/95 backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-2xl border border-white/20 text-slate-800"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search Text */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Vehicle / Brand
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="BMW, Tesla, Fortuner..."
                      value={searchParams.search}
                      onChange={(e) =>
                        setSearchParams({ ...searchParams, search: e.target.value })
                      }
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 bg-white"
                    />
                  </div>
                </div>

                {/* Category Dropdown */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Category Type
                  </label>
                  <select
                    value={searchParams.category}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, category: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pickup Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Pickup Date
                  </label>
                  <input
                    type="date"
                    value={searchParams.pickupDate}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, pickupDate: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 bg-white"
                  />
                </div>

                {/* Return Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={searchParams.returnDate}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, returnDate: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 bg-white"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Instant Booking
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" /> Free Cancellation
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-2xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/25 hover:shadow-lg transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Available Cars</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            Tailored For Every Journey
          </p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Explore Vehicles by Category
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Whether for high-profile business meetings, cross-country family roadtrips or weekend thrills.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((c) => (
            <Link
              key={c._id}
              to={`/vehicles?category=${encodeURIComponent(c.name)}`}
              className="group bg-white rounded-2xl p-4 border border-slate-200/80 hover:border-brand-300 shadow-sm hover:shadow-lg transition-all text-center flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden mb-3 group-hover:scale-110 transition-transform">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-brand-600 transition-colors">
                {c.name}
              </h4>
              <p className="text-[10px] text-slate-400 mt-1">Explore Fleet →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Vehicles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
              Popular Selections
            </p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Featured Fleet Vehicles
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top rated cars ready for reservation today with zero waiting time.
            </p>
          </div>
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-colors"
          >
            <span>View All Fleet ({featuredVehicles.length}+)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Retrieving top cars..." size="lg" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      {/* How It Works (3 Steps) */}
      <section className="bg-slate-900 text-white py-20 rounded-3xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-1">
            Simple 3-Step Process
          </p>
          <h2 className="text-3xl font-black tracking-tight">How VRMS Rental Works</h2>
          <p className="text-sm text-slate-400 mt-2">
            Renting a car has never been simpler. Book online in 2 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="bg-slate-800/60 border border-slate-700/80 rounded-3xl p-8 relative flex flex-col justify-between"
              >
                <div className="text-4xl font-black text-slate-700 font-mono mb-4">{st.num}</div>
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center mb-6 shadow-md shadow-brand-500/20">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{st.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            The VRMS Advantage
          </p>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Why Drivers Choose VRMS
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Engineered from the ground up for transparent, hassle-free vehicle rentals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 ${p.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">{p.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-tr from-brand-900 via-slate-900 to-slate-950 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl">
            <div className="flex items-center gap-1 text-amber-400 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-lg sm:text-xl font-medium leading-relaxed italic text-slate-100 mb-6">
              "The experience with VRMS was simply flawless. Picked up the Tesla Model 3 at the
              airport terminal, car was spotless with 100% battery, and returning took under 60
              seconds. The digital receipt arrived on my phone immediately!"
            </p>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="Rohan Sharma"
                className="w-11 h-11 rounded-full object-cover border-2 border-brand-400"
              />
              <div>
                <h5 className="font-bold text-sm text-white">Rohan Sharma</h5>
                <p className="text-xs text-slate-400">Senior Product Architect, TechCorp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-brand-50 border border-brand-200 rounded-3xl p-10 sm:p-16">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Ready to Take the Driver's Seat?
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto mt-3">
            Choose from 10+ premium categories. Reserve in minutes with instant digital booking
            confirmations.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/vehicles"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all"
            >
              Explore All Vehicles
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
