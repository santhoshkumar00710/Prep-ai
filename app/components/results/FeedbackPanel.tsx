'use client';

import { CheckCircle, AlertCircle, XCircle, Lightbulb, Star, MessageSquare, ArrowRight } from 'lucide-react';

interface FeedbackData {
  overallScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  contentFeedback: string;
  deliveryFeedback: string;
  bodyLanguageFeedback: string;
  nextSteps: string[];
}

interface FeedbackPanelProps {
  feedback: FeedbackData;
}

export function FeedbackPanel({ feedback }: FeedbackPanelProps) {
  const scoreColor =
    feedback.overallScore >= 80
      ? 'text-emerald-400'
      : feedback.overallScore >= 60
      ? 'text-amber-400'
      : 'text-red-400';

  return (
    <div className="space-y-4">
      {/* Overall score + summary */}
      <div className="glass-elevated rounded-2xl p-6 border border-[var(--border-muted)]">
        <div className="flex items-start gap-4">
          <div className="text-center shrink-0">
            <span className={`text-5xl font-black ${scoreColor}`}>{feedback.overallScore}</span>
            <p className="text-xs text-[var(--text-muted)] mt-1">/ 100</p>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[var(--text-primary)] mb-2 flex items-center gap-2">
              <Star size={16} className="text-amber-400" />
              AI Assessment
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feedback.summary}</p>
          </div>
        </div>
      </div>

      {/* Strengths & Improvements */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="glass rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2 mb-3">
            <CheckCircle size={15} />
            Strengths
          </h4>
          <ul className="space-y-2">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="glass rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2 mb-3">
            <AlertCircle size={15} />
            Areas to Improve
          </h4>
          <ul className="space-y-2">
            {feedback.improvements.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detailed sections */}
      {[
        { icon: MessageSquare, color: 'text-indigo-400', label: 'Content & Structure', text: feedback.contentFeedback },
        { icon: XCircle,       color: 'text-violet-400',  label: 'Delivery & Speech',  text: feedback.deliveryFeedback },
        { icon: CheckCircle,   color: 'text-cyan-400',    label: 'Body Language',       text: feedback.bodyLanguageFeedback },
      ].filter(({ text }) => text).map(({ icon: Icon, color, label, text }) => (
        <div key={label} className="glass rounded-2xl p-5">
          <h4 className={`text-sm font-semibold ${color} flex items-center gap-2 mb-2`}>
            <Icon size={15} />
            {label}
          </h4>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{text}</p>
        </div>
      ))}

      {/* Next steps */}
      {feedback.nextSteps && feedback.nextSteps.length > 0 && (
        <div className="glass-elevated rounded-2xl p-5 border border-indigo-500/20">
          <h4 className="text-sm font-semibold text-indigo-400 flex items-center gap-2 mb-3">
            <Lightbulb size={15} />
            Next Steps
          </h4>
          <ul className="space-y-2">
            {feedback.nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <ArrowRight size={14} className="text-indigo-500 mt-0.5 shrink-0" />
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
