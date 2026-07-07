# Phase 8 Parked Scope

Phase 8 is a product-scope guardrail. These mockup families remain parked and should not be implemented unless product scope changes:

- Daily Challenge on kid screens
- Emotion check-in
- Story creation, create-your-own, or My Stories authoring
- Avatar dress-up or avatar shop systems
- Chat, social, ratings, or reviews
- Mic or AI retell

## Active App Check

The active route set does not include dedicated routes for story creation, challenges, emotion check-in, avatar customization, chat/social, reviews, ratings, or mic/AI retell.

Checked with:

```bash
rg --files src/routes
rg -n "mic|microphone|voice|record|AI|retell|challenge|emotion|mood|create story|my stories|review|rating|social|chat|avatar shop|dress" src/components src/routes src/services
rg -n "Story Creation|Create Story|Create tab|My Stories|Challenges|Challenge|Avatar|avatar|dress|chat|social|review|rating|4\\.9|sci-fi|fantasy|Day Streak|daily streak|Stars Earned" src/components src/routes src/services
```

## Allowed Similar-Looking Areas

These are not parked mockup features and should stay:

- Decorative star artwork and the real 1-3 story-complete performance rating.
- Browser TTS playback for story text. This is not microphone input or AI retell.
- V1 retell screens that use tappable story-element icons. These are the approved retell interaction model.
- Parent-gate math challenge. This is a grown-up access check, not a kid daily challenge feature.
- Story vocabulary tagged as `emotion` and story-element labels such as Feeling. These are story data concepts, not an emotion check-in flow.
- Child avatars in profile selection, settings, and map placement. These are static profile visuals, not dress-up or avatar shop systems.
- Reward shop categories for Paper Planes, badges, wallpapers, lore cards, and airplane tricks. No avatar dress-up/shop route is exposed.

## Parking Rule

If a parked mockup has useful visual styling, borrow only the style language. Do not add routes, nav items, services, data models, copy, counters, calls to action, or empty states for the parked feature.
