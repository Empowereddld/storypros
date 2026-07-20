
-- 1) Tighten permissive RLS policies on screen_feedback
DROP POLICY IF EXISTS "Anyone submits feedback" ON public.screen_feedback;
DROP POLICY IF EXISTS "Anyone toggles status" ON public.screen_feedback;

CREATE POLICY "Authenticated submit feedback"
  ON public.screen_feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated toggle status"
  ON public.screen_feedback FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- 2) Remove denormalized parent_email PII from slp_caseload
-- Recreate redeem_slp_invite without parent_email
CREATE OR REPLACE FUNCTION public.redeem_slp_invite(p_code text)
 RETURNS TABLE(linked_child_id uuid, linked_child_name text, linked_parent_email text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_invite slp_invites%ROWTYPE;
  v_child children%ROWTYPE;
  v_parent profiles%ROWTYPE;
BEGIN
  SELECT * INTO v_invite FROM slp_invites
  WHERE code = upper(trim(p_code)) AND used_at IS NULL AND expires_at > now()
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'invalid or expired code';
  END IF;

  SELECT * INTO v_child FROM children WHERE id = v_invite.child_id;
  SELECT * INTO v_parent FROM profiles WHERE id = v_invite.parent_id;

  UPDATE slp_invites
  SET used_by_slp = auth.uid(), used_at = now()
  WHERE id = v_invite.id;

  INSERT INTO slp_caseload (slp_id, child_id, child_name)
  VALUES (auth.uid(), v_child.id, v_child.name)
  ON CONFLICT (slp_id, child_id) DO NOTHING;

  RETURN QUERY SELECT v_child.id, v_child.name, coalesce(v_parent.email, '');
END;
$function$;

-- Recreate caseload summary to join profiles for email
CREATE OR REPLACE FUNCTION public.get_slp_caseload_summary(p_slp_id uuid)
 RETURNS TABLE(child_id uuid, child_name text, parent_email text, tag text, stories_completed bigint, active_assignments bigint, latest_note_at timestamp with time zone)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT
    c.child_id,
    c.child_name,
    coalesce(p.email, ''),
    c.tag,
    (SELECT count(*) FROM story_progress sp WHERE sp.child_id = c.child_id AND sp.completed = true),
    (SELECT count(*) FROM story_assignments sa WHERE sa.child_id = c.child_id AND sa.slp_id = p_slp_id AND sa.status != 'completed'),
    (SELECT max(sn.created_at) FROM session_notes sn WHERE sn.child_id = c.child_id AND sn.slp_id = p_slp_id)
  FROM slp_caseload c
  LEFT JOIN children ch ON ch.id = c.child_id
  LEFT JOIN profiles p ON p.id = ch.profile_id
  WHERE c.slp_id = p_slp_id
  ORDER BY c.linked_at;
$function$;

ALTER TABLE public.slp_caseload DROP COLUMN IF EXISTS parent_email;

-- 3) Revoke anon EXECUTE on SECURITY DEFINER functions in public schema
REVOKE EXECUTE ON FUNCTION public.get_paper_planes(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_slp_caseload_summary(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_child_premium(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.create_slp_invite(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.redeem_slp_invite(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.process_expired_subscriptions() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_paper_planes(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_slp_caseload_summary(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_child_premium(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_slp_invite(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_slp_invite(text) TO authenticated;
