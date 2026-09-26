'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Building2,
  GraduationCap,
  MapPin,
  Globe,
  Briefcase,
  BarChart3,
  FileText,
  Download,
  Settings,
  Sparkles,
  X,
  ArrowRight,
  Command,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDiscovery?: () => void;
  onOpenExport?: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  onOpenDiscovery,
  onOpenExport,
}: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open triggered by parent state or keyboard event
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    {
      label: 'Discover New District / City',
      icon: Sparkles,
      color: 'text-purple-400',
      action: () => {
        onClose();
        if (onOpenDiscovery) onOpenDiscovery();
      },
    },
    {
      label: 'Explore Businesses Directory',
      icon: Building2,
      color: 'text-indigo-400',
      action: () => {
        onClose();
        router.push('/businesses');
      },
    },
    {
      label: 'Educational Institutes Hub',
      icon: GraduationCap,
      color: 'text-purple-400',
      action: () => {
        onClose();
        router.push('/institutes');
      },
    },
    {
      label: 'Website Opportunity Radar (No Website)',
      icon: Globe,
      color: 'text-cyan-400',
      action: () => {
        onClose();
        router.push('/websites');
      },
    },
    {
      label: 'Interactive Geospatial Map Intelligence',
      icon: MapPin,
      color: 'text-rose-400',
      action: () => {
        onClose();
        router.push('/map');
      },
    },
    {
      label: 'Lead Management & Kanban Board',
      icon: Briefcase,
      color: 'text-emerald-400',
      action: () => {
        onClose();
        router.push('/leads');
      },
    },
    {
      label: 'Analytics & Growth Dashboard',
      icon: BarChart3,
      color: 'text-blue-400',
      action: () => {
        onClose();
        router.push('/analytics');
      },
    },
    {
      label: 'Executive Intelligence Reports',
      icon: FileText,
      color: 'text-amber-400',
      action: () => {
        onClose();
        router.push('/reports');
      },
    },
    {
      label: 'Export Data (CSV, Excel, JSON, PDF)',
      icon: Download,
      color: 'text-slate-300',
      action: () => {
        onClose();
        if (onOpenExport) onOpenExport();
        else router.push('/export');
      },
    },
    {
      label: 'System Governance & API Settings',
      icon: Settings,
      color: 'text-slate-400',
      action: () => {
        onClose();
        router.push('/admin');
      },
    },
  ];

  const filtered = quickActions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-[#0B1220] border border-slate-700/80 shadow-2xl shadow-black/80 overflow-hidden">
        {/* Input */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-800">
          <Search className="w-4 h-4 text-slate-400 mr-3 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, navigate, or search entities..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-800 text-slate-400">
            ESC
          </kbd>
        </div>

        {/* List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Navigation & Actions
          </div>
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No commands matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-left font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span>{item.label}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-colors" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#080d18] border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>Use</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">↑</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">↓</kbd>
            <span>to navigate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Command className="w-3 h-3 text-purple-400" />
            <span>Local Intelligence Finder</span>
          </div>
        </div>
      </div>
    </div>
  );
}
