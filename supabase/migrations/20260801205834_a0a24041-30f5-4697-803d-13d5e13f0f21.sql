DROP POLICY IF EXISTS "Anyone reads feedback" ON public.screen_feedback;

CREATE POLICY "Authenticated users read feedback"
ON public.screen_feedback
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

REVOKE SELECT ON public.screen_feedback FROM anon;