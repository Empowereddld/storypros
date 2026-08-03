# Polish the Section Intro screens

All seven activity intros ("Question Time", "Put It in Order", "Story Words", "Build a Sentence", "Word Play", "Sound Play", "Tell the Story") share one component. Right now they read as three unrelated floating objects on a big empty field: an oversized title, a buddy + bubble pair, and a wide button. The fix is a single tightened composition with a real card, deliberate spacing, and correct proportions.

## What changes visually

1. **Group everything into one panel.** Buddy + bubble + Start live inside a single soft white card (max ~640px, 28px radius, subtle border and card shadow) centered on the cream field. This gives the content a container instead of floating in space.

2. **Rebalance the title.** Drop from 26/32px to 22/26px, add a small uppercase label above it ("Next activity", letter-spaced, muted) so the heading reads as a section marker rather than the hero. The buddy and the instruction become the visual hero.

3. **Fix buddy proportions and grounding.** Buddy scales to ~190/230px and sits flush against the bubble with a soft elliptical ground shadow beneath the feet so they no longer float. Vertical alignment moves from center to bottom-aligned on desktop so head height reads naturally next to the bubble.

4. **Clean up the bubble.** Move the speaker button out of the paragraph flow — it becomes a circular button pinned to the bubble's top-left corner (slightly overlapping the border), so the sentence has a clean left edge and consistent line starts. Bubble text goes to 17/19px with 1.5 line-height and a max ~34ch measure so lines break in readable chunks. Bubble tint stays buddy-themed (Dan lilac, Daria gold) but at lower saturation with a 2px border.

5. **Spacing scale, applied consistently.** Fixed rhythm instead of ad-hoc margins: label→title 8px, title→buddy group 24/28px, buddy group→divider 24px, divider→button 20px. A hairline divider above the Start button separates "what you'll do" from "act now".

6. **Start button.** Constrained to 260px mobile / 300px desktop (currently 340/400 which reads like a form submit), height 56px, soft shadow only, with a small forward chevron after the label.

7. **Vertical centering that behaves.** The panel is centered with a max-height guard so on short viewports content scrolls instead of stretching, and on tall desktop viewports the panel doesn't drift to the middle of a huge void — it sits slightly above center (~45%).

8. **Motion.** Keep the existing one-time fade/slide entrance, staggered label → title → panel → button. No looping bob, per the existing rule.

## Technical notes

- All work is contained in `src/components/empowered/phases/SectionIntro.tsx`. No changes to `StoryEngine.tsx`, phase order, copy, or props.
- Uses existing tokens only (`cream`, `card`, `primary`, `secondary`, `secondary-deep`, `accent`, `shadow-card`, `font-display`). No new colors, no hardcoded hex.
- Speaker button keeps its current `aria-pressed` / `aria-label` behavior and the `stopLabelSpeech` cleanup; only its position changes.
- Responsive: single column stacked on mobile (buddy above bubble, bubble tail points up), two column from `sm:` up.
