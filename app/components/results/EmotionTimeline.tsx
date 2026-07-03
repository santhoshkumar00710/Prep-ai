'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { EmotionTimelinePoint } from '@/types/analytics';

interface EmotionTimelineProps {
  data: EmotionTimelinePoint[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-elevated rounded-xl px-3 py-2 border border-[var(--border-muted)] text-xs">
        <p className="text-[var(--text-muted)] mb-2">{label}s</p>
        {payload.map((entry: { color: string; name: string; value: number }) => (
          <div key={entry.name} className="flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-[var(--text-secondary)] capitalize">{entry.name}:</span>
            <span className="font-semibold text-[var(--text-primary)]">{Math.round(entry.value)}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function EmotionTimeline({ data }: EmotionTimelineProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-[var(--text-muted)] text-sm">
        No emotion data recorded
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
        <defs>
          <linearGradient id="confidentGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="neutralGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="negativeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="timestamp"
          tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}s`}
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '11px', color: 'var(--text-muted)', paddingTop: '8px' }}
        />
        <Area type="monotone" dataKey="confident" stroke="#22c55e" fill="url(#confidentGrad)" strokeWidth={2} />
        <Area type="monotone" dataKey="neutral"   stroke="#6366f1" fill="url(#neutralGrad)"   strokeWidth={2} />
        <Area type="monotone" dataKey="negative"  stroke="#ef4444" fill="url(#negativeGrad)"  strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
