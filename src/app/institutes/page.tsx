'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  Search,
  MapPin,
  Phone,
  Globe,
  CheckCircle2,
  Eye,
  Users,
  Award,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { BusinessRecord } from '@/types';
import BusinessDetailModal from '@/components/BusinessDetailModal';

const INSTITUTE_CATEGORIES = [
  'All Institutes',
  'IT Training',
  'Coaching',
  'Engineering',
  'College',
  'School',
  'Competitive Exams',
  'Skill Development',
  'Vocational Training',
];

export default function InstitutesPage() {
  const [institutes, setInstitutes] = useState<BusinessRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState('All Institutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [inspectedInstitute, setInspectedInstitute] = useState<BusinessRecord | null>(null);

  useEffect(() => {
    fetch('/api/businesses?category=Education&limit=200')
      .then((res) => res.json())
      .then((data) => {
        if (data.businesses) {
          setInstitutes(data.businesses);
          setAvailableCities(data.availableCities || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = institutes.filter((inst) => {
    if (selectedCity !== 'All' && inst.city !== selectedCity) return false;

    if (selectedSubcategory !== 'All Institutes') {
      const sub = (inst.business_subcategory || '').toLowerCase();
      const norm = (inst.ai_normalized_category || '').toLowerCase();
      const cat = selectedSubcategory.toLowerCase();

      if (cat === 'it training' && !(sub.includes('it') || sub.includes('computer') || sub.includes('coding') || sub.includes('software'))) {
        return false;
      }
      if (cat === 'coaching' && !(sub.includes('coaching') || sub.includes('academy') || sub.includes('classes') || sub.includes('tuition'))) {
        return false;
      }
      if (cat === 'engineering' && !(sub.includes('engineering') || norm.includes('engineering') || inst.business_name.toLowerCase().includes('engineering'))) {
        return false;
      }
      if (cat === 'college' && !(sub.includes('college') || norm.includes('college') || inst.business_name.toLowerCase().includes('college'))) {
        return false;
      }
      if (cat === 'school' && !(sub.includes('school') || norm.includes('school') || inst.business_name.toLowerCase().includes('school'))) {
        return false;
      }
      if (cat === 'competitive exams' && !(sub.includes('exam') || sub.includes('mpsc') || sub.includes('upsc') || norm.includes('exam'))) {
        return false;
      }
      if (cat === 'skill development' && !(sub.includes('skill') || sub.includes('vocational') || sub.includes('training'))) {
        return false;
      }
      if (cat === 'vocational training' && !(sub.includes('vocational') || sub.includes('technical') || sub.includes('skill'))) {
        return false;
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = inst.business_name.toLowerCase().includes(q);
      const matchesCourse = inst.courses?.some((c) => c.toLowerCase().includes(q));
      const matchesCity = inst.city.toLowerCase().includes(q);
      const matchesAddress = inst.address.toLowerCase().includes(q);
      if (!matchesName && !matchesCourse && !matchesCity && !matchesAddress) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900/60 border border-purple-500/20 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/25">
                <GraduationCap className="w-3.5 h-3.5" />
                Educational Intelligence Hub
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                Educational Institutes & Academies
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl">
                Discover verified schools, colleges, IT training bootcamps, and competitive exam coaching centers with structured course curriculums.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center min-w-[130px]">
                <span className="text-3xl font-black text-purple-400 block">{institutes.length}</span>
                <span className="text-[11px] text-slate-400 font-medium">Total Institutes</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center min-w-[130px]">
                <span className="text-3xl font-black text-emerald-400 block">
                  {institutes.filter((i) => i.verification_status === 'Verified').length}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Verified Institutes</span>
              </div>
            </div>
          </div>

          {/* Subcategory Pills */}
          <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-800/80 mt-6">
            {INSTITUTE_CATEGORIES.map((cat) => {
              const active = selectedSubcategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedSubcategory(cat)}
                  className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold transition-all ${
                    active
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 scale-[1.02]'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search institutes by name, courses (AI, Java, Python, MPSC), or location..."
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

        {/* Institutes Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-56 rounded-2xl bg-slate-900/50 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <GraduationCap className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No institutes found</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your category filter or search keywords.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((inst) => (
              <div
                key={inst.business_id}
                className="p-6 rounded-2xl bg-[#0f172a]/80 border border-slate-800/90 hover:border-purple-500/40 transition-all flex flex-col justify-between group shadow-lg shadow-black/20"
              >
                <div className="space-y-3">
                  {/* Badges & Score */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                        {inst.business_subcategory}
                      </span>
                      {inst.is_mock_data && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          DEMO
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{inst.data_confidence}% Verified</span>
                    </div>
                  </div>

                  {/* Name */}
                  <h3
                    onClick={() => setInspectedInstitute(inst)}
                    className="text-lg font-bold text-white tracking-tight cursor-pointer group-hover:text-purple-300 transition-colors"
                  >
                    {inst.business_name}
                  </h3>

                  {/* Location */}
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                    <span>{inst.address || inst.city}</span>
                  </p>

                  {/* Courses Pill List */}
                  {inst.courses && inst.courses.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-slate-400 block">
                        Offered Courses:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {inst.courses.map((c, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-950/40 text-purple-200 border border-purple-800/40"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Estimated Reach / Students info if present */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{inst.review_count ? `${inst.review_count * 5}+ enrolled` : 'Active Batches'}</span>
                    </div>
                    {inst.established_year && (
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Est. {inst.established_year}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {inst.phone_numbers.length > 0 && (
                      <a
                        href={`tel:${inst.phone_numbers[0]}`}
                        title={inst.phone_numbers[0]}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-emerald-400 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {inst.website ? (
                      <a
                        href={inst.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={inst.website}
                        className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-indigo-400 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-500 px-2 py-1 rounded bg-slate-900 border border-slate-800">
                        No Website
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setInspectedInstitute(inst)}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600/15 hover:bg-purple-600/30 text-purple-300 hover:text-white border border-purple-500/30 font-semibold text-xs transition-all flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {inspectedInstitute && (
        <BusinessDetailModal
          business={inspectedInstitute}
          onClose={() => setInspectedInstitute(null)}
        />
      )}
    </div>
  );
}
