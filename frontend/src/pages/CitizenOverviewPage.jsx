import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { Activity, Clock, CheckCircle2, ArrowRight, MapPin, Volume2 } from 'lucide-react';
import Header from '../components/layout/Header';
import ComplaintTable from '../components/complaints/ComplaintTable';
import UrbanNoiseMapCanvas from '../components/map/UrbanNoiseMapCanvas';
import { statsAPI, complaintAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function CitizenOverviewPage() {
  const { user } = useAuth();
  const { setMobileOpen } = useOutletContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    active: 3,
    underReview: 2,
    resolved: 8,
    total: 13,
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [featuredHotspot, setFeaturedHotspot] = useState(null);

  // Determine dynamic time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await statsAPI.getCitizenDashboard();
      if (data.success) {
        setStats(data.stats);
        setRecentComplaints(data.recentComplaints || []);
        setFeaturedHotspot(data.featuredHotspot || null);
      }
    } catch (err) {
      console.warn('Dashboard fetch error:', err);
      // Fallback display
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteComplaint = async (id) => {
    try {
      await complaintAPI.delete(id);
      showToast('Complaint removed successfully.', 'success');
      fetchDashboardData();
    } catch (err) {
      showToast(err.message || 'Could not delete complaint.', 'error');
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Page Header matching Figma */}
      <Header
        eyebrow="YOUR OVERVIEW"
        title={getGreeting()}
        subtitle="Here's what's happening with your reports."
        setMobileOpen={setMobileOpen}
      />

      {/* 3 Metric Stat Cards (Matching Figma Page 1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {/* Card 1: ACTIVE */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
              ACTIVE
            </span>
            <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {String(stats.active).padStart(2, '0')}
            </div>
            <p className="text-xs text-slate-400 mt-1">Complaints in progress</p>
          </div>
        </div>

        {/* Card 2: UNDER REVIEW */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              UNDER REVIEW
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {String(stats.underReview).padStart(2, '0')}
            </div>
            <p className="text-xs text-slate-400 mt-1">Being evaluated today</p>
          </div>
        </div>

        {/* Card 3: RESOLVED */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              RESOLVED
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {String(stats.resolved).padStart(2, '0')}
            </div>
            <p className="text-xs text-slate-400 mt-1">Complaints closed</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Recent Complaints + Noise Around You */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: My Recent Complaints (approx 7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">My Recent Complaints</h3>
                <p className="text-xs text-slate-400">Follow the progress of your reports</p>
              </div>
              <Link
                to="/my-complaints"
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Table */}
            <div className="mt-2">
              <ComplaintTable
                complaints={recentComplaints}
                loading={loading}
                onDelete={handleDeleteComplaint}
                showActions={true}
              />
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Showing recent complaints. Noise updates are reviewed within 48h.
            </span>
            <Link
              to="/report"
              className="text-xs font-semibold text-teal-700 hover:text-teal-800"
            >
              + File New Report
            </Link>
          </div>
        </div>

        {/* Right Column: Noise Around You (approx 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Noise Around You</h3>
                <p className="text-xs text-slate-400">A glance at today's activity</p>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                Prototype
              </span>
            </div>

            {/* Mini Map Preview */}
            <div className="my-3">
              <UrbanNoiseMapCanvas
                isMini={true}
                selectedHotspotId="anna-nagar"
                onSelectHotspot={() => navigate('/map')}
              />
            </div>

            <div className="space-y-1.5 mt-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>• 4 hot spots</span>
                <span className="text-rose-600 font-bold">• Peak: 82dB (Anna Nagar)</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Explore complaint density and schematic acoustic hot spots across your neighbourhood.
              </p>
            </div>
          </div>

          {/* Explore Map Button */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => navigate('/map')}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Explore Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
