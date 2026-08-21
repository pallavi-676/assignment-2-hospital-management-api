import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Hospital',
  message = 'Are you sure you want to delete this hospital record? This action cannot be undone.',
  itemName = '',
  isProcessing = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#072B2E]/40 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-sm rounded-2xl bg-white border border-[#E0EEEE] shadow-xl p-6"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-[#0B2B2F]">{title}</h3>
            <p className="mt-1 text-xs text-[#5A7175] leading-relaxed">{message}</p>
            {itemName && (
              <p className="mt-2.5 text-xs font-bold text-[#0B2B2F] bg-[#F8FDFD] p-2.5 rounded-xl border border-[#E0EEEE] truncate">
                {itemName}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5 pt-3.5 border-t border-[#F0FAFA]">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl text-xs font-bold text-[#5A7175] bg-white border border-[#E0EEEE] hover:bg-[#F8FDFD] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] shadow-sm shadow-[#DC2626]/20 transition-colors cursor-pointer disabled:opacity-60"
          >
            {isProcessing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
