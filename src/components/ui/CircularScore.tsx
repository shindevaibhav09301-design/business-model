import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';

interface CircularScoreProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showBreakdown?: boolean;
}

export default function CircularScore({
  score = 95,
  size = 54,
  strokeWidth = 4.5,
  showBreakdown = false,
}: CircularScoreProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 90
      ? '#10b981' // emerald
      : score >= 75
      ? '#6366f1' // indigo
      : score >= 50
      ? '#f59e0b' // amber
      : '#ef4444'; // red

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-black text-white leading-none">{score}</span>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
            SCORE
          </span>
        </div>
      </div>

      {showBreakdown && (
        <div className="text-[10px] space-y-0.5 text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>Identity & Name</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>Physical Location</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>Contact Records</span>
          </div>
        </div>
      )}
    </div>
  );
}
