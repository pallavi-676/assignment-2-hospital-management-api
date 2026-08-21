import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Edit2, Trash2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

const HospitalCard = ({ hospital, onEdit, onDelete }) => {
  const { _id, name, city, totalBeds, availableBeds } = hospital;
  
  const occupiedBeds = Math.max(0, totalBeds - availableBeds);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  const isAvailable = availableBeds > 0;

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white border border-[#E0EEEE] p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-[#0D5C63]/40 transition-all duration-200 group">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex-1 min-w-0">
            <h3 className="font-heading text-base font-bold text-[#0B2B2F] group-hover:text-[#0D5C63] transition-colors truncate">
              {name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs font-medium text-[#5A7175] mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#0D5C63] shrink-0" />
              <span className="truncate">{city}</span>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${
              isAvailable
                ? 'bg-[#E6F6F7] text-[#0D5C63] border border-[#CCEEF0]'
                : 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
            }`}
          >
            {isAvailable ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-[#0D5C63]" />
                Available
              </>
            ) : (
              <>
                <AlertCircle className="w-3 h-3 text-[#DC2626]" />
                Full
              </>
            )}
          </span>
        </div>

        {/* Capacity Overview Box */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#F8FDFD] border border-[#EBF5F5] mb-4 text-center">
          <div>
            <span className="text-[10px] font-bold text-[#8FA8AB] uppercase tracking-wider block">Total</span>
            <span className="font-heading font-extrabold text-sm text-[#0B2B2F] mt-0.5 block">{totalBeds}</span>
          </div>
          <div className="border-x border-[#E0EEEE]">
            <span className="text-[10px] font-bold text-[#8FA8AB] uppercase tracking-wider block">Available</span>
            <span className="font-heading font-extrabold text-sm text-[#0D5C63] mt-0.5 block">{availableBeds}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#8FA8AB] uppercase tracking-wider block">Occupied</span>
            <span className="font-heading font-extrabold text-sm text-[#5A7175] mt-0.5 block">{occupiedBeds}</span>
          </div>
        </div>

        {/* Occupancy bar */}
        <div className="space-y-1 mb-2">
          <div className="flex justify-between text-[11px] font-semibold text-[#5A7175]">
            <span>Bed Utilization</span>
            <span>{occupancyRate}%</span>
          </div>
          <div className="h-1.5 w-full bg-[#E6F6F7] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                occupancyRate > 85 ? 'bg-[#DC2626]' : occupancyRate > 60 ? 'bg-[#F59E0B]' : 'bg-[#0D5C63]'
              }`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[#F0FAFA] text-xs">
        <Link
          to={`/hospitals/${_id}`}
          className="inline-flex items-center gap-1.5 font-bold text-[#0D5C63] hover:text-[#094449] transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(hospital)}
              className="p-1.5 rounded-lg text-[#5A7175] hover:text-[#0D5C63] hover:bg-[#E6F6F7] transition-colors cursor-pointer"
              title="Edit hospital"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(hospital)}
              className="p-1.5 rounded-lg text-[#8FA8AB] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
              title="Delete hospital"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;
