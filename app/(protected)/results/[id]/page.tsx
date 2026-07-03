import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FeedbackPanel } from '@/app/components/results/FeedbackPanel';
import { MetricsSummary } from '@/app/components/results/MetricsSummary';
import { EmotionTimeline } from '@/app/components/results/EmotionTimeline';
import { Interview } from '@/types/interview';
import { Analytics } from '@/types/analytics';
import { formatDate, formatDuration } from '@/lib/utils';
import { ArrowLeft, Calendar, Clock, Briefcase, MessageSquare, Download } from 'lucide-react';

interface ResultsPageProps {
  params: Promise<{ id: string }>;
}

async function fetchResults(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: interview, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error || !interview) return null;

  const { data: analytics } = await supabase
    .from('analytics')
    .select('*')
    .eq('interview_id', id)
    .single();

  return {
    interview: interview as Interview,
    analytics: (analytics ?? null) as Analytics | null,
  };
}

function parseFeedback(raw: string) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const { id } = await params;
  const data = await fetchResults(id);

  if (!data) notFound();

  const { interview, analytics } = data;
  const feedback = parseFeedback(interview.ai_feedback);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Interview Results
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {formatDate(interview.created_at)}
            </span>
            {interview.duration ? (
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {formatDuration(interview.duration)}
              </span>
            ) : null}
            {interview.job_title && (
              <span className="flex items-center gap-1.5">
                <Briefcase size={13} />
                {interview.job_title}
              </span>
            )}
          </div>
        </div>

        <Link
          href="/interview"
          id="practice-again-btn"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm shadow-lg shadow-indigo-900/30 active:scale-95"
        >
          Practice Again
        </Link>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-6">
        {/* Left: AI Feedback */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">AI Coaching Feedback</h2>

          {feedback ? (
            <FeedbackPanel feedback={feedback} />
          ) : (
            <div className="glass rounded-2xl p-8 text-center border border-[var(--border-subtle)]">
              <MessageSquare size={32} className="text-[var(--text-muted)] mx-auto mb-3" />
              <p className="text-sm text-[var(--text-secondary)]">
                AI feedback was not generated for this session.
              </p>
            </div>
          )}

          {/* Transcript */}
          {interview.transcript && (
            <div className="glass rounded-2xl p-5 border border-[var(--border-subtle)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                <MessageSquare size={14} className="text-indigo-400" />
                Full Transcript
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                {interview.transcript}
              </p>
            </div>
          )}
        </div>

        {/* Right: Metrics */}
        <div className="space-y-5">
          <div className="glass-elevated rounded-2xl p-6 border border-[var(--border-subtle)]">
            <h2 className="text-base font-semibold text-[var(--text-primary)] mb-5">
              Performance Metrics
            </h2>
            <MetricsSummary interview={interview} />
          </div>

          {/* Emotion timeline chart */}
          {analytics?.emotion_timeline && analytics.emotion_timeline.length > 0 && (
            <div className="glass-elevated rounded-2xl p-6 border border-[var(--border-subtle)]">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
                Emotion Timeline
              </h3>
              <EmotionTimeline data={analytics.emotion_timeline} />
            </div>
          )}

          {/* Quick stats */}
          <div className="glass rounded-2xl p-5 border border-[var(--border-subtle)]">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">
              Session Summary
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Confidence Score', value: `${interview.confidence_score}/100` },
                { label: 'Eye Contact',       value: `${interview.eye_contact_score}%` },
                { label: 'Speaking Speed',    value: `${interview.speaking_speed} WPM` },
                { label: 'Filler Words',      value: String(interview.filler_words_count) },
                { label: 'Dominant Emotion',  value: interview.dominant_emotion },
                { label: 'Duration',          value: interview.duration ? formatDuration(interview.duration) : '—' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-1.5 border-b border-[var(--border-subtle)] last:border-0">
                  <span className="text-xs text-[var(--text-muted)]">{label}</span>
                  <span className="text-xs font-semibold text-[var(--text-primary)]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Download note */}
          <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
            <Download size={11} />
            Share this page URL to save your results
          </p>
        </div>
      </div>
    </div>
  );
}
