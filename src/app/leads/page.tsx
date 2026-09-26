'use client';

import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Plus,
  Filter,
  Search,
  Sparkles,
  TrendingUp,
  Target,
  DollarSign,
  Download,
  Users,
} from 'lucide-react';
import { LeadRecord } from '@/types/enterprise';
import { leadService } from '@/services/leadService';
import LeadKanbanBoard from '@/components/leads/LeadKanbanBoard';
import StatCard from '@/components/ui/StatCard';

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Form states
  const [bizName, setBizName] = useState('');
  const [category, setCategory] = useState('Healthcare');
  const [city, setCity] = useState('Parbhani');
  const [phone, setPhone] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('₹40,000 / setup');
  const [notes, setNotes] = useState('');

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = await leadService.getLeads();
      setLeads(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizName.trim()) return;

    await leadService.createLead({
      businessId: `custom-biz-${Date.now()}`,
      businessName: bizName.trim(),
      category,
      city,
      phone: phone || '+91 94220 00000',
      websiteStatus: 'None',
      opportunityScore: 88,
      stage: 'new',
      estimatedValue,
      assignedTo: 'Dr. Vaibhav Shinde',
      notes,
    });

    setIsCreateOpen(false);
    setBizName('');
    setPhone('');
    setNotes('');
    loadLeads();
  };

  const convertedCount = leads.filter((l) => l.stage === 'converted').length;
  const activePipelines = leads.filter((l) => l.stage !== 'closed').length;

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* Top Banner & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-xs font-bold uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            Commercial CRM & Web Deal Flow
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Lead Management & Pipeline
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Track, nurture, and close website design, ERP software, and marketing opportunities discovered by the AI platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" /> Add Opportunity
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Opportunities"
          value={activePipelines}
          trend="+21.5%"
          trendUp={true}
          context="In active stages"
          icon={Target}
          accentColor="#a855f7"
          sparklineData={[12, 14, 18, 22, 25, 28, 32]}
        />
        <StatCard
          title="High-Value Offline Leads"
          value={leads.filter((l) => l.opportunityScore >= 88).length}
          trend="+14.2%"
          trendUp={true}
          context="Score ≥ 88%"
          icon={Sparkles}
          accentColor="#06b6d4"
          sparklineData={[8, 11, 15, 14, 19, 21, 24]}
        />
        <StatCard
          title="Converted Deals"
          value={convertedCount}
          trend="+33.3%"
          trendUp={true}
          context="Won contracts"
          icon={TrendingUp}
          accentColor="#10b981"
          sparklineData={[2, 3, 3, 4, 4, 5, 6]}
        />
        <StatCard
          title="Estimated Pipeline"
          value="₹2.4L"
          trend="Target: ₹5L"
          trendUp={true}
          context="Maharashtra zone"
          icon={DollarSign}
          accentColor="#6366f1"
          sparklineData={[1.1, 1.4, 1.8, 2.0, 2.2, 2.4]}
        />
      </div>

      {/* Interactive Kanban Board */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-slate-300">
            Pipeline Stages & Progression
          </span>
          <span>Click stage dropdown on any card to advance stage</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 rounded-2xl bg-[#0B1220] border border-slate-800">
            Loading opportunities Kanban board...
          </div>
        ) : (
          <LeadKanbanBoard initialLeads={leads} />
        )}
      </div>

      {/* Create Lead Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-[#0B1220] border border-slate-700/80 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Create New Lead Opportunity</h3>
            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  placeholder="e.g. Parbhani Dental Imaging Center"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Retail">Retail</option>
                    <option value="IT Services">IT Services</option>
                    <option value="Restaurants">Restaurants</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">City / District</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 2452 220000"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Estimated Value</label>
                <input
                  type="text"
                  value={estimatedValue}
                  onChange={(e) => setEstimatedValue(e.target.value)}
                  placeholder="e.g. ₹50,000 / setup"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Notes / Pitch Plan</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key discussion points, owner name, requirements..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Create Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
