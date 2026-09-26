'use client';

import React from 'react';
import { CheckCircle2, Eye, Phone, Globe, MapPin } from 'lucide-react';
import { BusinessRecord } from '@/types';

interface BusinessTableViewProps {
  businesses: BusinessRecord[];
  onViewDetails: (biz: BusinessRecord) => void;
}

export default function BusinessTableView({ businesses, onViewDetails }: BusinessTableViewProps) {
  return (
    <div className="rounded-2xl bg-[#0B1220] border border-slate-800/80 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#080d18] text-slate-400 font-bold border-b border-slate-800 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-4">Business Name & Category</th>
              <th className="p-4">Location</th>
              <th className="p-4">Direct Contact</th>
              <th className="p-4">Website</th>
              <th className="p-4">Trust Score</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {businesses.map((biz) => {
              const hasPhone = biz.phone_numbers.length > 0;
              const hasWebsite = Boolean(biz.website);
              return (
                <tr key={biz.business_id} className="hover:bg-slate-900/50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-700/60 to-indigo-600/60 border border-purple-500/30 flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                        {biz.business_name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <span
                          onClick={() => onViewDetails(biz)}
                          className="font-bold text-white hover:text-purple-300 cursor-pointer block truncate text-sm"
                        >
                          {biz.business_name}
                        </span>
                        <span className="text-[11px] text-purple-400 font-medium">
                          {biz.business_category} · {biz.business_subcategory}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-slate-300">
                    <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                      <MapPin className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                      <span className="truncate">{biz.address || biz.city}</span>
                    </div>
                  </td>

                  <td className="p-4 text-slate-300 font-mono text-[11px]">
                    {hasPhone ? (
                      <span className="text-emerald-400 font-semibold">{biz.phone_numbers[0]}</span>
                    ) : (
                      <span className="text-slate-500 italic">Unlisted</span>
                    )}
                  </td>

                  <td className="p-4">
                    {hasWebsite ? (
                      <a
                        href={biz.website!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 truncate block max-w-[150px] font-medium"
                      >
                        {biz.website}
                      </a>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        No Website
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{biz.data_confidence}%</span>
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => onViewDetails(biz)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600/15 hover:bg-purple-600/30 text-purple-300 hover:text-white border border-purple-500/30 font-semibold text-xs transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
