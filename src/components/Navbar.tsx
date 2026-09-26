'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Building2,
  GraduationCap,
  MapPin,
  Globe,
  BarChart3,
  Download,
  Settings,
  Menu,
  X,
  Sparkles,
  Layers,
  Plus,
} from 'lucide-react';
import DiscoveryModal from '@/components/DiscoveryModal';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [discoveryModalOpen, setDiscoveryModalOpen] = useState(false);

  const navItems = [
    { label: 'Discover', href: '/', icon: Compass },
    { label: 'Businesses', href: '/businesses', icon: Building2 },
    { label: 'Institutes', href: '/institutes', icon: GraduationCap },
    { label: 'Map View', href: '/map', icon: MapPin },
    { label: 'No Website', href: '/websites', icon: Globe },
    { label: 'Jobs', href: '/jobs', icon: Layers },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'Export', href: '/export', icon: Download },
    { label: 'Admin', href: '/admin', icon: Settings },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Brand: AI sparkle icon inside a purple rounded square + Text */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold tracking-tight text-white group-hover:text-purple-300 transition-colors">
                  Local Intelligence
                </span>
                <span className="text-[10px] font-black tracking-wider text-purple-400 uppercase">
                  FINDER SAAS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                // Active check: Businesses is active when on /businesses
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-purple-600/25 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side: Large purple button "+ New Discovery" */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDiscoveryModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                New Discovery
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => setDiscoveryModalOpen(true)}
                className="p-2 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center justify-center sm:hidden"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-800 bg-[#0b0f19] px-4 pt-2 pb-4 space-y-1 shadow-2xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setDiscoveryModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                + New Discovery
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Discovery Modal */}
      <DiscoveryModal
        isOpen={discoveryModalOpen}
        onClose={() => setDiscoveryModalOpen(false)}
      />
    </>
  );
}
