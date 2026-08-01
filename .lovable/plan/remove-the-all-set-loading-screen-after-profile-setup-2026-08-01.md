# Remove the "All set!" loading screen after profile setup

The confetti "All set, Test! / Your adventure is ready" screen disappears. Continue on the child profile step saves the profile inline and drops the parent straight onto the Adventure Map.

## What changes

1. **Continue button becomes the loading indicator**
   - While saving: label changes to "Setting things up…" with a small spinner inside the button.
   - Button keeps its exact height/width so nothing shifts.
   - All fields (name, age, country, diagnosis checkboxes, free-text) and the back button are disabled while saving.

2. **Direct routing**
   - On success, navigate straight to the Adventure Map (`/map`), and mark onboarding complete so the app doesn't bounce back into onboarding.
   - The intermediate success screen route is removed from the flow. No artificial delay.

3. **Error handling**
   - If saving fails, the button returns to "Continue", fields re-enable, and a clear error message appears just above the button.
   - Everything already typed or selected stays exactly as entered.

## Technical notes

- `src/components/empowered/DataFormScreen.tsx`: add `submitting` and `error` props (or internal async submit handling), disable inputs, swap button content for spinner + "Setting things up…".
- `src/routes/_authenticated/onboarding/profile.tsx`: wrap `addChild` in try/catch, call `markOnboarded()` from `AuthContext` on success, then `navigate({ to: "/map" })`.
- Delete `src/routes/_authenticated/onboarding/success.tsx` and `src/components/empowered/SuccessScreen.tsx` (no other callers).
- Note: this bypasses the current post-setup assessment step (`/onboarding/assessment`), since the request is to go straight to the Adventure Map. The route stays in the codebase but is no longer part of onboarding — say the word if you'd rather keep it in the flow.
- Existing `addChild` profile-creation logic and the `/map` route are untouched.
