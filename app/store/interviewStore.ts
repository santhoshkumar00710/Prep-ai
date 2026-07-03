'use client';

import { create } from 'zustand';
import { LiveMetrics, InterviewQuestion, SessionState } from '@/types/interview';
import { EmotionTimelinePoint, EyeContactPoint, WpmPoint } from '@/types/analytics';
import { getRandomQuestion } from '@/utils/questions';

interface AnalyticsBuffer {
  emotionTimeline: EmotionTimelinePoint[];
  eyeContactData: EyeContactPoint[];
  wpmOverTime: WpmPoint[];
}

interface InterviewStore {
  // Session state
  session: SessionState;

  // Current metrics (live)
  metrics: LiveMetrics;

  // Current question
  currentQuestion: InterviewQuestion;
  usedQuestionIds: string[];

  // Job title
  jobTitle: string;

  // Analytics buffer (accumulated during session)
  analyticsBuffer: AnalyticsBuffer;

  // Actions
  setJobTitle: (title: string) => void;
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  toggleMute: () => void;
  tickSecond: () => void;
  nextQuestion: () => void;
  updateMetrics: (metrics: Partial<LiveMetrics>) => void;
  pushAnalyticsSnapshot: (snapshot: {
    eyeContactValue: number;
    emotionConfident: number;
    emotionNeutral: number;
    emotionNegative: number;
    wpm: number;
  }) => void;
  reset: () => void;
}

const defaultMetrics: LiveMetrics = {
  eyeContactScore: 0,
  speechClarity: 0,
  emotionScore: 0,
  fillerPenalty: 0,
  confidenceScore: 0,
  dominantEmotion: 'Neutral',
  wpm: 0,
  fillerCount: 0,
  transcript: '',
  isLookingAway: false,
};

const defaultSession: SessionState = {
  isRecording: false,
  isPaused: false,
  isMuted: false,
  startTime: null,
  elapsedSeconds: 0,
  currentQuestionIndex: 0,
};

export const useInterviewStore = create<InterviewStore>((set, get) => ({
  session: defaultSession,
  metrics: defaultMetrics,
  currentQuestion: getRandomQuestion(),
  usedQuestionIds: [],
  jobTitle: '',
  analyticsBuffer: {
    emotionTimeline: [],
    eyeContactData: [],
    wpmOverTime: [],
  },

  setJobTitle: (title) => set({ jobTitle: title }),

  startRecording: () =>
    set({
      session: {
        ...defaultSession,
        isRecording: true,
        startTime: new Date(),
      },
    }),

  pauseRecording: () =>
    set((state) => ({
      session: { ...state.session, isPaused: true },
    })),

  resumeRecording: () =>
    set((state) => ({
      session: { ...state.session, isPaused: false },
    })),

  stopRecording: () =>
    set((state) => ({
      session: { ...state.session, isRecording: false, isPaused: false },
    })),

  toggleMute: () =>
    set((state) => ({
      session: { ...state.session, isMuted: !state.session.isMuted },
    })),

  tickSecond: () =>
    set((state) => {
      if (!state.session.isRecording || state.session.isPaused) return state;
      return {
        session: {
          ...state.session,
          elapsedSeconds: state.session.elapsedSeconds + 1,
        },
      };
    }),

  nextQuestion: () => {
    const { usedQuestionIds, currentQuestion } = get();
    const newUsed = [...usedQuestionIds, currentQuestion.id];
    const next = getRandomQuestion(newUsed);
    set((state) => ({
      currentQuestion: next,
      usedQuestionIds: newUsed,
      session: {
        ...state.session,
        currentQuestionIndex: state.session.currentQuestionIndex + 1,
      },
    }));
  },

  updateMetrics: (partial) =>
    set((state) => ({
      metrics: { ...state.metrics, ...partial },
    })),

  pushAnalyticsSnapshot: ({ eyeContactValue, emotionConfident, emotionNeutral, emotionNegative, wpm }) => {
    const elapsed = get().session.elapsedSeconds;
    set((state) => ({
      analyticsBuffer: {
        emotionTimeline: [
          ...state.analyticsBuffer.emotionTimeline,
          { timestamp: elapsed, confident: emotionConfident, neutral: emotionNeutral, negative: emotionNegative },
        ],
        eyeContactData: [
          ...state.analyticsBuffer.eyeContactData,
          { timestamp: elapsed, value: eyeContactValue },
        ],
        wpmOverTime: [
          ...state.analyticsBuffer.wpmOverTime,
          { timestamp: elapsed, wpm },
        ],
      },
    }));
  },

  reset: () =>
    set({
      session: defaultSession,
      metrics: defaultMetrics,
      currentQuestion: getRandomQuestion(),
      usedQuestionIds: [],
      jobTitle: '',
      analyticsBuffer: {
        emotionTimeline: [],
        eyeContactData: [],
        wpmOverTime: [],
      },
    }),
}));
