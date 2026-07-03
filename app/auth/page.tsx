'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Brain, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

type Mode = 'signin' | 'signup';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>(
    (searchParams.get('mode') as Mode) === 'signup' ? 'signup' : 'signin'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const urlError = searchParams.get('error');
  useEffect(() => {
    if (urlError === 'auth_callback_failed') setError('Authentication failed. Please try again.');
  }, [urlError]);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          },
        });
        if (signUpError) throw signUpError;
        setSuccessMsg('Check your email to confirm your account, then sign in.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="flex flex-col items-center gap-3 mb-8 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-2xl shadow-indigo-900/50">
          <Brain size={28} className="text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black gradient-text">PrepAI</h1>
          <p className="text-sm text-[var(--text-muted)]">AI Interview Coach</p>
        </div>
      </div>

      {/* Card */}
      <div className="glass-elevated rounded-3xl p-8 border border-[var(--border-muted)] animate-fade-in-up">
        {/* Mode toggle */}
        <div className="flex rounded-xl bg-[var(--bg-surface)] p-1 mb-6 border border-[var(--border-subtle)]">
          {(['signin', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                id={`auth-mode-${m}`}
                onClick={() => { setMode(m); setError(''); setSuccessMsg(''); }}
                className={[
                  'flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                  mode === m
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
                ].join(' ')}
              >
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
          ))}
        </div>

        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          {mode === 'signin'
            ? 'Sign in to access your interview dashboard'
            : 'Start coaching yourself to interview success'}
        </p>

        {/* Error / Success */}
        {error && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4 animate-fade-in">
            <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 mb-4 animate-fade-in">
            <p className="text-sm text-emerald-300">{successMsg}</p>
          </div>
        )}

        {/* Form */}
        <form id="auth-form" onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5" htmlFor="full-name-input">
                Full Name
              </label>
              <input
                id="full-name-input"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Smith"
                required={mode === 'signup'}
                className="w-full h-11 bg-[var(--bg-surface)] border border-[var(--border-muted)] rounded-xl px-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5" htmlFor="email-input">
              Email address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full h-11 bg-[var(--bg-surface)] border border-[var(--border-muted)] rounded-xl pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5" htmlFor="password-input">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full h-11 bg-[var(--bg-surface)] border border-[var(--border-muted)] rounded-xl pl-10 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-colors"
              />
              <button
                type="button"
                id="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <Button
            id="auth-submit-btn"
            type="submit"
            fullWidth
            loading={loading}
            size="lg"
            className="mt-2"
          >
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>
      </div>

      <p className="text-center text-xs text-[var(--text-muted)] mt-6">
        By continuing, you agree to our terms of service and privacy policy.
      </p>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-600/20 border-t-indigo-600 animate-spin" />
          <p className="text-sm text-[var(--text-muted)]">Loading...</p>
        </div>
      }>
        <AuthContent />
      </Suspense>
    </div>
  );
}
