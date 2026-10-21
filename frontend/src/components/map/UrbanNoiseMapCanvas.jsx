import React from 'react';
import { Volume2, MapPin, Eye } from 'lucide-react';

// Hotspot schematic coordinates mapped to a 800x600 SVG canvas representing central Chennai
const DEFAULT_HOTSPOTS = [
  { id: 'anna-nagar', name: 'Anna Nagar', x: 260, y: 190, decibel: 82, category: 'High' },
  { id: 'kilpauk', name: 'Kilpauk', x: 420, y: 170, decibel: 74, category: 'High' },
  { id: 'nungambakkam', name: 'Nungambakkam', x: 390, y: 310, decibel: 71, category: 'High' },
  { id: 't-nagar', name: 'T. Nagar', x: 330, y: 440, decibel: 78, category: 'High' },
  { id: 'adyar', name: 'Adyar', x: 520, y: 450, decibel: 59, category: 'Moderate' },
  { id: 'velachery', name: 'Velachery', x: 360, y: 530, decibel: 68, category: 'Moderate' },
  { id: 'besant-nagar', name: 'Besant Nagar', x: 570, y: 510, decibel: 52, category: 'Low' },
];

export default function UrbanNoiseMapCanvas({
  hotspots = [],
  selectedHotspotId = 'anna-nagar',
  onSelectHotspot = () => {},
  isMini = false,
  filterLevel = 'all',
  interactivePicker = false,
  onMapClick = null,
  pickedCoords = null,
}) {
  // Merge live hotspots data with SVG layout coordinates
  const points = (hotspots.length > 0 ? hotspots : DEFAULT_HOTSPOTS).map((h) => {
    const fallback = DEFAULT_HOTSPOTS.find(
      (d) => d.id === h.zoneId || d.name.toLowerCase() === h.name.toLowerCase()
    ) || { x: 350, y: 300 };

    return {
      ...h,
      id: h._id || h.zoneId || h.id,
      x: fallback.x,
      y: fallback.y,
    };
  });

  const filteredPoints = points.filter((p) => {
    if (filterLevel === 'all') return true;
    if (filterLevel === 'low') return p.decibel < 55;
    if (filterLevel === 'moderate') return p.decibel >= 55 && p.decibel <= 70;
    if (filterLevel === 'high') return p.decibel > 70;
    return true;
  });

  const getColor = (db) => {
    if (db >= 75) return { fill: '#EF4444', ring: 'rgba(239, 68, 68, 0.25)', border: '#B91C1C' };
    if (db >= 65) return { fill: '#F59E0B', ring: 'rgba(245, 158, 11, 0.25)', border: '#D97706' };
    return { fill: '#10B981', ring: 'rgba(16, 185, 129, 0.25)', border: '#059669' };
  };

  const handleCanvasClick = (e) => {
    if (interactivePicker && onMapClick) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 800;
      const y = ((e.clientY - rect.top) / rect.height) * 600;
      onMapClick({ x: Math.round(x), y: Math.round(y) });
    }
  };

  return (
    <div
      onClick={handleCanvasClick}
      className={`relative w-full overflow-hidden rounded-xl bg-[#E8EEF3] border border-slate-300 shadow-inner select-none ${
        isMini ? 'h-64' : 'h-[460px] sm:h-[540px]'
      } ${interactivePicker ? 'cursor-crosshair' : 'cursor-default'}`}
    >
      {/* SVG Canvas Map */}
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full object-cover"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D1DCE5" strokeWidth="0.8" />
          </pattern>
          {/* Subtle coastline gradient */}
          <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C8DCF0" />
            <stop offset="100%" stopColor="#A8C8E6" />
          </linearGradient>
        </defs>

        {/* Map Grid */}
        <rect width="800" height="600" fill="#EBF2F7" />
        <rect width="800" height="600" fill="url(#grid)" />

        {/* Bay of Bengal / Coastline schematic right side */}
        <path
          d="M 640 0 Q 610 200 660 400 T 680 600 L 800 600 L 800 0 Z"
          fill="url(#oceanGrad)"
        />
        <text
          x="710"
          y="320"
          fill="#5B7E9F"
          fontSize="14"
          fontWeight="600"
          letterSpacing="4"
          transform="rotate(90, 710, 320)"
          textAnchor="middle"
        >
          BAY OF BENGAL
        </text>

        {/* Major Road Networks (Schematic Arterial Lines) */}
        <g stroke="#CBD7E2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Poonamallee High Road / EVR Periyar Salai */}
          <path d="M 50 160 Q 250 180 430 170 T 650 170" />
          {/* Anna Salai (Mount Road) */}
          <path d="M 220 50 L 380 280 L 520 460 L 590 590" />
          {/* Inner Ring Road */}
          <path d="M 120 400 Q 260 480 480 470 T 630 430" />
          {/* Coastal Kamarajar Salai */}
          <path d="M 640 120 Q 620 280 660 520" />
          {/* Connecting Links */}
          <path d="M 260 190 L 330 440" strokeDasharray="4 4" strokeWidth="1.5" />
          <path d="M 420 170 L 390 310" strokeDasharray="4 4" strokeWidth="1.5" />
          <path d="M 390 310 L 520 450" strokeDasharray="4 4" strokeWidth="1.5" />
        </g>

        {/* Monitoring Area Watermark / Header */}
        {!isMini && (
          <g transform="translate(30, 40)">
            <rect
              width="240"
              height="30"
              rx="6"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="1"
            />
            <circle cx="15" cy="15" r="4" fill="#0D9488" />
            <text x="28" y="19" fontSize="11" fontWeight="600" fill="#0F172A" letterSpacing="0.5">
              CHENNAI MONITORING AREA
            </text>
            <text x="200" y="19" fontSize="9" fontWeight="700" fill="#0D9488">
              TODAY
            </text>
          </g>
        )}

        {/* Hotspots Render */}
        {filteredPoints.map((pt) => {
          const isSelected = selectedHotspotId === pt.id || selectedHotspotId === pt.name;
          const colors = getColor(pt.decibel);
          const radius = pt.decibel > 75 ? 26 : pt.decibel > 65 ? 20 : 16;

          return (
            <g
              key={pt.id}
              transform={`translate(${pt.x}, ${pt.y})`}
              className="cursor-pointer transition-transform duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot(pt);
              }}
            >
              {/* Outer Pulsing Radar Ring */}
              <circle
                r={radius + 14}
                fill={colors.ring}
                className="animate-radar"
              />

              {/* Selection Halo */}
              {isSelected && (
                <circle
                  r={radius + 6}
                  fill="none"
                  stroke="#0D9488"
                  strokeWidth="3"
                  strokeDasharray="3 3"
                />
              )}

              {/* Main Hotspot Dot */}
              <circle
                r={radius}
                fill={colors.fill}
                stroke="#FFFFFF"
                strokeWidth="2.5"
                filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
              />

              {/* Decibel Label inside hotspot */}
              <text
                textAnchor="middle"
                dy="4"
                fill="#FFFFFF"
                fontSize={radius > 20 ? '11' : '9'}
                fontWeight="700"
              >
                {pt.decibel}
              </text>

              {/* Zone Name Label below */}
              <text
                textAnchor="middle"
                dy={radius + 16}
                fill="#1E293B"
                fontSize={isMini ? '10' : '12'}
                fontWeight={isSelected ? '700' : '600'}
                className="select-none"
              >
                {pt.name}
              </text>
            </g>
          );
        })}

        {/* Picked pin in picker mode */}
        {interactivePicker && pickedCoords && (
          <g transform={`translate(${pickedCoords.x}, ${pickedCoords.y})`}>
            <circle r="18" fill="rgba(13, 148, 136, 0.3)" className="animate-ping" />
            <circle r="8" fill="#0D9488" stroke="#FFFFFF" strokeWidth="2" />
            <text
              textAnchor="middle"
              dy="-14"
              fill="#0F766E"
              fontSize="11"
              fontWeight="700"
            >
              Selected Location
            </text>
          </g>
        )}
      </svg>

      {/* Floating Status & Scale Indicator */}
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Low (&lt;60dB)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Moderate (60-75dB)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span>High (&gt;75dB)</span>
        </div>
      </div>
    </div>
  );
}
