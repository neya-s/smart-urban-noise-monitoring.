import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import {
  ShieldAlert,
  ClipboardList,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import Header from '../components/layout/Header';
import { statsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function StaffOverviewPage() {
  const { user } = useAuth();
  const { setMobileOpen } = useOutletContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    total: 0,
    submitted: 0,
    underReview: 0,
    investigating: 0,
    assigned: 0,
    resolved: 0,
    dismissed: 0,
    activeTotal: 0,
  });
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [zoneBreakdown, setZoneBreakdown] = useState([]);

  useEffect(() => {
    const fetchStaffStats = async () => {
      try {
        setLoading(true);
        const data = await statsAPI.getStaffDashboard();
        if (data.success) {
          setMetrics(data.metrics);
          setCategoryBreakdown(data.categoryBreakdown || []);
          setZoneBreakdown(data.zoneBreakdown || []);
        }
      } catch (err) {
        console.warn('Failed to fetch staff stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffStats();
  }, []);

  return (
    <div className="space-y-6 lg:space-y-8">
      <Header
        eyebrow="MUNICIPAL DISPATCH CONTROL"
        title="Municipal Operations Dashboard"
        subtitle={`Welcome, ${user?.name || 'Officer'}. Review citizen noise complaints and dispatch acoustic field teams.`}
        setMobileOpen={setMobileOpen}
        actionButton={
          <Link
            to="/staff/complaints"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs transition-colors shadow-xs"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Open Review Queue</span>
          </Link>
        }
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reports */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              TOTAL REPORTS
            </span>
            <ClipboardList className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-3">
            {metrics.total}
          </div>
          <p className="text-xs text-slate-400 mt-1">Across all city zones</p>
        </div>

        {/* Pending Triage */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              PENDING TRIAGE
            </span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 mt-3">
            {metrics.submitted + metrics.underReview}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {metrics.submitted} new, {metrics.underReview} in review
          </p>
        </div>

        {/* Active Investigation */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-teal-600">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
              INVESTIGATING / ASSIGNED
            </span>
            <Search className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-teal-700 mt-3">
            {metrics.investigating + metrics.assigned}
          </div>
          <p className="text-xs text-slate-400 mt-1">Field teams active</p>
        </div>

        {/* Resolved */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              RESOLVED CASES
            </span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-3">
            {metrics.resolved}
          </div>
          <p className="text-xs text-slate-400 mt-1">Remediated or damped</p>
        </div>
      </div>

      {/* Two Column Section: Category Distribution & Zone Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Complaints by Noise Source</h3>
              <p className="text-xs text-slate-400">Distribution across pollutant categories</p>
            </div>
          </div>

          <div className="space-y-4 mt-5">
            {categoryBreakdown.map((item) => {
              const pct = metrics.total > 0 ? Math.round((item.count / metrics.total) * 100) : 0;
              return (
                <div key={item._id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{item._id}</span>
                    <span>
                      {item.count} reports ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Zone Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Complaints by City Zone</h3>
              <p className="text-xs text-slate-400">Chennai corporation administrative wards</p>
            </div>
            <Link
              to="/map"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>View Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4 mt-5">
            {zoneBreakdown.map((item) => {
              const pct = metrics.total > 0 ? Math.round((item.count / metrics.total) * 100) : 0;
              return (
                <div key={item._id || 'General'} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {item._id || 'Unspecified Zone'}
                    </span>
                    <span>
                      {item.count} reports ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
