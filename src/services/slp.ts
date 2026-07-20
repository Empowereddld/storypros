/* ─────────────────────────────────────────────
 * SLP Services
 * Manages caseload (linked children), story
 * assignments, and clinical session notes.
 *
 * Cache-first hybrid:
 *   - localStorage = synchronous cache the dashboard reads
 *   - slp_caseload / story_assignments / session_notes
 *     tables = source of truth
 *   - hydrateSlpFromCloud(slpId) refreshes the cache and
 *     emits "storypros:slp-updated"; mutations write through
 *   - Demo SLP accounts (non-UUID ids) stay local-only
 * ───────────────────────────────────────────── */

import { db, isCloudId, logSyncError, emitDataUpdated } from "./cloud";

// ── Types ──

export interface CaseloadChild {
  /** The child's profile ID (from parent's account) */
  childId: string;
  /** Display name (copied at link time, may be stale) */
  childName: string;
  /** Parent's email for identification */
  parentEmail: string;
  /** When the child was added to this SLP's caseload */
  linkedAt: string; // ISO date
  /** Optional clinical label / group */
  tag?: string;
}

export interface StoryAssignment {
  id: string;
  childId: string;
  storyId: string;
  storyTitle: string;
  assignedAt: string; // ISO date
  dueBy?: string; // ISO date, optional
  status: "assigned" | "in_progress" | "completed";
  completedAt?: string;
}

export interface SessionNote {
  id: string;
  childId: string;
  date: string; // ISO date
  /** Free-text clinical note */
  content: string;
  /** Optional story the note relates to */
  storyId?: string;
  /** Tags for filtering */
  tags: string[];
}

// ── Storage (synchronous cache) ──

const CASELOAD_KEY = "storypros_slp_caseload";
const ASSIGNMENTS_KEY = "storypros_slp_assignments";
const NOTES_KEY = "storypros_slp_notes";

