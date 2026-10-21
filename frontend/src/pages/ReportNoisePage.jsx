import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  MapPin,
  Compass,
  Car,
  HardHat,
  Volume2,
  Factory,
  MoreHorizontal,
  Calendar,
  Clock,
  ArrowRight,
  Info,
  ImageIcon,
} from 'lucide-react';
import Header from '../components/layout/Header';
import UrbanNoiseMapCanvas from '../components/map/UrbanNoiseMapCanvas';
import { complaintAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const CATEGORIES = [
  { id: 'Traffic', label: 'Traffic', icon: Car },
  { id: 'Construction', label: 'Construction', icon: HardHat },
  { id: 'Loudspeaker', label: 'Loudspeaker', icon: Volume2 },
  { id: 'Industrial', label: 'Industrial', icon: Factory },
  { id: 'Other', label: 'Other', icon: MoreHorizontal },
];

export default function ReportNoisePage() {
  const { setMobileOpen } = useOutletContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Form State
  const [address, setAddress] = useState('Anna Nagar, Chennai');
  const [zone, setZone] = useState('Anna Nagar');
  const [category, setCategory] = useState('Traffic');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [incidentDate, setIncidentDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [incidentTime, setIncidentTime] = useState('20:30');
  const [evidenceImageUrl, setEvidenceImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pickedCoords, setPickedCoords] = useState({ x: 260, y: 190 });

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setAddress('Anna Nagar West, Chennai (Current Location)');
          setZone('Anna Nagar');
          setPickedCoords({ x: 250, y: 185 });
          showToast('Detected current device location in Chennai.', 'info');
        },
        () => {
          setAddress('Anna Nagar, Chennai (Default)');
          setZone('Anna Nagar');
          setPickedCoords({ x: 260, y: 190 });
          showToast('Location permission denied. Defaulted to Anna Nagar.', 'warning');
        }
      );
    } else {
      setAddress('Anna Nagar, Chennai');
      setZone('Anna Nagar');
    }
  };

  const handleMapClick = (coords) => {
    setPickedCoords(coords);
    // Find closest zone
    if (coords.x > 450 && coords.y > 400) {
      setAddress('Adyar, Chennai');
      setZone('Adyar');
    } else if (coords.x < 350 && coords.y > 350) {
      setAddress('T. Nagar, Chennai');
      setZone('T. Nagar');
    } else if (coords.y < 250 && coords.x < 350) {
      setAddress('Anna Nagar, Chennai');
      setZone('Anna Nagar');
    } else if (coords.y < 250 && coords.x >= 350) {
      setAddress('Kilpauk, Chennai');
      setZone('Kilpauk');
    } else {
      setAddress('Nungambakkam, Chennai');
      setZone('Nungambakkam');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('Please enter a brief complaint title.', 'error');
      return;
    }

    if (!description.trim()) {
      showToast('Please provide an incident description.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: title.trim(),
        category,
        description: description.trim(),
        location: {
          address: address.trim(),
          zone: zone.trim(),
          coordinates: {
            lat: 13.085,
            lng: 80.2101,
          },
        },
        incidentDate,
        incidentTime,
        evidenceImageUrl: evidenceImageUrl.trim(),
      };

      const res = await complaintAPI.create(payload);
      showToast(res.message || 'Complaint filed successfully!', 'success');
      navigate('/overview');
    } catch (err) {
      showToast(err.message || 'Failed to submit complaint. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header matching Figma */}
      <Header
        eyebrow="CITIZEN / NEW REPORT"
        title="Report Noise Pollution"
        subtitle="Help us understand what's happening in your area"
        setMobileOpen={setMobileOpen}
      />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Sections 01 & 02 (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* 01: Location Selection */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    01
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Where is the noise happening?
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Use Current Location</span>
                </button>
              </div>

              {/* Selected location input field */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  SELECTED LOCATION
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-teal-600" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter street, area, or landmark in Chennai"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Interactive Location Picker Map */}
              <div className="mt-2">
                <div className="text-xs text-slate-400 mb-1.5">
                  Click on the map to pin noise origin:
                </div>
                <div className="h-64 rounded-xl overflow-hidden border border-slate-200">
                  <UrbanNoiseMapCanvas
                    isMini={true}
                    interactivePicker={true}
                    onMapClick={handleMapClick}
                    pickedCoords={pickedCoords}
                  />
                </div>
              </div>
            </div>

            {/* 02: Noise Category & Incident Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  02
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  What type of noise are you reporting?
                </h3>
              </div>

              {/* Category Selection Tiles */}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">
                  Choose the category that best describes it
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = category === cat.id;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-teal-50/70 border-teal-500 text-teal-900 ring-2 ring-teal-500/20 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 mb-1.5 ${
                            isSelected ? 'text-teal-700' : 'text-slate-400'
                          }`}
                        />
                        <span className="text-xs font-semibold">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title & Description fields */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Complaint Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Excessive honking near roundabout"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Description & Observations *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the noise characteristics, frequency (continuous/intermittent), source vehicles or equipment..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 leading-relaxed"
                  />
                </div>

                {/* Evidence Image URL (with instant preview) */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Photo Evidence URL (Optional)
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      value={evidenceImageUrl}
                      onChange={(e) => setEvidenceImageUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Provide a public image URL of the sound source, machinery, or site notice board.
                  </p>

                  {/* Preview if provided */}
                  {evidenceImageUrl && (
                    <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
                      <img
                        src={evidenceImageUrl}
                        alt="Evidence Preview"
                        className="w-16 h-12 object-cover rounded border"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <span className="text-xs text-slate-500">Image URL attached</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Section 03 & Action Buttons (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* 03: When did it happen? */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  03
                </span>
                <h3 className="text-base font-bold text-slate-900">When did it happen?</h3>
              </div>
              <p className="text-xs text-slate-400">Choose the date and approximate time</p>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="time"
                      required
                      value={incidentTime}
                      onChange={(e) => setIncidentTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Informational Callout matching Figma */}
              <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Info className="w-4 h-4 text-teal-600" />
                  Your report matters
                </div>
                <p className="leading-relaxed">
                  Noise complaints will be reviewed by the municipal acoustic division. Verified data helps target traffic calming and sound barriers.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/overview')}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>SUBMIT COMPLAINT</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
