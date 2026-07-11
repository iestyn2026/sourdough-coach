# Changelog

Meaningful changes only — things that affect what the app does, how it's structured, or
what a rule says. Newest first.

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
