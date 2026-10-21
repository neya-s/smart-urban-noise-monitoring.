import React from 'react';
import { Clock, Search, UserCheck, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const statusConfig = {
  'Submitted': {
    label: 'Submitted',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    icon: Clock,
  },
  'Under Review': {
    label: 'Under Review',
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
    icon: AlertCircle,
  },
  'Investigating': {
    label: 'Investigating',
    bg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    dot: 'bg-cyan-600',
    icon: Search,
  },
  'Assigned': {
    label: 'Assigned',
    bg: 'bg-amber-50 text-amber-800 border-amber-200',
    dot: 'bg-amber-500',
    icon: UserCheck,
  },
  'Resolved': {
    label: 'Resolved',
    bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dot: 'bg-emerald-600',
    icon: CheckCircle2,
  },
  'Dismissed': {
    label: 'Dismissed',
    bg: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    icon: XCircle,
  },
};

export default function StatusBadge({ status, showIcon = true, size = 'sm' }) {
  const config = statusConfig[status] || {
    label: status || 'Unknown',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    icon: Clock,
  };

  const Icon = config.icon;
  const sizeClasses = size === 'xs' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      {showIcon && <Icon className="w-3 h-3 flex-shrink-0" aria-hidden="true" />}
      <span>{config.label}</span>
    </span>
  );
}
