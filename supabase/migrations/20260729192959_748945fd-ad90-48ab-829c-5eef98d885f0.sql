GRANT SELECT, INSERT ON public.screen_feedback TO anon;
CREATE POLICY "Anyone can submit feedback" ON public.screen_feedback FOR INSERT TO anon WITH CHECK (author IS NULL OR length(author) <= 80);