'use client';

import { Interview } from '@/types/interview';
import { CircularProgress, Progress } from '@/app/components/ui/Progress';
import { Eye, Mic, Smile, Zap, MessageSquare } from 'lucide-react';

interface MetricsSummaryProps {
  interview: Interview;
}

export function MetricsSummary({ interview }: MetricsSummaryProps) {
  const metrics = [
    {
      label: 'Overall Confidence',
      value: interview.confidence_score,
      icon: Smile,
      color: '#6366f1',
    },
    {
      label: 'Eye Contact',
      value: interview.eye_contact_score,
      icon: Eye,
      color: '#06b6d4',
    },
    {
      label: 'Speech Clarity',
      value: interview.speech_clarity ?? 0,
      icon: Mic,
      color: '#8b5cf6',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Circular rings row */}
      <div className="flex justify-around flex-wrap gap-6">
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <div className="relative">
              <CircularProgress
                value={value}
                size={100}
                strokeWidth={7}
                color={color}
                label={`${value}`}
                sublabel="/ 100"
              />
              <div
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background: `${color}20` }}
              >
                <Icon size={14} style={{ color }} />
              </div>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-medium text-center">{label}</p>
          </div>
        ))}
      </div>

      {/* Progress bars */}
      <div className="space-y-3">
        <Progress
          label="Eye Contact"
          value={interview.eye_contact_score}
          color="auto"
          showValue
          size="md"
        />
        <Progress
          label="Speech Clarity"
          value={interview.speech_clarity ?? 0}
          color="auto"
          showValue
          size="md"
        />
        <Progress
          label="Confidence Score"
          value={interview.confidence_score}
          color="auto"
          showValue
          size="md"
        />
      </div>

      {/* Raw metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="glass rounded-xl p-3 text-center">
          <Zap size={16} className="text-cyan-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-[var(--text-primary)]">{interview.speaking_speed}</p>
          <p className="text-xs text-[var(--text-muted)]">WPM</p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <MessageSquare size={16} className="text-amber-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-[var(--text-primary)]">{interview.filler_words_count}</p>
          <p className="text-xs text-[var(--text-muted)]">Filler Words</p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <Smile size={16} className="text-violet-400 mx-auto mb-1" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">{interview.dominant_emotion}</p>
          <p className="text-xs text-[var(--text-muted)]">Dominant Emotion</p>
        </div>
      </div>
    </div>
  );
}
