import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toastIcons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#0D5C63]" />,
    error: <AlertCircle className="w-4 h-4 text-[#DC2626]" />,
    warning: <AlertTriangle className="w-4 h-4 text-[#D97706]" />,
    info: <Info className="w-4 h-4 text-[#0D5C63]" />,
  };

  const toastStyles = {
    success: 'bg-[#F0FAFA] border-[#CCEEF0] text-[#0B2B2F]',
    error: 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]',
    warning: 'bg-[#FFFBEB] border-[#FEF3C7] text-[#92400E]',
    info: 'bg-[#FFFFFF] border-[#E0EEEE] text-[#0B2B2F]',
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-lg transition-all duration-200 animate-fade-in ${
              toastStyles[toast.type] || toastStyles.info
            }`}
          >
            <span className="shrink-0 mt-0.5">{toastIcons[toast.type] || toastIcons.info}</span>
            <p className="text-xs font-semibold leading-relaxed flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#5A7175] hover:text-[#0B2B2F] transition-colors shrink-0 cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
