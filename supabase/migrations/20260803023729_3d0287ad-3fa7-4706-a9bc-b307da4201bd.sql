-- 1. get_paper_planes: explicit caller + ownership check
DROP FUNCTION IF EXISTS public.get_paper_planes(uuid);

CREATE OR REPLACE FUNCTION public.get_paper_planes(p_child_id uuid, p_caller_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF p_caller_id IS NULL THEN
    RAISE EXCEPTION 'caller required';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM children WHERE id = p_child_id AND profile_id = p_caller_id
  ) AND NOT EXISTS (
    SELECT 1 FROM slp_caseload WHERE child_id = p_child_id AND slp_id = p_caller_id
  ) THEN
    RAISE EXCEPTION 'not authorized for this child';
  END IF;

  RETURN coalesce((SELECT sum(amount) FROM coins_ledger WHERE child_id = p_child_id), 0)::int;
END;
$$;

-- 2. create_slp_invite: explicit caller
DROP FUNCTION IF EXISTS public.create_slp_invite(uuid);

CREATE OR REPLACE FUNCTION public.create_slp_invite(p_child_id uuid, p_caller_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_code text;
BEGIN
  IF p_caller_id IS NULL THEN
    RAISE EXCEPTION 'caller required';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM children WHERE id = p_child_id AND profile_id = p_caller_id
  ) THEN
    RAISE EXCEPTION 'not your child profile';
  END IF;

  v_code := (
    SELECT string_agg(substr('23456789ABCDEFGHJKMNPQRSTUVWXYZ', (random() * 30)::int + 1, 1), '')
    FROM generate_series(1, 6)
  );

  INSERT INTO slp_invites (code, child_id, parent_id)
  VALUES (v_code, p_child_id, p_caller_id);

  RETURN v_code;
END;
$$;

-- 3. redeem_slp_invite: explicit caller
DROP FUNCTION IF EXISTS public.redeem_slp_invite(text);

CREATE OR REPLACE FUNCTION public.redeem_slp_invite(p_code text, p_caller_id uuid)
RETURNS TABLE(linked_child_id uuid, linked_child_name text, linked_parent_email text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_invite slp_invites%ROWTYPE;
  v_child children%ROWTYPE;
  v_parent profiles%ROWTYPE;
BEGIN
  IF p_caller_id IS NULL THEN
    RAISE EXCEPTION 'caller required';
  END IF;

  SELECT * INTO v_invite FROM slp_invites
  WHERE code = upper(trim(p_code)) AND used_at IS NULL AND expires_at > now()
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'invalid or expired code';
  END IF;

  SELECT * INTO v_child FROM children WHERE id = v_invite.child_id;
  SELECT * INTO v_parent FROM profiles WHERE id = v_invite.parent_id;

  UPDATE slp_invites
  SET used_by_slp = p_caller_id, used_at = now()
  WHERE id = v_invite.id;

  INSERT INTO slp_caseload (slp_id, child_id, child_name)
  VALUES (p_caller_id, v_child.id, v_child.name)
  ON CONFLICT (slp_id, child_id) DO NOTHING;

  RETURN QUERY SELECT v_child.id, v_child.name, coalesce(v_parent.email, '');
END;
$$;

-- 4. Lock all of them down to server-side use only
REVOKE ALL ON FUNCTION public.get_paper_planes(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_slp_invite(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.redeem_slp_invite(text, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_slp_caseload_summary(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_child_premium(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.process_expired_subscriptions() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_paper_planes(uuid, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.create_slp_invite(uuid, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.redeem_slp_invite(text, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.get_slp_caseload_summary(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.is_child_premium(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.process_expired_subscriptions() TO service_role;