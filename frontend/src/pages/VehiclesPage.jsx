import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import VehicleCard from '../components/common/VehicleCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
  Car,
  ChevronDown,
} from 'lucide-react';

const VehiclesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [fuelType, setFuelType] = useState(searchParams.get('fuelType') || '');
  const [transmissionType, setTransmissionType] = useState(
    searchParams.get('transmissionType') || ''
  );
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [availabilityOnly, setAvailabilityOnly] = useState(
    searchParams.get('available') === 'true'
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '');

  // Load categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axiosClient.get('/categories');
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  // Fetch vehicles based on filters
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (fuelType) params.append('fuelType', fuelType);
      if (transmissionType) params.append('transmissionType', transmissionType);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (availabilityOnly) params.append('availabilityStatus', 'true');
      if (sortBy) params.append('sortBy', sortBy);
      params.append('limit', '50');

      const res = await axiosClient.get(`/vehicles?${params.toString()}`);
      setVehicles(res.data.vehicles || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [category, fuelType, transmissionType, maxPrice, availabilityOnly, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchVehicles();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('');
    setFuelType('');
    setTransmissionType('');
    setMaxPrice('');
    setAvailabilityOnly(false);
    setSortBy('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Browse Fleet Vehicles</h1>
          <p className="text-sm text-slate-500 mt-1">
            Choose from {vehicles.length} high-performance and luxury vehicles available for rent.
          </p>
        </div>

        {/* Search Bar & Mobile Filter Trigger */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by car name, brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-brand-500"
            />
          </form>

          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden p-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters (Desktop) */}
        <aside
          className={`${
            showMobileFilters ? 'block' : 'hidden'
          } md:block md:col-span-1 space-y-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm h-fit sticky top-24`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">Filters & Sort</h3>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-[11px] font-semibold text-rose-600 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Sort Results</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 bg-white"
            >
              <option value="">Featured / Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="rating_desc">Highest Rated</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Category</label>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setCategory('')}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  category === ''
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  type="button"
                  onClick={() => setCategory(c.name)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    category === c.name
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Fuel Type</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Petrol', 'Diesel', 'Electric', 'Hybrid'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFuelType(fuelType === f ? '' : f)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium border text-center transition-colors ${
                    fuelType === f
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Transmission</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Automatic', 'Manual'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTransmissionType(transmissionType === t ? '' : t)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium border text-center transition-colors ${
                    transmissionType === t
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Range */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span>Max Daily Price</span>
              <span className="text-brand-600 font-mono">
                {maxPrice ? `₹${Number(maxPrice).toLocaleString('en-IN')}` : 'Any'}
              </span>
            </div>
            <input
              type="range"
              min="1500"
              max="15000"
              step="500"
              value={maxPrice || 15000}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full accent-brand-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹1,500</span>
              <span>₹15,000+</span>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Available Cars Only</span>
            <input
              type="checkbox"
              checked={availabilityOnly}
              onChange={(e) => setAvailabilityOnly(e.target.checked)}
              className="w-4 h-4 accent-brand-600 rounded"
            />
          </div>
        </aside>

        {/* Vehicles Grid */}
        <main className="md:col-span-3">
          {loading ? (
            <LoadingSpinner text="Searching vehicles..." size="lg" />
          ) : vehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
                <Car className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No Vehicles Matched</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We couldn't find any vehicles matching your filter criteria. Try adjusting the price,
                fuel type, or category.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VehiclesPage;
