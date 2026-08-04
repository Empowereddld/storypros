# Tighten the landing-page hero copy

## What feels wordy

The hero currently stacks four separate text blocks before the CTAs:

1. **Eyebrow**: "Story-based language learning for ages 5–12"
2. **H1**: "Language learning through interactive stories"
3. **Subheading**: "Learning that feels like a story, not a lesson."
4. **Body**: "Designed for children with DLD and other language-learning needs, Story Pros turns relatable stories into meaningful, guided language practice."

The repetition is real: the word "story/stories" appears four times and "learning" appears three times before the user even reaches a button. The eyebrow and the headline essentially say the same thing, and the subheading adds a fourth line that restates the premise rather than the benefit.

## The fix: make each line do one job

Reduce to three lines with distinct roles:

```text
Eyebrow  → Who it's for
Headline → The big promise
Body     → The specific outcome
```

Proposed copy:

- **Eyebrow**: "For children ages 5–12 with language-learning needs"  
  (was: "Story-based language learning for ages 5–12")
- **H1**: "Language learning through interactive stories"  
  (keep — it is the clearest promise)
- **Body**: "Story Pros helps children understand, retell, and connect through guided stories."  
  (remove the subheading and merge the benefit into one shorter line)

This removes the redundant "story-based" / "not a lesson" framing and gives the CTA group more visual weight.

## Layout polish

- Slightly reduce the top padding on tablet/desktop so the app preview stays closer to the fold.
- Keep the eyebrow pill compact and content-hugging; do not let it stretch.
- Preserve mobile stacking and the existing button wording ("Try the Demo", "Join the Waitlist").

## Files to change

- `src/data/landingContent.ts` — update `HERO` object.
- `src/components/empowered/LandingPage.tsx` — remove the separate subheading paragraph, keep eyebrow/H1/body, adjust spacing if needed.

## Verification

- Screenshot the hero at 1440px, 768px, and 390px.
- Confirm the headline remains prominent, the body is readable, and the CTA pair sits above the fold on desktop.
