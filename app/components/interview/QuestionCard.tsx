'use client';

import { InterviewQuestion } from '@/types/interview';
import { CategoryBadge } from '@/app/components/ui/Badge';
import { Lightbulb, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { useState } from 'react';

interface QuestionCardProps {
  question: InterviewQuestion;
  questionIndex: number;
  onNext: () => void;
  isRecording: boolean;
}

export function QuestionCard({ question, questionIndex, onNext, isRecording }: QuestionCardProps) {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="glass-elevated rounded-2xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CategoryBadge category={question.category} />
          <span className="text-xs text-[var(--text-muted)]">Q{questionIndex + 1}</span>
        </div>
        {isRecording && (
          <Button
            id="next-question-btn"
            variant="ghost"
            size="sm"
            onClick={onNext}
            className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            Skip
            <ChevronRight size={14} />
          </Button>
        )}
      </div>

      {/* Question */}
      <p className="text-base font-medium text-[var(--text-primary)] leading-relaxed">
        {question.question}
      </p>

      {/* Hint toggle */}
      <div>
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-1.5 text-xs text-amber-400/80 hover:text-amber-400 transition-colors"
        >
          <Lightbulb size={13} />
          {showHint ? 'Hide hint' : 'Show interviewer hint'}
        </button>
        {showHint && (
          <div className="mt-2 px-3 py-2 bg-amber-500/8 border border-amber-500/20 rounded-lg animate-fade-in">
            <p className="text-xs text-amber-200/70">{question.hint}</p>
          </div>
        )}
      </div>
    </div>
  );
}
