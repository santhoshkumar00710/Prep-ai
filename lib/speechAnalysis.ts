export const FILLER_WORDS = ['um', 'uh', 'like', 'basically', 'actually', 'literally', 'you know', 'i mean', 'sort of', 'kind of'];

export interface SpeechAnalysisResult {
  fillerCount: number;
  fillerBreakdown: Record<string, number>;
  wpm: number;
  speechClarity: number; // 0-100
  fillerPenalty: number; // 0-100
}

/**
 * Analyze transcript for filler words and speaking speed
 */
export function analyzeSpeech(transcript: string, durationSeconds: number): SpeechAnalysisResult {
  const lower = transcript.toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean);
  const totalWords = words.length;

  // Count filler words
  const fillerBreakdown: Record<string, number> = {};
  let fillerCount = 0;

  for (const filler of FILLER_WORDS) {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = transcript.match(regex);
    if (matches && matches.length > 0) {
      fillerBreakdown[filler] = matches.length;
      fillerCount += matches.length;
    }
  }

  // WPM
  const minutes = durationSeconds / 60 || 1;
  const wpm = Math.round(totalWords / minutes);

  // Speech clarity: penalize filler words and too fast/slow WPM
  const fillerRatio = totalWords > 0 ? fillerCount / totalWords : 0;
  const wpmPenalty = wpm < 100 ? (100 - wpm) / 2 : wpm > 180 ? (wpm - 180) / 3 : 0;
  const speechClarity = Math.max(0, Math.min(100, 100 - fillerRatio * 200 - wpmPenalty));

  // fillerPenalty: 0-100, higher = worse
  const fillerPenalty = Math.min(100, fillerRatio * 300);

  return {
    fillerCount,
    fillerBreakdown,
    wpm,
    speechClarity: Math.round(speechClarity),
    fillerPenalty: Math.round(fillerPenalty),
  };
}
