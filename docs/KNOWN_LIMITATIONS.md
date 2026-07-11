# Known limitations & assumptions

Honest list of what the app assumes, simplifies, or can't do. Grows as the app does —
every shortcut taken during a milestone gets a line here.

## Current (project setup stage — no app code yet)

- **The rules in `SOURDOUGH_RULES.md` are draft defaults**, not yet reviewed against the
  PRD or Iestyn's own baking practice. Numbers (salt %, fermentation times, temperature
  ranges) are common baselines, not validated facts.
- **Fermentation prediction is inherently approximate.** Flour type, starter health, and
  ambient conditions all matter and the model ignores most of them. The app will present
  estimates as guidance and defer to sensory checks — it will never claim precision.
- **Data will be per-browser, per-device** (localStorage, no accounts). Clearing browser
  data deletes saved bakes. No sync, no backup (see `DECISIONS.md` #3).
- **Placeholder code isn't type-checked yet** — the TypeScript toolchain arrives with the
  first build milestone (see `DECISIONS.md` #5).
- **Assumes 100%-hydration starter** in all calculations until a reason to support other
  ratios appears.
- **Metric grams and °C only** assumed for MVP; cups/ounces/°F support is not planned
  unless the PRD asks for it.
