import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#F8FDFD] flex flex-col items-center justify-center p-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6F6F7] text-[#0D5C63] mb-4 shadow-sm">
        <HeartPulse className="w-7 h-7" />
      </div>

      <h1 className="font-heading text-4xl font-extrabold text-[#0B2B2F] tracking-tight">
        404
      </h1>
      <h2 className="font-heading text-lg font-bold text-[#0B2B2F] mt-1">
        Page Not Found
      </h2>
      <p className="text-xs font-medium text-[#5A7175] max-w-sm mt-1">
        The requested healthcare portal resource does not exist or has been moved.
      </p>

      <div className="mt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold text-white bg-[#0D5C63] hover:bg-[#094449] shadow-sm shadow-[#0D5C63]/25 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
