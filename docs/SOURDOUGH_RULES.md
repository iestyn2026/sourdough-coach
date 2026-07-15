# Sourdough Rules — plain English

This document is the **source of truth** for every calculation and fermentation rule in
the app. The code in `src/lib/sourdough/` must match what's written here, and every rule
here gets a matching test. If a rule changes, this file changes in the same commit.

> **Status: adopted 2026-07-11** from the PRD, replacing the earlier generic drafts.
> Items marked ⚠️ are defaults awaiting Iestyn's confirmation (see `PRD.md` → Open
> questions).

## 1. Baker's percentages & the starter rule

Percentages are relative to flour weight. The starter is itself flour + water — **assumed
100% hydration** (equal parts by weight), so 114g starter = 57g flour + 57g water.

The one rule the app must never get wrong: **hydration counts the flour and water inside
the starter.** Never compute water as hydration % × added flour.

**Definitions:**

- *Added flour* — flour the user weighs into the dough (default **570g**), excluding
  starter flour.
- *Total flour* = added flour + starter flour.
- *Starter %* is applied to **added flour** (per the PRD example: 20% × 570g = 114g).
- *Hydration* = total water ÷ total flour.
- *Salt %* applied to **total flour** — confirmed by Iestyn, 2026-07-14.
- *Diastatic malt* ⚠️ 0.5% of total flour when toggled on.

**Water to add** = (hydration % × total flour) − water in starter.

### Worked example (the standard beginner loaf)

- 570g added flour, 20% starter, 69% hydration, 2% salt
- Starter: 0.20 × 570 = **114g** → brings 57g flour + 57g water
- Total flour: 570 + 57 = 627g
- Total water needed: 0.69 × 627 = 432.6g
- **Water to add: 432.6 − 57 ≈ 376g** ✓ (matches PRD: "approximately 370–380g")
- Salt: 0.02 × 627 ≈ **12.5g**
- Total dough weight ≈ 570 + 376 + 114 + 12.5 ≈ **1073g**

## 2. Hydration presets & flour guidance

- **Easy / beginner: 68%. Standard: 69%.** Custom lets the user pick their own.
- Flour-mix guidance is **display-only** — the app never auto-adds water based on flour
  type. The user raises hydration via Custom if they want to.

| Flour mix | Suggested hydration |
|---|---|
| Mostly high-grade white / bread flour | 68–70% |
| Mostly plain white flour | 67–69% |
| 10–20% spelt | 68–70% |
| 10–20% rye | 68–70% |
| 10–15% pearl barley | 68–70% |
| 10–30% wholemeal | 69–72% |

## 3. Starter building

A feeding ratio of **1:X:X** means 1 part existing starter : X parts flour : X parts
water, by weight. So feeding 20g starter at 1:2:2 = 20g starter + 40g flour + 40g water
= 100g total. Supported ratios: 1:1:1, 1:2:2, 1:3:3, custom.

### Which ratio to use (Iestyn, 2026-07-11)

**1:2:2 is the recommended default**, shown as such in the app.

| Ratio | Peaks in* | Character |
|---|---|---|
| 1:1:1 | 4–6 hours | Fastest to peak, but weakens quickly once there |
| 1:2:2 | 6–8 hours | The standard balance for daily feeding and normal baking windows |
| 1:3:3 | 8–12 hours | Slowest to peak — extends your baking window |

\* Assuming a moderate kitchen (~21–24°C). These ratio times are general guidance; the
plan's own estimate uses the temperature table below, which assumes a typical (1:2:2-ish)
feed — a 1:3:3 feed will run toward or past the slow end of its band.

