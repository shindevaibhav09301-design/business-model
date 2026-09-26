'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Compass,
  Search,
  MapPin,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  Building2,
  GraduationCap,
  Activity,
  Utensils,
  ShoppingBag,
  Briefcase,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Database,
  Globe2,
} from 'lucide-react';
import { DEFAULT_TAXONOMY } from '@/lib/data/categories';

export default function LandingPage() {
  const router = useRouter();
  const [cityName, setCityName] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Advanced settings state
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Maharashtra');
  const [maxResults, setMaxResults] = useState(50);
  const [searchDepth, setSearchDepth] = useState(2);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [includeWebsites, setIncludeWebsites] = useState(true);
  const [includeSocialProfiles, setIncludeSocialProfiles] = useState(true);
  const [includeContactInfo, setIncludeContactInfo] = useState(true);

  // Live District Suggestions
  const [districtSuggestions, setDistrictSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const popularCities = [
    'Pune',
    'Hingoli',
    'Mumbai',
    'Parbhani',
    'Chhatrapati Sambhajinagar',
    'Nagpur',
    'Nashik',
    'Kolhapur',
    'Thane',
    'Solapur',
    'Nanded',
    'Latur',
  ];

  React.useEffect(() => {
    if (cityName.trim().length >= 2) {
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/districts?q=${encodeURIComponent(cityName.trim())}&limit=6`);
          if (res.ok) {
            const data = await res.json();
            setDistrictSuggestions(data.districts || []);
            setShowSuggestions(true);
          }
        } catch (e) {
          // ignore
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setDistrictSuggestions([]);
      setShowSuggestions(false);
    }
  }, [cityName]);

  const handleStartDiscovery = async (targetCity?: string, targetState?: string) => {
    const cityToSearch = (targetCity || cityName).trim();
    if (!cityToSearch) {
      setErrorMsg('Please enter a valid Maharashtra district or city name');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);
    setShowSuggestions(false);

    try {
      const res = await fetch('/api/discovery/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: cityToSearch,
          country,
          state: targetState || state || 'Maharashtra',
          maxResults,
          searchDepth,
          categories: selectedCategories.length > 0 ? selectedCategories : undefined,
          includeWebsites,
          includeSocialProfiles,
          includeContactInfo,
        }),
      });

      const data = await res.json();
      if (res.ok && data.jobId) {
        router.push(`/discover/${data.jobId}`);
      } else {
        setErrorMsg(data.error || 'Failed to initiate discovery');
        setIsSubmitting(false);
      }
    } catch (e: any) {
      setErrorMsg('Network error while launching discovery. Please retry.');
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== id));
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Top Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse-slow">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Maharashtra Local Intelligence & Discovery Engine
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Discover Businesses, Institutes & Services Across{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Maharashtra
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Comprehensive multi-provider intelligence across all 36 Maharashtra districts. Discover hospitals, colleges, IT firms, shops, and contact details with verified confidence.
        </p>

        {/* Search Engine Input Card */}
        <div className="mt-10 max-w-3xl mx-auto">
          <div className="p-2 sm:p-3 glass-panel rounded-2xl shadow-2xl shadow-indigo-950/50 border border-indigo-500/20">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="text"
                  value={cityName}
                  onChange={(e) => {
                    setCityName(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleStartDiscovery();
                  }}
                  placeholder="Enter Maharashtra District or City (e.g. Hingoli, Parbhani, Pune, Nashik, Washim)..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-900/90 text-white placeholder-slate-500 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-700/60"
                />

                {/* Floating Autocomplete Dropdown for 36 Maharashtra Districts */}
                {showSuggestions && districtSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl bg-slate-900/95 backdrop-blur-md border border-indigo-500/30 shadow-2xl overflow-hidden text-left">
                    <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-800/60 border-b border-slate-700/50 flex items-center justify-between">
                      <span>Maharashtra Districts & Administrative Regions</span>
                      <span className="text-indigo-400 font-normal">Click to Discover</span>
                    </div>
                    <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
                      {districtSuggestions.map((dist) => (
                        <button
                          key={`${dist.city}-${dist.state}`}
                          type="button"
                          onClick={() => {
                            setCityName(dist.city);
                            setState(dist.state);
                            setShowSuggestions(false);
                            handleStartDiscovery(dist.city, dist.state);
                          }}
                          className="w-full px-4 py-2.5 hover:bg-indigo-600/20 flex items-center justify-between text-left transition-colors group"
                        >
                          <div>
                            <div className="text-sm font-semibold text-white group-hover:text-indigo-300">
                              {dist.city}
                            </div>
                            <div className="text-xs text-slate-400">
                              {dist.talukas && dist.talukas.length > 0
                                ? `${dist.talukas.slice(0, 3).join(', ')} • `
                                : ''}
                              Maharashtra
                            </div>
                          </div>
                          {dist.region && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                              {dist.region}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className={`px-4 py-4 rounded-xl border flex items-center gap-2 text-sm font-medium transition-colors ${
                    showAdvanced
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80'
                  }`}
                  title="Advanced Search Filters"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span className="hidden sm:inline">Settings</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleStartDiscovery()}
                  className="flex-1 sm:flex-initial px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-bold text-base shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-purple-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 min-w-[170px]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Start Discovery
                    </>
                  )}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-3 text-sm text-red-400 flex items-center justify-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                {errorMsg}
              </div>
            )}

            {/* Quick Popular City Chips */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-500 mr-1">Maharashtra Districts:</span>
              {popularCities.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCityName(c);
                    handleStartDiscovery(c);
                  }}
                  className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/20 hover:text-indigo-300 border border-slate-700/80 hover:border-indigo-500/40 transition-colors"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Settings Modal / Dropdown */}
          {showAdvanced && (
            <div className="mt-4 p-6 glass-panel rounded-2xl border border-indigo-500/20 text-left animate-in fade-in slide-in-from-top-2 duration-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Advanced Discovery Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">State / Province</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Max Results</label>
                  <select
                    value={maxResults}
                    onChange={(e) => setMaxResults(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value={25}>25 Businesses</option>
                    <option value={50}>50 Businesses</option>
                    <option value={100}>100 Businesses</option>
                  </select>
                </div>
              </div>

              {/* Taxonomy category selector */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-400 mb-2">Target Specific Categories (Optional)</label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_TAXONOMY.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                            : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Checkbox toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeWebsites}
                    onChange={(e) => setIncludeWebsites(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  Find & Validate Websites
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeSocialProfiles}
                    onChange={(e) => setIncludeSocialProfiles(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  Extract Social Profiles
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeContactInfo}
                    onChange={(e) => setIncludeContactInfo(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  Verify Phone & Emails
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Strict Data Principle Assurance Card */}
        <div className="mt-14 max-w-4xl mx-auto p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Strict Source Grounding & Zero Hallucination</h4>
              <p className="text-xs text-slate-400">
                Every phone, address, and course is verified with source links. Missing fields are explicitly marked{' '}
                <code className="text-amber-300 bg-slate-800 px-1 py-0.5 rounded">Not Available</code>.
              </p>
            </div>
          </div>
          <Link
            href="/businesses"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 whitespace-nowrap"
          >
            Explore Pune & Parbhani Directory <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Feature / Category Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Configurable Multi-Domain Taxonomy
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Our discovery crawler traverses educational academies, hospitals, retail shops, and companies simultaneously.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 glass-card rounded-xl transition-all">
            <div className="w-12 h-12 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Education & Institutes</h3>
            <p className="text-xs text-slate-400 mb-3">
              IT training, computer classes, competitive coaching, colleges, and vocational centers with course curriculums.
            </p>
            <span className="text-xs font-semibold text-indigo-400">15 Subcategories</span>
          </div>

          <div className="p-6 glass-card rounded-xl transition-all">
            <div className="w-12 h-12 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Healthcare & Clinics</h3>
            <p className="text-xs text-slate-400 mb-3">
              Multispeciality hospitals, diagnostic labs, pediatric centers, and dental clinics with 24/7 emergency tags.
            </p>
            <span className="text-xs font-semibold text-emerald-400">9 Subcategories</span>
          </div>

          <div className="p-6 glass-card rounded-xl transition-all">
            <div className="w-12 h-12 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center mb-4">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Food & Dining</h3>
            <p className="text-xs text-slate-400 mb-3">
              Heritage eateries, cafes, cloud kitchens, and bakeries with dine-in and takeaway options.
            </p>
            <span className="text-xs font-semibold text-orange-400">8 Subcategories</span>
          </div>

          <div className="p-6 glass-card rounded-xl transition-all">
            <div className="w-12 h-12 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Professional & IT</h3>
            <p className="text-xs text-slate-400 mb-3">
              Software product engineering, digital marketing agencies, law firms, and architectural consultancies.
            </p>
            <span className="text-xs font-semibold text-violet-400">10 Subcategories</span>
          </div>
        </div>
      </section>

      {/* Discovery Pipeline Architecture Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/60">
        <div className="p-8 glass-panel rounded-2xl border border-indigo-500/20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Enterprise Data Pipeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              How Local Intelligence Discovers A City
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-indigo-400 font-extrabold text-sm mb-1">01. Normalize</div>
              <h4 className="text-sm font-bold text-white mb-1">Location Standard</h4>
              <p className="text-xs text-slate-400">Resolves aliases (e.g. Poona → Pune) and geocoding bounds.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-indigo-400 font-extrabold text-sm mb-1">02. Multi-Query</div>
              <h4 className="text-sm font-bold text-white mb-1">Provider Search</h4>
              <p className="text-xs text-slate-400">Executes OpenStreetMap & Google Places queries across domains.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-indigo-400 font-extrabold text-sm mb-1">03. Crawl</div>
              <h4 className="text-sm font-bold text-white mb-1">Website Verification</h4>
              <p className="text-xs text-slate-400">Polite robots.txt crawler audits /about, /contact, /courses.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-indigo-400 font-extrabold text-sm mb-1">04. Deduplicate</div>
              <h4 className="text-sm font-bold text-white mb-1">Entity Resolution</h4>
              <p className="text-xs text-slate-400">Merges matching records using phone, domain & geo-distance.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-emerald-400 font-extrabold text-sm mb-1">05. Verify</div>
              <h4 className="text-sm font-bold text-white mb-1">Confidence Score</h4>
              <p className="text-xs text-slate-400">Assigns source provenance and confidence score (0-100).</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
