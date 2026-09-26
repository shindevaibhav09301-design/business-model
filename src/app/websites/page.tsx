'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Globe,
  Building2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Search,
  Eye,
  Info,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Target,
  Zap,
} from 'lucide-react';
import { BusinessRecord } from '@/types';
import BusinessDetailModal from '@/components/BusinessDetailModal';
import DiscoveryModal from '@/components/DiscoveryModal';

export default function NoWebsitePage() {
  const [businesses, setBusinesses] = useState<BusinessRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [inspectedBusiness, setInspectedBusiness] = useState<BusinessRecord | null>(null);
  const [minOpportunityScore, setMinOpportunityScore] = useState<number>(0);
  const [discoveryModalOpen, setDiscoveryModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/businesses?websiteStatus=no_website&limit=200')
      .then((res) => res.json())
      .then((data) => {
        if (data.businesses) {
          setBusinesses(data.businesses);
          setAvailableCities(data.availableCities || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Compute realistic Website Opportunity Score (0 - 100)
  const getOpportunityScore = (b: BusinessRecord) => {
    let score = 50;
    // Higher if they already have established phone contacts
    if (b.phone_numbers.length > 0) score += 20;
    // Higher if high review count or rating
    if ((b.rating ?? 0) >= 4.0) score += 15;
    if (b.review_count > 50) score += 10;
    // High-value categories (Healthcare, Education, Hotels, IT) have higher demand
    const cat = b.business_category.toLowerCase();
    if (cat.includes('health') || cat.includes('educ') || cat.includes('hotel')) {
      score += 10;
    }
    return Math.min(score, 98);
  };

  const filtered = businesses.filter((b) => {
    if (selectedCity !== 'All' && b.city !== selectedCity) return false;
    const oppScore = getOpportunityScore(b);
    if (oppScore < minOpportunityScore) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.business_name.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.business_category.toLowerCase().includes(q) ||
        b.business_subcategory.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const highPotentialLeadsCount = businesses.filter((b) => getOpportunityScore(b) >= 80).length;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-purple-950/40 border border-indigo-500/20 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/25">
                <Globe className="w-3.5 h-3.5" />
                Digital Transformation & Web Opportunity Radar
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                Businesses Without Official Websites
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                High-intent local establishments, clinics, schools, and merchants with confirmed physical operations and verified phone lines, but without a discovered official web presence.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center min-w-[140px]">
                <span className="text-3xl font-black text-cyan-400 block">{businesses.length}</span>
                <span className="text-[11px] text-slate-400 font-medium">No Website Found</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-center min-w-[140px]">
                <span className="text-3xl font-black text-purple-400 block">{highPotentialLeadsCount}</span>
                <span className="text-[11px] text-slate-400 font-medium">Potential Leads</span>
              </div>
            </div>
          </div>

          {/* CTA & Opportunity Quick Filter */}
          <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Filter by Opportunity:</span>
              <button
                type="button"
                onClick={() => setMinOpportunityScore(minOpportunityScore === 80 ? 0 : 80)}
                className={`px-3 py-1 rounded-lg font-semibold border transition-all ${
                  minOpportunityScore === 80
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                High Potential (80%+)
              </button>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={() => setDiscoveryModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] flex items-center gap-2 self-start sm:self-auto"
            >
              <Target className="w-4 h-4" />
              Find Website Opportunities
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search offline businesses by name, category, or city..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option value="All">All Cities</option>
            {availableCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Grid of Results: 3 columns */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-56 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <Globe className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No establishments match criteria</h3>
            <p className="text-xs text-slate-400">
              Try relaxing your opportunity score or clearing search filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((biz) => {
              const oppScore = getOpportunityScore(biz);
              return (
                <div
                  key={biz.business_id}
                  className="p-5 rounded-2xl bg-[#0f172a]/80 border border-slate-800/90 hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-lg shadow-black/20"
                >
                  <div className="space-y-3">
                    {/* Top Row: Category + Website Opportunity Score */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                        {biz.business_category}
                      </span>

                      {/* Opportunity Score Pill */}
                      <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-950/50 text-purple-300 border border-purple-500/30">
                        <Zap className="w-3 h-3 text-purple-400" />
                        <span>Opp: {oppScore}%</span>
                      </div>
                    </div>

                    {/* Name */}
                    <h3
                      onClick={() => setInspectedBusiness(biz)}
                      className="text-base font-bold text-white tracking-tight cursor-pointer group-hover:text-cyan-300 transition-colors line-clamp-1"
                    >
                      {biz.business_name}
                    </h3>

                    {/* Location */}
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      <span>{biz.address || biz.city}, {biz.city}</span>
                    </p>

                    {/* Contact details */}
                    <div className="space-y-1 pt-1 text-xs">
                      {biz.phone_numbers.length > 0 ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{biz.phone_numbers[0]}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">No direct phone</span>
                      )}

                      {biz.email_addresses.length > 0 && (
                        <div className="flex items-center gap-1.5 text-cyan-400 text-[11px]">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="truncate">{biz.email_addresses[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Status: <strong className="text-slate-300">{biz.verification_status}</strong>
                    </span>

                    <button
                      onClick={() => setInspectedBusiness(biz)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BusinessDetailModal
        business={inspectedBusiness}
        onClose={() => setInspectedBusiness(null)}
      />

      <DiscoveryModal
        isOpen={discoveryModalOpen}
        onClose={() => setDiscoveryModalOpen(false)}
      />
    </div>
  );
}
