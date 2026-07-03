'use client';

import { Play, Pause, Square, Mic, MicOff, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

interface SessionControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  isMuted: boolean;
  canEnd: boolean; // require at least some recording time
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onEnd: () => void;
  onToggleMute: () => void;
  onNextQuestion: () => void;
  isEnding?: boolean;
}

export function SessionControls({
  isRecording,
  isPaused,
  isMuted,
  canEnd,
  onStart,
  onPause,
  onResume,
  onEnd,
  onToggleMute,
  onNextQuestion,
  isEnding = false,
}: SessionControlsProps) {
  return (
    <div className="glass-elevated rounded-2xl p-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Left: main action */}
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <Button
              id="start-session-btn"
              onClick={onStart}
              size="md"
              variant="primary"
              className="min-w-[140px]"
            >
              <Play size={16} />
              Start Session
            </Button>
          ) : isPaused ? (
            <Button
              id="resume-session-btn"
              onClick={onResume}
              size="md"
              variant="primary"
              className="min-w-[140px]"
            >
              <Play size={16} />
              Resume
            </Button>
          ) : (
            <Button
              id="pause-session-btn"
              onClick={onPause}
              size="md"
              variant="secondary"
              className="min-w-[140px]"
            >
              <Pause size={16} />
              Pause
            </Button>
          )}

          {/* Mute */}
          {isRecording && (
            <Button
              id="toggle-mute-btn"
              onClick={onToggleMute}
              size="md"
              variant={isMuted ? 'danger' : 'ghost'}
              className="w-10 p-0"
              title={isMuted ? 'Unmute' : 'Mute mic'}
            >
              {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
            </Button>
          )}
        </div>

        {/* Right: next question + end */}
        <div className="flex items-center gap-2">
          {isRecording && (
            <Button
              id="next-question-ctrl-btn"
              onClick={onNextQuestion}
              size="md"
              variant="outline"
            >
              Next Q
              <ChevronRight size={15} />
            </Button>
          )}

          {isRecording && (
            <Button
              id="end-session-btn"
              onClick={onEnd}
              size="md"
              variant="danger"
              disabled={!canEnd}
              loading={isEnding}
            >
              <Square size={15} />
              End & Analyse
            </Button>
          )}
        </div>
      </div>

      {/* Hint */}
      {!isRecording && (
        <p className="text-xs text-[var(--text-muted)] mt-3 text-center">
          Make sure your camera and microphone are allowed before starting
        </p>
      )}
    </div>
  );
}
