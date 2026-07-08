/* ─────────────────────────────────────────────
 * Retell Recordings
 * Uploads a child's spoken retell audio to Supabase
 * Storage and lists it back for the parent or any
 * SLP/teacher linked to that child. Demo/local children
 * (non-UUID ids) never touch the cloud — recording is a
 * cloud-only feature, gated by isCloudId().
 * ───────────────────────────────────────────── */

import { db, isCloudId, logSyncError } from "./cloud";
import { getStory } from "./stories";

const BUCKET = "retell-recordings";

export type RetellPhase = "immediate" | "delayed";

export interface RetellRecording {
  id: string;
  childId: string;
  storyId: string;
  storyTitle: string;
  phase: RetellPhase;
  storagePath: string;
  durationSeconds: number | null;
  createdAt: string;
}

/** Upload a recorded retell clip and log it, if this is a real cloud child. */
export async function uploadRetellRecording(
  childId: string,
  storyId: string,
  phase: RetellPhase,
  blob: Blob,
  durationSeconds: number,
): Promise<{ success: boolean; error?: string }> {
  if (!isCloudId(childId)) {
    return { success: false, error: "Recording is only saved for signed-in accounts." };
  }

  const storyTitle = getStory(storyId)?.title ?? storyId;
  const path = `${childId}/${crypto.randomUUID()}.webm`;

  const { error: uploadError } = await db.storage.from(BUCKET).upload(path, blob, {
    contentType: blob.type || "audio/webm",
  });
  if (uploadError) {
    logSyncError("upload retell recording")(uploadError);
    return { success: false, error: "Couldn't save the recording. Please try again." };
  }

  const { error: insertError } = await db.from("retell_recordings").insert({
    child_id: childId,
    story_id: storyId,
    story_title: storyTitle,
    phase,
    storage_path: path,
    duration_seconds: durationSeconds,
  });
  if (insertError) {
    logSyncError("insert retell recording")(insertError);
    return { success: false, error: "Couldn't save the recording. Please try again." };
  }

  return { success: true };
}

/** List every retell recording for a child, newest first, with a playable signed URL. */
export async function getRetellRecordings(
  childId: string,
): Promise<(RetellRecording & { url: string })[]> {
  if (!isCloudId(childId)) return [];

  const { data, error } = await db
    .from("retell_recordings")
    .select("*")
    .eq("child_id", childId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    if (error) logSyncError("load retell recordings")(error);
    return [];
  }

  const withUrls = await Promise.all(
    data.map(async (row: Record<string, unknown>) => {
      const { data: signed } = await db.storage
        .from(BUCKET)
        .createSignedUrl(row.storage_path as string, 60 * 60);
      return {
        id: row.id as string,
        childId: row.child_id as string,
        storyId: row.story_id as string,
        storyTitle: row.story_title as string,
        phase: row.phase as RetellPhase,
        storagePath: row.storage_path as string,
        durationSeconds: (row.duration_seconds as number) ?? null,
        createdAt: row.created_at as string,
        url: signed?.signedUrl ?? "",
      };
    }),
  );

  return withUrls.filter((r) => r.url);
}

/** Delete a recording (storage object + row). */
export async function deleteRetellRecording(id: string, storagePath: string): Promise<void> {
  await db.storage.from(BUCKET).remove([storagePath]);
  const { error } = await db.from("retell_recordings").delete().eq("id", id);
  if (error) logSyncError("delete retell recording")(error);
}
