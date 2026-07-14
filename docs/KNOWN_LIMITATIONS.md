# Known limitations & assumptions

Honest list of what the app assumes, simplifies, or can't do. Grows as the app does —
every shortcut taken during a milestone gets a line here.

## Current

- **Planner clock times sit at range midpoints** — real doughs will run early or late;
  the visible ranges and "dough decides" language carry the honesty
  (SOURDOUGH_RULES.md §4).
- **"Tomorrow morning/evening" are fixed at 8am/6pm** ⚠️ — not yet configurable.
- **Pages don't share state** — the planner asks for starter % again instead of reading
  the calculator (deliberate until the bake-session milestone, `DECISIONS.md` #10).
- **Guided Bake steps have no times attached** — the checklist tells you what and how,
  the Planner tells you when; they're not linked yet. One bake at a time, and the
  final "log the result" step can't hand off to the Loaf Log until that page exists.
- **Oven temperatures are app-chosen drafts** ⚠️ (SOURDOUGH_RULES.md §9), assuming a
  lidded Dutch oven.
- **Troubleshooting answers are app-drafted** ⚠️ — questions come from the PRD, but
  every answer awaits Iestyn's review (`src/lib/sourdough/faq.ts`). No search box:
  25 questions scan fine; add one if the list grows.
- **The Starter Builder plans a single feed only.** Starting from a very small jar, it
  advises "feed again at peak" rather than scheduling multiple feeds
  (see `DECISIONS.md` #9).
- **The 5g build buffer and the rye/spelt "peaks sooner" note are app-chosen** ⚠️, not
  from the PRD.
- **Ratio peak times and the temperature-band estimate are independent approximations**
  and can disagree at the extremes (a 1:3:3 feed in a warm kitchen won't really peak in
  3–5 hours). The plan shows the temperature-band number; the ratio guidance flags the
  direction (SOURDOUGH_RULES.md §3).
- **Flour breakdown lines are rounded individually**, so with some mixes they can sum
  to a gram or two off the added-flour total (e.g. 570g split three ways). Cosmetic;
  fix if it bothers anyone.
- **Dough feel wording and inclusion amounts are app-invented drafts**
  (`SOURDOUGH_RULES.md` §7–8 ⚠️), not from the PRD or validated by baking.
- **Results update live while typing** — mid-keystroke values briefly show odd numbers
  or a validation message (see `DECISIONS.md` #8).
- **`npm` isn't on the shell PATH** — Node lives in `~/.local/node`; run the app with
  `scripts/dev.sh` (see `DECISIONS.md` #8).

## From setup (still true)

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
- **Photo capacity: roughly 6–10 fully-photographed loaves.** Photos are downscaled
  to ≤1000px JPEGs (~80–150KB each) but localStorage's ~5MB quota is finite. The app
  reports a full quota honestly; the fix at that point is deleting old entries or
  migrating photos to IndexedDB (`DECISIONS.md` #12).
- **Log entries can't be edited** — add and delete only. A typo means re-entering.
- **The "Log this bake" handoff pre-fills the date only** — amounts don't flow from
  the calculator into the log yet (needs the shared bake-session state,
  `DECISIONS.md` #10/#12).
- **Metric only** — grams and °C, as used throughout the PRD. No cups/ounces/°F.
- **Flour-mix hydration guidance is display-only** — the app never auto-adjusts water
  for flour type (explicit PRD requirement, not an oversight).
