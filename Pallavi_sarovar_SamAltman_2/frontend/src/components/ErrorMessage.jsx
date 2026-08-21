import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message, onRetry, className = '' }) => {
  if (!message) return null;

  return (
    <div
      className={`flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] text-[#0B2B2F] ${className}`}
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
        <p className="text-xs font-semibold text-[#991B1B]">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#0B2B2F] bg-white border border-[#E0EEEE] rounded-xl hover:bg-[#F8FDFD] transition-colors shrink-0 cursor-pointer shadow-2xs"
        >
          <RefreshCw className="w-3 h-3 text-[#0D5C63]" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
