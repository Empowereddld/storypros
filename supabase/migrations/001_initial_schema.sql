-- ============================================================
-- Story Pros — Initial Database Schema
-- Must-complete scoring model (Option D)
-- ============================================================

-- ── Enums ──

create type user_role as enum ('parent', 'slp', 'teacher');
create type story_element as enum ('character', 'setting', 'problem', 'feeling', 'action', 'solution');
create type vocab_type as enum ('noun', 'emotion');
create type activity_type as enum ('comprehension', 'sequencing', 'vocab_quiz', 'sentence_builder', 'phonological');
create type skill_domain as enum ('listening', 'story_structure', 'vocabulary', 'grammar', 'phonological', 'retell');

-- ── Profiles ──

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  display_name text,
  role user_role not null default 'parent',
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
create policy "Users see own profile" on profiles for select using (auth.uid() = id);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);

-- ── Children ──

create table children (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles on delete cascade,
  name text not null,
  age int check (age between 3 and 15),
  current_level int not null default 1,
  level_override boolean not null default false,
  created_at timestamptz not null default now()
);

alter table children enable row level security;
create policy "Parents see own children" on children for select using (auth.uid() = profile_id);
create policy "Parents manage own children" on children for all using (auth.uid() = profile_id);

-- ── Stories ──

create table stories (
  id text primary key,
  title text not null,
  level int not null default 1,
  theme text,
  target_connective text,
  slide_count int not null default 5,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table stories enable row level security;
create policy "Stories are public" on stories for select using (true);

-- ── Story slides ──

create table story_slides (
  id uuid primary key default gen_random_uuid(),
  story_id text not null references stories on delete cascade,
  position int not null,
  text text not null,
  story_element story_element not null,
  image_url text,
  unique (story_id, position)
);

alter table story_slides enable row level security;
create policy "Slides are public" on story_slides for select using (true);

-- ── Comprehension questions ──

create table comprehension_questions (
  id uuid primary key default gen_random_uuid(),
  story_id text not null references stories on delete cascade,
  position int not null,
  prompt text not null,
  story_element story_element not null,
  options jsonb not null, -- [{id, label, emoji, correct}]
  brain_check_correct text not null,
  brain_check_wrong text not null,
  unique (story_id, position)
);

alter table comprehension_questions enable row level security;
create policy "Questions are public" on comprehension_questions for select using (true);

-- ── Vocabulary words ──

create table vocabulary_words (
  id uuid primary key default gen_random_uuid(),
  story_id text not null references stories on delete cascade,
  word text not null,
  type vocab_type not null,
  image_url text,
  sfa_category text not null,
  sfa_function text not null,
  sfa_appearance text not null,
  sfa_parts text not null,
  sfa_location text not null
);

alter table vocabulary_words enable row level security;
create policy "Vocab is public" on vocabulary_words for select using (true);

-- ── Vocabulary quiz questions ──

create table vocabulary_quiz_questions (
  id uuid primary key default gen_random_uuid(),
  vocabulary_word_id uuid not null references vocabulary_words on delete cascade,
  position int not null,
  prompt text not null,
  options jsonb not null, -- [{id, text, correct}]
  unique (vocabulary_word_id, position)
);

alter table vocabulary_quiz_questions enable row level security;
create policy "Vocab quiz is public" on vocabulary_quiz_questions for select using (true);

-- ── Sentence frames ──

create table sentence_frames (
  id uuid primary key default gen_random_uuid(),
  story_id text not null references stories on delete cascade,
  position int not null,
  frame_text text not null,
  choices jsonb not null, -- [{id, text, correct}]
  brain_check_prompt text not null,
  unique (story_id, position)
);

alter table sentence_frames enable row level security;
create policy "Frames are public" on sentence_frames for select using (true);

-- ── Sequencing frames ──

create table sequencing_frames (
  id uuid primary key default gen_random_uuid(),
  story_id text not null references stories on delete cascade,
  correct_position int not null,
  image_url text,
  caption text not null,
  unique (story_id, correct_position)
);

alter table sequencing_frames enable row level security;
create policy "Sequencing is public" on sequencing_frames for select using (true);

-- ── Story progress (per child × story) ──

create table story_progress (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children on delete cascade,
  story_id text not null references stories on delete cascade,
  completed boolean not null default false,
  completed_at timestamptz,
  first_attempt_accuracy float, -- 0–1, across all scored activities
  replay_count int not null default 0,
  created_at timestamptz not null default now(),
  unique (child_id, story_id)
);

alter table story_progress enable row level security;
create policy "Parents see child progress" on story_progress for select
  using (child_id in (select id from children where profile_id = auth.uid()));
create policy "System writes progress" on story_progress for insert
  with check (child_id in (select id from children where profile_id = auth.uid()));
create policy "System updates progress" on story_progress for update
  using (child_id in (select id from children where profile_id = auth.uid()));

-- ── Activity attempts (every question answered) ──

create table activity_attempts (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children on delete cascade,
  story_id text not null references stories on delete cascade,
  activity_type activity_type not null,
  question_index int not null,
  attempt_number int not null default 1,
  selected_option text,
  is_correct boolean not null,
  brain_check_response text,
  time_ms int,
  created_at timestamptz not null default now()
);

create index idx_attempts_child_story on activity_attempts (child_id, story_id);

alter table activity_attempts enable row level security;
create policy "Parents see child attempts" on activity_attempts for select
  using (child_id in (select id from children where profile_id = auth.uid()));
create policy "System writes attempts" on activity_attempts for insert
  with check (child_id in (select id from children where profile_id = auth.uid()));

-- ── Skill scores (rolling domain scores per child) ──

create table skill_scores (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children on delete cascade,
  domain skill_domain not null,
  score float not null default 0, -- 0–100 based on first-attempt accuracy
  stories_counted int not null default 0,
  updated_at timestamptz not null default now(),
  unique (child_id, domain)
);

alter table skill_scores enable row level security;
create policy "Parents see child scores" on skill_scores for select
  using (child_id in (select id from children where profile_id = auth.uid()));
create policy "System writes scores" on skill_scores for all
  using (child_id in (select id from children where profile_id = auth.uid()));

-- ── Daily streaks ──

create table daily_streaks (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children on delete cascade,
  streak_date date not null default current_date,
  stories_completed int not null default 0,
  unique (child_id, streak_date)
);

alter table daily_streaks enable row level security;
create policy "Parents see child streaks" on daily_streaks for select
  using (child_id in (select id from children where profile_id = auth.uid()));
create policy "System writes streaks" on daily_streaks for all
  using (child_id in (select id from children where profile_id = auth.uid()));

-- ── Paper Planes ledger (append-only) ──

create table coins_ledger (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children on delete cascade,
  amount int not null, -- positive = earn, negative = spend
  reason text not null,
  story_id text references stories,
  created_at timestamptz not null default now()
);

create index idx_coins_child on coins_ledger (child_id);

alter table coins_ledger enable row level security;
create policy "Parents see child coins" on coins_ledger for select
  using (child_id in (select id from children where profile_id = auth.uid()));
create policy "System writes coins" on coins_ledger for insert
  with check (child_id in (select id from children where profile_id = auth.uid()));

-- ── Function: calculate total Paper Planes ──

create or replace function get_paper_planes(p_child_id uuid)
returns int
language sql
stable
security definer
as $$
  select coalesce(sum(amount), 0)::int
  from coins_ledger
  where child_id = p_child_id;
$$;
