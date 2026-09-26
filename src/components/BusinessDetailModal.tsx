'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  ShieldCheck,
  Award,
  CheckCircle2,
  Calendar,
  User,
  Copy,
  Check,
  Sparkles,
  Layers,
  FileText,
  AlertTriangle,
  Lock,
  Smartphone,
  Info,
  Loader2,
  Navigation,
} from 'lucide-react';
import { BusinessRecord } from '@/types';

interface BusinessDetailModalProps {
  business: BusinessRecord | null;
  onClose: () => void;
  onVerify?: (id: string) => void;
  onEnrich?: (biz: BusinessRecord) => void;
}

export default function BusinessDetailModal({
  business: initialBusiness,
  onClose,
  onVerify,
  onEnrich,
}: BusinessDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'offerings' | 'contact' | 'provenance' | 'website_audit'>('overview');
  const [copied, setCopied] = useState(false);
  const [business, setBusiness] = useState<BusinessRecord | null>(initialBusiness);
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichSuccess, setEnrichSuccess] = useState<string | null>(null);

  useEffect(() => {
    setBusiness(initialBusiness);
    setEnrichSuccess(null);
  }, [initialBusiness]);

  if (!business) return null;

  // Clean and deduplicate address string so words like "Parbhani" are never repeated 3x
  const getCleanDisplayAddress = () => {
    const rawTokens = [
      ...(business.address || '').split(',').map((s) => s.trim()),
      business.city,
      business.state,
    ].filter(Boolean);

    const seen = new Set<string>();
    const deduped: string[] = [];

    for (const t of rawTokens) {
      const lower = t.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        deduped.push(t);
      }
    }
    return deduped.join(', ');
  };

  const handleEnrich = async () => {
    setIsEnriching(true);
    setEnrichSuccess(null);
    try {
      const res = await fetch(`/api/businesses/${business.business_id}/enrich`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.business) {
          setBusiness(data.business);
          setEnrichSuccess('Contacts & street address enriched from public databases!');
          if (onEnrich) onEnrich(data.business);
        }
      } else {
        setEnrichSuccess('No additional contacts found in public directories.');
      }
    } catch {
      setEnrichSuccess('Lookup failed. Please check internet connection.');
    } finally {
      setIsEnriching(false);
    }
  };

  const handleCopy = () => {
    const text = `
${business.business_name}
Category: ${business.business_category} (${business.business_subcategory})
Address: ${getCleanDisplayAddress()}
Phone: ${business.phone_numbers.join(', ') || 'Not Available'}
Website: ${business.website || 'Not Available'}
Confidence: ${business.data_confidence}% (${business.verification_status})
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-indigo-500/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xl font-black text-white shadow-md">
              {business.business_name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                  {business.business_category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">
                  {business.business_subcategory}
                </span>
                {business.is_mock_data && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 tracking-wider">
                    DEMO DATA
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {business.business_name}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span>{getCleanDisplayAddress()}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confidence & Status Meter Banner */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Data Confidence:</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    business.data_confidence >= 90
                      ? 'bg-emerald-500'
                      : business.data_confidence >= 70
                      ? 'bg-indigo-500'
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${business.data_confidence}%` }}
                />
              </div>
              <span className="font-bold text-white">{business.data_confidence}%</span>
              <span className="text-slate-500 font-medium">({business.confidence_level})</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">Status:</span>
            <span
              className={`inline-flex items-center gap-1 font-semibold ${
                business.verification_status === 'Verified'
                  ? 'text-emerald-400'
                  : business.verification_status === 'Partially Verified'
                  ? 'text-amber-400'
                  : 'text-slate-400'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {business.verification_status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Enrichment Button */}
            <button
              onClick={handleEnrich}
              disabled={isEnriching}
              title="Search public registries and reverse-geocode to find contact numbers and full street address"
              className="px-3 py-1 rounded-md bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isEnriching ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                  <span>Finding Contacts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Enrich Contacts & Address</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopy}
              className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Record'}
            </button>

            {business.verification_status !== 'Verified' && onVerify && (
              <button
                onClick={() => onVerify(business.business_id)}
                className="px-3 py-1 rounded-md bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Verify
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/20 text-xs font-semibold overflow-x-auto">
          {[
            { key: 'overview', label: 'Overview & Profile', icon: Info },
            { key: 'offerings', label: 'Courses & Offerings', icon: Layers },
            { key: 'contact', label: 'Contact & Location', icon: MapPin },
            { key: 'provenance', label: 'Source Provenance', icon: FileText },
            { key: 'website_audit', label: 'Website Audit', icon: Globe },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                  active
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                  {business.description || 'Not Available'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Classification</h4>
                  <div>
                    <span className="text-xs text-slate-500 block">Primary Category:</span>
                    <span className="text-sm text-white font-medium">{business.business_category}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Subcategory:</span>
                    <span className="text-sm text-white font-medium">{business.business_subcategory}</span>
                  </div>
                  {business.ai_normalized_category && (
                    <div>
                      <span className="text-xs text-indigo-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI Normalized Taxonomy:
                      </span>
                      <span className="text-sm text-slate-200 font-medium">{business.ai_normalized_category}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Establishment Info</h4>
                  <div>
                    <span className="text-xs text-slate-500 block">Established Year:</span>
                    <span className="text-sm text-white font-medium">{business.established_year || 'Not Available'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Founder / Owner:</span>
                    <span className="text-sm text-white font-medium">
                      {business.founder_name || business.owner_name || 'Not Available'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">Contact Person:</span>
                    <span className="text-sm text-white font-medium">{business.contact_person || 'Not Available'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OFFERINGS */}
          {activeTab === 'offerings' && (
            <div className="space-y-6">
              {business.courses && business.courses.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> Academic & Certification Courses
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {business.courses.map((course, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20 flex items-center justify-between text-sm text-slate-200"
                      >
                        <span className="font-medium">{course}</span>
                        <span className="text-xs text-indigo-400 font-mono">Curriculum Verified</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {business.services && business.services.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">
                    Services & Specialties
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {business.services.map((svc, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs font-medium text-emerald-300"
                      >
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {business.products && business.products.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-3">
                    Products & Menu Highlights
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {business.products.map((prod, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg bg-orange-950/30 border border-orange-500/20 text-xs font-medium text-orange-300"
                      >
                        {prod}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(!business.courses || business.courses.length === 0) &&
                (!business.services || business.services.length === 0) &&
                (!business.products || business.products.length === 0) && (
                  <div className="text-center py-8 text-slate-500 text-sm">
                    No specific course or product catalog was identified from public sources for this establishment.
                  </div>
                )}
            </div>
          )}

          {/* TAB 3: CONTACT & LOCATION */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              {/* Missing Contacts / Enrichment Banner */}
              {business.phone_numbers.length === 0 && (
                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-white">Missing Direct Phone or Street Details?</h4>
                      <p className="text-xs text-slate-300">
                        Map pins on OpenStreetMap often lack phone numbers. Run live reverse-geocoding and web directory lookup to extract contact numbers and street address.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleEnrich}
                    disabled={isEnriching}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 whitespace-nowrap shadow-lg shadow-indigo-600/30"
                  >
                    {isEnriching ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Searching Directories...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Find Contacts & Address</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {enrichSuccess && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{enrichSuccess}</span>
                </div>
              )}

              {/* Direct Contact Numbers & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-indigo-400" /> Direct Contact Numbers
                    </h4>
                    {business.phone_numbers.length === 0 && (
                      <button
                        onClick={handleEnrich}
                        disabled={isEnriching}
                        className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 underline"
                      >
                        Search Web
                      </button>
                    )}
                  </div>
                  {business.phone_numbers.length > 0 ? (
                    business.phone_numbers.map((phone, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm font-mono text-white font-medium">{phone}</span>
                        <a
                          href={`tel:${phone}`}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30"
                        >
                          Call
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="py-2">
                      <span className="text-sm text-slate-500 block">Not Available in Map Node</span>
                      <span className="text-[11px] text-slate-400 mt-1 block">Click &quot;Find Contacts &amp; Address&quot; above to scan public directories.</span>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-purple-400" /> Email Addresses
                  </h4>
                  {business.email_addresses.length > 0 ? (
                    business.email_addresses.map((email, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm font-mono text-white truncate max-w-[200px]">{email}</span>
                        <a
                          href={`mailto:${email}`}
                          className="px-2.5 py-1 text-xs font-semibold rounded bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30"
                        >
                          Email
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="py-2">
                      <span className="text-sm text-slate-500 block">Not Available</span>
                      <span className="text-[11px] text-slate-400 mt-1 block">Extracted from official website domain when verified.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Physical Street Address & Geo-Location Card */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400" /> Physical Address &amp; Location
                  </h4>
                  {(!business.postal_code || business.postal_code === 'Not Available') && business.latitude && (
                    <button
                      onClick={handleEnrich}
                      disabled={isEnriching}
                      className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 underline"
                    >
                      Lookup PIN &amp; Road
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-1">Full Street Address:</span>
                    <span className="text-sm text-white font-medium block">
                      {getCleanDisplayAddress()}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-1">Area / Locality:</span>
                    <span className="text-sm text-white font-medium block">
                      {business.area || business.city}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-1">Postal / PIN Code:</span>
                    <span className="text-sm font-mono text-indigo-300 font-semibold block">
                      {business.postal_code && business.postal_code !== 'Not Available'
                        ? business.postal_code
                        : 'Resolving via Nominatim GPS...'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-1">GPS Coordinates:</span>
                    {business.latitude && business.longitude ? (
                      <span className="text-sm font-mono text-emerald-400 font-medium block">
                        {business.latitude.toFixed(5)}, {business.longitude.toFixed(5)}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-500 block">Coordinates Not Logged</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Web & Map Portals */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Web &amp; Navigation Portals</h4>
                <div className="flex flex-wrap gap-3">
                  {business.website ? (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 hover:bg-indigo-600/30 transition-colors"
                    >
                      <Globe className="w-4 h-4" /> Open Official Website <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="px-3 py-2 rounded-lg bg-slate-800/80 text-slate-400 text-xs">
                      No Official Website Identified
                    </span>
                  )}

                  {business.latitude && business.longitude && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${business.business_name}, ${business.city}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-red-400" /> Open in Google Maps <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {business.latitude && business.longitude && (
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${business.latitude}&mlon=${business.longitude}#map=17/${business.latitude}/${business.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 hover:bg-emerald-900/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Navigation className="w-4 h-4 text-emerald-400" /> View on OpenStreetMap <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SOURCE PROVENANCE */}
          {activeTab === 'provenance' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Source-Grounded Evidence: Each individual data attribute carries its origin source URL, timestamp, and confidence score.
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="p-3">Attribute</th>
                      <th className="p-3">Discovered Value</th>
                      <th className="p-3">Source Provider</th>
                      <th className="p-3">Confidence</th>
                      <th className="p-3">Verified Date</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {Object.entries(business.field_provenance || {}).map(([key, prov]) => (
                      <tr key={key} className="hover:bg-slate-800/30">
                        <td className="p-3 font-semibold text-slate-300 capitalize">{key}</td>
                        <td className="p-3 font-mono text-slate-200 max-w-[200px] truncate">{String(prov.value)}</td>
                        <td className="p-3 text-slate-400">{prov.source}</td>
                        <td className="p-3">
                          <span
                            className={`font-bold ${
                              prov.confidence >= 90 ? 'text-emerald-400' : 'text-indigo-400'
                            }`}
                          >
                            {prov.confidence}%
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">{prov.verifiedAt}</td>
                        <td className="p-3">
                          {prov.sourceUrl ? (
                            <a
                              href={prov.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                            >
                              View Source <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-600">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: WEBSITE QUALITY AUDIT */}
          {activeTab === 'website_audit' && (
            <div className="space-y-4">
              {business.website_audit ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2.5 text-xs">
                    <h4 className="font-bold text-slate-300 uppercase tracking-wider mb-2">Technical Health Checks</h4>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                      <span className="text-slate-400 flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> HTTPS Encrypted:</span>
                      <span className={business.website_audit.hasHttps ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                        {business.website_audit.hasHttps ? 'Yes (Valid SSL)' : 'No (Insecure HTTP)'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                      <span className="text-slate-400 flex items-center gap-1.5"><Smartphone className="w-3.5 h-3.5" /> Mobile Responsive:</span>
                      <span className={business.website_audit.mobileFriendly ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                        {business.website_audit.mobileFriendly ? 'Yes (Viewport Tag)' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Content Snapshot Hash:</span>
                      <span className="font-mono text-slate-300">{business.website_audit.contentHash || 'Verified'}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2.5 text-xs">
                    <h4 className="font-bold text-slate-300 uppercase tracking-wider mb-2">Public Contact Discovery</h4>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Dedicated Contact Page:</span>
                      <span className={business.website_audit.hasContactPage ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        {business.website_audit.hasContactPage ? 'Found' : 'Not Found'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Phone Discovered on Site:</span>
                      <span className={business.website_audit.hasPhoneFound ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        {business.website_audit.hasPhoneFound ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-400">Email Discovered on Site:</span>
                      <span className={business.website_audit.hasEmailFound ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        {business.website_audit.hasEmailFound ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No official website is identified for this business to run technical audit checks.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Last verified on: {new Date(business.last_verified_at).toLocaleDateString()}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
