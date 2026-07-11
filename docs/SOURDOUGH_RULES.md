# Sourdough Rules — plain English

This document is the **source of truth** for every calculation and fermentation rule in
the app. The code in `src/lib/sourdough/` must match what's written here, and every rule
here should have a matching test. If a rule changes, this file changes in the same commit.

> **Status: draft defaults.** These are widely used baseline rules, written down so we
> have something concrete to confirm or correct against Iestyn's PRD. Nothing here is
> final until reviewed.

## 1. Baker's percentages

Everything is measured relative to **total flour weight = 100%**. This is the standard
way bakers scale recipes up and down.

- **Hydration** = water weight ÷ flour weight. A "75% hydration" dough with 500g flour
  has 375g water.
- **Salt** is typically 1.8–2.2% of flour weight (default: 2%).
- **Starter** is typically 15–25% of flour weight (default: 20%).

## 2. Starter counts as flour and water

A sourdough starter is itself flour + water (usually at 100% hydration, i.e. equal parts).
When calculating a dough's *true* hydration, the flour and water inside the starter must
be counted:

- 100g of 100%-hydration starter = 50g flour + 50g water.
- Ignoring this is the most common beginner calculation mistake, and the app must not
  make it.

## 3. Fermentation and temperature

Fermentation speed depends primarily on dough temperature. The working baseline:

- **Reference point:** bulk fermentation takes roughly 6–8 hours at 24°C (75°F) with a
  20% starter ratio.
- **Warmer is faster, cooler is slower.** As a rule of thumb, fermentation speed roughly
  doubles for every ~8°C increase, within the normal home range (18–28°C).
- Below ~18°C fermentation slows dramatically; above ~30°C the dough ferments very fast
  and flavor/structure suffer. The app should warn outside 18–28°C rather than pretend
  to predict precisely.

## 4. Readiness signals (coaching, not math)

Time and temperature estimate readiness; the dough itself confirms it. The app coaches
users to check:

- Dough has risen roughly 50–75% in volume (not necessarily doubled).
- Surface is domed with some visible bubbles; edges pull slightly from the container.
- Feels airy and jiggly, not dense.

Estimates are **guidance**; sensory checks are the deciding signal. The app's language
should always reflect that.

## 5. Validation boundaries

Inputs outside these ranges get a friendly warning or error (exact ranges to be
confirmed with the PRD):

| Input | Sensible range |
|---|---|
| Hydration | 55%–100% (warn above 85% for beginners) |
| Salt | 1.5%–2.5% of flour |
| Starter | 5%–40% of flour |
| Dough temperature | 18°C–30°C for predictions |
