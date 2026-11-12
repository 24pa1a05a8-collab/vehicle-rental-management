import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import {
  Car,
  Users,
  Fuel,
  Gauge,
  Star,
  ShieldCheck,
  Calendar,
  MapPin,
  Check,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Clock,
  ChevronRight,
} from 'lucide-react';

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // Booking Calculator State
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [pickupDate, setPickupDate] = useState(todayStr);
  const [returnDate, setReturnDate] = useState(tomorrowStr);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState(null);
  const [isDateAvailable, setIsDateAvailable] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/vehicles/${id}`);
        setVehicle(res.data.vehicle);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  // Compute days and cost
  const start = new Date(pickupDate);
  const end = new Date(returnDate);
  const diffTime = end - start;
  const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const rentalCost = totalDays * (vehicle?.rentalPricePerDay || 0);
  const tax = Math.round(rentalCost * 0.12);
  const totalAmount = rentalCost + tax;

  // Check availability API trigger
  const handleCheckAvailability = async () => {
    if (!pickupDate || !returnDate) return;
    try {
      setCheckingAvailability(true);
      setAvailabilityMessage(null);
      const res = await axiosClient.get(
        `/vehicles/${id}/check-availability?pickupDate=${pickupDate}&returnDate=${returnDate}`
      );
      setIsDateAvailable(res.data.isAvailable);
      setAvailabilityMessage(res.data.message);
    } catch (err) {
      setAvailabilityMessage(err.message || 'Error checking availability');
      setIsDateAvailable(false);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleProceedBooking = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/vehicles/${id}`)}`);
      return;
    }
    navigate(
      `/checkout/${id}?pickup=${encodeURIComponent(pickupDate)}&return=${encodeURIComponent(
        returnDate
      )}`
    );
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving vehicle specifications..." size="lg" />;
  }

  if (!vehicle) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <Car className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Vehicle Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested vehicle may have been removed or does not exist.
        </p>
        <Link
          to="/vehicles"
          className="inline-block px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600"
        >
          Back to Vehicles
        </Link>
      </div>
    );
  }

  const images =
    vehicle.images && vehicle.images.length > 0
      ? vehicle.images
      : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/" className="hover:text-slate-900">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/vehicles" className="hover:text-slate-900">
          Vehicles
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-bold">{vehicle.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Images + Specs + Description */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Gallery */}
          <div className="space-y-4">
            <div className="aspect-[16/10] rounded-3xl overflow-hidden bg-slate-900 relative shadow-lg">
              <img
                src={images[selectedImage]}
                alt={vehicle.name}
                className="w-full h-full object-cover animate-in fade-in duration-300"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md">
                  {vehicle.vehicleType}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
                    vehicle.availabilityStatus
                      ? 'bg-emerald-500/90 text-white'
                      : 'bg-rose-500/90 text-white'
                  }`}
                >
                  {vehicle.availabilityStatus ? 'Ready for Pickup' : 'Unavailable'}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-24 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === index
                        ? 'border-brand-600 scale-105 shadow-md'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Key Highlights */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {vehicle.brand} • {vehicle.model}
                </p>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  {vehicle.name}
                </h1>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-bold text-slate-800">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {vehicle.rating || '4.9'} Rating
                  </span>
                  <span>•</span>
                  <span className="font-mono text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded">
                    Plate: {vehicle.registrationNumber}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-brand-500" />
                    {vehicle.location}
                  </span>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-3xl font-black text-slate-900">
                  ₹{vehicle.rentalPricePerDay?.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-semibold text-slate-400"> /day</span>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                  Includes comprehensive insurance
                </p>
              </div>
            </div>

            {/* Technical Specifications Grid */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Technical Specifications
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Capacity</span>
                    <strong className="text-slate-800 font-bold">
                      {vehicle.seatingCapacity} Passengers
                    </strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Gauge className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Transmission</span>
                    <strong className="text-slate-800 font-bold">{vehicle.transmissionType}</strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Fuel className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Fuel Engine</span>
                    <strong className="text-slate-800 font-bold">{vehicle.fuelType}</strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Fuel Economy</span>
                    <strong className="text-slate-800 font-bold">{vehicle.mileage}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                About This Vehicle
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">{vehicle.description}</p>
            </div>

            {/* Included Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Key Features & Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {vehicle.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Interactive Booking Calculator */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl sticky top-24 space-y-6">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                Instant Reservation
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">Book This Car</h3>
              <p className="text-xs text-slate-500 mt-1">
                Choose dates to see instant pricing and confirm your rental.
              </p>
            </div>

            <div className="space-y-4">
              {/* Pickup Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Date</label>
                <input
                  type="date"
                  min={todayStr}
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              {/* Return Date */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Return Date</label>
                <input
                  type="date"
                  min={pickupDate || todayStr}
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              {/* Check Availability Trigger */}
              <button
                type="button"
                onClick={handleCheckAvailability}
                disabled={checkingAvailability}
                className="w-full py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                {checkingAvailability ? 'Verifying Calendar...' : 'Check Date Availability'}
              </button>

              {availabilityMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    isDateAvailable
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {isDateAvailable ? (
                    <Check className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{availabilityMessage}</span>
                </div>
              )}
            </div>

            {/* Price Breakdown Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>
                  ₹{vehicle.rentalPricePerDay?.toLocaleString('en-IN')} × {totalDays} Day
                  {totalDays > 1 ? 's' : ''}
                </span>
                <span className="font-semibold text-slate-800">
                  ₹{rentalCost.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST & Platform Charges (12%)</span>
                <span className="font-semibold text-slate-800">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-brand-600 text-lg">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Proceed CTA */}
            <button
              onClick={handleProceedBooking}
              disabled={!vehicle.availabilityStatus}
              className="w-full py-3.5 rounded-2xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Reserve'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] font-medium text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Free cancellation up to pickup time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;
