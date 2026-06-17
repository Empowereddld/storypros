-- ============================================================
-- 005 · SLP invite-code consent flow
-- Parents generate a short-lived code; SLPs redeem it to link
-- a child. Direct caseload INSERT by SLPs is removed — linking
-- only happens through redeem_slp_invite() with parent consent.
-- Applied to the live Lovable Cloud DB on 2026-06-11.
-- ============================================================

CREATE TABLE IF NOT EXISTS slp_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  child_id uuid NOT NULL REFERENCES children ON DELETE CASCADE,
  parent_id uuid NOT NULL REFERENCES profiles ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT now() + interval '7 days',
  used_by_slp uuid REFERENCES profiles,
  used_at timestamptz
);
CREATE INDEX IF NOT EXISTS idx_slp_invites_code ON slp_invites (code) WHERE used_at IS NULL;
ALTER TABLE slp_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents see own invites" ON slp_invites FOR SELECT
  USING (parent_id = auth.uid());
CREATE POLICY "Parents create invites for own children" ON slp_invites FOR INSERT
  WITH CHECK (
    parent_id = auth.uid()
    AND child_id IN (SELECT id FROM children WHERE profile_id = auth.uid())
  );
CREATE POLICY "Parents revoke own invites" ON slp_invites FOR DELETE
  USING (parent_id = auth.uid());

-- Tighten caseload: no direct INSERT for SLPs anymore
DROP POLICY IF EXISTS "SLPs manage own caseload" ON slp_caseload;
CREATE POLICY "SLPs update own caseload" ON slp_caseload FOR UPDATE
  USING (auth.uid() = slp_id);
CREATE POLICY "SLPs unlink own caseload" ON slp_caseload FOR DELETE
  USING (auth.uid() = slp_id);

CREATE OR REPLACE FUNCTION create_slp_invite(p_child_id uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_code text;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM children WHERE id = p_child_id AND profile_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'not your child profile';
  END IF;

  -- 6-char unambiguous code (no 0/O/1/I)
  v_code := (
    SELECT string_agg(substr('23456789ABCDEFGHJKMNPQRSTUVWXYZ', (random() * 30)::int + 1, 1), '')
    FROM generate_series(1, 6)
  );

  INSERT INTO slp_invites (code, child_id, parent_id)
  VALUES (v_code, p_child_id, auth.uid());

  RETURN v_code;
END;
$$;

CREATE OR REPLACE FUNCTION redeem_slp_invite(p_code text)
RETURNS TABLE (linked_child_id uuid, linked_child_name text, linked_parent_email text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
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

  INSERT INTO slp_caseload (slp_id, child_id, child_name, parent_email)
  VALUES (auth.uid(), v_child.id, v_child.name, coalesce(v_parent.email, ''))
  ON CONFLICT (slp_id, child_id) DO NOTHING;

  RETURN QUERY SELECT v_child.id, v_child.name, coalesce(v_parent.email, '');
END;
$$;
