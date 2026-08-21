import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Building2, Search, Plus, RefreshCw } from 'lucide-react';
import HospitalCard from '../components/HospitalCard';
import HospitalModal from '../components/HospitalModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getHospitals, createHospital, updateHospital, deleteHospital } from '../api/hospitalApi';
import { useToast } from '../context/ToastContext';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState(null);
  const [deletingHospital, setDeletingHospital] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  const fetchHospitals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHospitals();
      setHospitals(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch hospitals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  // Client-side search by name or city
  const filteredHospitals = useMemo(() => {
    if (!searchTerm.trim()) return hospitals;
    const term = searchTerm.toLowerCase();
    return hospitals.filter((h) => {
      const name = (h.name || '').toLowerCase();
      const city = (h.city || '').toLowerCase();
      return name.includes(term) || city.includes(term);
    });
  }, [hospitals, searchTerm]);

  // Handle Add
  const handleAddSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const result = await createHospital(formData);
      showToast(result.message || 'Hospital registered successfully', 'success');
      setIsAddModalOpen(false);
      fetchHospitals();
    } catch (err) {
      showToast(err.message || 'Failed to register hospital', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit
  const handleEditSubmit = async (formData) => {
    if (!editingHospital?._id) return;
    setIsSubmitting(true);
    try {
      const result = await updateHospital(editingHospital._id, formData);
      showToast(result.message || 'Hospital updated successfully', 'success');
      setEditingHospital(null);
      fetchHospitals();
    } catch (err) {
      showToast(err.message || 'Failed to update hospital', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete
  const handleDeleteConfirm = async () => {
    if (!deletingHospital?._id) return;
    setIsSubmitting(true);
    try {
      const result = await deleteHospital(deletingHospital._id);
      showToast(result.message || 'Hospital deleted successfully', 'success');
      setDeletingHospital(null);
      fetchHospitals();
    } catch (err) {
      showToast(err.message || 'Failed to delete hospital', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-[#0B2B2F] tracking-tight">
            All Hospitals
          </h1>
          <p className="text-sm font-medium text-[#5A7175] mt-0.5">
            Manage and view all registered healthcare facilities in the directory.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchHospitals}
            disabled={loading}
            className="p-2.5 rounded-2xl text-[#5A7175] bg-white hover:bg-[#F0FAFA] hover:text-[#0D5C63] border border-[#E0EEEE] transition-all cursor-pointer shadow-2xs"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold text-white bg-[#0D5C63] hover:bg-[#094449] shadow-sm shadow-[#0D5C63]/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Hospital</span>
          </button>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchHospitals} />}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#8FA8AB] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by hospital name or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-white border border-[#E0EEEE] text-[#0B2B2F] placeholder-[#8FA8AB] focus:outline-none focus:ring-2 focus:ring-[#0D5C63]/20 focus:border-[#0D5C63] shadow-2xs transition-all"
        />
      </div>

      {/* Hospitals Grid */}
      {loading ? (
        <Loading message="Loading hospitals list..." />
      ) : filteredHospitals.length === 0 ? (
        <div className="rounded-3xl bg-white border border-[#E0EEEE] p-12 text-center shadow-xs">
          <Building2 className="w-12 h-12 text-[#CCEEF0] mx-auto mb-3" />
          <h3 className="font-heading font-bold text-base text-[#0B2B2F]">
            {searchTerm ? 'No matching hospitals found' : 'No hospitals registered yet'}
          </h3>
          <p className="text-xs text-[#5A7175] mt-1 max-w-sm mx-auto">
            {searchTerm
              ? 'Try searching with a different hospital name or city.'
              : 'Add your first hospital using the button above.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredHospitals.map((hospital) => (
            <HospitalCard
              key={hospital._id}
              hospital={hospital}
              onEdit={(h) => setEditingHospital(h)}
              onDelete={(h) => setDeletingHospital(h)}
            />
          ))}
        </div>
      )}

      {/* Add Hospital Modal */}
      <HospitalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Edit Hospital Modal */}
      <HospitalModal
        isOpen={!!editingHospital}
        initialData={editingHospital}
        onClose={() => setEditingHospital(null)}
        onSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingHospital}
        itemName={deletingHospital ? `${deletingHospital.name} (${deletingHospital.city})` : ''}
        onClose={() => setDeletingHospital(null)}
        onConfirm={handleDeleteConfirm}
        isProcessing={isSubmitting}
      />
    </div>
  );
};

export default Hospitals;
