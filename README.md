# 🍞 Sourdough Coach

A simple web app that helps beginner sourdough bakers calculate, plan, bake, and learn
from each loaf. Practical, calm, and encouraging — not overly technical.

Built as a learning project: the goal was code I can **understand, inspect, and change**,
not a black box.

## What it does

| Page | What it's for |
|---|---|
| **Calculator** | Ingredient amounts from baker's percentages — correctly counting the flour and water already in your starter |
| **Starter Builder** | Exactly what to keep, discard, and feed, plus when it'll peak |
| **Bake Planner** | A clock-time timeline for your day, based on room temperature |
| **Guided Bake** | Interactive 15-step bake mode with coaching at each step |
| **Troubleshooting** | 25 beginner questions answered |
| **Loaf Log** | A diary of past bakes with photos, notes, and ratings |

## Running it locally

Requires [Node.js](https://nodejs.org) 20 or newer.

```bash
npm install
npm run dev      # development server at localhost:5173
```

Other commands:

```bash
npm test         # run the test suite
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

## How it's built

- **React + TypeScript**, bundled with [Vite](https://vite.dev). No framework beyond that.
- **No backend, no accounts, no database.** Everything is saved in your browser's
  local storage, so your data stays on your own device.
- **Baking logic is separated from the interface.** Every calculation and rule lives in
  `src/lib/sourdough/` as plain, tested functions. The pages only collect input and
  display results — they contain no baking math.

```
src/
├── lib/sourdough/   # the rules and maths, with tests alongside
├── pages/           # one file per screen
├── storage/         # saving to the browser
└── index.css        # all styling, hand-written
```

## Documentation

The thinking behind the app is written down in [`docs/`](docs/):

- [`PRD.md`](docs/PRD.md) — what it's for and what's in scope
- [`SOURDOUGH_RULES.md`](docs/SOURDOUGH_RULES.md) — every calculation and timing rule in
  plain English. **This is the source of truth** the code must match.
- [`DECISIONS.md`](docs/DECISIONS.md) — decisions made along the way and their trade-offs
- [`CHANGELOG.md`](docs/CHANGELOG.md) — what changed, and when
- [`KNOWN_LIMITATIONS.md`](docs/KNOWN_LIMITATIONS.md) — an honest list of what it assumes
  and can't do

## A note on the advice

Times and amounts are **guidance, not guarantees**. Fermentation depends on your flour,
your starter, and your kitchen. The app says so throughout: the dough always has the
final say.
