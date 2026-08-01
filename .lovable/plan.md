# Home page: simplify the two stat cards

My recommendation: yes, drop the icon tiles. The two cards already say "Stories Completed" and "Coins" in words, so the icon tile is decoration that eats about a third of each card's height and adds two more shapes to a page that already has a big hero image, a play pill, a level chip and a map button.

## What changes

Both cards become number-led instead of icon-led:

```text
before                    after
+------------------+      +------------------+
| [icon tile]      |      | 0                |
|                  |      | Stories Completed|
| 0                |      | Finish one to    |
| Stories Completed|      | start!           |
| Finish one...    |      +------------------+
+------------------+
```

- Remove the icon tile from both cards.
- Make the number the visual anchor (larger, purple for stories, gold-dark for coins) so the two cards stay distinguishable without icons.
- Keep a thin colour cue so they aren't identical grey boxes: a left accent edge or a tinted top-left corner in purple (stories) and gold (coins).
- Cards get shorter, which tightens the right rail on laptop and the two-up row on mobile.
- Coins card keeps its tap-through to the Shop, with a small "Shop" chevron hint on the right so it still reads as tappable now that the coin icon is gone.

## Icons kept elsewhere

The coin icon stays in the header currency badge (there it replaces text, so it earns its place), and the play icon stays on the "Continue Story" pill.

## Technical notes

- `src/components/empowered/HomeDashboardScreen.tsx`: drop the `icon` prop from `StatCardLite` and its two call sites, restructure the card body, remove the now-unused `BookOpenCheck` import.
- `CoinIcon` and `BookOpenCheck` stay available for other screens; no shared component is deleted.
