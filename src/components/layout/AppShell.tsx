'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Building2,
  GraduationCap,
  MapPin,
  Globe,
  Briefcase,
  Layers,
  BarChart3,
  FileText,
  Bookmark,
  FolderKanban,
  History,
  ShieldCheck,
  Users,
  Database,
  Key,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  Command,
  Check,
  User,
  ExternalLink,
} from 'lucide-react';
import CommandPalette from './CommandPalette';
import NotificationPanel from './NotificationPanel';
import DiscoveryModal from '@/components/DiscoveryModal';
import ExportModal from '@/components/ExportModal';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [discoveryModalOpen, setDiscoveryModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme === 'light') {
      setIsLightMode(true);
      document.documentElement.classList.add('light-theme');
    }
  }, []);

  const toggleTheme = () => {
    if (isLightMode) {
      setIsLightMode(false);
      localStorage.setItem('theme-preference', 'dark');
      document.documentElement.classList.remove('light-theme');
    } else {
      setIsLightMode(true);
      localStorage.setItem('theme-preference', 'light');
      document.documentElement.classList.add('light-theme');
    }
  };

  // Keyboard shortcut listener for Cmd+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Compute active breadcrumb title
  const getBreadcrumbTitle = () => {
    if (pathname === '/') return 'Overview & Discovery';
    if (pathname.startsWith('/businesses')) return 'Businesses Intelligence';
    if (pathname.startsWith('/institutes')) return 'Institutes Hub';
    if (pathname.startsWith('/map')) return 'Geospatial Map Intelligence';
    if (pathname.startsWith('/websites')) return 'Website Opportunities';
    if (pathname.startsWith('/leads')) return 'Lead Management (CRM)';
    if (pathname.startsWith('/jobs')) return 'Jobs & Pipeline Monitor';
    if (pathname.startsWith('/analytics')) return 'Analytics & Growth';
    if (pathname.startsWith('/reports')) return 'Executive Intelligence Reports';
    if (pathname.startsWith('/export')) return 'Data Export Engine';
    if (pathname.startsWith('/admin')) return 'Admin & System Governance';
    return 'Directory';
  };

  const navSections = [
    {
      title: 'PLATFORM',
      items: [
        { label: 'Overview', href: '/', icon: Compass },
        { label: 'Businesses', href: '/businesses', icon: Building2 },
        { label: 'Institutes', href: '/institutes', icon: GraduationCap },
        { label: 'Map Intelligence', href: '/map', icon: MapPin },
        { label: 'No Website', href: '/websites', icon: Globe },
        { label: 'Leads', href: '/leads', icon: Briefcase, badge: 'New' },
        { label: 'Jobs', href: '/jobs', icon: Layers },
        { label: 'Analytics', href: '/analytics', icon: BarChart3 },
        { label: 'Reports', href: '/reports', icon: FileText },
      ],
    },
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Saved Searches', href: '/businesses?saved=true', icon: Bookmark },
        { label: 'Collections', href: '/leads?view=collections', icon: FolderKanban },
        { label: 'Recent Discoveries', href: '/jobs?view=recent', icon: History },
      ],
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { label: 'Admin Panel', href: '/admin', icon: ShieldCheck },
        { label: 'Data Sources', href: '/admin?tab=sources', icon: Database },
        { label: 'API Keys', href: '/admin?tab=api_settings', icon: Key },
        { label: 'Settings', href: '/admin?tab=settings', icon: Settings },
      ],
    },
  ];

  return (
    <div
      className={`min-h-screen flex ${
        isLightMode ? 'bg-slate-50 text-slate-900' : 'bg-[#050816] text-slate-100'
      }`}
    >
      {/* ======================================================== */}
      {/* 5. SIDEBAR (Collapsible: 250px -> 72px)                 */}
      {/* ======================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r transition-all duration-300 ease-in-out ${
          isLightMode
            ? 'bg-white border-slate-200'
            : 'bg-[#0B1220] border-slate-800/80 shadow-2xl shadow-black/40'
        } ${collapsed ? 'w-[72px]' : 'w-[250px]'}`}
      >
        {/* Sidebar Header / Brand */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/70">
          <Link href="/" className="flex items-center gap-3 group overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-600/30 flex-shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col leading-none truncate">
                <span className="text-xs font-black tracking-wider text-white uppercase group-hover:text-purple-300 transition-colors">
                  Local Intelligence
                </span>
                <span className="text-[9px] font-bold text-purple-400 tracking-widest uppercase mt-0.5">
                  FINDER SAAS
                </span>
              </div>
            )}
          </Link>

          {/* Collapse Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors hidden lg:flex"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  {sec.title}
                </div>
              )}
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href) && !item.href.includes('?'));

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer: User Profile & Status */}
        <div className="p-3 border-t border-slate-800/70 bg-[#080d18]/70">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-700 to-indigo-600 flex items-center justify-center font-bold text-white text-xs flex-shrink-0 shadow-md">
              VS
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1 leading-tight">
                <span className="text-xs font-bold text-white block truncate">
                  Dr. Vaibhav Shinde
                </span>
                <span className="text-[10px] text-purple-400 font-semibold flex items-center gap-1">
                  Enterprise Tier
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 4 & 6. MAIN CONTENT AREA + TOP HEADER                   */}
      {/* ======================================================== */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? 'lg:pl-[72px]' : 'lg:pl-[250px]'
        }`}
      >
        {/* Top Header */}
        <header
          className={`sticky top-0 z-30 h-16 border-b backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors ${
            isLightMode
              ? 'bg-white/90 border-slate-200'
              : 'bg-[#050816]/90 border-slate-800/80 shadow-md shadow-black/20'
          }`}
        >
          {/* Left: Dynamic Breadcrumb */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Local Intelligence</span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-bold tracking-tight">{getBreadcrumbTitle()}</span>
          </div>

          {/* Center: Command Palette Trigger Button (⌘K) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 transition-all shadow-inner"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span>Search businesses, institutes, cities...</span>
              </div>
              <kbd className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700/60">
                ⌘ K
              </kbd>
            </button>
          </div>

          {/* Right Action Icons & User Controls */}
          <div className="flex items-center gap-3 relative">
            {/* AI Status Indicator with animated pulse */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AI Engine Online</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800 relative transition-colors"
                title="Intelligence Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500" />
              </button>

              <NotificationPanel
                isOpen={notificationOpen}
                onClose={() => setNotificationOpen(false)}
              />
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition-colors"
              title={isLightMode ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Primary Action Button: + New Discovery */}
            <button
              onClick={() => setDiscoveryModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">New Discovery</span>
            </button>
          </div>
        </header>

        {/* Main Content Router Slot */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto">{children}</main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenDiscovery={() => setDiscoveryModalOpen(true)}
        onOpenExport={() => setExportModalOpen(true)}
      />

      {/* Global Discovery Pipeline Modal */}
      <DiscoveryModal
        isOpen={discoveryModalOpen}
        onClose={() => setDiscoveryModalOpen(false)}
      />

      {/* Global Universal Export Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  );
}
