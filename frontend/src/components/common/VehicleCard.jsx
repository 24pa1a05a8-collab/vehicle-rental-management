import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Fuel, Gauge, Star, ShieldCheck, ArrowRight } from 'lucide-react';

const VehicleCard = ({ vehicle }) => {
  const {
    _id,
    name,
    brand,
    model,
    vehicleType,
    fuelType,
    transmissionType,
    seatingCapacity,
    rentalPricePerDay,
    images,
    availabilityStatus,
    rating,
    mileage,
  } = vehicle;

  const displayImage =
    images && images.length > 0
      ? images[0]
      : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col">
      {/* Vehicle Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-900/80 text-white backdrop-blur-md shadow-sm">
            {vehicleType || 'Sedan'}
          </span>

          <span
            className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-md shadow-sm flex items-center gap-1.5 ${
              availabilityStatus
                ? 'bg-emerald-500/90 text-white'
                : 'bg-rose-500/90 text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            {availabilityStatus ? 'Available' : 'Booked'}
          </span>
        </div>

        {/* Rating Floating Tag */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 text-slate-800 text-xs font-bold backdrop-blur-md shadow-sm">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{rating ? rating.toFixed(1) : '4.9'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {brand} • {model}
          </p>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
            {name}
          </h3>
        </div>

        {/* Specs Badges */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 mb-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-brand-500 shrink-0" />
            <span>{seatingCapacity} Seats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-brand-500 shrink-0" />
            <span className="truncate">{transmissionType}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="w-4 h-4 text-brand-500 shrink-0" />
            <span className="truncate">{fuelType}</span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">
                ₹{rentalPricePerDay?.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-semibold text-slate-400">/day</span>
            </div>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Zero Security Deposit
            </p>
          </div>

          <Link
            to={`/vehicles/${_id}`}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 hover:shadow-lg transition-all group-hover:gap-2"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
