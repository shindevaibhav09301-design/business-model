'use client';

import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  PieChart,
  Building2,
  Globe,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Layers,
  GraduationCap,
  Target,
  Calendar,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { BusinessRecord } from '@/types';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [businesses, setBusinesses] = useState<BusinessRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | '90d' | 'custom'>('30d');

  useEffect(() => {
    Promise.all([
      fetch('/api/analytics').then((r) => r.json()),
      fetch('/api/businesses?limit=1000').then((r) => r.json()),
    ])
      .then(([analyticsData, bizData]) => {
        setData(analyticsData);
        setBusinesses(bizData.businesses || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-8 text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          <span className="text-sm">Loading SaaS Analytics Dashboard...</span>
        </div>
      </div>
    );
  }

  // City breakdown
  const cityCounts: Record<string, number> = {};
  businesses.forEach((b) => {
    const c = b.city || 'Unknown';
    cityCounts[c] = (cityCounts[c] || 0) + 1;
  });
  const cityEntries = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);
  const maxCityCount = Math.max(...cityEntries.map(([, v]) => v), 1);

  // Category breakdown
  const categoryEntries = Object.entries(data.categoryCounts || {}).sort(
    (a: any, b: any) => b[1] - a[1]
  );
  const maxCategoryCount = Math.max(...categoryEntries.map(([_, v]: any) => v), 1);

  // Derived metrics
  const totalBusinesses = businesses.length || data.total || 80;
  const institutesCount = businesses.filter(
    (b) =>
      b.business_category === 'Education' ||
      b.business_category === 'Classes' ||
      b.business_category === 'Institutions'
  ).length;
  const potentialWebsiteLeads = businesses.filter((b) => !b.website).length;
  const verifiedCount = businesses.filter((b) => b.verification_status === 'Verified').length;
  const partiallyVerifiedCount = businesses.filter((b) => b.verification_status === 'Partially Verified').length;
  const unverifiedCount = totalBusinesses - verifiedCount - partiallyVerifiedCount;

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header & Date Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <BarChart3 className="w-7 h-7 text-purple-400" />
              Intelligence & Performance Analytics
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Data density, verification accuracy, and digital penetration metrics across Maharashtra districts.
            </p>
          </div>

          {/* Date Filters: Today, 7 Days, 30 Days, 90 Days, Custom */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold self-start md:self-auto">
            {[
              { id: 'today', label: 'Today' },
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '90d', label: '90 Days' },
              { id: 'custom', label: 'Custom' },
            ].map((tab) => {
              const active = dateRange === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDateRange(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    active
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Top 4 Primary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Businesses */}
          <div className="p-5 rounded-2xl bg-[#0f172a]/80 border border-slate-800/80 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold">Total Businesses</span>
              <Building2 className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-white tracking-tight">{totalBusinesses}</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1.5 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18% from last month</span>
            </div>
          </div>

          {/* Institutes Found */}
          <div className="p-5 rounded-2xl bg-[#0f172a]/80 border border-slate-800/80 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold">Institutes Found</span>
              <GraduationCap className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-black text-indigo-300 tracking-tight">{institutesCount}</div>
            <span className="text-[11px] text-indigo-400/80 block mt-1.5">
              Engineering, IT, Coaching & Colleges
            </span>
          </div>

          {/* Potential Website Leads */}
          <div className="p-5 rounded-2xl bg-[#0f172a]/80 border border-slate-800/80 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold">Potential Website Leads</span>
              <Target className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-black text-cyan-400 tracking-tight">{potentialWebsiteLeads}</div>
            <span className="text-[11px] text-slate-400 block mt-1.5">
              Active establishments without websites
            </span>
          </div>

          {/* Verification Status High */}
          <div className="p-5 rounded-2xl bg-[#0f172a]/80 border border-slate-800/80 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold">Fully Verified Ratio</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400 tracking-tight">
              {Math.round((verifiedCount / (totalBusinesses || 1)) * 100)}%
            </div>
            <span className="text-[11px] text-slate-400 block mt-1.5">
              {verifiedCount} records fully verified
            </span>
          </div>
        </div>

        {/* Detailed Breakdown Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart 1: Businesses by Category */}
          <div className="p-6 rounded-2xl bg-[#0f172a]/80 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-purple-400" />
                Businesses by Category
              </h3>
              <span className="text-xs text-slate-400">{categoryEntries.length} Domains</span>
            </div>

            <div className="space-y-3.5">
              {categoryEntries.slice(0, 7).map(([cat, count]: any) => {
                const pct = Math.round((count / maxCategoryCount) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-200">{cat}</span>
                      <span className="text-purple-300 font-mono">{count} records</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 2: Businesses by City */}
          <div className="p-6 rounded-2xl bg-[#0f172a]/80 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                Businesses by City & District
              </h3>
              <span className="text-xs text-slate-400">{cityEntries.length} Districts</span>
            </div>

            <div className="space-y-3.5">
              {cityEntries.slice(0, 7).map(([city, count]) => {
                const pct = Math.round((count / maxCityCount) * 100);
                return (
                  <div key={city} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-200">{city}</span>
                      <span className="text-cyan-300 font-mono">{count} records</span>
                    </div>
                    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart 3: Website Availability Breakdown */}
          <div className="p-6 rounded-2xl bg-[#0f172a]/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              Website Availability Breakdown
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 block">Has Official Website</span>
                <span className="text-2xl font-black text-cyan-400 mt-1 block">
                  {totalBusinesses - potentialWebsiteLeads}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {Math.round(((totalBusinesses - potentialWebsiteLeads) / (totalBusinesses || 1)) * 100)}% digital adoption
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 block">No Website Found</span>
                <span className="text-2xl font-black text-purple-400 mt-1 block">
                  {potentialWebsiteLeads}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  {Math.round((potentialWebsiteLeads / (totalBusinesses || 1)) * 100)}% agency opportunity
                </span>
              </div>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden flex">
              <div
                className="h-full bg-cyan-400 transition-all duration-500"
                style={{
                  width: `${Math.round(
                    ((totalBusinesses - potentialWebsiteLeads) / (totalBusinesses || 1)) * 100
                  )}%`,
                }}
              />
              <div
                className="h-full bg-purple-500 transition-all duration-500"
                style={{
                  width: `${Math.round(
                    (potentialWebsiteLeads / (totalBusinesses || 1)) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Chart 4: Verification Status Breakdown */}
          <div className="p-6 rounded-2xl bg-[#0f172a]/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verification Status Quality Distribution
            </h3>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-emerald-400 font-semibold block">Fully Verified</span>
                <span className="text-xl font-black text-white mt-1 block">{verifiedCount}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-amber-400 font-semibold block">Partial</span>
                <span className="text-xl font-black text-white mt-1 block">{partiallyVerifiedCount}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 font-semibold block">Unverified</span>
                <span className="text-xl font-black text-white mt-1 block">{Math.max(unverifiedCount, 0)}</span>
              </div>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden flex">
              <div
                className="h-full bg-emerald-500"
                style={{ width: `${Math.round((verifiedCount / (totalBusinesses || 1)) * 100)}%` }}
              />
              <div
                className="h-full bg-amber-500"
                style={{
                  width: `${Math.round((partiallyVerifiedCount / (totalBusinesses || 1)) * 100)}%`,
                }}
              />
              <div
                className="h-full bg-slate-700"
                style={{
                  width: `${Math.max(
                    100 -
                      Math.round((verifiedCount / (totalBusinesses || 1)) * 100) -
                      Math.round((partiallyVerifiedCount / (totalBusinesses || 1)) * 100),
                    0
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
