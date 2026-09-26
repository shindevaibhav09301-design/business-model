'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Layers,
  MapPin,
  Building2,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';
import { DiscoveryJobProgress } from '@/types';
import DiscoveryModal from '@/components/DiscoveryModal';

interface LocalJob {
  id: string;
  title: string;
  company: string;
  category: string;
  city: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  salary: string;
  experience: string;
  postedDate: string;
  skills: string[];
  contactEmail: string;
}

const SAMPLE_LOCAL_JOBS: LocalJob[] = [
  {
    id: 'job-001',
    title: 'Senior Pediatric ICU Staff Nurse',
    company: 'Ankur Hospital',
    category: 'Healthcare',
    city: 'Parbhani',
    type: 'Full-time',
    salary: '₹25,000 - ₹38,000 / month',
    experience: '1-3 Years (B.Sc / GNM)',
    postedDate: '2 days ago',
    skills: ['NICU / PICU Care', 'Patient Monitoring', 'Emergency Response', 'IV Therapy'],
    contactEmail: 'contact@ankurhospitalparbhani.com',
  },
  {
    id: 'job-002',
    title: 'AI & Python Instructor / Mentor',
    company: 'Devansh Edutech',
    category: 'Education',
    city: 'Parbhani',
    type: 'Full-time',
    salary: '₹35,000 - ₹55,000 / month',
    experience: '2+ Years Industry / Teaching',
    postedDate: '1 day ago',
    skills: ['Python', 'Machine Learning', 'Generative AI', 'Data Science', 'PyTorch'],
    contactEmail: 'admissions@devanshedutech.com',
  },
  {
    id: 'job-003',
    title: 'Laparoscopic OT Technician',
    company: 'Parbhani Multispeciality Hospital',
    category: 'Healthcare',
    city: 'Parbhani',
    type: 'Full-time',
    salary: '₹22,000 - ₹32,000 / month',
    experience: '1+ Years OT Experience',
    postedDate: '3 days ago',
    skills: ['OT Protocol', 'Sterilization', 'Laparoscopy Equipment Care', 'Anesthesia Prep'],
    contactEmail: 'info@parbhanimultispeciality.org',
  },
  {
    id: 'job-004',
    title: 'MPSC Foundation Faculty (General Studies)',
    company: 'Parbhani Academy',
    category: 'Education',
    city: 'Parbhani',
    type: 'Part-time',
    salary: '₹30,000 - ₹45,000 / month',
    experience: 'MPSC Main Exam App开发者 / 2+ Yrs',
    postedDate: '4 days ago',
    skills: ['Indian Polity', 'Maharashtra Geography', 'Current Affairs', 'Answer Writing'],
    contactEmail: 'parbhaniacademy@gmail.com',
  },
  {
    id: 'job-005',
    title: 'Registered Retail Pharmacist',
    company: 'Om Medicals',
    category: 'Retail',
    city: 'Parbhani',
    type: 'Full-time',
    salary: '₹18,000 - ₹28,000 / month',
    experience: 'B.Pharm / D.Pharm (Registered)',
    postedDate: 'Just now',
    skills: ['Dispensing', 'Inventory Software', 'Customer Care', 'Drug License Compliance'],
    contactEmail: 'ommedicals.pbn@gmail.com',
  },
  {
    id: 'job-006',
    title: 'Full-Stack Java / React Developer',
    company: 'Marathwada IT Solutions',
    category: 'IT Services',
    city: 'Pune',
    type: 'Full-time',
    salary: '₹50,000 - ₹85,000 / month',
    experience: '2-4 Years',
    postedDate: '5 days ago',
    skills: ['Java Spring Boot', 'React', 'PostgreSQL', 'RESTful APIs', 'Docker'],
    contactEmail: 'hr@marathwadaitsolutions.com',
  },
];

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState<'openings' | 'discovery_jobs'>('openings');
  const [discoveryJobs, setDiscoveryJobs] = useState<DiscoveryJobProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => {
        if (data.recentJobs) {
          setDiscoveryJobs(data.recentJobs);
        }
      })
      .catch(console.error);
  }, []);

  const filteredLocalJobs = SAMPLE_LOCAL_JOBS.filter((j) => {
    if (selectedCity !== 'All' && j.city !== selectedCity) return false;
    if (selectedCategory !== 'All' && j.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.skills.some((s) => s.toLowerCase().includes(q))
      );
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
                <Briefcase className="w-3.5 h-3.5" />
                Local Employment & Discovery Jobs Intelligence
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">
                Local Jobs & Intelligence Tasks
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl">
                Explore local career opportunities extracted from discovered institutions, hospitals, and companies, alongside autonomous background discovery jobs.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsDiscoveryOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4" /> Run Discovery Job
              </button>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-slate-800/80 mt-6 pt-2 gap-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab('openings')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'openings'
                  ? 'border-purple-500 text-purple-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Local Openings ({filteredLocalJobs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('discovery_jobs')}
              className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'discovery_jobs'
                  ? 'border-purple-500 text-purple-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Autonomous Discovery Jobs ({discoveryJobs.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: LOCAL OPENINGS */}
        {activeTab === 'openings' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by job title, company name, skills (Python, Nurse, React)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="All">All Cities</option>
                <option value="Parbhani">Parbhani</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Nashik">Nashik</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="All">All Categories</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
                <option value="IT Services">IT Services</option>
              </select>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredLocalJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-6 rounded-2xl bg-[#0f172a]/80 border border-slate-800/90 hover:border-purple-500/40 transition-all flex flex-col justify-between group shadow-lg shadow-black/20"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/25">
                        {job.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">{job.postedDate}</span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mt-1">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{job.company}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-purple-400" />
                        <span>{job.city}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-emerald-400">
                        <span>{job.salary}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] bg-slate-900 border border-slate-800 text-slate-300 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      Exp: <strong className="text-slate-200">{job.experience}</strong>
                    </span>

                    <a
                      href={`mailto:${job.contactEmail}?subject=Application for ${encodeURIComponent(job.title)}`}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      Apply via Direct Email
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: AUTONOMOUS DISCOVERY JOBS */}
        {activeTab === 'discovery_jobs' && (
          <div className="p-6 rounded-2xl bg-[#0f172a]/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Autonomous Intelligence Crawler Jobs
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pipeline runs executed across OpenStreetMap, web crawlers, and directory APIs.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Job ID</th>
                    <th className="p-4">Target City</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Discovered</th>
                    <th className="p-4">Websites Audited</th>
                    <th className="p-4">Started At</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {discoveryJobs.map((job) => (
                    <tr key={job.jobId} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-purple-400">{job.jobId}</td>
                      <td className="p-4 font-semibold text-white">{job.city}</td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            job.status === 'COMPLETED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {job.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-white">{job.discoveredCount}</td>
                      <td className="p-4 font-mono text-cyan-400">{job.websitesFoundCount}</td>
                      <td className="p-4 text-slate-400">
                        {new Date(job.startedAt).toLocaleTimeString()}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/businesses?city=${encodeURIComponent(job.city)}`}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold text-[11px] inline-flex items-center gap-1"
                        >
                          Inspect <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <DiscoveryModal
        isOpen={isDiscoveryOpen}
        onClose={() => setIsDiscoveryOpen(false)}
      />
    </div>
  );
}
