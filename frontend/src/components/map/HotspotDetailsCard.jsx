import React, { useState } from 'react';
import { Volume2, AlertTriangle, Clock, Activity, ShieldAlert, BarChart3, X } from 'lucide-react';
import Modal from '../common/Modal';

export default function HotspotDetailsCard({ hotspot }) {
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  if (!hotspot) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 text-center text-slate-500">
        <Volume2 className="w-8 h-8 mx-auto text-slate-400 mb-2" />
        <p className="text-sm">Click on any hotspot on the map to inspect sound levels and active complaints.</p>
      </div>
    );
  }

  const isHigh = hotspot.decibel >= 75;
  const isModerate = hotspot.decibel >= 60 && hotspot.decibel < 75;
  const isLow = hotspot.decibel < 60;

  // Percentage on 30dB - 100dB scale
  const meterPercentage = Math.min(Math.max(((hotspot.decibel - 30) / 70) * 100, 5), 100);

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
        <div>
          {/* Eyebrow */}
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            SELECTED HOTSPOT
          </div>

          {/* Hotspot Name & Badge */}
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {hotspot.name}
            </h2>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded tracking-wider border ${
                isHigh
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : isModerate
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {isHigh ? 'HIGH NOISE ZONE' : isModerate ? 'MODERATE NOISE ZONE' : 'LOW NOISE ZONE'}
            </span>
          </div>

          {/* Big Decibel Readout */}
          <div className="mt-5 flex items-baseline gap-2">
            <span className="text-5xl font-black text-slate-900 tracking-tight">
              {hotspot.decibel}
            </span>
            <span className="text-xl font-medium text-slate-500">dB</span>
            {/* Audio Wave Visualizer */}
            <div className="ml-4 flex items-end gap-1 h-8" aria-hidden="true">
              <span className="w-1.5 bg-teal-600 rounded-full h-3" />
              <span className="w-1.5 bg-teal-600 rounded-full h-6" />
              <span className="w-1.5 bg-teal-600 rounded-full h-8" />
              <span className="w-1.5 bg-teal-600 rounded-full h-5" />
              <span className="w-1.5 bg-teal-600 rounded-full h-2" />
            </div>
          </div>

          {/* Decibel Meter Bar (Figma colored scale) */}
          <div className="mt-4">
            <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 relative">
              {/* Pointer Marker */}
              <div
                className="absolute -top-1 w-4 h-4 bg-slate-900 border-2 border-white rounded-full shadow transform -translate-x-1/2 transition-all duration-300"
                style={{ left: `${meterPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-medium text-slate-400 mt-1">
              <span>30 dB (Quiet)</span>
              <span>65 dB (Limit)</span>
              <span>100 dB (Severe)</span>
            </div>
          </div>

          {/* Detailed Hotspot Metrics List */}
          <div className="mt-6 space-y-3.5 text-sm border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" />
                Active complaints
              </span>
              <span className="font-semibold text-slate-800">
                {hotspot.activeComplaintsCount || 12}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                Peak hours
              </span>
              <span className="font-semibold text-slate-800">
                {hotspot.peakHours || '18:00 - 21:00'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-slate-400" />
                Regulatory Status
              </span>
              <span
                className={`font-semibold text-xs px-2 py-0.5 rounded ${
                  hotspot.decibel > (hotspot.dayLimitDb || 65)
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {hotspot.decibel > (hotspot.dayLimitDb || 65)
                  ? `Above Limit (Day limit: ${hotspot.dayLimitDb || 65} dB)`
                  : `Within Safe Limit (${hotspot.dayLimitDb || 65} dB)`}
              </span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <span className="text-slate-500 flex items-center gap-2 flex-shrink-0">
                <AlertTriangle className="w-4 h-4 text-slate-400" />
                Primary Source
              </span>
              <span className="font-medium text-slate-700 text-right text-xs">
                {hotspot.primarySource || 'Traffic & Commercial Activities'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => setShowAnalyticsModal(true)}
            className="w-full py-2.5 px-4 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <span>View Zone Analytics</span>
            <span>&rarr;</span>
          </button>
        </div>
      </div>

      {/* Hourly Analytics Modal */}
      <Modal
        isOpen={showAnalyticsModal}
        onClose={() => setShowAnalyticsModal(false)}
        title={`${hotspot.name} - Acoustic Activity Analysis`}
      >
        <div className="space-y-4">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
            <strong>Illustrative readings: Notice:</strong> Acoustic curves and sound measurements are schematic prototype representations for municipal monitoring simulation.
          </div>

          <h4 className="text-sm font-semibold text-slate-800">24-Hour Decibel Trend Curve</h4>

          {/* Visual Bar Chart for Hourly Readings */}
          <div className="h-44 flex items-end gap-2 pt-6 pb-2 border-b border-slate-200">
            {(hotspot.hourlyReadings && hotspot.hourlyReadings.length > 0
              ? hotspot.hourlyReadings
              : [
                  { hour: '06:00', decibel: 55 },
                  { hour: '08:00', decibel: 72 },
                  { hour: '10:00', decibel: 78 },
                  { hour: '12:00', decibel: 74 },
                  { hour: '14:00', decibel: 70 },
                  { hour: '16:00', decibel: 75 },
                  { hour: '18:00', decibel: 82 },
                  { hour: '20:00', decibel: 80 },
                  { hour: '22:00', decibel: 67 },
                ]
            ).map((item, idx) => {
              const heightPercent = ((item.decibel - 30) / 70) * 100;
              const isOver = item.decibel > (hotspot.dayLimitDb || 65);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.decibel}dB
                  </span>
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      isOver ? 'bg-rose-500' : 'bg-teal-600'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[10px] text-slate-400 mt-1">{item.hour}</span>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Prescribed Day Limit</span>
              <span className="text-base font-bold text-slate-800">{hotspot.dayLimitDb || 65} dB (06:00 - 22:00)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block">Prescribed Night Limit</span>
              <span className="text-base font-bold text-slate-800">{hotspot.nightLimitDb || 55} dB (22:00 - 06:00)</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setShowAnalyticsModal(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
