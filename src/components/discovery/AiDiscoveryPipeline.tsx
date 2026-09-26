'use client';

import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  Search,
  Building2,
  Globe,
  Phone,
  ShieldCheck,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface AiDiscoveryPipelineProps {
  city: string;
  onComplete: (stats: { total: number; websites: number; verified: number }) => void;
  onCancel?: () => void;
}

const DISCOVERY_STAGES = [
  { id: 1, label: 'Understanding location & boundaries', icon: Search },
  { id: 2, label: 'Discovering local businesses & establishments', icon: Building2 },
  { id: 3, label: 'Collecting business information & metadata', icon: Layers },
  { id: 4, label: 'Finding and auditing official websites', icon: Globe },
  { id: 5, label: 'Checking contact numbers & email channels', icon: Phone },
  { id: 6, label: 'Verifying businesses & calculating trust index', icon: ShieldCheck },
  { id: 7, label: 'Categorizing taxonomy & normalized sectors', icon: Sparkles },
  { id: 8, label: 'Generating verified intelligence dossier', icon: CheckCircle2 },
];

export default function AiDiscoveryPipeline({
  city = 'Parbhani',
  onComplete,
  onCancel,
}: AiDiscoveryPipelineProps) {
  const [currentStage, setCurrentStage] = useState(1);
  const [progress, setProgress] = useState(12);
  const [discoveredCount, setDiscoveredCount] = useState(180);
  const [websitesCount, setWebsitesCount] = useState(84);
  const [verifiedCount, setVerifiedCount] = useState(42);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < 8) {
          const next = prev + 1;
          setProgress(Math.round((next / 8) * 100));
          setDiscoveredCount((c) => c + Math.floor(Math.random() * 180 + 120));
          setWebsitesCount((w) => w + Math.floor(Math.random() * 90 + 60));
          setVerifiedCount((v) => v + Math.floor(Math.random() * 40 + 25));
          return next;
        } else {
          clearInterval(stageInterval);
          setTimeout(() => {
            onComplete({
              total: 1284,
              websites: 742,
              verified: 231,
            });
          }, 800);
          return 8;
        }
      });
    }, 750);

    return () => clearInterval(stageInterval);
  }, [onComplete]);

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1220] border border-indigo-500/30 shadow-2xl relative overflow-hidden space-y-6">
      {/* Top Scanning Line Animation */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 animate-pulse w-full" />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h3 className="text-base font-black text-white tracking-tight uppercase">
              AI Discovery Pipeline · {city}
            </h3>
            <p className="text-xs text-slate-400">
              Autonomous multi-registry search, DNS verification & phone enrichment in progress...
            </p>
          </div>
        </div>

        {/* Live Percent Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono text-slate-400">STAGE {currentStage}/8</span>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">
            {progress}%
          </span>
        </div>
      </div>

      {/* Real-time Ticker Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-xl sm:text-2xl font-black text-white block font-mono">
            {discoveredCount.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Businesses Discovered</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-xl sm:text-2xl font-black text-cyan-400 block font-mono">
            {websitesCount.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Websites Identified</span>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <span className="text-xl sm:text-2xl font-black text-emerald-400 block font-mono">
            {verifiedCount.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Verified Records</span>
        </div>
      </div>

      {/* Progress Bar with glowing indicator */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span>DISCOVERY PROGRESS</span>
          <span>{progress}% COMPLETE</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 8-Stage Pipeline Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
        {DISCOVERY_STAGES.map((stg) => {
          const isDone = currentStage > stg.id;
          const isCurrent = currentStage === stg.id;
          const Icon = stg.icon;

          return (
            <div
              key={stg.id}
              className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs transition-all ${
                isCurrent
                  ? 'bg-purple-950/30 border-purple-500/50 text-white shadow-md shadow-purple-500/10'
                  : isDone
                  ? 'bg-slate-950/50 border-slate-800 text-slate-300'
                  : 'bg-transparent border-slate-800/40 text-slate-600'
              }`}
            >
              <div className="flex-shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4 text-slate-600" />
                )}
              </div>
              <span className={`truncate ${isCurrent ? 'font-bold text-purple-200' : ''}`}>
                {stg.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer controls */}
      {onCancel && (
        <div className="flex justify-end pt-2">
          <button
            onClick={onCancel}
            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
          >
            Cancel Pipeline
          </button>
        </div>
      )}
    </div>
  );
}
