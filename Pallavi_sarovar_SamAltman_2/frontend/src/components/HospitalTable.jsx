import React from 'react';
import { Building, MapPin, BedDouble, Edit3, Trash2, Plus, Minus, ShieldCheck, AlertCircle } from 'lucide-react';

export default function HospitalTable({ 
  hospitals = [], 
  onEdit, 
  onDelete, 
  onQuickBedChange 
}) {
  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-glass">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/90 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th scope="col" className="py-4 px-6">Hospital Facility</th>
              <th scope="col" className="py-4 px-6">Location</th>
              <th scope="col" className="py-4 px-6">Total Beds</th>
              <th scope="col" className="py-4 px-6">Available Beds</th>
              <th scope="col" className="py-4 px-6">Occupancy</th>
              <th scope="col" className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {hospitals.map((h) => {
              const total = Number(h.totalBeds) || 0;
              const avail = Number(h.availableBeds) || 0;
              const isFull = avail === 0;
              const pct = total > 0 ? Math.round(((total - avail) / total) * 100) : 0;

              return (
                <tr key={h._id} className="hover:bg-slate-900/50 transition-colors">
                  
                  {/* Name */}
                  <td className="py-4 px-6 font-semibold text-white">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-brand-400 shrink-0">
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-100">{h.name}</div>
                        <div className="text-[11px] text-slate-400 font-normal">ID: {h._id}</div>
                      </div>
                    </div>
                  </td>

                  {/* City */}
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-brand-400" />
                      {h.city}
                    </span>
                  </td>

                  {/* Total Beds */}
                  <td className="py-4 px-6 font-semibold text-slate-200">
                    {total}
                  </td>

                  {/* Available Beds */}
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <span className={`font-bold text-sm ${isFull ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {avail}
                      </span>
                      
                      {/* Quick Bed +/- Buttons */}
                      <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-md p-0.5">
                        <button
                          onClick={() => onQuickBedChange(h._id, avail - 1, total)}
                          disabled={avail <= 0}
                          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 rounded"
                          title="Admit (-1 bed)"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onQuickBedChange(h._id, avail + 1, total)}
                          disabled={avail >= total}
                          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 rounded"
                          title="Discharge (+1 bed)"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Occupancy */}
                  <td className="py-4 px-6">
                    <div className="w-32">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{pct}%</span>
                        <span className="text-[11px] text-slate-400">{total - avail} occupied</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${isFull ? 'bg-rose-500' : 'bg-brand-500'}`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(h)}
                        className="p-2 text-slate-400 hover:text-brand-300 hover:bg-brand-500/10 rounded-lg transition-colors"
                        title="Edit Hospital"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(h._id, h.name)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Hospital"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
