/* ─────────────────────────────────────────────
 * Cloud sync helpers
 *
 * The app uses a cache-first hybrid model:
 *   - localStorage stays the synchronous cache that
 *     screens read directly (no async refactor needed)
 *   - Supabase (via Lovable Cloud) is the source of
 *     truth: services hydrate from it on child switch
 *     and write through on every mutation
 *   - Demo/seed children have non-UUID ids and are
 *     never synced to the cloud
 *
 * Note: `db` is loosely typed because Lovable's
 * generated Database type (integrations/supabase/types.ts)
 * only covers profiles/children until its next codegen
 * pass picks up the new tables.
 * ───────────────────────────────────────────── */

import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/** Supabase client without the (stale) generated table types */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = supabase as unknown as SupabaseClient<any, "public", any>;

/** True when an id is a real cloud UUID (demo children use slugs like "demo-child-ava") */
export function isCloudId(id: string | null | undefined): boolean {
  return !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

/** Fire-and-forget error handler for background cloud writes */
export function logSyncError(scope: string) {
  return (err: unknown) => {
    console.warn(`[cloud-sync] ${scope} failed:`, err);
  };
}

/** Notify screens that cached data changed (after async hydration) */
export function emitDataUpdated(topic: string): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(`storypros:${topic}-updated`));
  }
}
