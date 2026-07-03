'use client';

import Link from 'next/link';
import { Interview } from '@/types/interview';
import { formatDate, formatDuration } from '@/lib/utils';
import { ScoreBadge } from '@/app/components/ui/Badge';
import { Calendar, Clock, Briefcase, ChevronRight, Eye, Mic, MessageSquare } from 'lucide-react';

interface SessionCardProps {
  interview: Interview;
}

export function SessionCard({ interview }: SessionCardProps) {
  const scoreColor =
    interview.confidence_score >= 80
      ? 'border-emerald-500/20 hover:border-emerald-500/40'
      : interview.confidence_score >= 60
      ? 'border-amber-500/20 hover:border-amber-500/40'
      : 'border-red-500/20 hover:border-red-500/40';

  return (
    <Link
      href={`/results/${interview.id}`}
      className={[
        'block glass rounded-2xl p-5 border transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20',
        scoreColor,
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left */}
        <div className="flex-1 min-w-0">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Calendar size={12} />
              {formatDate(interview.created_at)}
            </div>
            {interview.duration !== undefined && interview.duration > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <Clock size={12} />
                {formatDuration(interview.duration)}
              </div>
            )}
            {interview.job_title && (
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <Briefcase size={12} />
                <span className="truncate max-w-[140px]">{interview.job_title}</span>
              </div>
            )}
          </div>

          {/* Emotion + Score */}
          <div className="flex items-center gap-2 mb-3">
            <ScoreBadge score={interview.confidence_score} />
            <span className="text-xs text-[var(--text-secondary)]">{interview.dominant_emotion}</span>
          </div>

          {/* Mini metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-1.5">
              <Eye size={12} className="text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-secondary)]">
                {interview.eye_contact_score}% eye
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mic size={12} className="text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-secondary)]">
                {interview.speaking_speed} WPM
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare size={12} className="text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-secondary)]">
                {interview.filler_words_count} fillers
              </span>
            </div>
          </div>
        </div>

        {/* Right: confidence ring + arrow */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="relative w-14 h-14">
            <svg viewBox="0 0 56 56" className="-rotate-90 w-14 h-14">
              <circle cx="28" cy="28" r="22" stroke="var(--bg-hover)" strokeWidth="4" fill="none" />
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke={
                  interview.confidence_score >= 80
                    ? '#22c55e'
                    : interview.confidence_score >= 60
                    ? '#f59e0b'
                    : '#ef4444'
                }
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 * (1 - interview.confidence_score / 100)}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-[var(--text-primary)]">
                {interview.confidence_score}
              </span>
            </div>
          </div>
          <ChevronRight size={16} className="text-[var(--text-muted)]" />
        </div>
      </div>
    </Link>
  );
}
