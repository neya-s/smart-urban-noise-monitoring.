import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  MapPin,
  Settings,
  LogOut,
  Shield,
  Activity,
  ClipboardList,
  Volume2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Sidebar({ mobileOpen = false, setMobileOpen = () => {} }) {
  const { user, isStaff, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast('You have been logged out successfully.', 'info');
    navigate('/login');
  };

  const citizenNav = [
    { name: 'Overview', to: '/overview', icon: LayoutDashboard },
    { name: 'Report Noise', to: '/report', icon: PlusCircle },
    { name: 'My Complaints', to: '/my-complaints', icon: FileText },
    { name: 'Noise Map', to: '/map', icon: MapPin },
  ];

  const staffNav = [
    { name: 'Staff Overview', to: '/staff/overview', icon: LayoutDashboard },
    { name: 'Complaints Review', to: '/staff/complaints', icon: ClipboardList },
    { name: 'Noise Map', to: '/map', icon: MapPin },
  ];

  const navItems = isStaff ? staffNav : citizenNav;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0B131E] text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo Header */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
              <Volume2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white leading-tight">
                SMART
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-300 leading-tight">
                URBAN NOISE
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                isStaff
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                  : 'bg-teal-950/80 text-teal-300 border border-teal-800/60'
              }`}
            >
              {isStaff ? 'STAFF PORTAL' : 'CITIZEN PORTAL'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-teal-700/30 text-teal-300 border-l-4 border-teal-400 pl-2.5'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-1">
          <NavLink
            to="/settings"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'text-teal-300 bg-slate-800/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`
            }
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </NavLink>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-950/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>

          {/* User profile pill */}
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between px-2">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-teal-300 flex-shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <div className="text-xs font-medium text-slate-200 truncate">
                  {user?.name || 'User'}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {isStaff ? 'Municipal Staff' : 'Citizen account'}
                </div>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" title="Online" />
          </div>
        </div>
      </aside>
    </>
  );
}
