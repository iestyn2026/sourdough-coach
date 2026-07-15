# Product Requirements — Sourdough Coach

> **Status: adopted 2026-07-11** from Iestyn's PRD ("PRD: Sourdough Coach Web App").
> This is the source of truth for scope. Calculation details live in
> `SOURDOUGH_RULES.md`; open questions are listed at the bottom of this file. If any calculation logic is changed in code, update SOURDOUGH_RULES.md and add a note to DECISIONS.md or CHANGELOG.md explaining the change.

## Vision

A simple web app that feels like a friendly beginner sourdough coach: practical, calm,
simple, and encouraging — not overly technical. An early rough prototype: Iestyn uses it
himself first, then shares with friends, then possibly makes it public later.

## Target user

Beginner sourdough bakers. Real pain points this app addresses:

- Not knowing how much flour, water, starter, and salt to use.
- Confusion about starter ratios like 1:1:1, 1:2:2, 1:3:3.
- Not knowing how much starter to build before baking.
- Not understanding why dough rises faster or slower with room temperature.
- Not knowing whether dough has fermented enough.
- Struggling with sticky dough.
- Not knowing when to shape, fridge, or bake.
- Not knowing how rye, spelt, wholemeal, and barley affect hydration and dough strength.
- Soft crusts because home ovens don't reach the temperature on the dial.
- Wanting to track loaves and learn over time.

## Platform & constraints

- Web app, mobile-friendly and desktop-friendly.
- **localStorage only. No backend, no accounts, no cloud database.**
- Card-based UI, large buttons, minimal text per screen, expandable explanations —
  easy to use in the kitchen.

## MVP scope — seven pages

1. **Home** — cards linking to each feature, plus one-line intro:
   "Sourdough Coach helps you calculate, plan, bake, and learn from each loaf."
2. **Loaf Calculator** — flour grams (default 570g, excluding starter flour), flour mix
   (high-grade white, plain white, wholemeal, rye, spelt, pearl barley), hydration
   (Easy 68% / Standard 69% / Custom), starter % (default 20%), salt % (default 2%),
   optional diastatic malt, optional inclusions (olives, seeds, rosemary). Outputs:
   flour breakdown, water to add, starter, salt, malt, total dough weight, expected
   dough feel. **Hydration math must count the flour and water inside the starter.**
3. **Starter Builder** — from current starter amount + needed amount + feeding ratio
   (1:1:1, 1:2:2, 1:3:3, custom) + starter flour, output exact keep/discard/feed
   instructions, plus time-to-peak estimate from room temperature.
4. **Bake Planner** — from room temperature band, bake goal (start now / tomorrow
   morning / tomorrow evening), flour mix, starter %, and fridge proof yes/no, generate
   a rough timeline from "build starter" through "bake".
5. **Guided Bake** — 15-step checklist (build starter → mix → rest → 3 stretch & folds
   → bulk → shape → banneton/fridge → preheat → score → bake lid on → lid off → cool →
   log result). Each step card: what to do, why it matters, what it should look/feel
   like, common beginner mistake. Steps can be marked complete. Ends with "Log this
   bake" pre-filling the Loaf Log.
6. **Troubleshooting / Common Questions** — short, practical Q&A cards covering the
   starter, dough, baking, and ingredients questions listed in the source PRD.
7. **Loaf Log** — save entries with optional fields: date, flour mix, water, starter,
   salt, room temp, bulk duration, fridge duration, bake time, notes, rating 1–10, and
   photos: two slots, before bake and after bake (simplified from the original five —
   Iestyn, 2026-07-14).

All calculation rules and timing tables are specified in `SOURDOUGH_RULES.md`.

## Out of scope (MVP)

- User accounts, backend, cloud database
- AI diagnosis
- Subscriptions
- Community features
- Recipe marketplace

## Build approach & milestones

Do not overbuild. Build one section at a time, in this order, each only when explicitly
requested:

1. **Loaf Calculator** ← first milestone, with clean UI and correct calculations
2. Starter Builder
3. Bake Planner
4. Guided Bake Checklist
5. Troubleshooting
6. Loaf Log

(Home page arrives naturally as pages accumulate.)

## Acceptance criteria (first prototype)

The prototype is successful when Iestyn can:

1. Enter a total flour amount.
2. Choose a flour mix.
3. Get water, starter, salt, and optional malt amounts.
4. Build the right amount of starter.
5. Get rough fermentation timing based on temperature.
6. Follow a checklist.
7. Save a loaf log locally.

## Open questions

Defaults chosen so work can proceed; each needs Iestyn's confirmation (tracked in
`DECISIONS.md` #6):

1. **Salt basis** — ✅ resolved (Iestyn, 2026-07-14): 2% of total flour including
   starter flour (627g in the standard loaf → ~12.5g), as the app already calculated.
2. **Diastatic malt amount** — not specified. Chosen default: 0.5% of total flour.
3. **Inclusion quantities** — olives/seeds/rosemary amounts not specified. Deferred to
   the Loaf Calculator milestone.
4. **"Expected dough feel" output** — assumed to be a short text description driven by
   hydration and flour mix; exact wording to be drafted at the calculator milestone.
