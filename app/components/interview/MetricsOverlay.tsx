'use client';

import { LiveMetrics } from '@/types/interview';
import { CircularProgress } from '@/app/components/ui/Progress';
import { Eye, EyeOff, Mic, Zap, Clock } from 'lucide-react';
import { formatDuration } from '@/lib/utils';

interface MetricsOverlayProps {
  metrics: LiveMetrics;
  elapsedSeconds: number;
}

const emotionColorMap: Record<string, string> = {
  'Happy':         '#22c55e',
  'Calm / Neutral':'#60a5fa',
  'Anxious':       '#f59e0b',
  'Tense':         '#ef4444',
  'Sad':           '#8b5cf6',
  'Surprised':     '#06b6d4',
  'Disgusted':     '#f97316',
};

export function MetricsOverlay({ metrics, elapsedSeconds }: MetricsOverlayProps) {
  const emotionColor = emotionColorMap[metrics.dominantEmotion] ?? '#94a3b8';

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Confidence — main score */}
      <div className="glass-elevated rounded-2xl p-4 flex items-center gap-4">
        <CircularProgress
          value={metrics.confidenceScore}
          size={72}
          strokeWidth={5}
          label={`${metrics.confidenceScore}`}
          sublabel="CONF"
        />
        <div className="flex-1">
          <p className="text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider">Confidence</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] leading-none mt-1">
            {metrics.confidenceScore}
            <span className="text-sm text-[var(--text-muted)] font-normal">/100</span>
          </p>
          <p className="text-xs mt-1" style={{ color: emotionColor }}>
            {metrics.dominantEmotion}
          </p>
        </div>
      </div>

      {/* Eye Contact */}
      <div className="glass rounded-xl p-3 flex items-center gap-3">
        {metrics.isLookingAway ? (
          <EyeOff size={18} className="text-amber-400 shrink-0" />
        ) : (
          <Eye size={18} className="text-emerald-400 shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[var(--text-muted)]">Eye Contact</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-[var(--bg-hover)] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${metrics.eyeContactScore}%`,
                  background: metrics.isLookingAway ? '#f59e0b' : '#22c55e',
                }}
              />
            </div>
            <span className="text-xs font-semibold text-[var(--text-primary)] shrink-0">
              {metrics.eyeContactScore}%
            </span>
          </div>
          {metrics.isLookingAway && (
            <p className="text-[10px] text-amber-400 mt-0.5">Look at the camera</p>
          )}
        </div>
      </div>

      {/* Speech Clarity */}
      <div className="glass rounded-xl p-3 flex items-center gap-3">
        <Mic size={18} className="text-violet-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[var(--text-muted)]">Speech Clarity</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-1.5 bg-[var(--bg-hover)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-700"
                style={{ width: `${metrics.speechClarity}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-[var(--text-primary)] shrink-0">
              {metrics.speechClarity}%
            </span>
          </div>
        </div>
      </div>

      {/* WPM + Fillers */}
      <div className="grid grid-cols-2 gap-2">
        <div className="glass rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap size={13} className="text-cyan-400" />
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">WPM</p>
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)]">{metrics.wpm}</p>
          <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
            {metrics.wpm < 100 ? 'Too slow' : metrics.wpm > 180 ? 'Too fast' : 'Optimal'}
          </p>
        </div>

        <div className="glass rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock size={13} className="text-amber-400" />
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Timer</p>
          </div>
          <p className="text-xl font-bold text-[var(--text-primary)]">{formatDuration(elapsedSeconds)}</p>
          <p className="text-[10px] text-amber-400 mt-0.5">
            {metrics.fillerCount > 0 ? `${metrics.fillerCount} fillers` : 'No fillers'}
          </p>
        </div>
      </div>
    </div>
  );
}
