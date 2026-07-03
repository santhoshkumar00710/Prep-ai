'use client';

import { TrendingUp, TrendingDown, Minus, Brain, Eye, MessageSquare, Zap, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Brain,
  Eye,
  MessageSquare,
  Zap,
};

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number;           // positive = improved
  deltaLabel?: string;
  icon: string;
  iconColor?: string;
  description?: string;
}

export function StatCard({
  label,
  value,
  unit,
  delta,
  deltaLabel,
  icon,
  iconColor = '#6366f1',
  description,
}: StatCardProps) {
  const Icon = iconMap[icon] ?? Brain;
  const hasDelta = delta !== undefined && delta !== null;
  const isPositive = hasDelta && delta > 0;
  const isNegative = hasDelta && delta < 0;

  return (
    <div className="glass-elevated rounded-2xl p-5 flex flex-col gap-3 hover:border-[var(--border-brand)] transition-all duration-200 border border-[var(--border-subtle)]">
      {/* Icon + label */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{label}</p>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: `${iconColor}18` }}
        >
          <Icon size={16} style={{ color: iconColor }} />
        </div>
      </div>

      {/* Value */}
      <div className="flex items-end gap-1">
        <span className="text-3xl font-bold text-[var(--text-primary)] leading-none">{value}</span>
        {unit && (
          <span className="text-base text-[var(--text-muted)] mb-0.5">{unit}</span>
        )}
      </div>

      {/* Delta */}
      {hasDelta && (
        <div className="flex items-center gap-1.5">
          {isPositive ? (
            <TrendingUp size={13} className="text-emerald-400" />
          ) : isNegative ? (
            <TrendingDown size={13} className="text-red-400" />
          ) : (
            <Minus size={13} className="text-[var(--text-muted)]" />
          )}
          <span
            className={`text-xs font-medium ${
              isPositive
                ? 'text-emerald-400'
                : isNegative
                ? 'text-red-400'
                : 'text-[var(--text-muted)]'
            }`}
          >
            {isPositive ? '+' : ''}
            {delta}
            {deltaLabel ?? ''}
          </span>
          <span className="text-xs text-[var(--text-muted)]">vs last session</span>
        </div>
      )}

      {description && !hasDelta && (
        <p className="text-xs text-[var(--text-muted)]">{description}</p>
      )}
    </div>
  );
}
