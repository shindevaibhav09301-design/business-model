'use client';

import React, { useState } from 'react';
import { Sparkles, Search, MapPin, ChevronDown, ArrowRight } from 'lucide-react';

interface DiscoverySearchBoxProps {
  onStartDiscovery: (city: string, category: string) => void;
  defaultCity?: string;
  isDiscovering?: boolean;
}

const POPULAR_DISTRICTS = ['Parbhani', 'Pune', 'Mumbai', 'Nashik', 'Aurangabad', 'Nagpur', 'Latur', 'Nanded'];

const DOMAINS = [
  'All Businesses',
  'Healthcare',
  'Education',
  'Classes',
  'Institutions',
  'Shops',
  'Restaurants',
  'Hotels',
  'Retail',
  'IT Services',
  'Finance',
  'Real Estate',
  'Automobile',
  'Manufacturing',
  'Professional Services',
  'Other',
];

export default function DiscoverySearchBox({
  onStartDiscovery,
  defaultCity = '',
  isDiscovering = false,
}: DiscoverySearchBoxProps) {
  const [cityInput, setCityInput] = useState(defaultCity || 'Parbhani');
  const [category, setCategory] = useState('All Businesses');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityInput.trim()) return;
    onStartDiscovery(cityInput.trim(), category);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B1220] via-[#0e1627] to-[#111a30] border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Title */}
      <div className="space-y-1 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/25 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Autonomous Entity Mining
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Where do you want to discover businesses?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Instantly harvest, verify, and geocode companies, hospitals, and coaching institutes across any district in Maharashtra.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* City / District input */}
          <div className="md:col-span-6 relative">
            <MapPin className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Enter city, district or location (e.g. Parbhani, Pune)..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
            />
          </div>

          {/* Category Selector */}
          <div className="md:col-span-3 relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-sm text-white focus:outline-none focus:border-purple-500 appearance-none transition-colors shadow-inner cursor-pointer"
            >
              {DOMAINS.map((dom) => (
                <option key={dom} value={dom}>
                  {dom}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Primary CTA */}
          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={isDiscovering || !cityInput.trim()}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isDiscovering ? 'Discovering...' : 'START DISCOVERY'}</span>
            </button>
          </div>
        </div>

        {/* Quick Picks District Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 pt-1">
          <span className="text-[11px] font-semibold text-slate-500 mr-1">Popular districts:</span>
          {POPULAR_DISTRICTS.map((dst) => (
            <button
              key={dst}
              type="button"
              onClick={() => setCityInput(dst)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                cityInput.toLowerCase() === dst.toLowerCase()
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                  : 'bg-slate-900/70 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {dst}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
