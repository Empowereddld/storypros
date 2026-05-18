-- ============================================================
-- Story Pros — SLP / Teacher Dashboard Tables
-- Caseload management, story assignments, session notes
-- ============================================================

-- ── SLP Caseload (links an SLP/teacher to children) ──

create table slp_caseload (
  id uuid primary key default gen_random_uuid(),
  slp_id uuid not null references profiles on delete cascade,
  child_id uuid not null references children on delete cascade,
  child_name text not null, -- denormalized for quick display
  parent_email text not null,
  tag text, -- optional grouping label (e.g. "Group A")
  linked_at timestamptz not null default now(),
  unique (slp_id, child_id)
);

alter table slp_caseload enable row level security;

-- SLPs see their own caseload
create policy "SLPs see own caseload" on slp_caseload
  for select using (auth.uid() = slp_id);

-- SLPs manage their own caseload
create policy "SLPs manage own caseload" on slp_caseload
  for all using (auth.uid() = slp_id);

-- Parents can see if their child is linked to an SLP
create policy "Parents see child links" on slp_caseload
  for select using (
    child_id in (select id from children where profile_id = auth.uid())
  );

-- ── Story Assignments (SLP assigns stories to children) ──

create type assignment_status as enum ('assigned', 'in_progress', 'completed');

create table story_assignments (
  id uuid primary key default gen_random_uuid(),
  slp_id uuid not null references profiles on delete cascade,
  child_id uuid not null references children on delete cascade,
  story_id text not null references stories on delete cascade,
  story_title text not null, -- denormalized for quick display
  status assignment_status not null default 'assigned',
  assigned_at timestamptz not null default now(),
  due_by timestamptz,
  completed_at timestamptz
);

create index idx_assignments_slp on story_assignments (slp_id);
create index idx_assignments_child on story_assignments (child_id);

alter table story_assignments enable row level security;

-- SLPs manage their own assignments
create policy "SLPs manage own assignments" on story_assignments
  for all using (auth.uid() = slp_id);

-- Parents see assignments for their children
create policy "Parents see child assignments" on story_assignments
  for select using (
    child_id in (select id from children where profile_id = auth.uid())
  );

-- ── Session Notes (clinical notes per child) ──

create table session_notes (
  id uuid primary key default gen_random_uuid(),
  slp_id uuid not null references profiles on delete cascade,
  child_id uuid not null references children on delete cascade,
  story_id text references stories, -- optional: note tied to a specific story
  content text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_notes_slp_child on session_notes (slp_id, child_id);

alter table session_notes enable row level security;

-- SLPs manage their own notes
create policy "SLPs manage own notes" on session_notes
  for all using (auth.uid() = slp_id);

-- ── SLP access to child progress data ──
-- SLPs need to read progress for children in their caseload

create policy "SLPs see caseload progress" on story_progress
  for select using (
    child_id in (
      select child_id from slp_caseload where slp_id = auth.uid()
    )
  );

create policy "SLPs see caseload attempts" on activity_attempts
  for select using (
    child_id in (
      select child_id from slp_caseload where slp_id = auth.uid()
    )
  );

create policy "SLPs see caseload scores" on skill_scores
  for select using (
    child_id in (
      select child_id from slp_caseload where slp_id = auth.uid()
    )
  );

create policy "SLPs see caseload streaks" on daily_streaks
  for select using (
    child_id in (
      select child_id from slp_caseload where slp_id = auth.uid()
    )
  );

-- ── Function: get SLP caseload summary ──

create or replace function get_slp_caseload_summary(p_slp_id uuid)
returns table (
  child_id uuid,
  child_name text,
  parent_email text,
  tag text,
  stories_completed bigint,
  active_assignments bigint,
  latest_note_at timestamptz
)
language sql
stable
security definer
as $$
  select
    c.child_id,
    c.child_name,
    c.parent_email,
    c.tag,
    (select count(*) from story_progress sp where sp.child_id = c.child_id and sp.completed = true),
    (select count(*) from story_assignments sa where sa.child_id = c.child_id and sa.slp_id = p_slp_id and sa.status != 'completed'),
    (select max(sn.created_at) from session_notes sn where sn.child_id = c.child_id and sn.slp_id = p_slp_id)
  from slp_caseload c
  where c.slp_id = p_slp_id
  order by c.linked_at;
$$;
