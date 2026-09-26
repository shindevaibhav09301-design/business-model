import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Database, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white tracking-tight">Local Intelligence Finder</span>
            <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/30">
              Enterprise v1.0
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            Source-grounded business, institute, and commercial directory intelligence engine.
            Extracts publicly available records from OpenStreetMap, Google Places, and verified web portals with cryptographic provenance.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Zero-Hallucination Policy
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <ShieldCheck className="w-4 h-4" /> Robots.txt & Rate-Limit Compliant
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Database className="w-4 h-4" /> Open Provider Architecture
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Discovery Domains</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/businesses?category=Education" className="hover:text-indigo-400 transition-colors">IT & Coaching Institutes</Link></li>
            <li><Link href="/businesses?category=Healthcare" className="hover:text-indigo-400 transition-colors">Hospitals & Clinics</Link></li>
            <li><Link href="/businesses?category=Food" className="hover:text-indigo-400 transition-colors">Dining & Restaurants</Link></li>
            <li><Link href="/businesses?category=Retail" className="hover:text-indigo-400 transition-colors">Retail & Supermarkets</Link></li>
            <li><Link href="/businesses?category=Services" className="hover:text-indigo-400 transition-colors">Software & CA Firms</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Platform Tools</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/map" className="hover:text-indigo-400 transition-colors">Interactive Geospatial Map</Link></li>
            <li><Link href="/websites" className="hover:text-indigo-400 transition-colors">No-Website Opportunities</Link></li>
            <li><Link href="/analytics" className="hover:text-indigo-400 transition-colors">Market Density Analytics</Link></li>
            <li><Link href="/export" className="hover:text-indigo-400 transition-colors">CSV & JSON Exporter</Link></li>
            <li><Link href="/admin" className="hover:text-indigo-400 transition-colors">Admin & Crawler Settings</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
        <p>© 2026 Local Intelligence Finder. All publicly discoverable information is attributed with source provenance.</p>
        <p className="mt-2 sm:mt-0">Compliant with public directory crawling and open data licenses.</p>
      </div>
    </footer>
  );
}
