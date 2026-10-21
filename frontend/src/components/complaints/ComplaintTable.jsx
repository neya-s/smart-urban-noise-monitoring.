import React, { useState } from 'react';
import { Eye, Trash2, Calendar, MapPin, Tag } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import ComplaintDetailModal from './ComplaintDetailModal';
import ConfirmDialog from '../common/ConfirmDialog';

export default function ComplaintTable({
  complaints = [],
  loading = false,
  onDelete = null,
  showActions = true,
  isStaff = false,
  onStatusClick = null,
}) {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteTargetId || !onDelete) return;
    try {
      setIsDeleting(true);
      await onDelete(deleteTargetId);
      setDeleteTargetId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-7 h-7 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500">
        <p className="text-sm">No complaints recorded yet.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4">COMPLAINT</th>
              <th className="py-3 px-4">LOCATION</th>
              <th className="py-3 px-4">REPORTED</th>
              <th className="py-3 px-4">STATUS</th>
              {showActions && <th className="py-3 px-4 text-right">ACTION</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {complaints.map((item) => (
              <tr
                key={item._id}
                onClick={() => setSelectedComplaint(item)}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
              >
                {/* Complaint Title & Category */}
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-400">{item.category}</div>
                </td>

                {/* Location */}
                <td className="py-3.5 px-4 text-slate-600 font-medium">
                  {item.location?.zone || item.location?.address || 'Chennai'}
                </td>

                {/* Reported Date */}
                <td className="py-3.5 px-4 text-slate-500 text-xs">
                  {formatDate(item.incidentDate || item.createdAt)}
                </td>

                {/* Status Badge */}
                <td className="py-3.5 px-4">
                  <StatusBadge status={item.status} />
                </td>

                {/* Actions */}
                {showActions && (
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedComplaint(item)}
                        className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {isStaff && onStatusClick && (
                        <button
                          onClick={() => onStatusClick(item)}
                          className="px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
                        >
                          Review / Update
                        </button>
                      )}

                      {!isStaff && onDelete && item.status === 'Submitted' && (
                        <button
                          onClick={() => setDeleteTargetId(item._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Complaint"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="md:hidden space-y-3">
        {complaints.map((item) => (
          <div
            key={item._id}
            onClick={() => setSelectedComplaint(item)}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3 cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">{item.title}</h4>
                <div className="text-xs text-slate-400">{item.category}</div>
              </div>
              <StatusBadge status={item.status} />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                {item.location?.zone || item.location?.address}
              </span>
              <span className="flex items-center gap-1.5 flex-shrink-0">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatDate(item.incidentDate || item.createdAt)}
              </span>
            </div>

            {showActions && (
              <div
                className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedComplaint(item)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg"
                >
                  View Details
                </button>
                {isStaff && onStatusClick && (
                  <button
                    onClick={() => onStatusClick(item)}
                    className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg"
                  >
                    Update Status
                  </button>
                )}
                {!isStaff && onDelete && item.status === 'Submitted' && (
                  <button
                    onClick={() => setDeleteTargetId(item._id)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        isOpen={Boolean(selectedComplaint)}
        onClose={() => setSelectedComplaint(null)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Noise Complaint"
        message="Are you sure you want to delete this complaint? This action cannot be undone once confirmed."
        confirmText="Yes, Delete"
        cancelText="Keep Complaint"
        isDanger={true}
        loading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </>
  );
}
