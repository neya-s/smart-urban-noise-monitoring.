import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Filter, Layers, Calendar, Volume2, Info, RefreshCw } from 'lucide-react';
import Header from '../components/layout/Header';
import UrbanNoiseMapCanvas from '../components/map/UrbanNoiseMapCanvas';
import HotspotDetailsCard from '../components/map/HotspotDetailsCard';
import { hotspotAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function NoiseMapPage() {
  const { setMobileOpen } = useOutletContext();
  const { showToast } = useToast();

  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  // Filters
  const [selectedZone, setSelectedZone] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [dateFilter, setDateFilter] = useState('Today');
  const [viewLayer, setViewLayer] = useState('both'); // 'both' | 'complaints' | 'prediction'

  const fetchHotspots = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedZone !== 'all') params.zone = selectedZone;
      if (filterLevel !== 'all') params.category = filterLevel === 'high' ? 'High' : filterLevel === 'moderate' ? 'Moderate' : 'Low';

      const data = await hotspotAPI.getHotspots(params);
      if (data.success && data.hotspots) {
        setHotspots(data.hotspots);

        // Default select Anna Nagar or first hotspot
        if (!selectedHotspot || selectedZone !== 'all') {
          const match = data.hotspots.find((h) => h.name.toLowerCase().includes('anna')) || data.hotspots[0];
          setSelectedHotspot(match);
        }
      }
    } catch (err) {
      console.warn('Failed to load hotspots:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotspots();
  }, [selectedZone, filterLevel]);

  const handleSelectHotspot = (pt) => {
    // Find matching full hotspot object
    const match = hotspots.find(
      (h) => h._id === pt.id || h.zoneId === pt.id || h.name.toLowerCase() === pt.name.toLowerCase()
    );
    if (match) {
      setSelectedHotspot(match);
    } else {
      setSelectedHotspot(pt);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Page Header matching Figma */}
      <Header
        eyebrow="URBAN MONITORING"
        title="Urban Noise Map"
        subtitle="Explore complaint density and predicted noise levels across the city"
        setMobileOpen={setMobileOpen}
      />

      {/* Filter Toolbar (Matching Figma PDF Page 2) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Zones Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400 font-medium">Zone:</span>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Zones</option>
              <option value="anna-nagar">Anna Nagar</option>
              <option value="t-nagar">T. Nagar</option>
              <option value="kilpauk">Kilpauk</option>
              <option value="nungambakkam">Nungambakkam</option>
              <option value="velachery">Velachery</option>
              <option value="adyar">Adyar</option>
              <option value="besant-nagar">Besant Nagar</option>
            </select>
          </div>

          {/* Noise Level Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400 font-medium">Noise Level:</span>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="high">High (&gt;70 dB)</option>
              <option value="moderate">Moderate (55-70 dB)</option>
              <option value="low">Low (&lt;55 dB)</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="Today">Today</option>
              <option value="7days">Past 7 Days</option>
              <option value="30days">Past 30 Days</option>
            </select>
          </div>

          {/* Layer View Toggle */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={viewLayer}
              onChange={(e) => setViewLayer(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="both">Complaints + Prediction</option>
              <option value="complaints">Complaints Only</option>
              <option value="prediction">Schematic Heatmap</option>
            </select>
          </div>
        </div>

        {/* Disclaimer Tag */}
        <div className="text-[11px] text-slate-400 italic">
          * Decibel readings are illustrative demo simulations.
        </div>
      </div>

      {/* Main Grid: Interactive Map + Selected Hotspot Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left / Center Map Canvas (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <UrbanNoiseMapCanvas
            hotspots={hotspots}
            selectedHotspotId={selectedHotspot?.zoneId || selectedHotspot?.name || 'anna-nagar'}
            onSelectHotspot={handleSelectHotspot}
            filterLevel={filterLevel}
          />
        </div>

        {/* Right Details Panel (4 Cols) */}
        <div className="lg:col-span-4">
          <HotspotDetailsCard hotspot={selectedHotspot} />
        </div>
      </div>
    </div>
  );
}
