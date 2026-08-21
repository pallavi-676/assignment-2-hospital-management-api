import React, { useState, useEffect, useCallback } from 'react';
import { BedDouble, CheckCircle2, RefreshCw } from 'lucide-react';
import HospitalCard from '../components/HospitalCard';
import HospitalModal from '../components/HospitalModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getAvailableHospitals, updateHospital, deleteHospital } from '../api/hospitalApi';
import { useToast } from '../context/ToastContext';

const AvailableHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [editingHospital, setEditingHospital] = useState(null);
  const [deletingHospital, setDeletingHospital] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  const fetchAvailable = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAvailableHospitals();
      setHospitals(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch available hospitals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAvailable();
  }, [fetchAvailable]);

  // Handle Edit
  const handleEditSubmit = async (formData) => {
    if (!editingHospital?._id) return;
    setIsSubmitting(true);
    try {
      const result = await updateHospital(editingHospital._id, formData);
      showToast(result.message || 'Hospital updated successfully', 'success');
      setEditingHospital(null);
      fetchAvailable();
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
      fetchAvailable();
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
            Available Beds
          </h1>
          <p className="text-sm font-medium text-[#5A7175] mt-0.5">
            Hospitals with currently open bed capacity (available beds &gt; 0).
          </p>
        </div>

        <button
          onClick={fetchAvailable}
          disabled={loading}
          className="self-start sm:self-auto p-2.5 rounded-2xl text-[#5A7175] bg-white hover:bg-[#F0FAFA] hover:text-[#0D5C63] border border-[#E0EEEE] transition-all cursor-pointer shadow-2xs"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchAvailable} />}

      {/* Grid */}
      {loading ? (
        <Loading message="Loading available hospitals..." />
      ) : hospitals.length === 0 ? (
        <div className="rounded-3xl bg-white border border-[#E0EEEE] p-12 text-center shadow-xs">
          <BedDouble className="w-12 h-12 text-[#CCEEF0] mx-auto mb-3" />
          <h3 className="font-heading font-bold text-base text-[#0B2B2F]">
            No available beds found
          </h3>
          <p className="text-xs text-[#5A7175] mt-1 max-w-sm mx-auto">
            All registered hospitals currently have 0 available beds.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {hospitals.map((hospital) => (
            <HospitalCard
              key={hospital._id}
              hospital={hospital}
              onEdit={(h) => setEditingHospital(h)}
              onDelete={(h) => setDeletingHospital(h)}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <HospitalModal
        isOpen={!!editingHospital}
        initialData={editingHospital}
        onClose={() => setEditingHospital(null)}
        onSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation */}
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

export default AvailableHospitals;
