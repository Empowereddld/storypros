# Remove diagnosis free-text subheading while keeping the input field

## Goal
On the Create Your Child's Profile screen, remove the visible subheading "Something else? Tell us here" above the free-text diagnosis field, but keep the input so parents can still type a diagnosis that is not in the checkbox list.

## Current state
In `src/components/empowered/DataFormScreen.tsx`, the diagnosis card contains:
- A fieldset legend: "Does your child have a diagnosis?"
- A helper: "Select all that apply."
- A grid of diagnosis checkboxes.
- A label: "Something else? Tell us here"
- An `<input id="other-diagnosis" ...>` with placeholder "Type a diagnosis not listed above".

## Changes
1. In `src/components/empowered/DataFormScreen.tsx`:
   - Remove the `<label htmlFor="other-diagnosis">` element that renders "Something else? Tell us here".
   - Keep the `<input id="other-diagnosis">` unchanged so the free-text option remains available.
   - Move the top margin (`mt-6`) from the removed label to the input itself so the spacing between the checkbox grid and the text field stays visually balanced.

## Outcome
Parents can still type a custom diagnosis, but the extra subheading is gone, making the form feel cleaner and less repetitive.
