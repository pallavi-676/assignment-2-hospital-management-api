import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  BedDouble,
  LogOut,
  X,
  HeartPulse,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'success');
      navigate('/login');
    } catch (err) {
      showToast('Error during logout', 'error');
    }
  };

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/hospitals', label: 'Hospitals', icon: Building2 },
    { to: '/available', label: 'Available Beds', icon: BedDouble },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0B2B2F]/30 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col w-64 bg-white border-r border-[#E0EEEE] transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F0FAFA]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0D5C63] text-white shadow-sm shadow-[#0D5C63]/20">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-heading text-base font-bold tracking-tight text-[#0B2B2F]">
                  CareNexus
                </h1>
                <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
              </div>
              <p className="text-[11px] font-semibold text-[#0D5C63]">Hospital Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#5A7175] hover:text-[#0B2B2F] hover:bg-[#F0FAFA] lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3.5 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-[#8FA8AB]">
            Healthcare Portal
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-[#0D5C63] text-white shadow-sm shadow-[#0D5C63]/20'
                      : 'text-[#5A7175] hover:bg-[#F0FAFA] hover:text-[#0D5C63]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Account Footer */}
        <div className="p-4 border-t border-[#F0FAFA] bg-[#F8FDFD]/80">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#E0EEEE] shadow-2xs mb-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E6F6F7] text-[#0D5C63] font-bold text-xs">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#0B2B2F] truncate">
                {user?.username || 'User'}
              </p>
              <p className="text-[11px] text-[#5A7175] truncate">
                {user?.email || 'admin@hospital.org'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold text-[#5A7175] bg-white hover:bg-[#FEF2F2] hover:text-[#DC2626] hover:border-[#FECACA] border border-[#E0EEEE] transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
