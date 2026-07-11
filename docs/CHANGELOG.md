# Changelog

Meaningful changes only — things that affect what the app does, how it's structured, or
what a rule says. Newest first.

## 2026-07-11 — Ratio guidance (Iestyn's feedback)

- 1:2:2 now carries a "Recommended" tag; a one-line description of the selected ratio
  sits under the buttons; the expandable explainer became "Which ratio should I use?"
  with Iestyn's quick summary of all three ratios and their peak windows.
- `SOURDOUGH_RULES.md` §3 gained the ratio-choice table.

## 2026-07-11 — Milestone 2: Starter Builder

- Starter Builder page: jar amount, starter needed, feeding ratio (1:1:1 / 1:2:2 /
  1:3:3 / custom), starter flour, temperature band → exact keep/discard/feed plan in
  the PRD's sentence format, plus time-to-peak estimate and the "doubled, bubbly,
  domed" note. Handles the not-enough-starter case with advice instead of a plan.
- Navigation added: hand-rolled hash routing between the two pages (`DECISIONS.md` #9).
- 12 new tests (43 total), anchored to the PRD's own example: 80g jar, 125g needed →
  keep 20g, discard 60g, feed 55g + 55g = 130g.
- `SOURDOUGH_RULES.md` §3 gained the build formula and 5g buffer ⚠️.

## 2026-07-11 — Milestone 1: Loaf Calculator

- **The app exists and runs.** Vite + React + TypeScript toolchain set up; Node 22
  installed locally to `~/.local/node` (this machine had none).
- Loaf Calculator page: flour amount, six-flour mix with display-only hydration
  guidance, Easy/Standard/Custom hydration, starter %, salt %, diastatic malt toggle,
  inclusions, live results with expected dough feel and an expandable "why isn't water
  just X% of my flour?" explainer.
- All calculator math implemented as pure functions in `src/lib/sourdough/` with 31
  passing tests, anchored to the PRD's worked example (570g flour → 376g water).
- `SOURDOUGH_RULES.md` gained §7 (dough feel wording) and §8 (inclusion amounts), both
  ⚠️ draft defaults.

## 2026-07-11 — Setup

- PRD adopted: `PRD.md` filled in from Iestyn's PRD (7 pages, build order, acceptance
  criteria); `SOURDOUGH_RULES.md` rewritten with the PRD's exact formulas and timing
  tables, worked example verified (570g flour / 20% starter / 69% hydration → 376g
  water). Interim defaults for PRD gaps logged in `DECISIONS.md` #6–7.
- Project scaffolded: documentation set (`docs/`), working rules (`CLAUDE.md`), and
  placeholder logic folder (`src/lib/sourdough/`). No application code yet.
