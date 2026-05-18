-- TalkLengua Supabase Schema
-- Run this in your Supabase SQL editor

-- Enable RLS
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- ─── Users / Profiles ───────────────────────────────────────────────────────
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  display_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── User Progress ───────────────────────────────────────────────────────────
create table if not exists user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  language_code text not null, -- 'ko', 'pt', 'ru', etc.
  cefr_level text not null default 'A1',
  xp integer not null default 0,
  completed_lessons text[] default '{}',
  weak_topics text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, language_code)
);

alter table user_progress enable row level security;
create policy "Users can manage own progress" on user_progress for all using (auth.uid() = user_id);

-- ─── Quiz History ────────────────────────────────────────────────────────────
create table if not exists quiz_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  language_code text not null,
  lesson_id text not null,
  question_id text not null,
  question_text text not null,
  correct_answer text not null,
  user_answer text not null,
  is_correct boolean not null,
  grammar_topic text not null,
  cefr_level text not null,
  ai_explanation text, -- cached Claude response
  created_at timestamptz default now()
);

alter table quiz_history enable row level security;
create policy "Users can manage own quiz history" on quiz_history for all using (auth.uid() = user_id);

-- Index for fast wrong-answer lookups (AI explainer cache)
create index if not exists idx_quiz_history_wrong
  on quiz_history(language_code, question_id, user_answer)
  where is_correct = false;

-- ─── AI Conversation Sessions ────────────────────────────────────────────────
create table if not exists conversation_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  language_code text not null,
  scenario text not null,
  formality text not null, -- 'casual' | 'polite' | 'formal'
  messages jsonb not null default '[]',
  total_corrections integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table conversation_sessions enable row level security;
create policy "Users can manage own sessions" on conversation_sessions for all using (auth.uid() = user_id);

-- ─── AI Explainer Cache ──────────────────────────────────────────────────────
-- Shared cache across all users — same question + wrong answer = same Claude response
create table if not exists explainer_cache (
  id uuid default gen_random_uuid() primary key,
  language_code text not null,
  question_id text not null,
  user_answer text not null,
  cefr_level text not null,
  explanation text not null,
  created_at timestamptz default now(),
  unique(language_code, question_id, user_answer, cefr_level)
);

-- Readable by all authenticated users (shared cache)
alter table explainer_cache enable row level security;
create policy "Authenticated users can read cache" on explainer_cache for select using (auth.role() = 'authenticated');
create policy "Service role can write cache" on explainer_cache for insert with check (true);

-- ─── Daily Conversation Usage (rate limiting) ────────────────────────────────
create table if not exists conversation_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  usage_date date not null default current_date,
  session_count integer not null default 0,
  unique(user_id, usage_date)
);

alter table conversation_usage enable row level security;
create policy "Users can manage own usage" on conversation_usage for all using (auth.uid() = user_id);

-- ─── Updated_at triggers ─────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger set_updated_at before update on profiles
  for each row execute procedure update_updated_at();
create trigger set_updated_at before update on user_progress
  for each row execute procedure update_updated_at();
create trigger set_updated_at before update on conversation_sessions
  for each row execute procedure update_updated_at();
