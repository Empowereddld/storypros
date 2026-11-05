# Bring stories 2-11 up to date with story 1

## Already shared by all 11 stories (no work needed)
Screen layouts and behaviour changed today apply to every story automatically:
- Word quiz: no "Show Answers" button, feature icon left / speaker right, coins per right answer
- Feeling words: group, looks like, similar words (all feeling-word choices)
- Two brain check-ins (after Put It In Order, after Sentence Builder)
- Sentence Builder: speakers in cards, short Check Answer button, no Brain Check pop-up
- Joke: question first, "Tap to see the answer", "Joke" label
- Second rhyming question (one-syllable words), new rhyme feedback wording
- Tell it again: one screen, Action label, record / listen / re-record / delete, nothing saved
- New Story check screen, "What About You?" intro removed, subtitle, no Think and Share pill
- You did it! screen: no stars, no skills box, Earned + Total, speakers

## Only done in story 1 so far (this plan)
1. **"Get the joke?" notes** - write a 3-line note for each of the 10 other jokes in the same style ("A ___ is ... / But ___ means ... / The joke uses two meanings of the word ___!"). While doing this, flag any joke whose two meanings are too similar or that reads like a story instead of a question + punchline, and rewrite it.
2. **"What About You?" question** - shorten each story's question to one sentence like story 1 (e.g. "Have you ever felt left out when other kids were playing?"), since the subtitle now asks them to share using all the story parts.
3. **Sentence Builder wrong choices** - check every story and replace wrong choices that sound too close to the right answer (like the injury choice fixed in story 1).

## Not included unless you say so
- Changing the 5 stories whose first sound question is "starts with the same sound" into rhymes.

## Notes
- All new lines play in the device's voice until recorded.
- I'll list every new joke note, question and replaced choice for your review.

## Technical details
Edits are content-only in `content/story-02..11*.json`: add `joke.explanation` arrays, trim `personal_connection.prompt`, adjust `sentence_builder` option text. No component changes.
