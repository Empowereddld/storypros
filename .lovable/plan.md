# Refine the seven activity intro screens

All seven intros already share one reusable component (`SectionIntro`) driven by a copy table in the story engine. This update rewrites the copy, changes the buttons, and tightens the layout — no new layouts, no activity changes.

## Copy updates (copy table in the story engine)

| Order | New title | Buddy | Instruction |
|---|---|---|---|
| 1 | Question Time | Dan | Read or listen to the question. Then choose the best answer. |
| 2 | Put It in Order | Daria | Put the story pictures in order, from what happened first to what happened last. |
| 3 | Story Words | Dan | Let's practise some words from the story. Tap each picture to hear the word and learn what it means. |
| 4 | Build a Sentence | Daria | Choose the word that makes the sentence make sense. Tap or drag it into place. |
| 5 | Word Play | Dan | Some words can mean more than one thing. Learn the meanings, then listen to the joke and see what makes it funny. |
| 6 | Sound Play | Daria | Listen to the word. Then choose the answer that rhymes or starts with the same sound. |
| 7 | Tell the Story | Dan | Now tell the story in your own words. Use the pictures and hints to help you remember. |

No exclamation marks in titles. Instructions are single-idea, no "First… Then… After that" chaining, Canadian spelling ("practise"). Internal phase keys stay unchanged so nothing else in the flow breaks.

## Buttons

- Audio button label becomes **Listen to Dan** / **Listen to Daria** (speaking state: "Stop Dan" / "Stop Daria"). It reads exactly the bubble text — no expanded spoken script.
- Remove the standalone circular-arrow replay button. The Listen button itself replays on tap.
- Primary CTA becomes **Start** (no chevron, no secondary action beneath it).
- Start stays the strongest action; Listen stays visually secondary (coral, secondary weight). Both keep 48px+ height and existing focus/hover/pressed states.

## Layout and type

- Vertical rhythm inside the centred column: title → 32px → character + bubble → 28px → audio → 28px → Start. Replaces the current uniform gap.
- Title: ~34px mobile, ~44px desktop/tablet, existing bold display style, centred.
- Bubble: max width ~600px, body text 20–22px on tablet/desktop, line-height ~1.45, internal padding ~30px, existing colours and tail.
- Bubble paragraph becomes **left-aligned** on all screens for a predictable reading anchor; the title stays centred.
- Character keeps existing artwork, pose, and scale, stays beside the bubble on wider screens and stacks above it on narrow widths; bubble keeps a comfortable minimum width so text never gets squeezed.

## Verification

Check the flow at desktop, landscape tablet, portrait tablet, and narrow widths: titles on one line where possible, bubble text readable and not overly wide, Start visually dominant, audio matching the on-screen text.

## Out of scope

Palette, background, artwork, typography, activity screens, story content, and navigation are untouched.
