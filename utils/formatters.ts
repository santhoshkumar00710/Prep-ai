export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatWpm(wpm: number): string {
  if (wpm < 110) return 'Slow';
  if (wpm > 170) return 'Fast';
  return 'Optimal';
}

export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#C5F135';
  if (score >= 60) return '#3B5BDB';
  return '#ef4444';
}
