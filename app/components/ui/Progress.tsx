'use client';

interface ProgressProps {
  value: number;       // 0-100
  size?: 'sm' | 'md' | 'lg';
  color?: 'brand' | 'success' | 'warning' | 'error' | 'auto';
  label?: string;
  showValue?: boolean;
  animated?: boolean;
}

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-3.5',
};

function getColor(value: number, color: ProgressProps['color']): string {
  if (color === 'auto') {
    if (value >= 80) return 'from-emerald-500 to-emerald-400';
    if (value >= 60) return 'from-amber-500 to-amber-400';
    return 'from-red-500 to-red-400';
  }
  const colorMap: Record<string, string> = {
    brand:   'from-indigo-600 to-violet-500',
    success: 'from-emerald-500 to-emerald-400',
    warning: 'from-amber-500 to-amber-400',
    error:   'from-red-500 to-red-400',
  };
  return colorMap[color ?? 'brand'];
}

export function Progress({
  value,
  size = 'md',
  color = 'brand',
  label,
  showValue = false,
  animated = true,
}: ProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const gradient = getColor(clampedValue, color);

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-xs font-medium text-[var(--text-secondary)]">{label}</span>
          )}
          {showValue && (
            <span className="text-xs font-semibold text-[var(--text-primary)]">{clampedValue}%</span>
          )}
        </div>
      )}
      <div
        className={`w-full rounded-full overflow-hidden bg-[var(--bg-hover)] ${sizeMap[size]}`}
      >
        <div
          className={`${sizeMap[size]} rounded-full bg-gradient-to-r ${gradient} ${
            animated ? 'transition-all duration-700 ease-out' : ''
          }`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}

// Circular progress
interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export function CircularProgress({
  value,
  size = 96,
  strokeWidth = 6,
  color,
  label,
  sublabel,
}: CircularProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clampedValue / 100) * circumference;

  const autoColor =
    !color
      ? clampedValue >= 80
        ? '#22c55e'
        : clampedValue >= 60
        ? '#f59e0b'
        : '#ef4444'
      : color;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--bg-hover)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={autoColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && (
          <span className="text-lg font-bold text-[var(--text-primary)] leading-tight">{label}</span>
        )}
        {sublabel && (
          <span className="text-[10px] text-[var(--text-muted)] leading-tight mt-0.5">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
