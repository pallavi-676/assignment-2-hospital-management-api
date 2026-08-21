import React, { useState, useEffect } from 'react';
import { X, Building2, MapPin, BedDouble, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function HospitalModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  hospital = null 
}) {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    totalBeds: '',
    availableBeds: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (hospital) {
      setFormData({
        name: hospital.name || '',
        city: hospital.city || '',
        totalBeds: hospital.totalBeds !== undefined ? hospital.totalBeds : '',
        availableBeds: hospital.availableBeds !== undefined ? hospital.availableBeds : '',
      });
    } else {
      setFormData({
        name: '',
        city: '',
        totalBeds: '',
        availableBeds: '',
      });
    }
    setError('');
  }, [hospital, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, city, totalBeds, availableBeds } = formData;

    if (!name.trim() || !city.trim() || totalBeds === '' || availableBeds === '') {
      setError('All hospital fields are required');
      return;
    }

    const numTotal = Number(totalBeds);
    const numAvail = Number(availableBeds);

    if (isNaN(numTotal) || numTotal < 0) {
      setError('Total beds must be a non-negative number');
      return;
    }

    if (isNaN(numAvail) || numAvail < 0) {
      setError('Available beds must be a non-negative number');
      return;
    }

    if (numAvail > numTotal) {
      setError('Available beds cannot exceed total bed capacity');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: name.trim(),
        city: city.trim(),
        totalBeds: numTotal,
        availableBeds: numAvail,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save hospital');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-modal w-full max-w-lg rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden relative">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {hospital ? 'Edit Hospital Details' : 'Register New Hospital'}
              </h2>
              <p className="text-xs text-slate-400">
                {hospital ? 'Update facility specs and bed capacity' : 'Add a medical center to system records'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Hospital Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Hospital Name
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. St. Mary Regional Hospital"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                required
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              City / Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Los Angeles"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Beds Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            
            {/* Total Beds */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Total Beds
              </label>
              <div className="relative">
                <BedDouble className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="number"
                  name="totalBeds"
                  value={formData.totalBeds}
                  onChange={handleChange}
                  placeholder="e.g. 200"
                  min="0"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Available Beds */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Available Beds
              </label>
              <div className="relative">
                <BedDouble className="w-4 h-4 text-brand-400 absolute left-3.5 top-3.5" />
                <input
                  type="number"
                  name="availableBeds"
                  value={formData.availableBeds}
                  onChange={handleChange}
                  placeholder="e.g. 45"
                  min="0"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
                  required
                />
              </div>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-sm font-medium border border-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-teal-500 hover:from-brand-500 hover:to-teal-400 text-white text-sm font-semibold shadow-glow-teal transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>{hospital ? 'Update Hospital' : 'Save Hospital'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
