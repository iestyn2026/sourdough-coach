# Architecture

## Stack

- **Vite + React + TypeScript** — a plain single-page app with minimal build magic.
  Chosen over Next.js deliberately: no server rendering, routing conventions, or hidden
  behavior to debug. See `DECISIONS.md` #2.
- **Vitest** for tests, colocated with the logic they test.
- **No backend, no database (MVP).** Data is saved in the browser via `localStorage`.
  See `DECISIONS.md` #3.

> **Status:** toolchain live as of milestone 1 (2026-07-11). Run the dev server with
> `scripts/dev.sh` (Node lives in `~/.local/node`, see `DECISIONS.md` #8); tests with
> `scripts/dev.sh`'s PATH plus `npm test`. **All seven PRD pages are built** (MVP
> complete 2026-07-14): Home (landing page), Loaf Calculator, Starter Builder, Bake
> Planner, Guided Bake, Troubleshooting, Loaf Log — hash navigation, `DECISIONS.md`
> #9/#14. Storage layer: `src/storage/` holds guided-bake progress, the loaf log,
> and the photo downscaler.

## Layers

```
┌─────────────────────────────┐
│  UI (React components)      │  renders, collects input — no baking logic
├─────────────────────────────┤
│  src/lib/sourdough/         │  pure functions: rules, calculations, validation
├─────────────────────────────┤
│  storage (localStorage)     │  save/load bakes — no baking logic
└─────────────────────────────┘
```

The middle layer is the heart of the app and must stay **pure** (same inputs → same
outputs, no browser APIs, no side effects). That's what makes it testable and
inspectable on its own.

## Folder structure (planned)

```
sourdough-coach/
├── CLAUDE.md                  # working rules for Claude Code
├── docs/                      # all project documentation
└── src/
    ├── lib/sourdough/         # pure business logic (exists now, placeholders)
    │   ├── types.ts           # shared data shapes (Recipe, BakeSession, …)
    │   ├── rules.ts           # named constants & thresholds from SOURDOUGH_RULES.md
    │   ├── calculations.ts    # the math (hydration, baker's %, timing estimates)
    │   ├── validation.ts      # input checks with human-readable messages
    │   ├── examples.ts        # worked examples doubling as test fixtures
    │   └── *.test.ts          # tests, colocated (added with the toolchain)
    ├── components/            # shared React UI pieces (future milestones)
    ├── pages/                 # one folder per PRD page: Home, LoafCalculator,
    │                          #   StarterBuilder, BakePlanner, GuidedBake,
    │                          #   Troubleshooting, LoafLog (built one at a time)
    └── storage/               # browser-local persistence wrapper (future milestone;
                               #   localStorage, possibly IndexedDB for photos —
                               #   see DECISIONS.md #7)
```

## Data flow

User input → `validation.ts` checks it → `calculations.ts` computes using constants from
`rules.ts` → UI renders the result → `storage/` persists what the user saves. Arrows only
point down the layer diagram; UI never reaches into storage's internals or does math.
