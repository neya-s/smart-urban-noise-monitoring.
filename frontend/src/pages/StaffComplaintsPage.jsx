import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Filter, RefreshCw, CheckCircle, Shield, AlertTriangle } from 'lucide-react';
import Header from '../components/layout/Header';
import ComplaintTable from '../components/complaints/ComplaintTable';
import Modal from '../components/common/Modal';
import StatusBadge from '../components/common/StatusBadge';
import { complaintAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function StaffComplaintsPage() {
  const { setMobileOpen } = useOutletContext();
  const { showToast } = useToast();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Status update modal state
  const [selectedForReview, setSelectedForReview] = useState(null);
  const [newStatus, setNewStatus] = useState('Under Review');
  const [officerName, setOfficerName] = useState('Officer Ramanathan');
  const [teamName, setTeamName] = useState('Field Squad Zone 8');
  const [staffNotes, setStaffNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchStaffComplaints = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (zoneFilter !== 'all') params.zone = zoneFilter;
      if (search.trim()) params.search = search.trim();

      const data = await complaintAPI.getAllComplaints(params);
      if (data.success) {
        setComplaints(data.complaints || []);
      }
    } catch (err) {
      showToast('Failed to load complaints review queue.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffComplaints();
  }, [statusFilter, categoryFilter, zoneFilter]);

  const handleOpenReviewModal = (complaint) => {
    setSelectedForReview(complaint);
    setNewStatus(complaint.status || 'Under Review');
    setOfficerName(complaint.assignedOfficer || 'Officer Ramanathan');
    setTeamName(complaint.assignedTeam || 'Field Squad Zone 8');
    setStaffNotes(complaint.staffNotes || '');
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!selectedForReview) return;

    try {
      setUpdating(true);
      const res = await complaintAPI.updateStatus(selectedForReview._id, {
        status: newStatus,
        assignedOfficer: officerName.trim(),
        assignedTeam: teamName.trim(),
        staffNotes: staffNotes.trim(),
      });

      showToast(`Complaint #${selectedForReview._id.substring(selectedForReview._id.length - 6)} updated to "${newStatus}"`, 'success');
      setSelectedForReview(null);
      fetchStaffComplaints();
    } catch (err) {
      showToast(err.message || 'Failed to update complaint status.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <Header
        eyebrow="MUNICIPAL TRIAGE"
        title="Complaints Review & Status Updates"
        subtitle="Evaluate citizen submissions, assign inspection officers, and log field acoustic actions."
        setMobileOpen={setMobileOpen}
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchStaffComplaints()}
            placeholder="Search keyword..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Status filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Investigating">Investigating</option>
              <option value="Assigned">Assigned</option>
              <option value="Resolved">Resolved</option>
              <option value="Dismissed">Dismissed</option>
            </select>
          </div>

          {/* Zone filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400">Zone:</span>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Zones</option>
              <option value="Anna Nagar">Anna Nagar</option>
              <option value="T. Nagar">T. Nagar</option>
              <option value="Kilpauk">Kilpauk</option>
              <option value="Nungambakkam">Nungambakkam</option>
              <option value="Velachery">Velachery</option>
              <option value="Adyar">Adyar</option>
            </select>
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400">Source:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Sources</option>
              <option value="Traffic">Traffic</option>
              <option value="Construction">Construction</option>
              <option value="Loudspeaker">Loudspeaker</option>
              <option value="Industrial">Industrial</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            onClick={fetchStaffComplaints}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg border border-slate-200 hover:bg-slate-50"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Review Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <ComplaintTable
          complaints={complaints}
          loading={loading}
          showActions={true}
          isStaff={true}
          onStatusClick={handleOpenReviewModal}
        />
      </div>

      {/* Staff Review & Status Update Modal */}
      <Modal
        isOpen={Boolean(selectedForReview)}
        onClose={() => setSelectedForReview(null)}
        title="Municipal Status Review & Action"
      >
        {selectedForReview && (
          <form onSubmit={handleUpdateStatusSubmit} className="space-y-4 text-xs">
            {/* Complaint Header Summary */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-900 text-sm">
                  {selectedForReview.title}
                </span>
                <StatusBadge status={selectedForReview.status} />
              </div>
              <div className="text-slate-500 text-[11px]">
                Reported by {selectedForReview.citizen?.name || 'Citizen'} ({selectedForReview.location?.address}) on {selectedForReview.incidentDate}
              </div>
            </div>

            {/* Change Status Dropdown */}
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Update Status *
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Submitted">Submitted (Pending Initial Screening)</option>
                <option value="Under Review">Under Review (Screening in Progress)</option>
                <option value="Investigating">Investigating (Acoustic Field Assessment)</option>
                <option value="Assigned">Assigned (Officer Dispatched)</option>
                <option value="Resolved">Resolved (Noise Mitigated / Notice Issued)</option>
                <option value="Dismissed">Dismissed (Non-Violation / Duplicate)</option>
              </select>
            </div>

            {/* Officer & Team Assignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Assign Officer
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  placeholder="Officer name"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Division / Squad
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Field Squad Zone 8"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Municipal Notes */}
            <div>
              <label className="block font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Official Municipal Action Notes & Remediation Details
              </label>
              <textarea
                rows={3}
                value={staffNotes}
                onChange={(e) => setStaffNotes(e.target.value)}
                placeholder="Log sound meter decibel verification, contractor advisories, detour enforcement, or resolution details..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 leading-relaxed"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedForReview(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {updating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Save Status Update</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
