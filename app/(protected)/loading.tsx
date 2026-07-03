export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-600/20 border-t-indigo-600 animate-spin" />
        <p className="text-sm text-[var(--text-muted)]">Loading…</p>
      </div>
    </div>
  );
}
