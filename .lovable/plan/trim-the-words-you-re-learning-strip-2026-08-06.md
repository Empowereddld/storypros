# Trim the "Words you're learning" strip

## My honest read

Yes — it's too wordy for a kids dashboard. Each card carries a 3-line definition, which turns a quick "here are your words" glance into a reading task. Kids already get the full definition inside the Story Words activity, so the dashboard only needs to say *which* words they're working on and let them hear each one.

There's also a small copy problem visible in the third card: "It's a feeling you get when describes how the character felt" is broken sentence text coming from the story data, which makes the wordiness more obvious.

## What to change

1. Drop the definition line from the dashboard word cards. Keep: circular image, the word, and the speaker button.
2. Make the cards more compact and word-forward — bigger word text, smaller card height, so three words read as a tidy row instead of three paragraphs.
3. Show a short label under the word only when it adds no reading burden (e.g. nothing at all by default). Definitions stay in the vocabulary activity where they belong.
4. Keep the header, the icon, and "View all words" exactly as they are.

## Technical notes

- Single file: `src/components/empowered/HomeDashboardScreen.tsx`, inside `WordsStrip`.
- Remove the `word.sfa.function` line, reduce card padding, bump word size, keep `SpeakButton` and the image tile.
- No data or backend changes; the broken "calm" definition text is only hidden here, not edited.
