import React, { useState, useEffect, useCallback } from 'react';
import { Building2, BedDouble, CheckCircle2, UserCheck, Plus, RefreshCw, HeartPulse, Sparkles } from 'lucide-react';
import StatCard from '../components/StatCard';
import HospitalCard from '../components/HospitalCard';
import HospitalModal from '../components/HospitalModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { getHospitals, createHospital, updateHospital, deleteHospital } from '../api/hospitalApi';
import { useToast } from '../context/ToastContext';

const Dashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError(err.message || 'Failed to load hospitals from server');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  // Frontend calculations strictly from real MongoDB data
  const totalHospitals = hospitals.length;
  const totalBeds = hospitals.reduce((acc, curr) => acc + (Number(curr.totalBeds) || 0), 0);
  const availableBeds = hospitals.reduce((acc, curr) => acc + (Number(curr.availableBeds) || 0), 0);
  const occupiedBeds = Math.max(0, totalBeds - availableBeds);
  const occupancyPercentage = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  // Handle Add Hospital
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

  // Handle Edit Hospital
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

  // Handle Delete Hospital
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
    <div className="space-y-8">
      {/* Header Banner - Omnio style welcoming overview */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-[#F4FAFA] to-[#E6F6F7] border border-[#E0EEEE] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F6F7] text-[#0D5C63] border border-[#CCEEF0] text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Healthcare Capacity Portal</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-[#0B2B2F] tracking-tight">
              Hospital Management
            </h1>
            <p className="text-sm font-medium text-[#5A7175] mt-2 max-w-xl leading-relaxed">
              Overview of registered hospitals and current bed availability across the healthcare network.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchHospitals}
              disabled={loading}
              className="p-2.5 rounded-2xl text-[#5A7175] bg-white hover:bg-[#F0FAFA] hover:text-[#0D5C63] border border-[#E0EEEE] transition-all cursor-pointer shadow-2xs"
              title="Refresh data"
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
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchHospitals} />}

      {/* 4 Spacious Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Hospitals"
          value={loading ? '...' : totalHospitals}
          subtitle="Registered in database"
          icon={Building2}
          color="teal"
          accentTag="Active Network"
        />
        <StatCard
          title="Total Beds"
          value={loading ? '...' : totalBeds.toLocaleString()}
          subtitle="Combined facility capacity"
          icon={BedDouble}
          color="slate"
        />
        <StatCard
          title="Available Beds"
          value={loading ? '...' : availableBeds.toLocaleString()}
          subtitle="Currently unoccupied"
          icon={CheckCircle2}
          color="cyan"
          accentTag="Ready for Intake"
        />
        <StatCard
          title="Occupied Beds"
          value={loading ? '...' : occupiedBeds.toLocaleString()}
          subtitle={`${occupancyPercentage}% overall occupancy`}
          icon={UserCheck}
          color="yellow"
        />
      </div>

      {/* Registered Hospitals Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-lg font-bold text-[#0B2B2F] tracking-tight">
              Registered Hospitals
            </h2>
            <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
          </div>
          <span className="text-xs font-bold text-[#0D5C63] bg-[#E6F6F7] px-3 py-1 rounded-full border border-[#CCEEF0]">
            {hospitals.length} {hospitals.length === 1 ? 'hospital' : 'hospitals'}
          </span>
        </div>

        {loading ? (
          <Loading message="Loading registered hospitals..." />
        ) : hospitals.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#E0EEEE] p-12 text-center shadow-xs">
            <Building2 className="w-12 h-12 text-[#CCEEF0] mx-auto mb-3" />
            <h3 className="font-heading font-bold text-base text-[#0B2B2F]">
              No hospitals registered yet
            </h3>
            <p className="text-xs text-[#5A7175] mt-1 max-w-sm mx-auto">
              Get started by adding your first hospital to the database.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0D5C63] hover:bg-[#094449] transition-all shadow-sm shadow-[#0D5C63]/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Hospital</span>
            </button>
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
      </div>

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

export default Dashboard;
