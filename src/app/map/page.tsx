'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { BusinessRecord } from '@/types';
import BusinessDetailModal from '@/components/BusinessDetailModal';
import {
  MapPin,
  Filter,
  Layers,
  Search,
  CheckCircle2,
  Building2,
  Phone,
  Globe,
  Eye,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { DEFAULT_TAXONOMY } from '@/lib/data/categories';

// Dynamically import MapComponent with SSR disabled
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[620px] rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
      Loading interactive map canvas...
    </div>
  ),
});

export default function MapPage() {
  const [businesses, setBusinesses] = useState<BusinessRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [previewBusiness, setPreviewBusiness] = useState<BusinessRecord | null>(null);
  const [modalBusiness, setModalBusiness] = useState<BusinessRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/businesses?limit=300')
      .then((res) => res.json())
      .then((data) => {
        if (data.businesses) {
          setBusinesses(data.businesses);
          setAvailableCities(data.availableCities || []);
          if (data.businesses.length > 0) {
            setPreviewBusiness(data.businesses[0]);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredBusinesses = businesses.filter((b) => {
    if (selectedCity !== 'All' && b.city !== selectedCity) return false;
    if (selectedCategory !== 'All' && b.business_category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.business_name.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.business_subcategory.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <MapPin className="w-6 h-6 text-purple-400" />
              Geospatial Intelligence Map
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Interactive geographic cluster of verified establishments across Maharashtra districts.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30 font-semibold">
              {filteredBusinesses.length} Locations Mapped
            </span>
          </div>
        </div>

        {/* Two-Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT PANEL: Search, Filters & Locations List */}
          <div className="lg:col-span-4 space-y-4 flex flex-col">
            <div className="p-5 rounded-2xl bg-[#0f172a]/80 border border-slate-800 shadow-xl space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search establishments on map..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">City</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="All">All Cities</option>
                    {availableCities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="All">All Categories</option>
                    {DEFAULT_TAXONOMY.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Selected Location Preview Card */}
            {previewBusiness && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900/90 to-slate-900/90 border border-purple-500/30 shadow-lg space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {previewBusiness.business_category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{previewBusiness.data_confidence}%</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">
                    {previewBusiness.business_name}
                  </h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 line-clamp-1">
                    <MapPin className="w-3 h-3 text-purple-400 flex-shrink-0" />
                    <span>{previewBusiness.address}, {previewBusiness.city}</span>
                  </p>
                </div>

                {previewBusiness.phone_numbers.length > 0 && (
                  <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{previewBusiness.phone_numbers[0]}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-medium">Click to inspect</span>
                  <button
                    onClick={() => setModalBusiness(previewBusiness)}
                    className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" /> View Dossier
                  </button>
                </div>
              </div>
            )}

            {/* List of Locations */}
            <div className="p-3 rounded-2xl bg-[#0f172a]/60 border border-slate-800/80 flex-1 max-h-[380px] overflow-y-auto space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 px-2 block">
                Matching Establishments ({filteredBusinesses.length}):
              </span>
              {filteredBusinesses.slice(0, 40).map((b) => {
                const isSelected = previewBusiness?.business_id === b.business_id;
                return (
                  <button
                    key={b.business_id}
                    onClick={() => setPreviewBusiness(b)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500/50 text-white shadow-sm'
                        : 'bg-slate-900/60 border-slate-800/70 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="truncate">
                      <span className="font-semibold block truncate">{b.business_name}</span>
                      <span className="text-[10px] text-slate-400 block truncate">{b.city}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT PANEL: Interactive Map Canvas */}
          <div className="lg:col-span-8 min-h-[580px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <MapComponent
              businesses={filteredBusinesses}
              onSelectBusiness={(biz) => {
                setPreviewBusiness(biz);
              }}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalBusiness && (
        <BusinessDetailModal
          business={modalBusiness}
          onClose={() => setModalBusiness(null)}
        />
      )}
    </div>
  );
}
