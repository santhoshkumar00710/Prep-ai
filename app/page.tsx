import Link from 'next/link';
import { Brain, Zap, Eye, BarChart3, ArrowRight, CheckCircle, Star } from 'lucide-react';

const features = [
  {
    icon: Eye,
    title: 'Live Eye Contact',
    description:
      'AI-powered face detection tracks whether you\'re maintaining confident eye contact in real time.',
    color: '#06b6d4',
  },
  {
    icon: Zap,
    title: 'Speech Analysis',
    description:
      'Detects filler words, measures speaking pace, and scores speech clarity as you answer each question.',
    color: '#8b5cf6',
  },
  {
    icon: Brain,
    title: 'Emotion Detection',
    description:
      'Face-API reads your micro-expressions to measure emotional confidence and composure throughout.',
    color: '#6366f1',
  },
  {
    icon: BarChart3,
    title: 'AI Feedback',
    description:
      'Gemini AI reviews your full session transcript and delivers structured, actionable coaching.',
    color: '#22c55e',
  },
];

const steps = [
  { step: '01', title: 'Set Up', desc: 'Choose a job title and allow camera & mic access.' },
  { step: '02', title: 'Practice', desc: 'Answer real interview questions while PrepAI monitors you live.' },
  { step: '03', title: 'Analyse', desc: 'Review your confidence score, metrics breakdown, and AI coaching.' },
];

const testimonials = [
  { name: 'Priya S.', role: 'Software Engineer', text: 'Landed my dream offer after 2 weeks. The eye contact feedback was a game-changer.', score: 94 },
  { name: 'Marcus T.', role: 'Product Manager', text: 'I never realised how many filler words I used. PrepAI fixed that in days.', score: 87 },
  { name: 'Aisha K.', role: 'Data Scientist', text: 'The AI feedback reads better than anything my college career centre gave me.', score: 91 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen mesh-gradient">
      {/* ── Navbar ─────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-900/40">
              <Brain className="text-white" size={18} />
            </div>
            <span className="font-bold text-lg gradient-text tracking-tight">PrepAI</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              href="/auth?mode=signup"
              id="landing-cta-btn"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-900/30 active:scale-95"
            >
              Get Started
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────── */}
      <section className="hero-gradient pt-24 pb-20 px-6 text-center relative overflow-hidden">
        {/* Background rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-indigo-500/5 absolute" />
          <div className="w-[900px] h-[900px] rounded-full border border-indigo-500/3 absolute" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse-dot" />
            <span className="text-xs text-indigo-300 font-medium">AI-powered • Real-time • Free to start</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6 animate-fade-in-up">
            Ace every interview
            <br />
            <span className="gradient-text glow-text">with AI coaching</span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-up animate-delay-100">
            PrepAI watches you answer real interview questions and gives instant feedback on confidence,
            eye contact, speech clarity, and emotional presence — all powered by AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animate-delay-200">
            <Link
              href="/auth?mode=signup"
              id="hero-signup-btn"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 shadow-2xl shadow-indigo-900/50 glow-brand active:scale-95 text-base"
            >
              Start Practising Free
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/auth"
              className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium px-6 py-4 rounded-2xl border border-[var(--border-subtle)] hover:border-[var(--border-muted)] transition-all text-base"
            >
              Sign in to dashboard
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 mt-10 flex-wrap animate-fade-in-up animate-delay-300">
            {['Free to start', 'No credit card', 'Browser-based'].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                <CheckCircle size={14} className="text-emerald-500" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
              Everything you need to
              <span className="gradient-text"> interview confidently</span>
            </h2>
            <p className="text-[var(--text-secondary)] max-w-xl mx-auto">
              PrepAI combines computer vision, speech analysis, and generative AI to give you
              the most realistic mock interview experience possible.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, description, color }, i) => (
              <div
                key={title}
                className={`glass-elevated rounded-2xl p-6 border border-[var(--border-subtle)] hover:border-[var(--border-brand)] hover:-translate-y-1 transition-all duration-300 animate-fade-in-up animate-delay-${(i + 1) * 100}`}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${color}18` }}
                >
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────── */}
      <section className="py-20 px-6 border-t border-[var(--border-subtle)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">How it works</h2>
            <p className="text-[var(--text-secondary)]">From sign-up to coached in under 5 minutes</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+12px)] right-[calc(16.67%+12px)] h-px bg-gradient-to-r from-transparent via-[var(--border-brand)] to-transparent" />
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-indigo-900/40 relative z-10">
                  {step}
                </div>
                <h3 className="font-semibold text-[var(--text-primary)]">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">
              Users who got the job
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map(({ name, role, text, score }) => (
              <div key={name} className="glass-elevated rounded-2xl p-6 border border-[var(--border-subtle)]">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">"{text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{role}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-indigo-400">{score}</span>
                    <span className="text-[10px] text-[var(--text-muted)]">conf. score</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-elevated rounded-3xl p-12 border border-[var(--border-brand)] glow-brand">
            <h2 className="text-3xl font-black text-[var(--text-primary)] mb-4">
              Ready to level up?
            </h2>
            <p className="text-[var(--text-secondary)] mb-8">
              Join thousands of candidates using AI to nail their interviews.
            </p>
            <Link
              href="/auth?mode=signup"
              id="bottom-cta-btn"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-10 py-4 rounded-2xl transition-all duration-200 shadow-2xl shadow-indigo-900/50 active:scale-95"
            >
              Start for free
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────── */}
      <footer className="border-t border-[var(--border-subtle)] py-8 px-6 text-center">
        <p className="text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} PrepAI · Built with Next.js, Supabase & Gemini AI
        </p>
      </footer>
    </div>
  );
}
