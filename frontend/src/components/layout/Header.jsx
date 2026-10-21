import React from 'react';
import { Menu, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header({
  eyebrow = 'YOUR OVERVIEW',
  title = 'Good evening',
  subtitle = "Here's what's happening with your reports.",
  setMobileOpen = () => {},
  actionButton = null,
}) {
  const { user, isStaff } = useAuth();

  return (
    <header className="mb-6 lg:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Title area */}
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-200"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
              {eyebrow}
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Right side badges & actions */}
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          {actionButton}

          {/* Location Badge matching Figma */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-xs">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span>Chennai, Tamil Nadu</span>
          </div>

          {/* Demo mode pill */}
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-semibold text-amber-800">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Prototype</span>
          </div>
        </div>
      </div>
    </header>
  );
}
