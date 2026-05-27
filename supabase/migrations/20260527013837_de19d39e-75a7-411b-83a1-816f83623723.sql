GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.children TO authenticated;
GRANT ALL ON public.children TO service_role;