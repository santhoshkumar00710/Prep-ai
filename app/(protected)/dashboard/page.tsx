import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Interview } from '@/types/interview';
import { ConfidenceTrendPoint } from '@/types/analytics';
import { SessionCard } from '@/app/components/dashboard/SessionCard';
import { StatCard } from '@/app/components/dashboard/StatCard';
import { ConfidenceTrendChart } from '@/app/components/dashboard/ConfidenceTrendChart';
import { Brain, Plus } from 'lucide-react';
import { formatDate } from '@/lib/utils';

async function fetchDashboardData(userId: string) {
  const supabase = await createClient();

  const { data: interviews } = await supabase
    .from('interviews')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  return (interviews ?? []) as Interview[];
}

function buildTrendData(interviews: Interview[]): ConfidenceTrendPoint[] {
  return [...interviews]
    .reverse()
    .slice(-7)
    .map((iv) => ({
      day: formatDate(iv.created_at),
      score: iv.confidence_score,
    }));
}

function buildStats(interviews: Interview[]) {
  if (!interviews.length) return null;
  const latest = interviews[0];
  const prev = interviews[1];

  const avgConf = Math.round(interviews.reduce((s, i) => s + i.confidence_score, 0) / interviews.length);
  const avgEye  = Math.round(interviews.reduce((s, i) => s + i.eye_contact_score, 0) / interviews.length);
  const avgFill = Math.round(interviews.reduce((s, i) => s + i.filler_words_count, 0) / interviews.length);
  const avgWpm  = Math.round(interviews.reduce((s, i) => s + i.speaking_speed, 0) / interviews.length);

  return {
    avgConf,
    avgEye,
    avgFill,
    avgWpm,
    confDelta: prev ? latest.confidence_score - prev.confidence_score : undefined,
    eyeDelta:  prev ? latest.eye_contact_score - prev.eye_contact_score : undefined,
    fillDelta: prev ? -(latest.filler_words_count - prev.filler_words_count) : undefined, // fewer is better
    wpmDelta:  undefined,
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const interviews = await fetchDashboardData(user!.id);
  const trendData = buildTrendData(interviews);
  const stats = buildStats(interviews);

  const firstName = (user?.user_metadata?.full_name as string)?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'there';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Welcome back, <span className="gradient-text">{firstName}</span> 👋
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {interviews.length === 0
              ? 'Start your first session to see your progress'
              : `You have ${interviews.length} session${interviews.length === 1 ? '' : 's'} recorded`}
          </p>
        </div>
        <Link
          href="/interview"
          id="new-interview-btn"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-900/30 active:scale-95 text-sm"
        >
          <Plus size={16} />
          New Interview
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Avg Confidence"
            value={stats.avgConf}
            unit="%"
            delta={stats.confDelta}
            icon="Brain"
            iconColor="#6366f1"
          />
          <StatCard
            label="Avg Eye Contact"
            value={stats.avgEye}
            unit="%"
            delta={stats.eyeDelta}
            icon="Eye"
            iconColor="#06b6d4"
          />
          <StatCard
            label="Avg Filler Words"
            value={stats.avgFill}
            delta={stats.fillDelta}
            deltaLabel=" fewer"
            icon="MessageSquare"
            iconColor="#f59e0b"
          />
          <StatCard
            label="Avg Speaking"
            value={stats.avgWpm}
            unit=" wpm"
            icon="Zap"
            iconColor="#22c55e"
            description="Ideal range: 120–160 WPM"
          />
        </div>
      )}

      {/* Empty state */}
      {interviews.length === 0 && (
        <div className="glass-elevated rounded-3xl p-16 text-center border border-[var(--border-subtle)]">
          <div className="w-20 h-20 rounded-2xl bg-indigo-600/15 flex items-center justify-center mx-auto mb-6">
            <Brain size={40} className="text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">No sessions yet</h2>
          <p className="text-[var(--text-secondary)] mb-6 max-w-sm mx-auto">
            Start your first mock interview and PrepAI will give you instant, AI-powered feedback.
          </p>
          <Link
            href="/interview"
            id="empty-state-cta"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all"
          >
            <Plus size={16} />
            Start Your First Session
          </Link>
        </div>
      )}

      {/* Trend + History */}
      {interviews.length > 0 && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Confidence trend */}
          <div className="lg:col-span-1 glass-elevated rounded-2xl p-6 border border-[var(--border-subtle)]">
            <h2 className="font-semibold text-[var(--text-primary)] mb-1">Confidence Trend</h2>
            <p className="text-xs text-[var(--text-muted)] mb-4">Last 7 sessions</p>
            <ConfidenceTrendChart data={trendData} />
          </div>

          {/* Recent sessions */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--text-primary)]">Recent Sessions</h2>
              <span className="text-xs text-[var(--text-muted)]">{interviews.length} total</span>
            </div>
            <div className="space-y-3">
              {interviews.slice(0, 5).map((interview) => (
                <SessionCard key={interview.id} interview={interview} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
