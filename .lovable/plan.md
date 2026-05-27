## Audit results

I reviewed everything that landed via the GitHub pushes (auth context, routes, Supabase integration, Lovable OAuth wrapper, migrations). Most of it is wired correctly:

- `AuthContext` is real Supabase, with `onAuthStateChange` + `getSession`, `signUp/signIn/signOut/resetPassword`, Google + Apple via `@/integrations/lovable`.
- `SignUpScreen` calls `signInWithGoogle` / `signInWithApple` on its buttons.
- `profiles` + `children` tables exist with RLS, policies, `handle_new_user` trigger on `auth.users`, and `updated_at` trigger.
- Routes shell is intact (`__root.tsx`, `index.tsx`, `reset-password.tsx`, `admin/content.tsx`).
- `src/integrations/lovable/index.ts` properly hands tokens back to `supabase.auth.setSession`.

However two real wiring bugs remain:

### 1. `profiles` / `children` have NO Data API grants

Current grants on both tables: only `sandbox_exec`. PostgREST roles (`authenticated`, `service_role`, `anon`) have nothing. As soon as the AuthContext tries `supabase.from("profiles").select(...)` after sign-in, it will fail with a permission error and the user will appear "logged in but broken."

Fix via migration:
```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.children TO authenticated;
GRANT ALL ON public.children TO service_role;
```
(No `anon` grant — every policy is scoped to `auth.uid()`.)

### 2. `LoginScreen` sign-in button does nothing

The form has a proper `handleSubmit` that calls `signIn`, but the submit button is:
```tsx
<TactileButton onClick={() => {}} disabled={...}>Sign in</TactileButton>
```
`onClick` is an empty no-op and there's no `type="submit"`, so pressing the button never submits the form. Email/password login is currently dead on this screen.

Fix: change to `<TactileButton type="submit" onClick={handleSubmit} ...>` (and ensure `TactileButton` forwards `type`; if it doesn't, just wire `onClick={handleSubmit}` which already accepts the event).

## Plan

1. Add a migration granting Data API privileges on `profiles` and `children` to `authenticated` and `service_role`.
2. Patch `src/components/empowered/LoginScreen.tsx` so the Sign-in button actually triggers `handleSubmit` (wire `onClick={handleSubmit}` and add `type="submit"`; verify `TactileButton` forwards `type`, otherwise relying on `onClick` is enough).
3. Quick verification: typecheck, then a smoke check that a fresh signup → profile row appears and login completes without permission errors.

No other files need changes. Google/Apple buttons, reset-password route, signup trigger, RLS, and the Supabase clients are all correctly in place.

Nothing else from the external pushes is broken.
