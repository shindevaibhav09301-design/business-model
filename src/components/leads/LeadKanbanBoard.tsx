'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Globe,
  Zap,
  ChevronRight,
  Plus,
  Trash2,
  Calendar,
  User,
} from 'lucide-react';
import { LeadRecord } from '@/types/enterprise';
import { leadService } from '@/services/leadService';

const STAGES: { id: LeadRecord['stage']; label: string; color: string }[] = [
  { id: 'new', label: 'New Leads', color: 'border-purple-500/40 text-purple-300' },
  { id: 'contacted', label: 'Contacted', color: 'border-blue-500/40 text-blue-300' },
  { id: 'interested', label: 'Interested', color: 'border-cyan-500/40 text-cyan-300' },
  { id: 'followup', label: 'Follow-up', color: 'border-amber-500/40 text-amber-300' },
  { id: 'converted', label: 'Converted', color: 'border-emerald-500/40 text-emerald-300' },
  { id: 'closed', label: 'Closed', color: 'border-slate-600/40 text-slate-400' },
];

interface LeadKanbanBoardProps {
  initialLeads: LeadRecord[];
}

export default function LeadKanbanBoard({ initialLeads }: LeadKanbanBoardProps) {
  const [leads, setLeads] = useState<LeadRecord[]>(initialLeads);

  const handleStageChange = async (leadId: string, nextStage: LeadRecord['stage']) => {
    const updated = await leadService.updateLeadStage(leadId, nextStage);
    if (updated) {
      setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
    }
  };

  const handleDelete = async (leadId: string) => {
    await leadService.deleteLead(leadId);
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
      {STAGES.map((stg) => {
        const columnLeads = leads.filter((l) => l.stage === stg.id);

        return (
          <div
            key={stg.id}
            className="flex flex-col rounded-2xl bg-[#0B1220] border border-slate-800/80 p-3 min-w-[240px] shadow-lg shadow-black/20"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <span className={`text-xs font-bold uppercase tracking-wider ${stg.color}`}>
                {stg.label}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-400">
                {columnLeads.length}
              </span>
            </div>

            {/* Cards List */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {columnLeads.length === 0 ? (
                <div className="p-4 text-center text-[11px] text-slate-600 rounded-xl border border-dashed border-slate-800/60">
                  No opportunities in this stage
                </div>
              ) : (
                columnLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5 group shadow-sm"
                  >
                    {/* Top Row: Opportunity Score */}
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-purple-300">{lead.category}</span>
                      <div className="flex items-center gap-1 font-bold text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20">
                        <Zap className="w-2.5 h-2.5" />
                        <span>{lead.opportunityScore}% Opp</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-xs font-bold text-white leading-snug line-clamp-1">
                      {lead.businessName}
                    </h4>

                    {/* Contact & City */}
                    <div className="space-y-1 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-purple-400 flex-shrink-0" />
                        <span className="truncate">{lead.city}</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-400 font-mono">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{lead.phone}</span>
                      </div>
                    </div>

                    {/* Estimated Value */}
                    <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[10px] text-slate-300 flex items-center justify-between">
                      <span className="text-slate-500">Value:</span>
                      <span className="font-bold text-emerald-400">{lead.estimatedValue}</span>
                    </div>

                    {/* Notes preview */}
                    {lead.notes && (
                      <p className="text-[10px] text-slate-500 line-clamp-2 italic">
                        &ldquo;{lead.notes}&rdquo;
                      </p>
                    )}

                    {/* Advance Stage Control */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <select
                        value={lead.stage}
                        onChange={(e) => handleStageChange(lead.id, e.target.value as any)}
                        className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-slate-300 focus:outline-none focus:border-purple-500 cursor-pointer"
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            Move: {s.label}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="text-slate-600 hover:text-rose-400 transition-colors p-1"
                        title="Remove Lead"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
