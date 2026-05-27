## Full audit results

I walked the entire app (routes, AuthContext, Supabase clients, Lovable OAuth broker, sign-in/up screens, reset-password route, root layout, admin route, and all services) to verify the Claude + Codex GitHub pushes are wired correctly.

### What's already wired correctly
- **Auth flow** — `AuthContext` uses real Supabase with `onAuthStateChange` + `getSession`, profile/children load after sign-in, signup metadata patch + fallback insert.
- **LoginScreen** — Sign-in button now correctly uses `type="submit"`; `TactileButton` extends `ButtonHTMLAttributes` so the type is forwarded.
- **SignUpScreen** — Google/Apple buttons call `signInWithGoogle` / `signInWithApple` through the Lovable broker; email/password signup wired to `useAuth().signUp`.
- **`/reset-password` route** — Exists, calls `supabase.auth.updateUser`, navigates back home.
- **Root** — `AuthProvider` wraps `<Outlet />`; root metadata + 404 in place.
- **DB** — `profiles` + `children` tables have RLS scoped to `auth.uid()`, `handle_new_user` trigger inserts profile on signup, Data API GRANTs for `authenticated` + `service_role` were applied in the last migration.
- **No server functions** — App uses only the browser Supabase client, so the `attachSupabaseAuth` middleware in `src/start.ts` is not required.

### One real gap remains

**Google + Apple providers are not enabled in Supabase Auth.** The frontend correctly calls them via the Lovable broker, but the first attempt will fail with `Unsupported provider: provider is not enabled` until I run `configure_social_auth` with `providers: ["google", "apple"]`. This is the canonical "wire the broker AND enable in Supabase" pairing the Lovable docs require.

### Known mocks (pre-existing, not from the pushes)

- `src/services/subscription.ts` — uses `localStorage` for trial/subscription state.
- `src/services/slp.ts` — file is explicitly labeled "Mock/localStorage for now — swap for Supabase" (caseload, assignments, notes).

These were intentional placeholders before Cloud was added. Not blocking auth or the build, so I'm flagging them but **not changing them** in this pass unless you ask.

## Plan

1. Enable Google and Apple providers in Supabase Auth via `configure_social_auth` so the OAuth buttons in `SignUpScreen` actually complete the flow.
2. Smoke check: verify build is clean and confirm via a brief read that no other pushed file imports a missing module or stale mock auth path.

No code edits are needed — only the provider config change. If you want me to also migrate `subscription.ts` / `slp.ts` off `localStorage` onto Supabase in a follow-up, say the word and I'll plan that separately.
