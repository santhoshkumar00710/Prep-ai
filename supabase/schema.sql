-- ============================================================
-- PrepAI — Supabase Database Schema
-- Run this in the Supabase SQL editor for your project
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. profiles — extends auth.users
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  tier        text not null default 'free' check (tier in ('free', 'elite')),
  created_at  timestamptz not null default now()
);

-- Auto-create a profile on sign-up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────
-- 2. interviews — one row per session
-- ─────────────────────────────────────────────────────────────
create table if not exists public.interviews (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  job_title         text,
  confidence_score  integer not null default 0 check (confidence_score between 0 and 100),
  eye_contact_score integer not null default 0 check (eye_contact_score between 0 and 100),
  filler_words_count integer not null default 0,
  dominant_emotion  text not null default 'Neutral',
  speaking_speed    integer not null default 0,
  speech_clarity    integer not null default 0 check (speech_clarity between 0 and 100),
  transcript        text not null default '',
  ai_feedback       text not null default '',
  duration          integer not null default 0,   -- seconds
  created_at        timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- 3. analytics — detailed timeline data per interview
-- ─────────────────────────────────────────────────────────────
create table if not exists public.analytics (
  id                  uuid primary key default gen_random_uuid(),
  interview_id        uuid not null references public.interviews(id) on delete cascade,
  emotion_timeline    jsonb not null default '[]',   -- EmotionTimelinePoint[]
  eye_contact_data    jsonb not null default '[]',   -- EyeContactPoint[]
  speech_metrics      jsonb not null default '{}',   -- SpeechMetricsData
  created_at          timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- 4. Row Level Security
-- ─────────────────────────────────────────────────────────────
alter table public.profiles  enable row level security;
alter table public.interviews enable row level security;
alter table public.analytics  enable row level security;

-- profiles: users can read/update their own profile
create policy "profiles: own read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: own update" on public.profiles for update using (auth.uid() = id);

-- interviews: users can CRUD their own sessions
create policy "interviews: own read"   on public.interviews for select using (auth.uid() = user_id);
create policy "interviews: own insert" on public.interviews for insert with check (auth.uid() = user_id);
create policy "interviews: own update" on public.interviews for update using (auth.uid() = user_id);
create policy "interviews: own delete" on public.interviews for delete using (auth.uid() = user_id);

-- analytics: scoped through interview ownership
create policy "analytics: own read" on public.analytics for select
  using (exists (
    select 1 from public.interviews i
    where i.id = analytics.interview_id and i.user_id = auth.uid()
  ));

create policy "analytics: own insert" on public.analytics for insert
  with check (exists (
    select 1 from public.interviews i
    where i.id = analytics.interview_id and i.user_id = auth.uid()
  ));

-- ─────────────────────────────────────────────────────────────
-- 5. Indexes for performance
-- ─────────────────────────────────────────────────────────────
create index if not exists idx_interviews_user_id   on public.interviews(user_id);
create index if not exists idx_interviews_created   on public.interviews(created_at desc);
create index if not exists idx_analytics_interview  on public.analytics(interview_id);
