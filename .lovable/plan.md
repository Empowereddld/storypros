# Onboarding + profile screens — design review

Reviewing the three intro slides and the child profile setup as a whole flow. The visual language is consistent and the copy is good. What's holding it back is mostly rhythm, honesty of the progress indicator, and a few accessibility gaps.

## Intro carousel

1. **Content jumps between slides.** Slide 1 aligns to the top while slides 2 and 3 centre themselves, so the heading moves vertically as you tap Next. All three should share one vertical anchor so the header and button stay put.
2. **No visible way back.** Swipe and arrow keys go back, but there is no control for it. A quiet back chevron in the header (mirroring the profile screen) makes the flow reversible, and the space is already reserved next to the logo.
3. **The dots are decoration only.** They can't be tapped and don't announce the active step to screen readers. Making them real buttons with the current step marked gives orientation and a shortcut.
4. **The Next button is very wide on desktop** (up to 560px) while every other primary action in the flow tops out around 320px. Aligning it makes the whole onboarding feel like one product.
The Meet Dan & Daria slide stays exactly as it is — no description lines, no crop changes.

## Profile setup screen

6. **The progress indicator is wrong.** It says "Step 1 of 3" and fills one third of the bar, but this is the last thing a parent fills in before the story starts. It should read as the final step, or the step count should cover the real flow.
7. **A phantom gap under the heading.** There's an empty paragraph left where the supporting sentence used to be, which pushes the first card down for no reason.
8. **Nothing tells the parent what's required.** Continue stays disabled until name, age, country *and* a diagnosis choice are all filled, but nothing is marked required and there's no hint about what's missing. Required markers plus a short line under the disabled button ("Add your child's name, age, country and one diagnosis option") removes the guesswork.
9. **The "other diagnosis" field has no label** — only a placeholder, which disappears as soon as typing starts and is invisible to screen readers. It needs a visible label.
10. **The disabled Continue button looks enabled.** It keeps full opacity with a slightly lighter purple, which reads as tappable. It should look clearly inactive while still legible.
11. **The Continue button is shorter than every other primary button** (48px vs 56px), which makes the most important action on the screen the smallest one.
12. **The second card's heading is vague.** "Tell us more about your child" sits above a single question; naming the section for what it actually asks is clearer.

## One thing that is not cosmetic

Country, diagnoses, and the custom diagnosis are collected but never saved — only name and age reach the database. A parent fills in required fields that then disappear. This needs a small storage change, so it's called out separately: say the word and I'll extend the child record to keep them.

## What I'd change

- One shared vertical layout across all three intro slides.
- Back chevron in the intro header; dots become real, announced step controls.
- Intro primary button width aligned with the rest of the flow (320px cap).
- One-line descriptions on Dan and Daria, matched portrait crops.
- Honest step label and progress fill on the profile screen.
- Remove the phantom empty paragraph.
- Required markers, a hint line for the disabled state, and a real label on the custom diagnosis field.
- Disabled Continue reads as disabled; button height matched to 56px.
- Clearer heading on the diagnosis card.

## Not changing

Palette, typography, routes, the approved copy on headings and slides, and the diagnosis option list all stay as they are. No behaviour changes beyond the navigation affordances listed above.

## Technical notes

Presentational work in `src/components/empowered/IntroCarousel.tsx` and `src/components/empowered/DataFormScreen.tsx`; the step label/count is passed from `src/routes/_authenticated/onboarding/profile.tsx`. Unused icon components left over from earlier slide versions get removed in the same pass. Persisting country and diagnoses would require a migration plus a change to `addChild` in `AuthContext` — excluded until you confirm.
