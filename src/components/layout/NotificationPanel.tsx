'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  Sparkles,
  Globe,
  ShieldCheck,
  X,
  ExternalLink,
} from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'discovery' | 'website' | 'verification' | 'system';
  timestamp: string;
  read: boolean;
  link?: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Parbhani Discovery Finished',
    description: '1,284 establishments indexed with full geocoded coordinates and postal codes.',
    type: 'discovery',
    timestamp: '12m ago',
    read: false,
    link: '/businesses?city=Parbhani',
  },
  {
    id: 'n-2',
    title: 'Website Opportunities Identified',
    description: '231 verified establishments have no official website detected in Parbhani.',
    type: 'website',
    timestamp: '45m ago',
    read: false,
    link: '/websites',
  },
  {
    id: 'n-3',
    title: 'Autonomous Verification Sweep',
    description: '86 newly resolved healthcare & coaching records verified with >90% confidence.',
    type: 'verification',
    timestamp: '2h ago',
    read: true,
    link: '/businesses?verificationStatus=Verified',
  },
];

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS);

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl bg-[#0B1220] border border-slate-700/80 shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#080d18]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </h4>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-purple-400 hover:text-purple-300 font-semibold"
            >
              Mark Read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="p-2 max-h-80 overflow-y-auto space-y-1.5">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No active notifications.
          </div>
        ) : (
          notifications.map((n) => (
            <Link
              key={n.id}
              href={n.link || '#'}
              onClick={onClose}
              className={`block p-3 rounded-xl border text-xs transition-colors ${
                !n.read
                  ? 'bg-purple-950/20 border-purple-500/30 text-white'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 font-bold">
                  {n.type === 'discovery' && <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
                  {n.type === 'website' && <Globe className="w-3.5 h-3.5 text-cyan-400" />}
                  {n.type === 'verification' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                  <span className={!n.read ? 'text-purple-200' : 'text-slate-200'}>{n.title}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                  {n.timestamp}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{n.description}</p>
            </Link>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-2 border-t border-slate-800 bg-[#080d18] flex items-center justify-between text-[11px]">
          <span className="text-slate-500">AI Intelligence Alerts</span>
          <button onClick={clearNotifications} className="text-slate-400 hover:text-white">
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
