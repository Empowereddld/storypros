# Comprehension screen: cut the "think first" gate and simplify the question card

## What isn't working

1. **Two screens to answer one question.** The "Think about the story first / Show answers" gate adds a tap and a second layout for every question. For a child who just heard the page read aloud, it delays the actual task and doubles the screens.
2. **The question card is overloaded.** A purple `?` tile, a "QUESTION 1" eyebrow, the question, a "Choose the right answer." line, and a play button all compete in one box. The progress header already says "Question 1 of 6".
3. **Emoji tiles fight the answer text.** A 56px emoji plus a letter badge plus the label means three things to scan per row; the emoji carries no meaning for "Dan" vs "A robot".
4. **Duplicated audio controls.** The play button in the card and the "Listen again" pill do the same thing; "Look again" reveals text that partially repeats the story clue image already on screen.
5. **The question itself is vague.** "Who is in the story?" with options Dan / a robot / a cat isn't a real comprehension check — the distractors aren't in the story at all.

## Changes

### Flow
- Remove the "Think about the story first" gate entirely; options render immediately with the question.

### Question card
- Remove the purple `?` badge, the "QUESTION 1" eyebrow, and "Choose the right answer.".
- Card becomes: speaker button + question text, vertically centered, question at the current display size.

### Answer rows
- Remove the emoji tile. Each row is letter badge + label + selected check, with a slightly shorter row height so all options fit without scrolling.

### Support row
- Remove both "Listen again" and "Look again" (and the hint panel they controlled). The card's speaker button stays as the single audio control; the "Story clue" image stays.

### Content
- Question 1 prompt becomes **"Who walked with Dan?"**. Its options must change too, since Dan/robot/cat no longer answer it: **His mom** (correct), plus **A bird** and **Daria's dad** as in-story-plausible distractors. Brain-check lines stay as-is (they're about answering WHO with a person).

## Files
- `src/components/empowered/phases/ComprehensionPhase.tsx`
- `content/story-01-dan-and-the-paper-cut.json`
