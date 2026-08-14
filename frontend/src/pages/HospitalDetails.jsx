import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Building2, MapPin, BedDouble, Edit2, Trash2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import HospitalModal from '../components/HospitalModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getHospitalById, updateHospital, deleteHospital } from '../api/hospitalApi';
import { useToast } from '../context/ToastContext';

const HospitalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchHospital = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getHospitalById(id);
      setHospital(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch hospital details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHospital();
  }, [fetchHospital]);

  // Handle Edit Submit
  const handleEditSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const result = await updateHospital(id, formData);
      showToast(result.message || 'Hospital updated successfully', 'success');
      setIsEditModalOpen(false);
      fetchHospital();
    } catch (err) {
      showToast(err.message || 'Failed to update hospital', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    try {
      const result = await deleteHospital(id);
      showToast(result.message || 'Hospital deleted successfully', 'success');
      setIsDeleteDialogOpen(false);
      navigate('/hospitals');
    } catch (err) {
      showToast(err.message || 'Failed to delete hospital', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loading message="Loading hospital details..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchHospital} />;
  if (!hospital) return <ErrorMessage message="Hospital not found" />;

  const totalBeds = Number(hospital.totalBeds) || 0;
  const availableBeds = Number(hospital.availableBeds) || 0;
  const occupiedBeds = Math.max(0, totalBeds - availableBeds);
  const occupancyPercentage = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  const isAvailable = availableBeds > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Button */}
      <div>
        <Link
          to="/hospitals"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5A7175] hover:text-[#0D5C63] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Hospitals</span>
        </Link>
      </div>

      {/* Hospital Detail Card */}
      <div className="rounded-3xl bg-white border border-[#E0EEEE] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-[#F0FAFA] bg-[#F8FDFD]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6F6F7] text-[#0D5C63] shrink-0 shadow-2xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-[#0B2B2F]">
                {hospital.name}
              </h1>
              <div className="flex items-center gap-1.5 text-xs font-medium text-[#5A7175] mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#0D5C63]" />
                <span>{hospital.city}</span>
              </div>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 self-start sm:self-center px-3 py-1 rounded-full text-xs font-bold ${
              isAvailable
                ? 'bg-[#E6F6F7] text-[#0D5C63] border border-[#CCEEF0]'
                : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
            }`}
          >
            {isAvailable ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Available Beds
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                Full Capacity
              </>
            )}
          </span>
        </div>

        {/* Capacity Details List */}
        <div className="p-6 sm:p-8 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#8FA8AB]">
            Bed Capacity Overview
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#F8FDFD] border border-[#EBF5F5] text-center">
              <span className="text-[11px] font-bold text-[#8FA8AB] uppercase tracking-wider block">Total Beds</span>
              <span className="font-heading font-extrabold text-xl text-[#0B2B2F] mt-1 block">
                {totalBeds}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#E6F6F7]/60 border border-[#CCEEF0] text-center">
              <span className="text-[11px] font-bold text-[#0D5C63] uppercase tracking-wider block">Available</span>
              <span className="font-heading font-extrabold text-xl text-[#0D5C63] mt-1 block">
                {availableBeds}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FDFD] border border-[#EBF5F5] text-center">
              <span className="text-[11px] font-bold text-[#8FA8AB] uppercase tracking-wider block">Occupied</span>
              <span className="font-heading font-extrabold text-xl text-[#5A7175] mt-1 block">
                {occupiedBeds}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FDFD] border border-[#EBF5F5] text-center">
              <span className="text-[11px] font-bold text-[#8FA8AB] uppercase tracking-wider block">Occupancy</span>
              <span className="font-heading font-extrabold text-xl text-[#0B2B2F] mt-1 block">
                {occupancyPercentage}%
              </span>
            </div>
          </div>

          {/* Occupancy bar */}
          <div className="pt-2">
            <div className="flex justify-between text-xs font-semibold text-[#5A7175] mb-1.5">
              <span>Bed Utilization</span>
              <span>{occupancyPercentage}% occupied</span>
            </div>
            <div className="h-2 w-full bg-[#E6F6F7] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  occupancyPercentage > 85 ? 'bg-[#DC2626]' : occupancyPercentage > 60 ? 'bg-[#F59E0B]' : 'bg-[#0D5C63]'
                }`}
                style={{ width: `${occupancyPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-6 bg-[#F8FDFD]/50 border-t border-[#F0FAFA] flex items-center justify-between">
          <Link
            to="/hospitals"
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#5A7175] bg-white border border-[#E0EEEE] hover:bg-[#F8FDFD] transition-colors shadow-2xs"
          >
            Back to Hospitals
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#0D5C63] bg-white border border-[#E0EEEE] hover:bg-[#E6F6F7] transition-colors shadow-2xs cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] shadow-sm shadow-[#DC2626]/20 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <HospitalModal
        isOpen={isEditModalOpen}
        initialData={hospital}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        itemName={`${hospital.name} (${hospital.city})`}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        isProcessing={isSubmitting}
      />
    </div>
  );
};

export default HospitalDetails;
