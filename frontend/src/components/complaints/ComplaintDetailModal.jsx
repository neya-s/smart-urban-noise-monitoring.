import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  User,
  ShieldCheck,
  Image as ImageIcon,
  CheckCircle,
  FileText,
  AlertCircle,
} from 'lucide-react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';

export default function ComplaintDetailModal({ complaint, isOpen, onClose }) {
  if (!complaint) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complaint Details" maxWidth="max-w-2xl">
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-mono text-slate-400">
              REF #{complaint._id ? complaint._id.substring(complaint._id.length - 8).toUpperCase() : 'N/A'}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{complaint.title}</h3>
          </div>
          <div>
            <StatusBadge status={complaint.status} size="md" />
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 text-slate-700">
            <Tag className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span className="text-slate-500">Category:</span>
            <span className="font-semibold text-slate-900">{complaint.category}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <MapPin className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span className="text-slate-500">Location:</span>
            <span className="font-semibold text-slate-900 truncate">
              {complaint.location?.address || 'Chennai'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Calendar className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span className="text-slate-500">Date:</span>
            <span className="font-semibold text-slate-900">{complaint.incidentDate}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span className="text-slate-500">Time:</span>
            <span className="font-semibold text-slate-900">{complaint.incidentTime}</span>
          </div>

          {complaint.citizen && (
            <div className="flex items-center gap-2 text-slate-700 sm:col-span-2">
              <User className="w-4 h-4 text-teal-600 flex-shrink-0" />
              <span className="text-slate-500">Submitted by:</span>
              <span className="font-semibold text-slate-900">
                {complaint.citizen.name || 'Registered Citizen'} ({complaint.citizen.email || 'Verified'})
              </span>
            </div>
          )}
        </div>

        {/* Description Section */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Incident Description
          </h4>
          <p className="text-sm text-slate-700 bg-white p-3.5 rounded-lg border border-slate-200 leading-relaxed whitespace-pre-line">
            {complaint.description}
          </p>
        </div>

        {/* Evidence Image (URL based) */}
        {complaint.evidenceImageUrl && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              Photo Evidence (Image URL)
            </h4>
            <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 max-h-60 flex items-center justify-center">
              <img
                src={complaint.evidenceImageUrl}
                alt="Complaint noise evidence"
                className="max-h-60 w-auto object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = `<div class="p-4 text-xs text-slate-500">Image could not be loaded from URL: ${complaint.evidenceImageUrl}</div>`;
                }}
              />
            </div>
            <div className="text-[11px] text-slate-400 mt-1 truncate">
              Source: <span className="font-mono">{complaint.evidenceImageUrl}</span>
            </div>
          </div>
        )}

        {/* Municipal Staff Notes */}
        {(complaint.staffNotes || complaint.assignedOfficer) && (
          <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-2">
            <div className="flex items-center gap-2 text-teal-900 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              Municipal Action & Inspection
            </div>
            {complaint.assignedOfficer && (
              <div className="text-xs text-teal-900">
                <span className="font-medium text-teal-700">Officer Assigned:</span>{' '}
                <span className="font-semibold">{complaint.assignedOfficer}</span>
                {complaint.assignedTeam ? ` (${complaint.assignedTeam})` : ''}
              </div>
            )}
            {complaint.staffNotes && (
              <div className="text-sm text-teal-950 font-normal leading-relaxed">
                {complaint.staffNotes}
              </div>
            )}
          </div>
        )}

        {/* Status History Timeline */}
        {complaint.statusHistory && complaint.statusHistory.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Status Progression Timeline
            </h4>
            <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {complaint.statusHistory.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-teal-600 border-2 border-white" />
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-semibold text-slate-900">{step.status}</span>
                    <span className="text-slate-400 text-[11px]">
                      {new Date(step.timestamp).toLocaleDateString()} at{' '}
                      {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {step.note && (
                    <p className="text-xs text-slate-600 mt-0.5 leading-normal">{step.note}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal footer */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
