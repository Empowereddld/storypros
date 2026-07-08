/* ─────────────────────────────────────────────
 * Retell Library
 * Every saved retell recording for a child, playable
 * by the parent (and, via ChildDetailView, any linked
 * SLP/teacher). Groups by story, newest first.
 * ───────────────────────────────────────────── */

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  deleteRetellRecording,
  getRetellRecordings,
  type RetellRecording,
} from "@/services/retell";
import { MiniPlane, Star } from "./StoryProsBrand";
import { BookIcon, ChevronLeftIcon } from "./StoryProsUi";

interface RetellLibraryScreenProps {
  childId: string;
  childName: string;
  onClose: () => void;
}

export function RetellLibraryScreen({ childId, childName, onClose }: RetellLibraryScreenProps) {
  const [recordings, setRecordings] = useState<(RetellRecording & { url: string })[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getRetellRecordings(childId).then((rows) => {
      if (!cancelled) setRecordings(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [childId]);

  async function handleDelete(recording: RetellRecording) {
    setRecordings((prev) => prev?.filter((r) => r.id !== recording.id) ?? prev);
    await deleteRetellRecording(recording.id, recording.storagePath);
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-accent/10 to-accent/35" />
        <Star className="absolute right-8 top-24 h-5 w-5 text-secondary animate-sparkle" />
        <Star className="absolute left-8 bottom-32 h-4 w-4 text-primary/25 animate-sparkle" />
        <MiniPlane className="absolute right-10 top-40 h-9 w-9 rotate-12 text-secondary/70 animate-float" />
      </div>

      <header className="relative z-10 flex items-center gap-3 px-5 pt-4">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-card press-pop"
          aria-label="Back"
        >
          <ChevronLeftIcon className="h-5 w-5 text-primary" />
        </button>
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-primary">
            Retell Library
          </p>
          <h1 className="font-display text-[22px] font-extrabold leading-tight text-primary">
            {childName}'s recordings
          </h1>
        </div>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto no-scrollbar px-5 pb-6 pt-4">
        {recordings === null && (
          <p className="mt-8 text-center text-sm font-semibold text-ink-soft">
            Loading recordings...
          </p>
        )}

        {recordings?.length === 0 && (
          <div className="mt-8 rounded-[28px] bg-card p-6 text-center shadow-soft">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-accent text-primary">
              <BookIcon className="h-8 w-8" />
            </div>
            <h2 className="mt-3 text-lg font-extrabold text-primary">No recordings yet</h2>
            <p className="mt-1 text-sm font-semibold leading-snug text-ink-soft">
              When {childName} records a retell during a story, it'll show up here for you to listen
              to anytime.
            </p>
          </div>
        )}

        {recordings && recordings.length > 0 && (
          <div className="space-y-3">
            {recordings.map((recording) => (
              <RecordingCard key={recording.id} recording={recording} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RecordingCard({
  recording,
  onDelete,
}: {
  recording: RetellRecording & { url: string };
  onDelete: (recording: RetellRecording) => void;
}) {
  const date = new Date(recording.createdAt);
  return (
    <div className="rounded-[24px] bg-card p-4 shadow-card animate-slide-up">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-extrabold text-primary">{recording.storyTitle}</p>
          <p className="mt-0.5 text-xs font-semibold text-ink-soft">
            {recording.phase === "immediate" ? "Right after the story" : "Retold later"} ·{" "}
            {date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase",
            recording.phase === "immediate"
              ? "bg-sky/25 text-primary"
              : "bg-secondary/25 text-secondary-foreground",
          )}
        >
          {recording.phase}
        </span>
      </div>

      <audio className="mt-3 w-full" controls preload="none" src={recording.url} />

      <button
        onClick={() => onDelete(recording)}
        className="mt-2 text-xs font-bold text-ink-soft underline decoration-dotted underline-offset-2 hover:text-destructive"
      >
        Delete recording
      </button>
    </div>
  );
}
