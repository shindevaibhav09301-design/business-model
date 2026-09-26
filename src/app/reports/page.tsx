'use client';

import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  MapPin,
  Building2,
  Globe,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { ExecutiveReport } from '@/types/enterprise';

const SAMPLE_REPORTS: ExecutiveReport[] = [
  {
    id: 'rep-pbn-2026',
    title: 'Parbhani District Commercial & Educational Intelligence Briefing',
    district: 'Parbhani',
    generatedAt: 'September 2026',
    totalEntities: 101,
    verifiedRatio: 94,
    websitePenetration: 28,
    highValueLeads: 42,
    topSectors: [
      { name: 'Healthcare & Hospitals', count: 38, growth: '+14%' },
      { name: 'Education & Coaching Academies', count: 32, growth: '+22%' },
      { name: 'Retail & Essential Services', count: 21, growth: '+8%' },
      { name: 'Automobile & Transport', count: 10, growth: '+5%' },
    ],
    summary:
      'Parbhani presents a rapid growth hub for healthcare services and competitive examination academies. Over 72% of active commercial establishments currently lack confirmed official web domains, representing an immediate digital transformation opportunity valued at ₹42L+.',
  },
  {
    id: 'rep-pune-2026',
    title: 'Pune Metropolitan Technology & Institutional Ecosystem Report',
    district: 'Pune',
    generatedAt: 'September 2026',
    totalEntities: 128,
    verifiedRatio: 96,
    websitePenetration: 64,
    highValueLeads: 28,
    topSectors: [
      { name: 'IT & Software Development', count: 54, growth: '+26%' },
      { name: 'Engineering & Higher Education', count: 36, growth: '+15%' },
      { name: 'Tertiary Healthcare', count: 24, growth: '+12%' },
      { name: 'Corporate Services', count: 14, growth: '+18%' },
    ],
    summary:
      'High digital maturity observed in Hinjawadi, Viman Nagar, and Shivaji Nagar clusters. Primary opportunity lies in AI enablement, mobile responsiveness optimization, and API integration for mid-market clinics and training centers.',
  },
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ExecutiveReport>(SAMPLE_REPORTS[0]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = `
EXECUTIVE INTELLIGENCE BRIEFING: ${selectedReport.title}
District: ${selectedReport.district}
Date: ${selectedReport.generatedAt}
Total Entities: ${selectedReport.totalEntities}
Verified Ratio: ${selectedReport.verifiedRatio}%
Website Penetration: ${selectedReport.websitePenetration}%
High-Value Opportunities: ${selectedReport.highValueLeads}

EXECUTIVE SUMMARY:
${selectedReport.summary}

TOP SECTORS:
${selectedReport.topSectors.map((s) => `- ${s.name}: ${s.count} entities (${s.growth})`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `intelligence-brief-${selectedReport.district.toLowerCase()}-2026.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25 text-xs font-bold uppercase tracking-wider mb-2">
            <FileText className="w-3.5 h-3.5" />
            Executive Intelligence Briefings
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Market & District Reports
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Download and export high-level business density, verification coverage, and digital penetration reports ready for enterprise presentations and investors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print Report
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
          >
            <Download className="w-4 h-4" /> Download Briefing
          </button>
        </div>
      </div>

      {/* Select District Report Tabs */}
      <div className="flex flex-wrap gap-2">
        {SAMPLE_REPORTS.map((rep) => {
          const active = selectedReport.id === rep.id;
          return (
            <button
              key={rep.id}
              onClick={() => setSelectedReport(rep)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                active
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-[#0B1220] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {rep.district} Executive Brief
            </button>
          );
        })}
      </div>

      {/* Report Canvas */}
      <div className="p-8 rounded-3xl bg-[#0B1220] border border-slate-800 shadow-2xl space-y-8 print:bg-white print:text-black">
        {/* Report Header */}
        <div className="border-b border-slate-800 pb-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-purple-400 font-bold uppercase tracking-wider">
            <span>LOCAL INTELLIGENCE FINDER · SAAS INTELLIGENCE BRIEF</span>
            <span>{selectedReport.generatedAt}</span>
          </div>
          <h2 className="text-2xl font-black text-white">{selectedReport.title}</h2>
          <p className="text-xs text-slate-400">
            Automated intelligence report generated from active OpenStreetMap polygons, corporate registries, and live website DNS audits.
          </p>
        </div>

        {/* 4 Metric Callouts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Entities Cataloged</span>
            <span className="text-2xl font-black text-white mt-1 block font-mono">
              {selectedReport.totalEntities}
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Verification Ratio</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block font-mono">
              {selectedReport.verifiedRatio}%
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Web Penetration</span>
            <span className="text-2xl font-black text-cyan-400 mt-1 block font-mono">
              {selectedReport.websitePenetration}%
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Opportunity Leads</span>
            <span className="text-2xl font-black text-purple-400 mt-1 block font-mono">
              {selectedReport.highValueLeads}
            </span>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
            Executive Key Findings & Market Thesis
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">{selectedReport.summary}</p>
        </div>

        {/* Sectoral Breakdown */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Sectors & Growth Distribution
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedReport.topSectors.map((sec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white block">{sec.name}</span>
                  <span className="text-slate-400 text-[11px]">{sec.count} verified entities</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30">
                  {sec.growth} YoY
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
