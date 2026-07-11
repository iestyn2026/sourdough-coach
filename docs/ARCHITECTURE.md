# Architecture

## Stack

- **Vite + React + TypeScript** — a plain single-page app with minimal build magic.
  Chosen over Next.js deliberately: no server rendering, routing conventions, or hidden
  behavior to debug. See `DECISIONS.md` #2.
- **Vitest** for tests, colocated with the logic they test.
- **No backend, no database (MVP).** Data is saved in the browser via `localStorage`.
  See `DECISIONS.md` #3.

> **Status:** the toolchain (`package.json`, Vite scaffold) is not set up yet — that is
> the first build milestone after the PRD is confirmed. Only docs and the logic folder
> skeleton exist today.

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
    ├── components/            # React UI (future milestone)
    └── storage/               # localStorage wrapper (future milestone)
```

## Data flow

User input → `validation.ts` checks it → `calculations.ts` computes using constants from
`rules.ts` → UI renders the result → `storage/` persists what the user saves. Arrows only
point down the layer diagram; UI never reaches into storage's internals or does math.
