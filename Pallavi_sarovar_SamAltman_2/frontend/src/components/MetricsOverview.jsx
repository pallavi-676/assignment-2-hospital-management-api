import React from 'react';
import { Building2, BedDouble, CheckCircle2, AlertTriangle, PieChart, Activity } from 'lucide-react';

export default function MetricsOverview({ hospitals = [] }) {
  const totalHospitals = hospitals.length;
  const totalBeds = hospitals.reduce((sum, h) => sum + (Number(h.totalBeds) || 0), 0);
  const availableBeds = hospitals.reduce((sum, h) => sum + (Number(h.availableBeds) || 0), 0);
  const occupiedBeds = Math.max(0, totalBeds - availableBeds);
  
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  
  let statusBadge = {
    text: 'Optimal System Load',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    icon: CheckCircle2,
  };
  if (occupancyRate > 90) {
    statusBadge = {
      text: 'Critical Surge Level',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30 animate-pulse',
      icon: AlertTriangle,
    };
  } else if (occupancyRate > 75) {
    statusBadge = {
      text: 'High Occupancy Alert',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      icon: Activity,
    };
  }

  const StatusIcon = statusBadge.icon;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* Metric 1: Total Hospitals */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-500/10 rounded-full blur-xl group-hover:bg-brand-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Hospitals</span>
          <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <Building2 className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white">{totalHospitals}</span>
          <span className="text-xs text-slate-400">active facilities</span>
        </div>
      </div>

      {/* Metric 2: Total Bed Capacity */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Bed Capacity</span>
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BedDouble className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-white">{totalBeds.toLocaleString()}</span>
          <span className="text-xs text-slate-400">total beds</span>
        </div>
      </div>

      {/* Metric 3: Available Beds */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-teal-500/10 rounded-full blur-xl group-hover:bg-teal-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Available Beds</span>
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold text-teal-300">{availableBeds.toLocaleString()}</span>
          <span className="text-xs text-teal-400/80 font-medium">ready for admission</span>
        </div>
      </div>

      {/* Metric 4: Occupancy Rate */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Occupancy Rate</span>
          <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${statusBadge.color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{occupancyRate}%</span>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="w-full bg-slate-800 rounded-full h-3 p-0.5 border border-slate-700">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                occupancyRate > 90 ? 'bg-gradient-to-r from-amber-500 to-rose-500' :
                occupancyRate > 75 ? 'bg-gradient-to-r from-teal-500 to-amber-500' :
                'bg-gradient-to-r from-brand-500 to-teal-400'
              }`}
              style={{ width: `${Math.min(100, occupancyRate)}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 flex justify-between">
            <span>Occupied: {occupiedBeds}</span>
            <span>Status: {statusBadge.text}</span>
          </p>
        </div>
      </div>

    </div>
  );
}
