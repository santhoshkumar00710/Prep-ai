export interface Analytics {
  id: string;
  interview_id: string;
  emotion_timeline: EmotionTimelinePoint[];
  eye_contact_data: EyeContactPoint[];
  speech_metrics: SpeechMetricsData;
}

export interface EmotionTimelinePoint {
  timestamp: number; // seconds from start
  confident: number;
  neutral: number;
  negative: number;
}

export interface EyeContactPoint {
  timestamp: number;
  value: number; // 0-100
}

export interface SpeechMetricsData {
  wpmOverTime: WpmPoint[];
  totalFillerWords: number;
  fillerWordBreakdown: Record<string, number>;
  averageWpm: number;
  pauseCount: number;
}

export interface WpmPoint {
  timestamp: number;
  wpm: number;
}

export interface DashboardStats {
  avgEmotionStability: number;
  emotionStabilityDelta: number;
  eyeContactPercent: number;
  eyeContactDelta: number;
  fillerWordsPerMin: number;
  fillerWordsDelta: number;
}

export interface ConfidenceTrendPoint {
  day: string;
  score: number;
}
