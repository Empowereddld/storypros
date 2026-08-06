-- Restrict grants: no direct INSERT for app users (linking goes through redeem_slp_invite)
REVOKE ALL ON public.slp_caseload FROM anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.slp_caseload TO authenticated;
GRANT ALL ON public.slp_caseload TO service_role;

-- Recreate policies scoped to authenticated role only
DROP POLICY IF EXISTS "Parents see child links" ON public.slp_caseload;
DROP POLICY IF EXISTS "SLPs see own caseload" ON public.slp_caseload;
DROP POLICY IF EXISTS "SLPs unlink own caseload" ON public.slp_caseload;
DROP POLICY IF EXISTS "SLPs update own caseload" ON public.slp_caseload;

CREATE POLICY "Parents see child links"
ON public.slp_caseload FOR SELECT TO authenticated
USING (child_id IN (SELECT children.id FROM public.children WHERE children.profile_id = auth.uid()));

CREATE POLICY "SLPs see own caseload"
ON public.slp_caseload FOR SELECT TO authenticated
USING (auth.uid() = slp_id);

CREATE POLICY "SLPs unlink own caseload"
ON public.slp_caseload FOR DELETE TO authenticated
USING (auth.uid() = slp_id);

CREATE POLICY "SLPs update own caseload"
ON public.slp_caseload FOR UPDATE TO authenticated
USING (auth.uid() = slp_id)
WITH CHECK (auth.uid() = slp_id);

-- Enforce immutability of identity columns and trusted child_name sourcing
CREATE OR REPLACE FUNCTION public.slp_caseload_guard()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT c.name INTO NEW.child_name FROM public.children c WHERE c.id = NEW.child_id;
    IF NEW.child_name IS NULL THEN
      RAISE EXCEPTION 'unknown child';
    END IF;
    RETURN NEW;
  END IF;

  IF NEW.slp_id IS DISTINCT FROM OLD.slp_id
     OR NEW.child_id IS DISTINCT FROM OLD.child_id THEN
    RAISE EXCEPTION 'caseload linkage is immutable';
  END IF;
  NEW.child_name := OLD.child_name;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.slp_caseload_guard() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_slp_caseload_guard_ins ON public.slp_caseload;
CREATE TRIGGER trg_slp_caseload_guard_ins
BEFORE INSERT ON public.slp_caseload
FOR EACH ROW EXECUTE FUNCTION public.slp_caseload_guard();

DROP TRIGGER IF EXISTS trg_slp_caseload_guard_upd ON public.slp_caseload;
CREATE TRIGGER trg_slp_caseload_guard_upd
BEFORE UPDATE ON public.slp_caseload
FOR EACH ROW EXECUTE FUNCTION public.slp_caseload_guard();