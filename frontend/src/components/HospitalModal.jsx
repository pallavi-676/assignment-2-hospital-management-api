import React, { useState, useEffect } from 'react';
import { X, Building2, AlertCircle, Loader2 } from 'lucide-react';

const HospitalModal = ({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    totalBeds: '',
    availableBeds: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        city: initialData.city || '',
        totalBeds: initialData.totalBeds !== undefined ? initialData.totalBeds : '',
        availableBeds: initialData.availableBeds !== undefined ? initialData.availableBeds : '',
      });
    } else {
      setFormData({
        name: '',
        city: '',
        totalBeds: '',
        availableBeds: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Hospital name is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    const total = Number(formData.totalBeds);
    if (formData.totalBeds === '' || isNaN(total) || total < 0) {
      newErrors.totalBeds = 'Total beds must be 0 or higher';
    }

    const available = Number(formData.availableBeds);
    if (formData.availableBeds === '' || isNaN(available) || available < 0) {
      newErrors.availableBeds = 'Available beds must be 0 or higher';
    } else if (!isNaN(total) && available > total) {
      newErrors.availableBeds = 'Available beds cannot exceed total beds';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        name: formData.name.trim(),
        city: formData.city.trim(),
        totalBeds: Number(formData.totalBeds),
        availableBeds: Number(formData.availableBeds),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#072B2E]/40 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md rounded-2xl bg-white border border-[#E0EEEE] shadow-xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#F0FAFA] bg-[#F8FDFD]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E6F6F7] text-[#0D5C63]">
              <Building2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="font-heading text-base font-bold text-[#0B2B2F]">
                {initialData ? 'Edit Hospital' : 'Register Hospital'}
              </h2>
              <p className="text-[11px] text-[#5A7175]">
                {initialData ? 'Update hospital capacity' : 'Add new facility to healthcare directory'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-[#8FA8AB] hover:text-[#0B2B2F] hover:bg-[#F0FAFA] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold text-[#0B2B2F] mb-1.5">
              Hospital Name <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Apollo Hospital"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#0B2B2F] placeholder-[#8FA8AB] focus:outline-none focus:ring-2 focus:ring-[#0D5C63]/20 focus:border-[#0D5C63] transition-all ${
                errors.name ? 'border-[#DC2626]' : 'border-[#E0EEEE]'
              }`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-[#DC2626] flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.name}
              </p>
            )}
          </div>

          {/* City Field */}
          <div>
            <label className="block text-xs font-bold text-[#0B2B2F] mb-1.5">
              City <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Mumbai, Bangalore"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#0B2B2F] placeholder-[#8FA8AB] focus:outline-none focus:ring-2 focus:ring-[#0D5C63]/20 focus:border-[#0D5C63] transition-all ${
                errors.city ? 'border-[#DC2626]' : 'border-[#E0EEEE]'
              }`}
              disabled={isSubmitting}
            />
            {errors.city && (
              <p className="mt-1 text-xs text-[#DC2626] flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.city}
              </p>
            )}
          </div>

          {/* Capacity Fields */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* Total Beds */}
            <div>
              <label className="block text-xs font-bold text-[#0B2B2F] mb-1.5">
                Total Beds <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={formData.totalBeds}
                onChange={(e) => setFormData({ ...formData, totalBeds: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#0B2B2F] placeholder-[#8FA8AB] focus:outline-none focus:ring-2 focus:ring-[#0D5C63]/20 focus:border-[#0D5C63] transition-all ${
                  errors.totalBeds ? 'border-[#DC2626]' : 'border-[#E0EEEE]'
                }`}
                disabled={isSubmitting}
              />
              {errors.totalBeds && (
                <p className="mt-1 text-xs text-[#DC2626]">{errors.totalBeds}</p>
              )}
            </div>

            {/* Available Beds */}
            <div>
              <label className="block text-xs font-bold text-[#0B2B2F] mb-1.5">
                Available Beds <span className="text-[#DC2626]">*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={formData.availableBeds}
                onChange={(e) => setFormData({ ...formData, availableBeds: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-[#0B2B2F] placeholder-[#8FA8AB] focus:outline-none focus:ring-2 focus:ring-[#0D5C63]/20 focus:border-[#0D5C63] transition-all ${
                  errors.availableBeds ? 'border-[#DC2626]' : 'border-[#E0EEEE]'
                }`}
                disabled={isSubmitting}
              />
              {errors.availableBeds && (
                <p className="mt-1 text-xs text-[#DC2626]">{errors.availableBeds}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#F0FAFA]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#5A7175] bg-white border border-[#E0EEEE] hover:bg-[#F8FDFD] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0D5C63] hover:bg-[#094449] shadow-sm shadow-[#0D5C63]/20 transition-all cursor-pointer disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{initialData ? 'Save Changes' : 'Register Hospital'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HospitalModal;
