import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  RefreshCw, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Trash2,
  X
} from 'lucide-react';

import { api } from './api/apiClient';
import Navbar from './components/Navbar';
import MetricsOverview from './components/MetricsOverview';
import HospitalCard from './components/HospitalCard';
import HospitalTable from './components/HospitalTable';
import HospitalModal from './components/HospitalModal';
import AuthModal from './components/AuthModal';
import ToastContainer from './components/ToastContainer';

export default function App() {
  // Main Data States
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(false);
  const [user, setUser] = useState(null);

  // Filter & Layout States
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all' | 'available' | 'full'
  const [selectedCity, setSelectedCity] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal States
  const [isHospitalModalOpen, setIsHospitalModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [deletingHospitalInfo, setDeletingHospitalInfo] = useState(null); // { id, name }

  // Notification Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch Hospitals from API
  const fetchHospitals = async () => {
    setLoading(true);
    try {
      let res;
      if (availabilityFilter === 'available') {
        res = await api.getAvailableHospitals();
      } else {
        res = await api.getHospitals();
      }
      
      setHospitals(res.data || []);
      setIsMockMode(res.isMock || false);

      if (res.isMock) {
        // Silent indicator or first time notice
      }
    } catch (err) {
      addToast(`Failed to load hospitals: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [availabilityFilter]);

  // Extract unique cities for filter dropdown
  const cities = useMemo(() => {
    const unique = new Set(hospitals.map((h) => h.city).filter(Boolean));
    return Array.from(unique);
  }, [hospitals]);

  // Filtered Hospitals List
  const filteredHospitals = useMemo(() => {
    return hospitals.filter((h) => {
      // Search query (name or city)
      const matchesSearch = 
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.city.toLowerCase().includes(searchQuery.toLowerCase());

      // City filter
      const matchesCity = selectedCity === 'all' || h.city === selectedCity;

      // Availability filter (client side refinement)
      let matchesAvail = true;
      if (availabilityFilter === 'available') {
        matchesAvail = Number(h.availableBeds) > 0;
      } else if (availabilityFilter === 'full') {
        matchesAvail = Number(h.availableBeds) === 0;
      }

      return matchesSearch && matchesCity && matchesAvail;
    });
  }, [hospitals, searchQuery, selectedCity, availabilityFilter]);

  // CRUD Handlers
  const handleCreateHospital = async (data) => {
    const res = await api.createHospital(data);
    addToast(res.data.message || 'Hospital created successfully!', 'success');
    fetchHospitals();
  };

  const handleUpdateHospital = async (data) => {
    if (!editingHospital) return;
    const res = await api.updateHospital(editingHospital._id, data);
    addToast(res.data.message || 'Hospital updated successfully!', 'success');
    fetchHospitals();
  };

  const handleQuickBedChange = async (id, newAvailable, total) => {
    if (newAvailable < 0 || newAvailable > total) return;
    try {
      const res = await api.updateHospital(id, { availableBeds: newAvailable, totalBeds: total });
      // Optimistic state update
      setHospitals((prev) =>
        prev.map((h) => (h._id === id ? { ...h, availableBeds: newAvailable } : h))
      );
      addToast(`Updated bed availability (${newAvailable} beds available)`, 'info');
    } catch (err) {
      addToast(`Failed to update beds: ${err.message}`, 'error');
    }
  };

  const handleDeleteHospital = async () => {
    if (!deletingHospitalInfo) return;
    try {
      const res = await api.deleteHospital(deletingHospitalInfo.id);
      addToast(res.data.message || 'Hospital deleted', 'success');
      setDeletingHospitalInfo(null);
      fetchHospitals();
    } catch (err) {
      addToast(`Delete failed: ${err.message}`, 'error');
    }
  };

  // Auth Handlers
  const handleLogin = async (credentials) => {
    const res = await api.login(credentials);
    setUser(res.data.user);
    addToast(`Welcome back, ${res.data.user.username || 'User'}!`, 'success');
  };

  const handleRegister = async (userData) => {
    const res = await api.register(userData);
    setUser(res.data.user);
    addToast('Account created successfully!', 'success');
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    addToast('Logged out successfully', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        user={user}
        isMockMode={isMockMode}
        onOpenAddModal={() => { setEditingHospital(null); setIsHospitalModalOpen(true); }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Real-time System Metrics Cards */}
        <MetricsOverview hospitals={hospitals} />

        {/* Search, Filters & Controls Bar */}
        <div className="glass-panel p-4 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4 border border-slate-800">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hospital name or city..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            
            {/* Availability Filter Chips */}
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
              <button
                onClick={() => setAvailabilityFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  availabilityFilter === 'all'
                    ? 'bg-brand-500 text-white shadow-glow-teal'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Facilities
              </button>
              <button
                onClick={() => setAvailabilityFilter('available')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  availabilityFilter === 'available'
                    ? 'bg-brand-500 text-white shadow-glow-teal'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Beds Available
              </button>
              <button
                onClick={() => setAvailabilityFilter('full')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  availabilityFilter === 'full'
                    ? 'bg-rose-500 text-white shadow-glow-rose'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Fully Occupied
              </button>
            </div>

            {/* City Dropdown Filter */}
            {cities.length > 0 && (
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 focus:outline-none focus:border-brand-500"
              >
                <option value="all">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            )}

            {/* View Switcher (Grid / Table) */}
            <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl ml-auto md:ml-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-slate-800 text-brand-400'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'table'
                    ? 'bg-slate-800 text-brand-400'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchHospitals}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-brand-300 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-400' : ''}`} />
            </button>

          </div>

        </div>

        {/* Main Content Grid / Table */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 mb-4 animate-spin">
              <RefreshCw className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Syncing with Health Network...</h3>
            <p className="text-xs text-slate-400 mt-1">Retrieving latest hospital occupancy logs</p>
          </div>
        ) : filteredHospitals.length === 0 ? (
          <div className="glass-panel p-12 rounded-2xl text-center border border-slate-800 my-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">No Hospitals Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-6">
              {searchQuery
                ? `No facilities matched "${searchQuery}". Try refining your search.`
                : 'No hospital facilities registered in the system yet.'}
            </p>
            <button
              onClick={() => { setEditingHospital(null); setIsHospitalModalOpen(true); }}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-medium text-sm shadow-glow-teal transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Register First Hospital</span>
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hospital) => (
              <HospitalCard
                key={hospital._id}
                hospital={hospital}
                onEdit={(h) => { setEditingHospital(h); setIsHospitalModalOpen(true); }}
                onDelete={(id, name) => setDeletingHospitalInfo({ id, name })}
                onQuickBedChange={handleQuickBedChange}
              />
            ))}
          </div>
        ) : (
          <HospitalTable
            hospitals={filteredHospitals}
            onEdit={(h) => { setEditingHospital(h); setIsHospitalModalOpen(true); }}
            onDelete={(id, name) => setDeletingHospitalInfo({ id, name })}
            onQuickBedChange={handleQuickBedChange}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-400">CareSync Medical Portal</span>
            <span>•</span>
            <span>Connected to Hospital Management Express API</span>
          </div>
          <div>
            Built with React & Vite for Assignment 2
          </div>
        </div>
      </footer>

      {/* Hospital Add / Edit Modal */}
      <HospitalModal
        isOpen={isHospitalModalOpen}
        onClose={() => setIsHospitalModalOpen(false)}
        onSubmit={editingHospital ? handleUpdateHospital : handleCreateHospital}
        hospital={editingHospital}
      />

      {/* User Login / Register Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      {/* Delete Confirmation Dialog */}
      {deletingHospitalInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-modal w-full max-w-sm rounded-2xl p-6 border border-slate-700/80 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Delete Hospital?</h3>
            <p className="text-xs text-slate-400 mb-6">
              Are you sure you want to remove <span className="text-rose-300 font-semibold">{deletingHospitalInfo.name}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => setDeletingHospitalInfo(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteHospital}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-semibold shadow-glow-rose transition-all"
              >
                Delete Hospital
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

    </div>
  );
}