Given "starter on hand" and "starter needed", the app tells the user exactly what to
**keep, discard, and feed** — and makes clear they don't need to use all their existing
starter. Build slightly more than needed (so there's some left to maintain).

Example (from the PRD): "You have 80g starter but only need 125g active starter. Keep
20g, discard 60g, then feed 20g starter + 55g flour + 55g water = 130g total."

### How the app works it out

Feeding at 1:X:X multiplies the starter you keep by (1 + 2X). So the app works
backwards from the target:

- **Target** = starter needed + **5g buffer** ⚠️ so a seed survives the bake (the PRD
  example builds 130g for a 125g need — that's where the 5g comes from).
- **Keep** = target ÷ (1 + 2X), rounded up to whole grams. **Discard** the rest (or
  save it for crackers/pancakes). **Feed** = X × keep of flour, and the same of water.
- If the jar holds less than the keep amount, one feed can't reach the target: the app
  says what one feed would give and suggests feeding again at peak, or a higher ratio.

⚠️ App-added note (not from the PRD): rye and spelt feeds often peak a little sooner —
shown when those flours are chosen.

### Time to peak, by room temperature

| Room temperature | Starter peaks in |
|---|---|
| 15–18°C (Cold) | 8–12h |
| 18–21°C (Cool) | 6–9h |
| 21–24°C (Moderate) | 4–7h |
| 24–26°C (Warm) | 3–5h |

Always shown with: *"Use when doubled, bubbly, and domed, or just starting to flatten."*

## 4. Bulk fermentation timing

Same four temperature bands:

| Room temperature | Bulk fermentation |
|---|---|
| 15–18°C (Cold) | 8–12h — overnight room-temp bulk can be appropriate if only 20–40% rise after several hours |
| 18–21°C (Cool) | 6–8h |
| 21–24°C (Moderate) | 4–6h |
| 24–26°C (Warm) | 3–5h |

### How the planner builds a timeline

"Start now" works forward from the current time; "bake tomorrow morning/evening"
anchors the oven-in time (⚠️ 8am / 6pm) and works backwards — warning if the required
start has already passed. Step ranges shown to the user come from the tables above;
clock times are placed at ⚠️ the midpoints of those ranges. Stretch & folds start
when bulk starts (they happen during it — the timeline shows the overlap honestly).

⚠️ Step durations the PRD leaves unspecified (draft defaults):

| Step | Duration |
|---|---|
| Mix dough | 15 min |
| Rest after mixing | 45 min |
| Stretch & folds | 3 folds, 30 min apart, during early bulk |
| Shape | 15 min |
| Fridge proof | 8–12h shown; 10h used for clock times |
| Bench proof (no fridge) | 1½ h |
| Preheat (Dutch oven in) | 45 min |
| Bake | ~45 min |

⚠️ App-added nudge: starter % ≠ ~20% shifts fermentation speed (more = faster), noted
on the plan.

**Practicality rules for "start now"** (Iestyn, 2026-07-11): the loaf should be in the
fridge **before midnight** — if the fridge step lands past midnight, the plan
recommends waiting and feeding the starter first thing tomorrow instead. Likewise a
no-fridge plan whose bake lands between 10pm and 6am recommends starting tomorrow (or
choosing a fridge proof). All times display as am/pm, never 24-hour.

## 5. Readiness — coaching language

**Never tell users the dough must double.** Default guidance, verbatim:

> "Shape when the dough has risen around 50–70%, looks puffy, has rounded edges, shows
> bubbles around the sides, and jiggles slightly."

Times are estimates; the dough's look and feel decide. All app copy reflects this —
friendly, calm, practical, never falsely precise.

## 6. Validation boundaries

Errors block calculation; warnings coach but allow.

| Input | Error outside | Warn outside |
|---|---|---|
| Added flour | 100–2000g | 300–1000g |
| Hydration | 50–110% | 65–75% ("wetter dough is harder to handle") |
| Starter % | 5–50% | 15–25% |
| Salt % | 0–4% | 1.8–2.2% |

These bounds are ⚠️ app-chosen defaults (the PRD doesn't specify them) — tune freely.

## 7. Expected dough feel ⚠️

Draft wording (app-chosen; the PRD asks for "expected dough feel" but doesn't specify
text). Band chosen by final hydration:

| Final hydration | Feel |
|---|---|
| under 66% | Firm and easy to handle — a confidence-building dough. |
| 66–69.5% | Soft and slightly tacky, but manageable — lightly wet hands help. |
| 69.5–72% | Noticeably sticky and slack — keep your hands wet and move confidently. |
| over 72% | Very wet and loose — expect some spreading and tricky shaping. |

Two notes append when they apply:

- Wholemeal + rye + pearl barley ≥ 20% of the mix → "Whole-grain flours soak up water,
  so it may feel a little drier than the number suggests."
- Rye ≥ 15% → "Rye makes dough stickier and less stretchy — that is normal."

## 8. Inclusions ⚠️

Suggested amounts (app-chosen defaults; the PRD names the inclusions but not amounts),
measured against total flour:

| Inclusion | Amount | When |
|---|---|---|
| Olives | ~15% of flour, pitted and drained | fold in at first stretch and fold |
| Seeds | ~10% of flour, toasted if you like | fold in at first stretch and fold |
| Rosemary | 1–2 tablespoons, finely chopped | add with the salt |

Inclusions are guidance lines only — they don't change the dough math.

## 9. Baking temperatures ⚠️

App-chosen defaults for the Guided Bake steps (the PRD gives the step list but not
temperatures). All for a lidded Dutch oven:

| Phase | Setting |
|---|---|
| Preheat, Dutch oven + lid inside | 250°C for a full 45 minutes |
| Bake, lid on | 230°C for 20 minutes |
| Bake, lid off | 210°C for 20–25 minutes, until deep brown |
| Cool | at least 1–2 hours before cutting |

Coaching context (PRD pain point): home oven dials overshoot and undershoot — time at
temperature heats the pot, not the preheat beep.
