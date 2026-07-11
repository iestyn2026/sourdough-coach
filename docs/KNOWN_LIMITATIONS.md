# Known limitations & assumptions

Honest list of what the app assumes, simplifies, or can't do. Grows as the app does —
every shortcut taken during a milestone gets a line here.

## Current (PRD adopted, no app code yet)

- **Some rule numbers are interim defaults, not from the PRD** — salt basis (total vs
  added flour), diastatic malt %, and validation ranges. Marked ⚠️ in
  `SOURDOUGH_RULES.md`, awaiting Iestyn's confirmation.
- **Fermentation timing uses four coarse temperature bands** (15–18 / 18–21 / 21–24 /
  24–26°C), not a continuous model, and ignores flour type, starter vigor, and dough vs
  room temperature. Deliberate: estimates are guidance, sensory checks decide (PRD
  tone: never falsely precise). Temperatures outside 15–26°C are unhandled — the app
  should say so rather than extrapolate.
- **Assumes 100%-hydration starter** in all calculations (per PRD).
- **Data is per-browser, per-device** (no accounts, no sync, no backup). Clearing
  browser data deletes saved loaves (see `DECISIONS.md` #3).
- **Photos will strain localStorage** (~5MB quota ≈ a few loaves' worth of photos).
  Resolution deferred to the Loaf Log milestone (see `DECISIONS.md` #7).
- **Metric only** — grams and °C, as used throughout the PRD. No cups/ounces/°F.
- **Flour-mix hydration guidance is display-only** — the app never auto-adjusts water
  for flour type (explicit PRD requirement, not an oversight).
- **Placeholder code isn't type-checked yet** — toolchain arrives with milestone 1
  (see `DECISIONS.md` #5).
