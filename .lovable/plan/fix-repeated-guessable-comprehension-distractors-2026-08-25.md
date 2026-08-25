# Fix repeated, guessable comprehension distractors

## The problem you spotted is real

Checking the story content files confirms it: 10 of the 11 stories use the exact same two wrong answers for "Who is in the story?" — "A cat" and "A robot". The pattern repeats across every question type:

- Where: "A store" / "The moon" in almost every story
- What went wrong: "He fell down" / "She lost her shoe"
- What did the character do / What happened after: "Went to sleep" / "Ate lunch" / "Went home"
- How did they feel: "Happy" / "Angry"

A child can score 6/6 without understanding the story by learning one rule: never pick the cat, the robot, the moon, or sleeping. That measures pattern-spotting, not comprehension. Story 01 (Dan and the Paper Cut) is the one story that does it right — its distractors are real items from that story pulled from other categories (a bandage, Daria's house, Dan's mom).

## What to change

Rewrite the two distractors for all 6 questions in stories 02-11 so each one is:

1. **Story-specific** — drawn from real people, places, objects, feelings, and actions in that same story, so nothing is dismissible as absurd.
2. **Cross-category** — still only one choice belongs to the category asked, keeping the existing Level 1 rule (WHO question -> exactly one person; the other two are a place, object, feeling, or action from the story).
3. **Non-repeating** — no distractor string reused for the same question slot across stories, and no fantasy filler (cat, robot, moon) anywhere.

Example for story 02 (Daria's Carnival Ticket), "Who is in the story?":
- Dan and Daria (correct, the only people)
- The carnival (place from the story)
- Her wet ticket (object from the story)

Feelings questions keep same-category choices, since "how did they feel" needs feeling options — but the wrong feelings become plausible near-misses tied to the story (e.g. worried / excited / surprised) instead of the fixed happy/angry pair.

## Also updated

- The stored project rule for Level 1 comprehension answers, so future stories follow the "story-specific, cross-category, no fantasy filler" standard automatically.

## Technical notes

- Edits are confined to `comprehension_questions[].options[].label` in `content/story-02*.json` through `content/story-11*.json`. Correct answers, ids, order, element tags, and the 3-choice structure stay as-is.
- No component changes needed; `ComprehensionPhase.tsx` reads labels from content and contains no hardcoded distractors.
- Answer shuffling/position stays as currently implemented, so the correct choice is not always in the same slot.
