import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { PlusCircle, Search, Filter, RefreshCw } from 'lucide-react';
import Header from '../components/layout/Header';
import ComplaintTable from '../components/complaints/ComplaintTable';
import { complaintAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function MyComplaintsPage() {
  const { setMobileOpen } = useOutletContext();
  const { showToast } = useToast();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchMyComplaints = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (search.trim()) params.search = search.trim();

      const data = await complaintAPI.getMyComplaints(params);
      if (data.success) {
        setComplaints(data.complaints || []);
      }
    } catch (err) {
      showToast('Could not load your complaints. Please check connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, [statusFilter, categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMyComplaints();
  };

  const handleDelete = async (id) => {
    try {
      await complaintAPI.delete(id);
      showToast('Complaint removed successfully.', 'success');
      fetchMyComplaints();
    } catch (err) {
      showToast(err.message || 'Cannot delete complaint.', 'error');
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <Header
        eyebrow="CITIZEN TRACKING"
        title="My Noise Complaints"
        subtitle="Review progress updates and municipal field actions for reports you submitted."
        setMobileOpen={setMobileOpen}
        actionButton={
          <Link
            to="/report"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs transition-colors shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Report</span>
          </Link>
        }
      />

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or street..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Investigating">Investigating</option>
              <option value="Assigned">Assigned</option>
              <option value="Resolved">Resolved</option>
              <option value="Dismissed">Dismissed</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="Traffic">Traffic</option>
              <option value="Construction">Construction</option>
              <option value="Loudspeaker">Loudspeaker</option>
              <option value="Industrial">Industrial</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            onClick={fetchMyComplaints}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Complaints Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <ComplaintTable
          complaints={complaints}
          loading={loading}
          onDelete={handleDelete}
          showActions={true}
        />
      </div>
    </div>
  );
}
