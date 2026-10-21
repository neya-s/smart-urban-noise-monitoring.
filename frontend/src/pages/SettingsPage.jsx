import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User, Phone, Mail, Shield, Check, RefreshCw, AlertCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function SettingsPage() {
  const { user, isStaff, updateProfile } = useAuth();
  const { setMobileOpen } = useOutletContext();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile({ name, phone });
      showToast('Profile updated successfully.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8 max-w-4xl">
      <Header
        eyebrow="ACCOUNT PREFERENCES"
        title="Settings & System Info"
        subtitle="Manage your contact information and review system prototype parameters."
        setMobileOpen={setMobileOpen}
      />

      {/* Profile Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Personal Details</h3>
          <p className="text-xs text-slate-400">Used by municipal teams for report verification contact.</p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Email Address (Account Identifier)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Email is tied to your login identity and cannot be altered directly.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="py-2.5 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* System Prototype Information Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Acoustic Prototype Information</h3>
          <p className="text-xs text-slate-400">Environment configuration and data claims</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 block font-bold uppercase text-[10px]">CURRENT ROLE</span>
            <span className="font-semibold text-slate-900 text-sm">
              {isStaff ? 'Municipal Staff / Officer' : 'Registered Citizen'}
            </span>
            <span className="text-slate-500 block">
              {isStaff ? 'Full triage & status update authority' : 'Citizen report filing & tracking only'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-slate-400 block font-bold uppercase text-[10px]">MONITORING REGION</span>
            <span className="font-semibold text-slate-900 text-sm">Chennai, Tamil Nadu</span>
            <span className="text-slate-500 block">
              Covering Anna Nagar, T. Nagar, Kilpauk, Nungambakkam, Adyar, Velachery
            </span>
          </div>
        </div>

        {/* Clear Notice on Data Claims */}
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="w-4 h-4 text-amber-700" />
            Evaluation Prototype Notice
          </div>
          <p className="leading-relaxed">
            All map decibel levels, sensor readings, and predictive curves are illustrative sample prototype data. They are not live telemetry or certified acoustic compliance records.
          </p>
        </div>
      </div>
    </div>
  );
}
