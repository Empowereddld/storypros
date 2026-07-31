# Where the intro screens went — and how to wire them back in

Yes, I remember that request, and the four intro screens still exist. Nothing was deleted.

What I confirmed by reading the code:

- The four screens live in `IntroCarousel.tsx` and render at the `/intro` route, in the exact order you asked for: Read, Watch & Listen → Understand, Retell & Connect → Earn Coins & Rewards → Meet Dan & Daria. The refinements (logo top-left, Skip top-right hidden on screen 4, four progress dots with a pill for the active step, Next/Get Started CTA, three-card rows, simplified reward card, character cards) are all in place.
- The reason you don't see them: nothing in the signed-in flow routes to `/intro` anymore. Sign-up sends people straight to `/onboarding/profile`, and the authenticated gate also redirects un-onboarded users straight to `/onboarding/profile`. So the intro is skipped and you land on Create Your Child's Profile (and then `/onboarding/assessment`, which is where you are now).

## The fix

1. Make the intro the first step of onboarding again:
   - Sign-up completion goes to the intro instead of the profile form.
   - The authenticated gate sends un-onboarded users to the intro first; once they've moved past it they continue to the profile form as they do today.
   - "Skip" and "Get Started" both land on Create Your Child's Profile, as specified.
   - The profile screen's Back button continues to return to the intro.
2. Keep the intro reachable at its current URL so the existing route structure, demo entry point, and the screen catalog listing stay valid.

## Also worth deciding

Your spec asks for a small uppercase **GROWN-UP SETUP** label above "Create your child's profile" — but in your last message you asked me to remove that pill, so it's gone right now. Unless you say otherwise I'll leave it removed and keep the rest of the profile-screen spacing and behaviour as-is.

## Technical notes

- Routing changes only: `src/routes/signup.tsx`, `src/routes/_authenticated.tsx`, plus a small "intro seen" flag (stored per-session in the browser) so returning un-onboarded users aren't trapped in the intro loop.
- No changes to `IntroCarousel.tsx` unless a screenshot pass after wiring shows a spacing or sizing deviation from the spec; in that case I'll adjust only the offending values.
- No auth, database, or branding changes.
