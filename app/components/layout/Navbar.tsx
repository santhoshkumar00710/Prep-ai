'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  Video,
  LogOut,
  Menu,
  X,
  Brain,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  userEmail?: string | null;
  userInitial?: string;
}

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/interview', label: 'New Interview', icon: Video },
];

export function Navbar({ userEmail, userInitial }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-900/40 group-hover:shadow-indigo-700/60 transition-shadow">
              <Brain className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <span className="font-bold text-lg gradient-text tracking-tight">PrepAI</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={[
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  pathname === href || pathname.startsWith(href + '/')
                    ? 'bg-indigo-600/15 text-indigo-300'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]',
                ].join(' ')}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </nav>

          {/* User dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <button
                id="user-menu-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[var(--bg-elevated)] transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                  {userInitial ?? '?'}
                </div>
                <span className="text-sm text-[var(--text-secondary)] max-w-[120px] truncate">
                  {userEmail ?? 'User'}
                </span>
                <ChevronDown size={14} className={`text-[var(--text-muted)] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 glass-elevated rounded-xl py-1 shadow-2xl border border-[var(--border-muted)]">
                  <div className="px-3 py-2 border-b border-[var(--border-subtle)]">
                    <p className="text-xs text-[var(--text-muted)] truncate">{userEmail}</p>
                  </div>
                  <button
                    id="sign-out-btn"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors rounded-lg mx-1 disabled:opacity-50"
                  >
                    <LogOut size={14} />
                    {signingOut ? 'Signing out…' : 'Sign out'}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-[var(--border-subtle)] pt-3 space-y-1 animate-fade-in">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={[
                  'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname === href
                    ? 'bg-indigo-600/15 text-indigo-300'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]',
                ].join(' ')}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
