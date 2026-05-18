/* ─────────────────────────────────────────────
 * SLP Services
 * Manages caseload (linked children), story
 * assignments, and clinical session notes.
 *
 * Mock/localStorage for now — swap for Supabase
 * when the backend is connected.
 * ───────────────────────────────────────────── */

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

// ── Storage ──

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
  if (caseload.find((c) => c.childId === child.childId)) {
    return caseload.find((c) => c.childId === child.childId)!;
  }

  const entry: CaseloadChild = {
    ...child,
    linkedAt: new Date().toISOString(),
  };
  caseload.push(entry);
  saveCaseload(slpId, caseload);
  return entry;
}

export function removeChildFromCaseload(slpId: string, childId: string) {
  const caseload = loadCaseload(slpId).filter((c) => c.childId !== childId);
  saveCaseload(slpId, caseload);
}

export function updateCaseloadChild(slpId: string, childId: string, updates: Partial<CaseloadChild>) {
  const caseload = loadCaseload(slpId).map((c) =>
    c.childId === childId ? { ...c, ...updates } : c,
  );
  saveCaseload(slpId, caseload);
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
  return assignment;
}

export function updateAssignment(slpId: string, assignmentId: string, updates: Partial<StoryAssignment>) {
  const assignments = loadAssignments(slpId).map((a) =>
    a.id === assignmentId ? { ...a, ...updates } : a,
  );
  saveAssignments(slpId, assignments);
}

export function removeAssignment(slpId: string, assignmentId: string) {
  const assignments = loadAssignments(slpId).filter((a) => a.id !== assignmentId);
  saveAssignments(slpId, assignments);
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
  return note;
}

export function updateNote(slpId: string, noteId: string, updates: Partial<SessionNote>) {
  const notes = loadNotes(slpId).map((n) =>
    n.id === noteId ? { ...n, ...updates } : n,
  );
  saveNotes(slpId, notes);
}

export function deleteNote(slpId: string, noteId: string) {
  const notes = loadNotes(slpId).filter((n) => n.id !== noteId);
  saveNotes(slpId, notes);
}

// ── Demo data (for preview / testing) ──

export function seedDemoCaseload(slpId: string) {
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
