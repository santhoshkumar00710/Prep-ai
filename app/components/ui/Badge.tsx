'use client';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'brand';
  size?: 'sm' | 'md';
}

const variantStyles = {
  success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  error:   'bg-red-500/15 text-red-400 border border-red-500/20',
  info:    'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20',
  neutral: 'bg-slate-500/15 text-slate-400 border border-slate-500/20',
  brand:   'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export function Badge({ label, variant = 'neutral', size = 'md' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center font-medium rounded-full',
        variantStyles[variant],
        sizeStyles[size],
      ].join(' ')}
    >
      {label}
    </span>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  const variant = score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error';
  return <Badge label={`${score}%`} variant={variant} />;
}

export function CategoryBadge({ category }: { category: 'behavioral' | 'technical' | 'situational' }) {
  const map = {
    behavioral:  { label: 'Behavioral',  variant: 'info'    as const },
    technical:   { label: 'Technical',   variant: 'brand'   as const },
    situational: { label: 'Situational', variant: 'warning' as const },
  };
  const { label, variant } = map[category];
  return <Badge label={label} variant={variant} />;
}
