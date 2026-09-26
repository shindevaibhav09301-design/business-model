'use client';

import React, { useEffect, useState, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Filter,
  Building2,
  GraduationCap,
  Globe,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  SlidersHorizontal,
  ChevronDown,
  Download,
  Eye,
  RefreshCw,
  Sparkles,
  Plus,
  RotateCcw,
  Check,
} from 'lucide-react';
import { BusinessRecord } from '@/types';
import BusinessDetailModal from '@/components/BusinessDetailModal';
import DiscoveryModal from '@/components/DiscoveryModal';
import ExportModal from '@/components/ExportModal';

const DOMAIN_CATEGORIES = [
  'All Categories',
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
  'Government',
  'Manufacturing',
  'Professional Services',
  'Other',
];

const TARGET_CITIES = [
  { value: 'All', label: 'All Maharashtra Districts (All Discovered)' },
  { value: 'Parbhani', label: 'Parbhani (Discovered)' },
  { value: 'Pune', label: 'Pune (Discovered)' },
  { value: 'Mumbai', label: 'Mumbai (Discovered)' },
  { value: 'Nashik', label: 'Nashik (Discovered)' },
  { value: 'Aurangabad', label: 'Aurangabad (Discovered)' },
  { value: 'Nagpur', label: 'Nagpur (Discovered)' },
  { value: 'Latur', label: 'Latur' },
  { value: 'Nanded', label: 'Nanded' },
  { value: 'Kolhapur', label: 'Kolhapur' },
  { value: 'Amravati', label: 'Amravati' },
  { value: 'Solapur', label: 'Solapur' },
  { value: 'Satara', label: 'Satara' },
  { value: 'Jalgaon', label: 'Jalgaon' },
  { value: 'Ahmednagar', label: 'Ahmednagar' },
];

const BUSINESS_TYPES = [
  { id: 'hospital', label: 'Hospital' },
  { id: 'clinic', label: 'Clinic' },
  { id: 'school', label: 'School' },
  { id: 'college', label: 'College' },
  { id: 'coaching institute', label: 'Coaching Institute' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'hotel', label: 'Hotel' },
  { id: 'shop', label: 'Shop' },
  { id: 'company', label: 'Company' },
  { id: 'service provider', label: 'Service Provider' },
];

function BusinessesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Primary Data State
  const [businesses, setBusinesses] = useState<BusinessRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [allStatsBusinesses, setAllStatsBusinesses] = useState<BusinessRecord[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessRecord | null>(null);
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Active Filter States
  const [city, setCity] = useState(searchParams.get('city') || 'All');
  const [category, setCategory] = useState(searchParams.get('category') || 'All Categories');
  const [websiteStatus, setWebsiteStatus] = useState<string>(searchParams.get('websiteStatus') || '');
  const [verificationStatus, setVerificationStatus] = useState<string>(
    searchParams.get('verificationStatus') || 'Any'
  );
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minScore, setMinScore] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeSearchInput, setActiveSearchInput] = useState(searchParams.get('q') || '');

  // Load complete dataset once for dynamic KPI cards
  useEffect(() => {
    fetch('/api/businesses?limit=1000')
      .then((res) => res.json())
      .then((data) => {
        if (data.businesses) {
          setAllStatsBusinesses(data.businesses);
        }
      })
      .catch(console.error);
  }, []);

  // Fetch filtered businesses
  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (city && city !== 'All') params.set('city', city);
      if (category && category !== 'All Categories') params.set('category', category);
      if (websiteStatus) params.set('websiteStatus', websiteStatus);
      if (verificationStatus && verificationStatus !== 'Any') {
        params.set('verificationStatus', verificationStatus);
      }
      if (selectedTypes.length > 0) {
        params.set('businessType', selectedTypes.join(','));
      }
      if (minScore > 0) {
        params.set('minScore', minScore.toString());
      }
      if (searchQuery.trim()) {
        params.set('query', searchQuery.trim());
      }
      params.set('page', page.toString());
      params.set('limit', '20');

      const res = await fetch(`/api/businesses?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setBusinesses(data.businesses || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching businesses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [city, category, websiteStatus, verificationStatus, selectedTypes, minScore, searchQuery, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(activeSearchInput);
    setPage(1);
  };

  const handleResetFilters = () => {
    setCity('All');
    setCategory('All Categories');
    setWebsiteStatus('');
    setVerificationStatus('Any');
    setSelectedTypes([]);
    setMinScore(0);
    setSearchQuery('');
    setActiveSearchInput('');
    setPage(1);
  };

  const toggleBusinessType = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((t) => t !== typeId) : [...prev, typeId]
    );
    setPage(1);
  };

  // Dynamic Statistics Calculations from the comprehensive dataset
  const stats = useMemo(() => {
    const dataset = allStatsBusinesses.length > 0 ? allStatsBusinesses : businesses;
    const totalInDir = dataset.length;
    const eduCount = dataset.filter(
      (b) =>
        b.business_category === 'Education' ||
        b.business_category === 'Classes' ||
        b.business_category === 'Institutions' ||
        (b.business_subcategory &&
          (b.business_subcategory.toLowerCase().includes('institute') ||
            b.business_subcategory.toLowerCase().includes('school') ||
            b.business_subcategory.toLowerCase().includes('college') ||
            b.business_subcategory.toLowerCase().includes('coaching')))
    ).length;
    const webVerifiedCount = dataset.filter(
      (b) => b.website_status === 'Verified' || (b.website && b.website.startsWith('http'))
    ).length;
    const fullyVerifiedCount = dataset.filter((b) => b.verification_status === 'Verified').length;

    return {
      total: totalInDir,
      institutes: eduCount,
      websites: webVerifiedCount,
      verified: fullyVerifiedCount,
    };
  }, [allStatsBusinesses, businesses]);

  // Clean deduplicated address helper
  const formatLocation = (b: BusinessRecord) => {
    if (!b.address) return b.city;
    const parts = [
      ...b.address.split(',').map((s) => s.trim()),
      b.city,
    ].filter(Boolean);
    const deduped: string[] = [];
    const seen = new Set<string>();
    for (const p of parts) {
      const lower = p.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        deduped.push(p);
      }
    }
    return deduped.join(', ');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ================================================== */}
        {/* 4. MAIN PAGE HEADER & ACTIONS                      */}
        {/* ================================================== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Local Intelligence Directory
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Browse, filter, and inspect verified businesses and educational institutes across Maharashtra districts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700/80 transition-all hover:scale-[1.02] shadow-sm"
            >
              <Download className="w-4 h-4 text-slate-400" />
              Export Results
            </button>
            <button
              type="button"
              onClick={() => setIsDiscoveryOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              New City Discovery
            </button>
          </div>
        </div>

        {/* ================================================== */}
        {/* 5. STATISTICS CARDS (Dynamically Calculated)       */}
        {/* ================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Card 1: Total In Directory */}
          <div className="p-5 rounded-2xl bg-[#0f172a]/70 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none" />
            <span className="text-xs text-slate-400 font-medium block">Total In Directory</span>
            <span className="text-3xl font-black text-white mt-1.5 block tracking-tight">
              {stats.total}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">Verified records</span>
          </div>

          {/* Card 2: Educational Institutes */}
          <div className="p-5 rounded-2xl bg-[#0f172a]/70 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden group hover:border-indigo-500/40 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-bl-full pointer-events-none" />
            <span className="text-xs text-indigo-400 font-semibold block">Educational Institutes</span>
            <span className="text-3xl font-black text-indigo-300 mt-1.5 block tracking-tight">
              {stats.institutes}
            </span>
            <span className="text-[11px] text-indigo-400/70 block mt-1">Academies & colleges</span>
          </div>

          {/* Card 3: Websites Verified */}
          <div className="p-5 rounded-2xl bg-[#0f172a]/70 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden group hover:border-cyan-500/40 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-bl-full pointer-events-none" />
            <span className="text-xs text-cyan-400 font-semibold block">Websites Verified</span>
            <span className="text-3xl font-black text-cyan-300 mt-1.5 block tracking-tight">
              {stats.websites}
            </span>
            <span className="text-[11px] text-cyan-400/70 block mt-1">Live audited domains</span>
          </div>

          {/* Card 4: Fully Verified */}
          <div className="p-5 rounded-2xl bg-[#0f172a]/70 border border-slate-800/80 backdrop-blur-sm relative overflow-hidden group hover:border-emerald-500/40 transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
            <span className="text-xs text-emerald-400 font-semibold block">Fully Verified</span>
            <span className="text-3xl font-black text-emerald-300 mt-1.5 block tracking-tight">
              {stats.verified}
            </span>
            <span className="text-[11px] text-emerald-400/70 block mt-1">High confidence score</span>
          </div>
        </div>

        {/* ================================================== */}
        {/* 6. CONTENT AREA (Two-Column Layout)                */}
        {/* ================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================================================== */}
          {/* 7. FILTER SIDEBAR (LEFT)                           */}
          {/* ================================================== */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div className="p-5 rounded-2xl bg-[#0f172a]/80 border border-slate-800/90 shadow-xl space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide">Filters</h3>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-medium text-slate-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset All
                </button>
              </div>

              {/* Target District / City */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target District / City
                </label>
                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  {TARGET_CITIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Domain Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Domain Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  {DOMAIN_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Website Availability Radio Buttons */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Website Availability
                </label>
                <div className="space-y-2 text-xs">
                  {[
                    { val: '', label: 'Any Status' },
                    { val: 'with_website', label: 'Has Official Website' },
                    { val: 'no_website', label: 'No Website Found' },
                  ].map((opt) => (
                    <label
                      key={opt.val}
                      className="flex items-center gap-2.5 cursor-pointer text-slate-300 hover:text-white transition-colors"
                    >
                      <input
                        type="radio"
                        name="websiteAvailability"
                        value={opt.val}
                        checked={websiteStatus === opt.val}
                        onChange={(e) => {
                          setWebsiteStatus(e.target.value);
                          setPage(1);
                        }}
                        className="text-purple-600 bg-slate-900 border-slate-700 focus:ring-0"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Verification Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Verification Status
                </label>
                <select
                  value={verificationStatus}
                  onChange={(e) => {
                    setVerificationStatus(e.target.value);
                    setPage(1);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="Any">Any</option>
                  <option value="Verified">Fully Verified</option>
                  <option value="Partially Verified">Partially Verified</option>
                  <option value="Unverified">Unverified</option>
                </select>
              </div>

              {/* Business Type Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Business Type
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs text-slate-300">
                  {BUSINESS_TYPES.map((bt) => {
                    const checked = selectedTypes.includes(bt.id);
                    return (
                      <label
                        key={bt.id}
                        className="flex items-center gap-2.5 cursor-pointer hover:text-white py-0.5 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleBusinessType(bt.id)}
                          className="rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-0"
                        />
                        <span>{bt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Minimum Verification Score Slider (0-100) */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label className="font-semibold text-slate-300">
                    Minimum Verification Score
                  </label>
                  <span className="font-bold text-purple-400 bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded-md text-[11px]">
                    {minScore}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={minScore}
                  onChange={(e) => {
                    setMinScore(parseInt(e.target.value, 10));
                    setPage(1);
                  }}
                  className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
                  <span>0% (All)</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Reset Filters CTA Button */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Filters
                </button>
              </div>
            </div>
          </aside>

          {/* ================================================== */}
          {/* 8 & 9. SEARCH BAR + BUSINESS RESULTS (RIGHT)       */}
          {/* ================================================== */}
          <main className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={activeSearchInput}
                  onChange={(e) => setActiveSearchInput(e.target.value)}
                  placeholder="Search by name, courses (Java, Python), medical specialty, address, phone..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#0f172a]/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </form>

            {/* Status indicator bar */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>
                Showing <strong className="text-white">{businesses.length}</strong> of{' '}
                <strong className="text-white">{total}</strong> establishments in directory
              </span>
              {(city !== 'All' || category !== 'All Categories' || searchQuery || minScore > 0) && (
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 font-medium">Active filters applied</span>
                  <button
                    onClick={handleResetFilters}
                    className="text-slate-400 hover:text-white underline text-[11px]"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Results Grid: 2 cards per row on Desktop */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className="h-56 rounded-2xl bg-[#0f172a]/50 border border-slate-800 animate-pulse p-5 space-y-4"
                  >
                    <div className="flex justify-between">
                      <div className="w-24 h-5 bg-slate-800 rounded-md" />
                      <div className="w-14 h-5 bg-slate-800 rounded-full" />
                    </div>
                    <div className="w-3/4 h-6 bg-slate-800 rounded-md" />
                    <div className="w-1/2 h-4 bg-slate-800 rounded-md" />
                    <div className="pt-4 border-t border-slate-800 flex justify-between">
                      <div className="w-20 h-4 bg-slate-800 rounded" />
                      <div className="w-24 h-7 bg-slate-800 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : businesses.length === 0 ? (
              /* Empty State */
              <div className="p-12 text-center rounded-2xl bg-[#0f172a]/70 border border-slate-800 space-y-4 shadow-xl">
                <div className="w-14 h-14 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
                  <Building2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">No businesses found</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Try changing your filters or search query, or run a live intelligence discovery sweep.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    Reset All Filters
                  </button>
                  <button
                    onClick={() => setIsDiscoveryOpen(true)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-purple-600/30 hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Discover in {city !== 'All' ? city : 'New City'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {businesses.map((biz) => {
                  const locationStr = formatLocation(biz);
                  return (
                    <div
                      key={biz.business_id}
                      className="p-5 rounded-2xl bg-[#0f172a]/80 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between group shadow-lg shadow-black/20"
                    >
                      <div className="space-y-3">
                        {/* Top badges + Verification Score Badge */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/25">
                              {biz.business_category}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/90 text-slate-300 border border-slate-700/60">
                              {biz.business_subcategory}
                            </span>
                            {biz.is_mock_data && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                DEMO
                              </span>
                            )}
                          </div>

                          {/* Verification Score Badge (95% with circular check/shield icon) */}
                          <div
                            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                              biz.data_confidence >= 90
                                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                                : biz.data_confidence >= 70
                                ? 'bg-indigo-950/40 text-indigo-300 border-indigo-500/30'
                                : 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{biz.data_confidence}%</span>
                          </div>
                        </div>

                        {/* Business Name */}
                        <h3
                          onClick={() => setSelectedBusiness(biz)}
                          className="text-lg font-bold text-white tracking-tight cursor-pointer group-hover:text-purple-300 transition-colors line-clamp-1"
                        >
                          {biz.business_name}
                        </h3>

                        {/* Location with MapPin icon */}
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 line-clamp-1">
                          <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                          <span>{locationStr}</span>
                        </p>

                        {/* Courses / Services / Specialties Tags */}
                        {biz.courses && biz.courses.length > 0 ? (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {biz.courses.slice(0, 3).map((c, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-950/60 text-indigo-300 border border-indigo-800/50"
                              >
                                {c}
                              </span>
                            ))}
                            {biz.courses.length > 3 && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">
                                +{biz.courses.length - 3} more
                              </span>
                            )}
                          </div>
                        ) : biz.specialties && biz.specialties.length > 0 ? (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {biz.specialties.slice(0, 3).map((s, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-950/50 text-purple-300 border border-purple-800/40"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        ) : biz.services && biz.services.length > 0 ? (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {biz.services.slice(0, 2).map((s, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      {/* Divider & Bottom Actions */}
                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        {/* Quick Contact Icons */}
                        <div className="flex items-center gap-1.5">
                          {biz.phone_numbers.length > 0 && (
                            <a
                              href={`tel:${biz.phone_numbers[0]}`}
                              title={biz.phone_numbers[0]}
                              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-emerald-400 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {biz.email_addresses.length > 0 && (
                            <a
                              href={`mailto:${biz.email_addresses[0]}`}
                              title={biz.email_addresses[0]}
                              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-400 transition-colors"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {biz.website ? (
                            <a
                              href={biz.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={biz.website}
                              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-indigo-400 transition-colors"
                            >
                              <Globe className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span
                              title="No website found"
                              className="p-1.5 rounded-lg bg-slate-900 text-slate-600 text-[10px]"
                            >
                              No Web
                            </span>
                          )}
                        </div>

                        {/* Bottom-right: "View Details" button with Eye icon */}
                        <button
                          type="button"
                          onClick={() => setSelectedBusiness(biz)}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-600/15 hover:bg-purple-600/30 text-purple-300 hover:text-white border border-purple-500/30 font-semibold text-xs transition-all flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-slate-800 text-xs">
                <span className="text-slate-400">
                  Page <strong className="text-white">{page}</strong> of{' '}
                  <strong className="text-white">{totalPages}</strong> ({total} Records)
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-semibold transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-semibold transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Business Details Modal */}
      {selectedBusiness && (
        <BusinessDetailModal
          business={selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
          onVerify={(id) => {
            fetch(`/api/businesses/${id}/verify`, { method: 'POST' })
              .then((r) => r.json())
              .then((d) => {
                if (d.business) setSelectedBusiness(d.business);
                fetchBusinesses();
              })
              .catch(console.error);
          }}
          onEnrich={(updated) => {
            setSelectedBusiness(updated);
            fetchBusinesses();
          }}
        />
      )}

      {/* Discovery Modal */}
      <DiscoveryModal
        isOpen={isDiscoveryOpen}
        onClose={() => {
          setIsDiscoveryOpen(false);
          fetchBusinesses();
        }}
        defaultCity={city !== 'All' ? city : 'Parbhani'}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        filteredBusinesses={businesses}
        totalDirectoryCount={stats.total}
        currentCity={city}
        currentCategory={category}
      />
    </div>
  );
}

export default function BusinessesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-8 text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
            <span className="text-sm">Loading Local Intelligence Directory...</span>
          </div>
        </div>
      }
    >
      <BusinessesContent />
    </Suspense>
  );
}
