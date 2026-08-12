# Moment-to-moment coin rewards

Connect the learning activities to the coin system already in the app, so children see coins arrive the instant they succeed instead of only at the end of a story.

## The economy

One fully completed story = up to 100 coins.

| Activity | How coins are earned | Max |
|---|---|---|
| Read & Listen | finishing the reading section | 5 |
| Question Time | 6 questions (4 / 3 / 2) + 6 completion | 30 |
| Sequencing | 6 events (2 first try, 1 after support) + 3 completion | 15 |
| Story Words | 4 per completed word sequence + 3 completion | 15 |
| Sentences | 3 / 2 / 1 per response + completion bonus | 10 |
| Word Play (jokes) | completing the activity | 5 |
| Sound Play | completing the activity | 5 |
| Retell | 5 immediate + 5 delayed | 10 |
| **Total** | | **100** |

Rules baked in:
- Wrong answers never remove coins; supported success still earns (a smaller amount).
- Coins reward learning actions only — never a plain Next tap, never the Listen button.
- Each coin-earning action pays out once per story. Replays are free to practise but already-earned coins don't pay again.

## What the child sees

- A small persistent coin pill in the activity header: a coin icon and the running total.
- On a successful response: the answer gets its positive state, a small "+4" floats up beside it, a coin travels to the pill, and the number counts up. Roughly 600ms, and Next is never blocked or delayed by it.
- At the end of a section: a calm line in the existing section-complete moment — "Question Time complete! You earned 27 coins."
- At the end of the story: the existing completion screen shows the real story total ("You earned 91 coins") instead of the current performance-score payout.
- No confetti bursts, no full-screen interruptions, no sound spam.

## Rewards shop and badges

Shop items today cost 10-100 coins, which is far too cheap once a story pays up to 100. Prices get rescaled to the intended ladder: small collectible 100, accessory 200, better item 350, theme 500, premium 750, rare 1000. Existing balances are scaled up by the same factor so no child loses purchasing power.

Badges stay achievement-only and are never purchasable: coins are currency, badges are accomplishments.

## Technical notes

- New `src/services/coins.ts` module: the per-activity coin table, an `awardCoins(action, tier)` API that dedupes by `storyId + action key` for the current story run, and event emission for the UI.
- Award persistence reuses the existing `coins_ledger` write path in `src/services/progress.ts` (with a per-activity `reason`), so the parent dashboard and totals keep working. `calculatePaperPlanes` at story completion is replaced by the sum of awards actually earned during the run; the checkpoint payload carries earned awards so a resumed story doesn't double-pay.
- New `CoinPill` + `CoinBurst` presentation components; the pill mounts in `ProgressHeader.tsx`, the burst is anchored to the answering element in each phase.
- Phases wired to emit awards: `StorySlidesPhase`, `ComprehensionPhase` (per-attempt tier), `SequencingPhase`, `VocabularyIntroPhase` / `VocabularyQuizPhase` (per completed word), `SentenceBuilderPhase`, `JokePhase`, `PhonologicalPhase`, `ImmediateRetellPhase`, `DelayedRetellPhase`.
- Animations respect `prefers-reduced-motion` (number updates instantly, no travel).
- Single-viewport layouts already enforced on several phases stay intact — the pill lives in the existing header row and the burst is absolutely positioned.

## Out of scope for this pass

Avatar items, new collectibles, and parent-facing coin reporting beyond what already exists.
