import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import LoadingSpinner from '../common/LoadingSpinner';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Power,
  Check,
  X,
  AlertCircle,
  Car,
  Image as ImageIcon,
  DollarSign,
  Fuel,
  Users,
  Gauge,
} from 'lucide-react';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    registrationNumber: '',
    category: '',
    vehicleType: 'Sedan',
    fuelType: 'Petrol',
    transmissionType: 'Automatic',
    seatingCapacity: 5,
    rentalPricePerDay: 2500,
    description: '',
    images: '',
    availabilityStatus: true,
    mileage: '15 kmpl',
    location: 'Central City Hub',
    features: 'GPS Navigation, Bluetooth, Air Conditioning, Backup Camera',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [vRes, cRes] = await Promise.all([
        axiosClient.get('/vehicles?limit=100'),
        axiosClient.get('/categories'),
      ]);
      setVehicles(vRes.data.vehicles || []);
      setCategories(cRes.data.categories || []);
      if (cRes.data.categories?.length > 0 && !formData.category) {
        setFormData((prev) => ({ ...prev, category: cRes.data.categories[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingVehicle(null);
    setFormData({
      name: '',
      brand: '',
      model: '',
      registrationNumber: '',
      category: categories[0]?._id || '',
      vehicleType: categories[0]?.name || 'Sedan',
      fuelType: 'Petrol',
      transmissionType: 'Automatic',
      seatingCapacity: 5,
      rentalPricePerDay: 3000,
      description: '',
      images: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      availabilityStatus: true,
      mileage: '15 kmpl',
      location: 'Central City Hub',
      features: 'GPS Navigation, Bluetooth, Air Conditioning, Backup Camera',
    });
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (v) => {
    setEditingVehicle(v);
    setFormData({
      name: v.name,
      brand: v.brand,
      model: v.model,
      registrationNumber: v.registrationNumber,
      category: v.category?._id || v.category || '',
      vehicleType: v.vehicleType,
      fuelType: v.fuelType,
      transmissionType: v.transmissionType,
      seatingCapacity: v.seatingCapacity,
      rentalPricePerDay: v.rentalPricePerDay,
      description: v.description,
      images: v.images?.join(', ') || '',
      availabilityStatus: v.availabilityStatus,
      mileage: v.mileage || 'Unlimited',
      location: v.location || 'Central City Hub',
      features: v.features?.join(', ') || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        seatingCapacity: Number(formData.seatingCapacity),
        rentalPricePerDay: Number(formData.rentalPricePerDay),
        images: formData.images
          .split(',')
          .map((img) => img.trim())
          .filter(Boolean),
        features: formData.features
          .split(',')
          .map((f) => f.trim())
          .filter(Boolean),
      };

      if (editingVehicle) {
        await axiosClient.put(`/vehicles/${editingVehicle._id}`, payload);
      } else {
        await axiosClient.post('/vehicles', payload);
      }

      setModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.message || 'Operation failed. Please verify vehicle fields.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      await axiosClient.patch(`/vehicles/${id}/toggle-availability`);
      setVehicles((prev) =>
        prev.map((v) => (v._id === id ? { ...v, availabilityStatus: !v.availabilityStatus } : v))
      );
    } catch (err) {
      alert(err.message || 'Failed to toggle vehicle availability');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete vehicle: "${name}"?`)) return;
    try {
      await axiosClient.delete(`/vehicles/${id}`);
      setVehicles((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete vehicle');
    }
  };

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase()) ||
      v.registrationNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, brand, reg number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
          />
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <LoadingSpinner text="Loading vehicle fleet..." size="md" />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Vehicle</th>
                  <th className="py-3.5 px-6">Registration</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Specs</th>
                  <th className="py-3.5 px-6">Price/Day</th>
                  <th className="py-3.5 px-6">Availability</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredVehicles.map((v) => (
                  <tr key={v._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={v.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=100&q=80'}
                          alt={v.name}
                          className="w-12 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{v.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {v.brand} • {v.model}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-800">
                      {v.registrationNumber}
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {v.vehicleType || v.category?.name}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      <div>{v.seatingCapacity} Seats • {v.transmissionType}</div>
                      <div className="text-[10px] text-slate-400">{v.fuelType}</div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      ₹{v.rentalPricePerDay?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggle(v._id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                          v.availabilityStatus
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                        title="Click to toggle availability"
                      >
                        <Power className="w-3 h-3" />
                        <span>{v.availabilityStatus ? 'Available' : 'Unavailable'}</span>
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(v)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                          title="Edit Vehicle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(v._id, v.name)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Vehicle"
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

      {/* Add / Edit Vehicle Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-base font-bold text-slate-800">
                {editingVehicle ? 'Edit Vehicle Details' : 'Add New Vehicle to Fleet'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Vehicle Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BMW 5 Series M Sport"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registration Plate Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DL01-AB-1001"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 uppercase font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BMW"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Model / Year *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 530i 2024"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const selCat = categories.find((c) => c._id === e.target.value);
                      setFormData({
                        ...formData,
                        category: e.target.value,
                        vehicleType: selCat ? selCat.name : formData.vehicleType,
                      });
                    }}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rental Price / Day (₹) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={formData.rentalPricePerDay}
                    onChange={(e) =>
                      setFormData({ ...formData, rentalPricePerDay: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fuel Type</label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 bg-white"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Transmission</label>
                  <select
                    value={formData.transmissionType}
                    onChange={(e) =>
                      setFormData({ ...formData, transmissionType: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 bg-white"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Seats</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.seatingCapacity}
                    onChange={(e) =>
                      setFormData({ ...formData, seatingCapacity: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mileage / Range</label>
                  <input
                    type="text"
                    placeholder="e.g. 14 kmpl or 580 km range"
                    value={formData.mileage}
                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Image URLs (comma separated) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Features (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="GPS Navigation, Bluetooth, Sunroof, Heated Seats"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe the vehicle condition, luxury appointments, performance..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
