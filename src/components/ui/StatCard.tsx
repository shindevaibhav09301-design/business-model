import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import Sparkline from './Sparkline';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  context?: string;
  icon: LucideIcon;
  accentColor?: string;
  sparklineData?: number[];
  badgeText?: string;
}

export default function StatCard({
  title,
  value,
  trend,
  trendUp = true,
  context,
  icon: Icon,
  accentColor = '#6366f1',
  sparklineData = [15, 20, 18, 25, 30, 28, 38],
  badgeText,
}: StatCardProps) {
  return (
    <div className="relative p-5 rounded-2xl bg-[#0B1220] border border-slate-800/80 shadow-lg shadow-black/20 hover:border-slate-700/80 transition-all duration-200 group overflow-hidden">
      {/* Subtle top indicator glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-70 transition-opacity group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        }}
      />

      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center border transition-transform group-hover:scale-110"
          style={{
            backgroundColor: `${accentColor}15`,
            borderColor: `${accentColor}30`,
            color: accentColor,
          }}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2 mt-1">
        <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {value}
        </span>

        {/* Sparkline mini chart */}
        {sparklineData && (
          <div className="hidden sm:block opacity-80 group-hover:opacity-100 transition-opacity">
            <Sparkline data={sparklineData} color={accentColor} width={70} height={22} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-800/60 text-xs">
        <div className="flex items-center gap-1.5">
          {trend && (
            <span
              className={`flex items-center gap-0.5 text-[11px] font-bold ${
                trendUp ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend}
            </span>
          )}
          {badgeText && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              {badgeText}
            </span>
          )}
        </div>

        {context && (
          <span className="text-[11px] text-slate-400 truncate max-w-[130px]">{context}</span>
        )}
      </div>
    </div>
  );
}
