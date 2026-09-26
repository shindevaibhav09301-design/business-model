'use client';

import React from 'react';
import {
  MapPin,
  Globe,
  Phone,
  Mail,
  CheckCircle2,
  Eye,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { BusinessRecord } from '@/types';
import CircularScore from '@/components/ui/CircularScore';

interface BusinessCardProps {
  business: BusinessRecord;
  onViewDetails: (biz: BusinessRecord) => void;
  onVerify?: (id: string) => void;
}

export default function BusinessCard({ business, onViewDetails, onVerify }: BusinessCardProps) {
  const hasPhone = business.phone_numbers.length > 0;
  const hasWebsite = Boolean(business.website);
  const score = business.data_confidence || 90;

  return (
    <div className="relative p-5 rounded-2xl bg-[#0B1220] border border-slate-800/80 shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-1 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/5 flex flex-col justify-between group">
      <div className="space-y-3">
        {/* Top Badges & Score */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/25">
              {business.business_category} · {business.business_subcategory}
            </span>
            {business.is_mock_data && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                BENCHMARK
              </span>
            )}
          </div>

          {/* Verification Badge with check circle */}
          <div
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border transition-transform group-hover:scale-105 ${
              score >= 90
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                : 'bg-indigo-950/40 text-indigo-300 border-indigo-500/30'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{score}%</span>
          </div>
        </div>

        {/* Business Name */}
        <h3
          onClick={() => onViewDetails(business)}
          className="text-base sm:text-lg font-bold text-white tracking-tight cursor-pointer group-hover:text-purple-300 transition-colors line-clamp-1"
        >
          {business.business_name}
        </h3>

        {/* Location with Pin */}
        <p className="text-xs text-slate-400 flex items-center gap-1.5 line-clamp-1">
          <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
          <span>{business.address || business.city}, {business.city}</span>
        </p>

        {/* Short Description */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {business.description || 'Verified commercial entity operating in local market district.'}
        </p>

        {/* Offerings Pills (Courses or Specialties or Services) */}
        {business.courses && business.courses.length > 0 ? (
          <div className="flex flex-wrap gap-1 pt-1">
            {business.courses.slice(0, 3).map((c, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-950/40 text-purple-300 border border-purple-800/40"
              >
                {c}
              </span>
            ))}
            {business.courses.length > 3 && (
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-slate-500">
                +{business.courses.length - 3} more
              </span>
            )}
          </div>
        ) : business.specialties && business.specialties.length > 0 ? (
          <div className="flex flex-wrap gap-1 pt-1">
            {business.specialties.slice(0, 3).map((s, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-950/40 text-indigo-300 border border-indigo-800/40"
              >
                {s}
              </span>
            ))}
          </div>
        ) : business.services && business.services.length > 0 ? (
          <div className="flex flex-wrap gap-1 pt-1">
            {business.services.slice(0, 2).map((s, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 text-slate-300 border border-slate-800"
              >
                {s}
              </span>
            ))}
          </div>
        ) : null}

        {/* Business Intelligence Signals Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-400 border-t border-slate-800/60">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Website:</span>
            {hasWebsite ? (
              <span className="text-cyan-400 font-semibold truncate">Available</span>
            ) : (
              <span className="text-amber-400 font-semibold">Offline</span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Phone:</span>
            {hasPhone ? (
              <span className="text-emerald-400 font-semibold">Available</span>
            ) : (
              <span className="text-slate-500">Unlisted</span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Quick Actions + View Details CTA */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        {/* Contact shortcuts */}
        <div className="flex items-center gap-1.5">
          {hasPhone && (
            <a
              href={`tel:${business.phone_numbers[0]}`}
              title={business.phone_numbers[0]}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          )}
          {business.email_addresses.length > 0 && (
            <a
              href={`mailto:${business.email_addresses[0]}`}
              title={business.email_addresses[0]}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          )}
          {hasWebsite && (
            <a
              href={business.website!}
              target="_blank"
              rel="noopener noreferrer"
              title={business.website!}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-slate-800 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* View Details Primary Action */}
        <button
          onClick={() => onViewDetails(business)}
          className="px-3.5 py-1.5 rounded-xl bg-purple-600/15 hover:bg-purple-600/30 text-purple-300 hover:text-white border border-purple-500/30 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-sm"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
}
