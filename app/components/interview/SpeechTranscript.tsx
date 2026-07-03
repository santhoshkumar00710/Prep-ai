'use client';

import { useEffect, useRef } from 'react';
import { FILLER_WORDS } from '@/lib/speechAnalysis';

interface SpeechTranscriptProps {
  transcript: string;
  isRecording: boolean;
}

function highlightFillers(text: string): React.ReactNode[] {
  if (!text) return [];

  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  // Build a regex to detect all filler words
  const fillerPattern = new RegExp(
    `\\b(${FILLER_WORDS.map((w) => w.replace(/\s+/g, '\\s+')).join('|')})\\b`,
    'gi'
  );

  let lastIndex = 0;
  const matches = [...text.matchAll(fillerPattern)];

  matches.forEach((match) => {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      parts.push(<span key={key++}>{text.slice(lastIndex, start)}</span>);
    }
    parts.push(
      <mark key={key++} className="filler-word">
        {match[0]}
      </mark>
    );
    lastIndex = start + match[0].length;
  });

  if (lastIndex < text.length) {
    parts.push(<span key={key++}>{text.slice(lastIndex)}</span>);
  }

  void remaining; // suppress unused warning
  return parts;
}

export function SpeechTranscript({ transcript, isRecording }: SpeechTranscriptProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as transcript grows
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-3 h-full min-h-0">
      <div className="flex items-center justify-between shrink-0">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Live Transcript</h3>
        {isRecording && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-dot" />
            <span className="text-[10px] text-indigo-400 font-medium">LIVE</span>
          </div>
        )}
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto text-sm leading-relaxed text-[var(--text-secondary)] pr-1"
        style={{ minHeight: '80px', maxHeight: '160px' }}
      >
        {transcript ? (
          <p className="break-words">{highlightFillers(transcript)}</p>
        ) : (
          <p className="text-[var(--text-muted)] italic text-center py-4">
            {isRecording ? 'Speak now — your words will appear here…' : 'Start the session to see your transcript'}
          </p>
        )}
      </div>

      {transcript && (
        <div className="flex items-center gap-1 shrink-0">
          <span className="w-2 h-2 rounded-full bg-red-400/70" />
          <span className="text-[10px] text-[var(--text-muted)]">
            Highlighted words are filler words
          </span>
        </div>
      )}
    </div>
  );
}
