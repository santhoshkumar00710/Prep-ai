'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WebcamFeed } from '@/app/components/interview/WebcamFeed';
import { MetricsOverlay } from '@/app/components/interview/MetricsOverlay';
import { SpeechTranscript } from '@/app/components/interview/SpeechTranscript';
import { QuestionCard } from '@/app/components/interview/QuestionCard';
import { SessionControls } from '@/app/components/interview/SessionControls';
import { useInterviewStore } from '@/app/store/interviewStore';
import { FaceDetectionResult } from '@/lib/faceapi';
import { calculateConfidence, calculateEmotionScore, getDominantEmotion } from '@/lib/confidenceCalculator';
import { analyzeSpeech } from '@/lib/speechAnalysis';
import { EmotionData } from '@/types/interview';
import { Briefcase, X } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

// Web Speech API type augmentation
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

export default function InterviewPage() {
  const router = useRouter();
  const [isEnding, setIsEnding] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [showJobPrompt, setShowJobPrompt] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const analyticsSnapshotRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const transcriptRef = useRef('');

  const store = useInterviewStore();
  const { session, metrics, currentQuestion } = store;

  // ── Timer ────────────────────────────────────────────────
  useEffect(() => {
    if (session.isRecording && !session.isPaused) {
      timerRef.current = setInterval(() => store.tickSecond(), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.isRecording, session.isPaused]);

  // ── Speech recognition ───────────────────────────────────
  const startSpeech = useCallback(() => {
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return;

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognitionRef.current = recognition;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let full = '';
      for (let i = 0; i < event.results.length; i++) {
        full += event.results[i][0].transcript;
      }
      transcriptRef.current = full;
      const analysis = analyzeSpeech(full, store.session.elapsedSeconds || 1);
      store.updateMetrics({
        transcript: full,
        fillerCount: analysis.fillerCount,
        fillerPenalty: analysis.fillerPenalty,
        wpm: analysis.wpm,
        speechClarity: analysis.speechClarity,
      });
    };

    recognition.onerror = () => {/* silently ignore */};
    recognition.onend = () => {
      // Restart if still recording
      if (store.session.isRecording && !store.session.isPaused) {
        try { recognition.start(); } catch { /* already started */ }
      }
    };

    try { recognition.start(); } catch { /* ignore */ }
  }, [store]);

  const stopSpeech = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }
  }, []);

  // ── Face detection callback ──────────────────────────────
  const handleFaceDetection = useCallback((result: FaceDetectionResult | null) => {
    if (!result) return;
    if (!result.faceDetected) {
      store.updateMetrics({ eyeContactScore: 0, isLookingAway: true, emotionScore: 0 });
      return;
    }
    const emotionData = result.expressions as unknown as EmotionData;
    const emotionScore = calculateEmotionScore(emotionData);
    const dominantEmotion = getDominantEmotion(emotionData);
    const confidenceScore = calculateConfidence({
      eyeContactScore: result.eyeContactScore,
      speechClarity: metrics.speechClarity,
      emotionScore,
      fillerPenalty: metrics.fillerPenalty,
    });

    store.updateMetrics({
      eyeContactScore: result.eyeContactScore,
      isLookingAway: result.isLookingAway,
      emotionScore,
      dominantEmotion,
      confidenceScore,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metrics.speechClarity, metrics.fillerPenalty]);

  // ── Analytics snapshot every 5s ─────────────────────────
  useEffect(() => {
    if (session.isRecording && !session.isPaused) {
      analyticsSnapshotRef.current = setInterval(() => {
        const m = useInterviewStore.getState().metrics;
        store.pushAnalyticsSnapshot({
          eyeContactValue: m.eyeContactScore,
          emotionConfident: m.emotionScore,
          emotionNeutral: 100 - m.emotionScore - m.fillerPenalty,
          emotionNegative: m.fillerPenalty,
          wpm: m.wpm,
        });
      }, 5000);
    } else {
      if (analyticsSnapshotRef.current) clearInterval(analyticsSnapshotRef.current);
    }
    return () => { if (analyticsSnapshotRef.current) clearInterval(analyticsSnapshotRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.isRecording, session.isPaused]);

  // ── Session actions ──────────────────────────────────────
  function handleStart() {
    store.startRecording();
    startSpeech();
  }

  function handlePause() {
    store.pauseRecording();
    stopSpeech();
  }

  function handleResume() {
    store.resumeRecording();
    startSpeech();
  }

  async function handleEnd() {
    setIsEnding(true);
    store.stopRecording();
    stopSpeech();

    const finalMetrics = useInterviewStore.getState().metrics;
    const finalSession = useInterviewStore.getState().session;
    const analyticsBuffer = useInterviewStore.getState().analyticsBuffer;

    // Get AI feedback
    let aiFeedback = '';
    try {
      const fbRes = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: finalMetrics.transcript,
          metrics: finalMetrics,
          jobTitle: store.jobTitle,
        }),
      });
      if (fbRes.ok) {
        const { feedback } = await fbRes.json();
        aiFeedback = JSON.stringify(feedback);
      }
    } catch { /* continue without feedback */ }

    // Save interview
    try {
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_title: store.jobTitle || null,
          confidence_score: finalMetrics.confidenceScore,
          eye_contact_score: finalMetrics.eyeContactScore,
          filler_words_count: finalMetrics.fillerCount,
          dominant_emotion: finalMetrics.dominantEmotion,
          speaking_speed: finalMetrics.wpm,
          speech_clarity: finalMetrics.speechClarity,
          transcript: finalMetrics.transcript,
          ai_feedback: aiFeedback,
          duration: finalSession.elapsedSeconds,
          emotion_timeline: analyticsBuffer.emotionTimeline,
          eye_contact_data: analyticsBuffer.eyeContactData,
          speech_metrics: {
            wpmOverTime: analyticsBuffer.wpmOverTime,
            totalFillerWords: finalMetrics.fillerCount,
            fillerWordBreakdown: {},
            averageWpm: finalMetrics.wpm,
            pauseCount: 0,
          },
        }),
      });

      if (res.ok) {
        const { interview } = await res.json();
        store.reset();
        router.push(`/results/${interview.id}`);
        return;
      }
    } catch { /* fall through */ }

    setIsEnding(false);
    router.push('/dashboard');
  }

  // Reset store on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      if (timerRef.current) clearInterval(timerRef.current);
      if (analyticsSnapshotRef.current) clearInterval(analyticsSnapshotRef.current);
    };
  }, [stopSpeech]);

  // ── Job title prompt ─────────────────────────────────────
  if (showJobPrompt) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="glass-elevated rounded-3xl p-10 w-full max-w-md border border-[var(--border-muted)] animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/15 flex items-center justify-center">
              <Briefcase size={20} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="font-bold text-[var(--text-primary)]">Ready to practise?</h2>
              <p className="text-xs text-[var(--text-muted)]">Optional: set a job title for tailored feedback</p>
            </div>
          </div>

          <input
            id="job-title-input"
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            className="w-full h-11 bg-[var(--bg-surface)] border border-[var(--border-muted)] rounded-xl px-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-indigo-500/60 mb-6 transition-colors"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                store.setJobTitle(jobTitle);
                setShowJobPrompt(false);
              }
            }}
          />

          <div className="space-y-2">
            <Button
              id="begin-session-btn"
              fullWidth
              size="lg"
              onClick={() => {
                store.setJobTitle(jobTitle);
                setShowJobPrompt(false);
              }}
            >
              Begin Interview Session
            </Button>
            <p className="text-xs text-center text-[var(--text-muted)] pt-1">
              Make sure your browser allows camera and microphone access
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Main session UI ──────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">Live Interview Session</h1>
          {store.jobTitle && (
            <p className="text-sm text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
              <Briefcase size={12} />
              {store.jobTitle}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            stopSpeech();
            store.reset();
            router.push('/dashboard');
          }}
          className="text-[var(--text-muted)]"
        >
          <X size={14} />
          Exit
        </Button>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          {/* Webcam */}
          <WebcamFeed
            isRecording={session.isRecording && !session.isPaused}
            onFaceDetection={handleFaceDetection}
            className="aspect-video w-full"
          />

          {/* Question */}
          <QuestionCard
            question={currentQuestion}
            questionIndex={session.currentQuestionIndex}
            onNext={store.nextQuestion}
            isRecording={session.isRecording}
          />

          {/* Transcript */}
          <SpeechTranscript
            transcript={metrics.transcript}
            isRecording={session.isRecording && !session.isPaused}
          />
        </div>

        {/* Right column — metrics */}
        <div className="flex flex-col gap-4">
          <MetricsOverlay
            metrics={metrics}
            elapsedSeconds={session.elapsedSeconds}
          />

          {/* Muted state notice */}
          {session.isMuted && (
            <div className="glass rounded-xl px-3 py-2.5 border border-amber-500/20 animate-fade-in">
              <p className="text-xs text-amber-400 text-center">🎤 Microphone muted</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls — always at bottom */}
      <SessionControls
        isRecording={session.isRecording}
        isPaused={session.isPaused}
        isMuted={session.isMuted}
        canEnd={session.elapsedSeconds >= 10}
        onStart={handleStart}
        onPause={handlePause}
        onResume={handleResume}
        onEnd={handleEnd}
        onToggleMute={store.toggleMute}
        onNextQuestion={store.nextQuestion}
        isEnding={isEnding}
      />
    </div>
  );
}
