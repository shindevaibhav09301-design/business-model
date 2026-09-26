'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Compass,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Building2,
  Globe,
  FileCheck2,
  CopyX,
  ShieldCheck,
  ArrowRight,
  Terminal,
  MapPin,
} from 'lucide-react';
import { DiscoveryJobProgress } from '@/types';

export default function DiscoveryProgressPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<DiscoveryJobProgress | null>(null);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    // Connect to Server-Sent Events (SSE) stream
    const eventSource = new EventSource(`/api/discovery/${jobId}/progress`);

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.job) {
          setJob(payload.job);
        }
      } catch (err) {
        console.error('Error parsing SSE data:', err);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      // Fallback polling if SSE disconnects
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(`/api/discovery/${jobId}`);
          if (res.ok) {
            const data = await res.json();
            setJob(data);
          }
        } catch (e) {
          // ignore
        }
      }, 2000);
      return () => clearTimeout(timer);
    };

    return () => {
      eventSource.close();
    };
  }, [jobId]);

  const isComplete = job?.status === 'COMPLETED';
  const isFailed = job?.status === 'FAILED';

  const pipelineSteps = [
    { key: 'RESOLVING', label: 'Resolving Geographical Bounds & Aliases' },
    { key: 'SEARCHING_PROVIDERS', label: 'Querying OpenStreetMap & Business Directories' },
    { key: 'FINDING_WEBSITES', label: 'Discovering & Validating Official Domains' },
    { key: 'CRAWLING', label: 'Polite Website Crawling & Quality Checks' },
    { key: 'AI_EXTRACTING', label: 'Category-Aware AI Course & Service Extraction' },
    { key: 'DEDUPLICATING', label: 'Multi-Factor Entity Resolution & Deduplication' },
    { key: 'VERIFYING', label: 'Cryptographic Provenance & Confidence Calculation' },
  ];

  const getStepStatus = (stepKey: string, currentStep?: string, percent: number = 0) => {
    const stepOrder = ['RESOLVING', 'SEARCHING_PROVIDERS', 'FINDING_WEBSITES', 'CRAWLING', 'AI_EXTRACTING', 'DEDUPLICATING', 'VERIFYING', 'COMPLETED'];
    const currentIndex = stepOrder.indexOf(currentStep || 'RESOLVING');
    const targetIndex = stepOrder.indexOf(stepKey);

    if (isComplete || currentIndex > targetIndex) {
      return 'completed';
    }
    if (currentIndex === targetIndex) {
      return 'active';
    }
    return 'pending';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header Banner */}
      <div className="p-8 glass-panel rounded-2xl border border-indigo-500/20 mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                Job ID: {jobId}
              </div>
              {job?.region && (
                <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 text-xs font-bold border border-purple-500/30">
                  {job.region} India
                </div>
              )}
              {job?.state && (
                <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
                  {job.state}
                </div>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <MapPin className="w-7 h-7 text-indigo-400" />
              Discovering {job?.city || 'Selected City'}...
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {job?.currentStepMessage || 'Initializing discovery pipeline and provider search agents...'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {isComplete && (
              <Link
                href={`/businesses?city=${encodeURIComponent(job?.city || '')}`}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center gap-2 transform hover:scale-105"
              >
                View Results Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {isFailed && (
              <button
                onClick={() => router.push('/')}
                className="px-6 py-3.5 rounded-xl bg-red-600/20 text-red-300 border border-red-500/40 text-sm font-semibold hover:bg-red-600/30"
              >
                Restart Discovery
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="mt-8">
          <div className="flex justify-between text-xs font-semibold mb-2">
            <span className="text-slate-400">Pipeline Execution Progress</span>
            <span className="text-indigo-400">{job?.percent ?? 10}%</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500 ease-out"
              style={{ width: `${Math.max(job?.percent ?? 10, 5)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Real-time Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <div className="p-5 glass-card rounded-xl border-slate-800 text-center">
          <Building2 className="w-5 h-5 text-indigo-400 mx-auto mb-2" />
          <div className="text-2xl font-black text-white">{job?.discoveredCount ?? 0}</div>
          <div className="text-xs text-slate-400 font-medium">Businesses Found</div>
        </div>

        <div className="p-5 glass-card rounded-xl border-slate-800 text-center">
          <Globe className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
          <div className="text-2xl font-black text-white">{job?.websitesFoundCount ?? 0}</div>
          <div className="text-xs text-slate-400 font-medium">Websites Identified</div>
        </div>

        <div className="p-5 glass-card rounded-xl border-slate-800 text-center">
          <FileCheck2 className="w-5 h-5 text-purple-400 mx-auto mb-2" />
          <div className="text-2xl font-black text-white">{job?.websitesAnalyzedCount ?? 0}</div>
          <div className="text-xs text-slate-400 font-medium">Sites Crawled</div>
        </div>

        <div className="p-5 glass-card rounded-xl border-slate-800 text-center">
          <CopyX className="w-5 h-5 text-amber-400 mx-auto mb-2" />
          <div className="text-2xl font-black text-white">{job?.duplicatesRemovedCount ?? 0}</div>
          <div className="text-xs text-slate-400 font-medium">Duplicates Merged</div>
        </div>

        <div className="p-5 glass-card rounded-xl border-slate-800 text-center col-span-2 sm:col-span-1">
          <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
          <div className="text-2xl font-black text-white">{job?.verifiedCount ?? 0}</div>
          <div className="text-xs text-slate-400 font-medium">Verified Records</div>
        </div>
      </div>

      {/* Main Two Column View: Pipeline Stepper & Live Log Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pipeline Stepper */}
        <div className="p-6 glass-panel rounded-2xl border border-slate-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-6 flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-400" />
            Autonomous Discovery Pipeline
          </h3>

          <div className="space-y-4">
            {pipelineSteps.map((step, idx) => {
              const status = getStepStatus(step.key, job?.status, job?.percent);

              return (
                <div key={step.key} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {status === 'completed' && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                    {status === 'active' && (
                      <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                    )}
                    {status === 'pending' && (
                      <div className="w-5 h-5 rounded-full border border-slate-700 bg-slate-900/50 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <span
                    className={`text-sm ${
                      status === 'completed'
                        ? 'text-slate-200 font-medium'
                        : status === 'active'
                        ? 'text-indigo-300 font-bold'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Terminal Log */}
        <div className="p-6 glass-panel rounded-2xl border border-slate-800 flex flex-col h-[400px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Live Discovery Stream
            </div>
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {isConnected ? 'STREAMING' : 'CONNECTING'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-2 font-mono text-xs text-slate-300">
            {job?.logs && job.logs.length > 0 ? (
              job.logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-slate-500 select-none">[{log.timestamp}]</span>
                  <span
                    className={
                      log.type === 'success'
                        ? 'text-emerald-400'
                        : log.type === 'error'
                        ? 'text-red-400'
                        : log.type === 'warn'
                        ? 'text-amber-400'
                        : 'text-slate-300'
                    }
                  >
                    {log.message}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-slate-500 italic">Waiting for discovery agent stream...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
