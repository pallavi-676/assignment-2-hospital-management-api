import React from 'react';
import { Menu, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onOpenSidebar, title = 'Dashboard' }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-8 bg-white/90 backdrop-blur-md border-b border-[#E0EEEE]">
      {/* Left: Mobile hamburger & title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl text-[#5A7175] hover:bg-[#F0FAFA] border border-[#E0EEEE] lg:hidden cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-[#0B2B2F] tracking-tight">
            {title}
          </h2>
        </div>
      </div>

      {/* Right: User Identity Pill */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F8FDFD] border border-[#E0EEEE]">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E6F6F7] text-[#0D5C63] text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-bold text-[#0B2B2F] hidden sm:inline">
          {user?.username || 'User'}
        </span>
      </div>
    </header>
  );
};

export default Navbar;