function loadCaseload(slpId: string): CaseloadChild[] {
  try {
    const raw = localStorage.getItem(`${CASELOAD_KEY}_${slpId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveCaseload(slpId: string, data: CaseloadChild[]) {
  localStorage.setItem(`${CASELOAD_KEY}_${slpId}`, JSON.stringify(data));
}

function loadAssignments(slpId: string): StoryAssignment[] {
  try {
    const raw = localStorage.getItem(`${ASSIGNMENTS_KEY}_${slpId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveAssignments(slpId: string, data: StoryAssignment[]) {
  localStorage.setItem(`${ASSIGNMENTS_KEY}_${slpId}`, JSON.stringify(data));
}

function loadNotes(slpId: string): SessionNote[] {
  try {
    const raw = localStorage.getItem(`${NOTES_KEY}_${slpId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveNotes(slpId: string, data: SessionNote[]) {
  localStorage.setItem(`${NOTES_KEY}_${slpId}`, JSON.stringify(data));
}

// ── Cloud hydration ──

interface CaseloadRow {
  child_id: string;
  child_name: string;
  tag: string | null;
  linked_at: string;
  children?: { profiles?: { email: string | null } | null } | null;
}

interface AssignmentRow {
  id: string;
  child_id: string;
  story_id: string;
  story_title: string;
  status: "assigned" | "in_progress" | "completed";
  assigned_at: string;
  due_by: string | null;
  completed_at: string | null;
}

interface NoteRow {
  id: string;
  child_id: string;
  story_id: string | null;
  content: string;
  tags: string[] | null;
  created_at: string;
}

/**
 * Pull this SLP's caseload, assignments, and notes from Supabase
 * into the local cache. No-op for demo SLPs (non-UUID ids).
 */
export async function hydrateSlpFromCloud(slpId: string): Promise<void> {
  if (!isCloudId(slpId)) return;
  try {
    const [caseloadRes, assignmentsRes, notesRes] = await Promise.all([
      db
        .from("slp_caseload")
        .select("child_id, child_name, parent_email, tag, linked_at")
        .eq("slp_id", slpId)
        .order("linked_at", { ascending: true }),
      db
        .from("story_assignments")
        .select("id, child_id, story_id, story_title, status, assigned_at, due_by, completed_at")
        .eq("slp_id", slpId)
        .order("assigned_at", { ascending: false }),
      db
        .from("session_notes")
        .select("id, child_id, story_id, content, tags, created_at")
        .eq("slp_id", slpId)
        .order("created_at", { ascending: false }),
    ]);
    if (caseloadRes.error) throw caseloadRes.error;
    if (assignmentsRes.error) throw assignmentsRes.error;
    if (notesRes.error) throw notesRes.error;

    saveCaseload(
      slpId,
      ((caseloadRes.data ?? []) as CaseloadRow[]).map((r) => ({
        childId: r.child_id,
        childName: r.child_name,
        parentEmail: r.parent_email,
        linkedAt: r.linked_at,
        tag: r.tag ?? undefined,
      })),
    );
    saveAssignments(
      slpId,
      ((assignmentsRes.data ?? []) as AssignmentRow[]).map((r) => ({
        id: r.id,
        childId: r.child_id,
        storyId: r.story_id,
        storyTitle: r.story_title,
        assignedAt: r.assigned_at,
        dueBy: r.due_by ?? undefined,
        status: r.status,
        completedAt: r.completed_at ?? undefined,
      })),
    );
    saveNotes(
      slpId,
      ((notesRes.data ?? []) as NoteRow[]).map((r) => ({
        id: r.id,
        childId: r.child_id,
        date: r.created_at,
        content: r.content,
        storyId: r.story_id ?? undefined,
        tags: r.tags ?? [],
      })),
    );
    emitDataUpdated("slp");
  } catch (err) {
    logSyncError("hydrate slp")(err);
  }
}

/** True when both ids are cloud UUIDs (skip sync for demo data) */
function shouldSync(slpId: string, childId?: string): boolean {
  return isCloudId(slpId) && (childId === undefined || isCloudId(childId));
}

// ── Invite-code consent flow ──
// Parents generate a code (createInviteCode); SLPs redeem it
// (redeemInviteCode). Direct caseload inserts are blocked by RLS —
// this is the only way a real child joins a caseload.

export async function createInviteCode(
  childId: string,
): Promise<{ code?: string; error?: string }> {
  if (!isCloudId(childId)) {
    return { error: "Demo children can't be shared with an SLP." };
  }
  try {
    const { data, error } = await db.rpc("create_slp_invite", {
      p_child_id: childId,
    });
    if (error) throw error;
    return { code: data as string };
  } catch (err) {
    logSyncError("create invite")(err);
    return { error: "Couldn't create a code right now. Please try again." };
  }
}

export async function redeemInviteCode(
  slpId: string,
  code: string,
): Promise<{ success: boolean; childName?: string; error?: string }> {
  if (!isCloudId(slpId)) {
    return {
      success: false,
      error: "Invite codes require a signed-in clinician account.",
    };
  }
  try {
    const { data, error } = await db.rpc("redeem_slp_invite", {
      p_code: code,
    });
    if (error) throw error;
    const row = (data as { linked_child_name?: string }[] | null)?.[0];
    await hydrateSlpFromCloud(slpId);
    return { success: true, childName: row?.linked_child_name };
  } catch (err) {
    logSyncError("redeem invite")(err);
    return {
      success: false,
      error: "That code is invalid or has expired. Ask the parent for a new one.",
    };
  }
}

// ── Caseload management ──

export function getCaseload(slpId: string): CaseloadChild[] {
  return loadCaseload(slpId);
}

export function addChildToCaseload(
  slpId: string,
  child: { childId: string; childName: string; parentEmail: string; tag?: string },
): CaseloadChild {
  const caseload = loadCaseload(slpId);

  // Don't add duplicates
  const existing = caseload.find((c) => c.childId === child.childId);
  if (existing) return existing;

  const entry: CaseloadChild = {
    ...child,
    linkedAt: new Date().toISOString(),
  };
  caseload.push(entry);
  saveCaseload(slpId, caseload);

  if (shouldSync(slpId, child.childId)) {
    void db
      .from("slp_caseload")
      .upsert(
        {
          slp_id: slpId,
          child_id: child.childId,
          child_name: child.childName,
          parent_email: child.parentEmail,
          tag: child.tag ?? null,
          linked_at: entry.linkedAt,
        },
        { onConflict: "slp_id,child_id" },
      )
      .then(({ error }) => {
        if (error) logSyncError("upsert caseload")(error);
      });
  }
  return entry;
}

export function removeChildFromCaseload(slpId: string, childId: string) {
  const caseload = loadCaseload(slpId).filter((c) => c.childId !== childId);
  saveCaseload(slpId, caseload);

  if (shouldSync(slpId, childId)) {
    void db
      .from("slp_caseload")
      .delete()
      .eq("slp_id", slpId)
      .eq("child_id", childId)
      .then(({ error }) => {
        if (error) logSyncError("delete caseload")(error);
      });
  }
}

export function updateCaseloadChild(slpId: string, childId: string, updates: Partial<CaseloadChild>) {
  const caseload = loadCaseload(slpId).map((c) =>
    c.childId === childId ? { ...c, ...updates } : c,
  );
  saveCaseload(slpId, caseload);

  if (shouldSync(slpId, childId)) {
    const payload: Record<string, unknown> = {};
    if (updates.childName !== undefined) payload.child_name = updates.childName;
    if (updates.parentEmail !== undefined) payload.parent_email = updates.parentEmail;
    if (updates.tag !== undefined) payload.tag = updates.tag ?? null;
    if (Object.keys(payload).length === 0) return;
    void db
      .from("slp_caseload")
      .update(payload)
      .eq("slp_id", slpId)
      .eq("child_id", childId)
      .then(({ error }) => {
        if (error) logSyncError("update caseload")(error);
      });
  }
}

// ── Story assignments ──

export function getAssignments(slpId: string, childId?: string): StoryAssignment[] {
  const all = loadAssignments(slpId);
  return childId ? all.filter((a) => a.childId === childId) : all;
}

export function assignStory(
  slpId: string,
  childId: string,
  storyId: string,
  storyTitle: string,
  dueBy?: string,
): StoryAssignment {
  const assignments = loadAssignments(slpId);
  const assignment: StoryAssignment = {
    id: crypto.randomUUID(),
    childId,
    storyId,
    storyTitle,
    assignedAt: new Date().toISOString(),
    dueBy,
    status: "assigned",
  };
  assignments.push(assignment);
  saveAssignments(slpId, assignments);

  if (shouldSync(slpId, childId)) {
    void db
      .from("story_assignments")
      .insert({
        id: assignment.id,
        slp_id: slpId,
        child_id: childId,
        story_id: storyId,
        story_title: storyTitle,
        status: "assigned",
        assigned_at: assignment.assignedAt,
        due_by: dueBy ?? null,
      })
      .then(({ error }) => {
        if (error) logSyncError("insert assignment")(error);
      });
  }
  return assignment;
}

export function updateAssignment(slpId: string, assignmentId: string, updates: Partial<StoryAssignment>) {
  const assignments = loadAssignments(slpId).map((a) =>
    a.id === assignmentId ? { ...a, ...updates } : a,
  );
  saveAssignments(slpId, assignments);

  if (isCloudId(slpId)) {
    const payload: Record<string, unknown> = {};
    if (updates.status !== undefined) payload.status = updates.status;
    if (updates.dueBy !== undefined) payload.due_by = updates.dueBy ?? null;
    if (updates.completedAt !== undefined) payload.completed_at = updates.completedAt ?? null;
    if (Object.keys(payload).length === 0) return;
    void db
      .from("story_assignments")
      .update(payload)
      .eq("id", assignmentId)
      .eq("slp_id", slpId)
      .then(({ error }) => {
        if (error) logSyncError("update assignment")(error);
      });
  }
}

export function removeAssignment(slpId: string, assignmentId: string) {
  const assignments = loadAssignments(slpId).filter((a) => a.id !== assignmentId);
  saveAssignments(slpId, assignments);

  if (isCloudId(slpId)) {
    void db
      .from("story_assignments")
      .delete()
      .eq("id", assignmentId)
      .eq("slp_id", slpId)
      .then(({ error }) => {
        if (error) logSyncError("delete assignment")(error);
      });
  }
}

// ── Session notes ──

export function getNotes(slpId: string, childId?: string): SessionNote[] {
  const all = loadNotes(slpId);
  return childId ? all.filter((n) => n.childId === childId) : all;
}

export function addNote(
  slpId: string,
  childId: string,
  content: string,
  options?: { storyId?: string; tags?: string[] },
): SessionNote {
  const notes = loadNotes(slpId);
  const note: SessionNote = {
    id: crypto.randomUUID(),
    childId,
    date: new Date().toISOString(),
    content,
    storyId: options?.storyId,
    tags: options?.tags ?? [],
  };
  notes.push(note);
  saveNotes(slpId, notes);

  if (shouldSync(slpId, childId)) {
    void db
      .from("session_notes")
      .insert({
        id: note.id,
        slp_id: slpId,
        child_id: childId,
        story_id: note.storyId ?? null,
        content,
        tags: note.tags,
        created_at: note.date,
      })
      .then(({ error }) => {
        if (error) logSyncError("insert note")(error);
      });
  }
  return note;
}

export function updateNote(slpId: string, noteId: string, updates: Partial<SessionNote>) {
  const notes = loadNotes(slpId).map((n) =>
    n.id === noteId ? { ...n, ...updates } : n,
  );
  saveNotes(slpId, notes);

  if (isCloudId(slpId)) {
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (updates.content !== undefined) payload.content = updates.content;
    if (updates.tags !== undefined) payload.tags = updates.tags;
    if (updates.storyId !== undefined) payload.story_id = updates.storyId ?? null;
    void db
      .from("session_notes")
      .update(payload)
      .eq("id", noteId)
      .eq("slp_id", slpId)
      .then(({ error }) => {
        if (error) logSyncError("update note")(error);
      });
  }
}

export function deleteNote(slpId: string, noteId: string) {
  const notes = loadNotes(slpId).filter((n) => n.id !== noteId);
  saveNotes(slpId, notes);

  if (isCloudId(slpId)) {
    void db
      .from("session_notes")
      .delete()
      .eq("id", noteId)
      .eq("slp_id", slpId)
      .then(({ error }) => {
        if (error) logSyncError("delete note")(error);
      });
  }
}

// ── Demo data (for preview / testing) ──
// Only used for demo SLP accounts; cloud SLPs see real caseload data.

export function seedDemoCaseload(slpId: string) {
  if (isCloudId(slpId)) return; // never seed fake children into real accounts
  const existing = loadCaseload(slpId);
  if (existing.length > 0) return; // already seeded

  const demoChildren: CaseloadChild[] = [
    {
      childId: "demo-child-1",
      childName: "Maya Johnson",
      parentEmail: "maya.parent@email.com",
      linkedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      tag: "Group A",
    },
    {
      childId: "demo-child-2",
      childName: "Liam Chen",
      parentEmail: "liam.parent@email.com",
      linkedAt: new Date(Date.now() - 21 * 86400000).toISOString(),
      tag: "Group A",
    },
    {
      childId: "demo-child-3",
      childName: "Sofia Martinez",
      parentEmail: "sofia.parent@email.com",
      linkedAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      tag: "Group B",
    },
  ];

  saveCaseload(slpId, demoChildren);

  // Demo assignments
  const demoAssignments: StoryAssignment[] = [
    {
      id: crypto.randomUUID(),
      childId: "demo-child-1",
      storyId: "dan-and-the-paper-cut",
      storyTitle: "Dan and the Paper Cut",
      assignedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      status: "completed",
      completedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
    {
      id: crypto.randomUUID(),
      childId: "demo-child-1",
      storyId: "darias-carnival-ticket",
      storyTitle: "Daria's Carnival Ticket",
      assignedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      status: "assigned",
    },
    {
      id: crypto.randomUUID(),
      childId: "demo-child-2",
      storyId: "dan-and-the-paper-cut",
      storyTitle: "Dan and the Paper Cut",
      assignedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      status: "in_progress",
    },
  ];
  saveAssignments(slpId, demoAssignments);

  // Demo notes
  const demoNotes: SessionNote[] = [
    {
      id: crypto.randomUUID(),
      childId: "demo-child-1",
      date: new Date(Date.now() - 5 * 86400000).toISOString(),
      content: "Maya completed Dan's Paper Cut with strong comprehension. Used 'because' correctly in 2/3 sentence frames. Needs more support with sequencing — got frames 4 and 5 reversed.",
      storyId: "dan-and-the-paper-cut",
      tags: ["comprehension", "sequencing"],
    },
    {
      id: crypto.randomUUID(),
      childId: "demo-child-2",
      date: new Date(Date.now() - 3 * 86400000).toISOString(),
      content: "Liam started Dan's Paper Cut today. Good engagement with story slides. Needed 3 replays on slide 4. Vocabulary recall strong for 'bandage' but struggled with 'papercut'.",
      storyId: "dan-and-the-paper-cut",
      tags: ["vocabulary", "engagement"],
    },
  ];
  saveNotes(slpId, demoNotes);
}
