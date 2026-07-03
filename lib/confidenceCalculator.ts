import { EmotionData } from '@/types/interview';

export interface ConfidenceInputs {
  eyeContactScore: number;   // 0-100
  speechClarity: number;     // 0-100
  emotionScore: number;      // 0-100
  fillerPenalty: number;     // 0-100
}

/**
 * confidence = eyeContact * 0.4 + speechClarity * 0.3 + emotionScore * 0.2 - fillerPenalty * 0.1
 */
export function calculateConfidence(inputs: ConfidenceInputs): number {
  const { eyeContactScore, speechClarity, emotionScore, fillerPenalty } = inputs;
  const raw =
    eyeContactScore * 0.4 +
    speechClarity * 0.3 +
    emotionScore * 0.2 -
    fillerPenalty * 0.1;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

/**
 * Convert face-api.js expression data to 0-100 emotion score
 * Higher = more positive/confident
 */
export function calculateEmotionScore(emotions: EmotionData): number {
  const positiveWeight = (emotions.happy || 0) * 100 + (emotions.neutral || 0) * 70;
  const negativeWeight =
    (emotions.sad || 0) * 20 + (emotions.angry || 0) * 10 + (emotions.surprised || 0) * 50;
  const total = positiveWeight + negativeWeight;
  return Math.min(100, Math.round(total));
}

/**
 * Dominant emotion label from expressions
 */
export function getDominantEmotion(emotions: EmotionData): string {
  const entries = Object.entries(emotions) as [string, number][];
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const top = sorted[0][0];
  const labelMap: Record<string, string> = {
    happy: 'Happy',
    neutral: 'Calm / Neutral',
    sad: 'Sad',
    angry: 'Tense',
    surprised: 'Surprised',
    disgusted: 'Disgusted',
    fearful: 'Anxious',
  };
  return labelMap[top] || 'Neutral';
}
