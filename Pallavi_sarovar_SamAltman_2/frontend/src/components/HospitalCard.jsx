import React from 'react';
import { MapPin, BedDouble, Edit3, Trash2, Plus, Minus, Building, ShieldCheck, AlertCircle } from 'lucide-react';

export default function HospitalCard({ 
  hospital, 
  onEdit, 
  onDelete, 
  onQuickBedChange 
}) {
  const { _id, name, city, totalBeds = 0, availableBeds = 0 } = hospital;
  const occupancyPercent = totalBeds > 0 ? Math.round(((totalBeds - availableBeds) / totalBeds) * 100) : 0;
  
  const isFull = availableBeds === 0;
  const isLow = availableBeds > 0 && availableBeds <= 10;

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between relative group border border-slate-800">
      
      {/* Top Banner & Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-brand-400 group-hover:border-brand-500/40 group-hover:text-brand-300 transition-colors">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white group-hover:text-brand-200 transition-colors line-clamp-1">
                {name}
              </h3>
              <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                <span>{city}</span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          {isFull ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1 shrink-0">
              <AlertCircle className="w-3 h-3" /> Full
            </span>
          ) : isLow ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 shrink-0">
              Low Availability
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 shrink-0">
              <ShieldCheck className="w-3 h-3" /> Available
            </span>
          )}
        </div>

        {/* Bed Capacity Meter */}
        <div className="mt-5 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-medium mb-2">
            <span className="text-slate-400 flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-brand-400" /> Bed Availability
            </span>
            <span className="text-slate-200 font-bold">
              <span className={isFull ? 'text-rose-400' : 'text-brand-300'}>{availableBeds}</span>
              <span className="text-slate-500"> / {totalBeds}</span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull ? 'bg-rose-500' : isLow ? 'bg-amber-400' : 'bg-gradient-to-r from-brand-500 to-teal-400'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, (availableBeds / (totalBeds || 1)) * 100))}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
            <span>{occupancyPercent}% Occupied</span>
            <span>{totalBeds - availableBeds} Patients Admitted</span>
          </div>
        </div>
      </div>

      {/* Quick Bed Adjustment & Action Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
        
        {/* Live +1 / -1 Bed Adjuster */}
        <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button
            onClick={() => onQuickBedChange(_id, availableBeds - 1, totalBeds)}
            disabled={availableBeds <= 0}
            title="Admit Patient (-1 Available Bed)"
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 rounded transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-semibold px-2 text-slate-300 select-none">
            {availableBeds} beds
          </span>
          <button
            onClick={() => onQuickBedChange(_id, availableBeds + 1, totalBeds)}
            disabled={availableBeds >= totalBeds}
            title="Discharge Patient (+1 Available Bed)"
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 rounded transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Edit & Delete Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(hospital)}
            className="p-2 text-slate-400 hover:text-brand-300 hover:bg-brand-500/10 rounded-lg transition-colors"
            title="Edit Details"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(_id, name)}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            title="Delete Hospital"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
}
