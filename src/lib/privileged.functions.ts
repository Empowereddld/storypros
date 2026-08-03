/* ─────────────────────────────────────────────
 * Privileged database helpers
 *
 * These wrap SECURITY DEFINER database functions that
 * are no longer executable by signed-in users directly.
 * The caller is verified here (bearer token -> userId)
 * and passed explicitly to the database function.
 * ───────────────────────────────────────────── */

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

export const getPaperPlanes = createServerFn({ method: "POST" })
  .middleware([attachSupabaseAuth, requireSupabaseAuth])
  .inputValidator((input: { childId: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: total, error } = await supabaseAdmin.rpc("get_paper_planes", {
      p_child_id: data.childId,
      p_caller_id: context.userId,
    });
    if (error) throw new Error(error.message);
    return { total: (total as number | null) ?? 0 };
  });

export const createSlpInvite = createServerFn({ method: "POST" })
  .middleware([attachSupabaseAuth, requireSupabaseAuth])
  .inputValidator((input: { childId: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: code, error } = await supabaseAdmin.rpc("create_slp_invite", {
      p_child_id: data.childId,
      p_caller_id: context.userId,
    });
    if (error) throw new Error(error.message);
    return { code: code as string };
  });

export const redeemSlpInvite = createServerFn({ method: "POST" })
  .middleware([attachSupabaseAuth, requireSupabaseAuth])
  .inputValidator((input: { code: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin.rpc("redeem_slp_invite", {
      p_code: data.code,
      p_caller_id: context.userId,
    });
    if (error) throw new Error(error.message);
    const row = (rows as { linked_child_name?: string }[] | null)?.[0];
    return { childName: row?.linked_child_name };
  });
