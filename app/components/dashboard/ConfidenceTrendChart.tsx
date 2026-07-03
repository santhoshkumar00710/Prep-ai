'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { ConfidenceTrendPoint } from '@/types/analytics';

interface ConfidenceTrendChartProps {
  data: ConfidenceTrendPoint[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-elevated rounded-xl px-3 py-2 border border-[var(--border-muted)]">
        <p className="text-xs text-[var(--text-muted)] mb-1">{label}</p>
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          {payload[0].value}
          <span className="text-[var(--text-muted)] font-normal"> / 100</span>
        </p>
      </div>
    );
  }
  return null;
}

export function ConfidenceTrendChart({ data }: ConfidenceTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-[var(--text-muted)] text-sm">
        Complete more sessions to see your trend
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
        <defs>
          <linearGradient id="confGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ fill: '#6366f1', r: 3, strokeWidth: 0 }}
          activeDot={{ fill: '#818cf8', r: 5, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
