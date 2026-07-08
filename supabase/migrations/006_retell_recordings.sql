-- ============================================================
-- Story Pros — Retell Recordings
-- Lets a child's spoken retell be saved as audio and reviewed
-- later by the parent or any SLP/teacher linked to that child.
-- ============================================================

create table retell_recordings (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children on delete cascade,
  story_id text not null references stories on delete cascade,
  story_title text not null, -- denormalized for quick display
  phase text not null check (phase in ('immediate', 'delayed')),
  storage_path text not null, -- path within the retell-recordings bucket
  duration_seconds numeric,
  created_at timestamptz not null default now()
);

create index idx_retell_recordings_child on retell_recordings (child_id, created_at desc);

alter table retell_recordings enable row level security;

-- Parents manage recordings for their own children
create policy "Parents manage own retell recordings" on retell_recordings
  for all using (
    child_id in (select id from children where profile_id = auth.uid())
  );

-- SLPs/teachers see recordings for children in their caseload
create policy "SLPs see caseload retell recordings" on retell_recordings
  for select using (
    child_id in (select child_id from slp_caseload where slp_id = auth.uid())
  );

-- ── Storage bucket ──
-- Private bucket; access is gated entirely by the policies below,
-- keyed off the child_id folder prefix in each object's path
-- (e.g. "<child_id>/<recording_id>.webm").

insert into storage.buckets (id, name, public)
values ('retell-recordings', 'retell-recordings', false)
on conflict (id) do nothing;

create policy "Parents upload own child retell audio" on storage.objects
  for insert with check (
    bucket_id = 'retell-recordings'
    and (storage.foldername(name))[1]::uuid in (
      select id from children where profile_id = auth.uid()
    )
  );

create policy "Parents read own child retell audio" on storage.objects
  for select using (
    bucket_id = 'retell-recordings'
    and (storage.foldername(name))[1]::uuid in (
      select id from children where profile_id = auth.uid()
    )
  );

create policy "Parents delete own child retell audio" on storage.objects
  for delete using (
    bucket_id = 'retell-recordings'
    and (storage.foldername(name))[1]::uuid in (
      select id from children where profile_id = auth.uid()
    )
  );

create policy "SLPs read caseload retell audio" on storage.objects
  for select using (
    bucket_id = 'retell-recordings'
    and (storage.foldername(name))[1]::uuid in (
      select child_id from slp_caseload where slp_id = auth.uid()
    )
  );
