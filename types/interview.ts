export interface Interview {
  id: string;
  user_id: string;
  confidence_score: number;
  eye_contact_score: number;
  filler_words_count: number;
  dominant_emotion: string;
  speaking_speed: number;
  transcript: string;
  ai_feedback: string;
  speech_clarity: number;
  created_at: string;
  job_title?: string;
  duration?: number;
}

export interface LiveMetrics {
  eyeContactScore: number;
  speechClarity: number;
  emotionScore: number;
  fillerPenalty: number;
  confidenceScore: number;
  dominantEmotion: string;
  wpm: number;
  fillerCount: number;
  transcript: string;
  isLookingAway: boolean;
}

export interface EmotionData {
  happy: number;
  neutral: number;
  sad: number;
  angry: number;
  surprised: number;
  disgusted?: number;
  fearful?: number;
}

export interface FeedbackItem {
  type: 'success' | 'warning' | 'error';
  message: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'behavioral' | 'technical' | 'situational';
  question: string;
  hint: string;
}

export interface SessionState {
  isRecording: boolean;
  isPaused: boolean;
  isMuted: boolean;
  startTime: Date | null;
  elapsedSeconds: number;
  currentQuestionIndex: number;
}
