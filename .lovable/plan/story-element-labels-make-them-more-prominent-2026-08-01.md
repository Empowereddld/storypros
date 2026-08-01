# Story Element Labels: Make Them More Prominent?

## Current state
The reader shows one element marker per slide: an 11×11 icon circle + small uppercase label (e.g. "CHARACTER") in muted ink above the artwork. The labels are the core story-grammar scaffold children are meant to learn, but they currently read as quiet metadata.

## Expert opinion
They should be more prominent — but not noisy. These six labels (Character, Place, Problem, Feeling, Action, Result) are the pedagogical backbone of the app. When a child sees "Problem" on slide 3 and "Result" on slide 6, the label is doing the teaching. Right now it blends into the page chrome.

## Three directions

### A. Color-coded pill badges (recommended)
Give each story element its own soft background color and turn the marker into a rounded pill.
- Larger, more legible label
- Color creates instant pattern recognition across stories
- Keeps the marker compact and anchored above the art
- Example mapping: Character = blue, Place = green, Problem = coral, Feeling = pink, Action = yellow, Result = purple

### B. Top-center chapter banner
Move the element marker to a centered banner that sits above the image like a chapter heading.
- Most prominent option
- Helps children anticipate what to look for on the slide
- Adds a little more vertical space

### C. Minimal contrast bump
Keep the current circle + label layout, but:
- Increase label size and weight
- Switch from muted ink to primary text
- Add a subtle background pill behind the label
- Smallest change, lowest risk

## Suggested scope
- Update `StorySlidesPhase.tsx` element marker
- Add color tokens or use existing semantic palette
- No changes to story data, navigation, or audio

## Recommendation
Direction A: color-coded pill badges. It gives the labels the presence they deserve without adding new page chrome, and the color coding reinforces the learning pattern.
