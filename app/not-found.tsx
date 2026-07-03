import Link from 'next/link';
import { Brain } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
          <Brain size={36} className="text-indigo-400" />
        </div>
        <h1 className="text-6xl font-black gradient-text mb-2">404</h1>
        <p className="text-lg text-[var(--text-secondary)] mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
