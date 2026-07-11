/**
 * calculations.ts — the math, as pure functions.
 *
 * Same inputs always give the same outputs; no browser APIs, no side effects.
 * Every rule implemented here is written in plain English in docs/SOURDOUGH_RULES.md,
 * and examples.ts holds hand-checked fixtures the tests assert.
 */

import type {
  CalculatorInput,
  CalculatorResult,
  FlourBreakdownLine,
  FlourMix,
  FlourType,
} from './types';
import {
  DOUGH_FEEL_BANDS,
  HYDRATION_EASY_PERCENT,
  HYDRATION_STANDARD_PERCENT,
  INCLUSION_GUIDANCE,
  MALT_PERCENT,
  MIX_HYDRATION_GUIDANCE,
  MOSTLY_HYDRATION_GUIDANCE,
  MOSTLY_THRESHOLD_PERCENT,
  RYE_FEEL_NOTE,
  RYE_FEEL_THRESHOLD_PERCENT,
  STARTER_FLOUR_FRACTION,
  THIRSTY_FEEL_NOTE,
  THIRSTY_FLOURS,
  THIRSTY_MIX_THRESHOLD_PERCENT,
} from './rules';

/** Whole grams for weights you scoop; one decimal for small amounts (salt, malt). */
const toGrams = (n: number) => Math.round(n);
const toSmallGrams = (n: number) => Math.round(n * 10) / 10;

const mixPercent = (mix: FlourMix, flour: FlourType) => mix[flour] ?? 0;

/** Easy = 68%, Standard = 69%, Custom = the user's number (SOURDOUGH_RULES.md §2). */
export function resolveHydrationPercent(input: CalculatorInput): number {
  switch (input.hydrationMode) {
    case 'easy':
      return HYDRATION_EASY_PERCENT;
    case 'standard':
      return HYDRATION_STANDARD_PERCENT;
    case 'custom':
      return input.customHydrationPercent ?? HYDRATION_STANDARD_PERCENT;
  }
}

/**
 * Suggested hydration range for a flour mix — display only, never applied to the
 * water amount (explicit PRD rule). First matching row of the guidance tables wins.
 */
export function suggestedHydrationForMix(mix: FlourMix): string | null {
  for (const rule of MIX_HYDRATION_GUIDANCE) {
    const pct = mixPercent(mix, rule.flour);
    if (pct >= rule.minPercent && pct <= rule.maxPercent) return rule.suggestedRange;
  }
  for (const rule of MOSTLY_HYDRATION_GUIDANCE) {
    if (mixPercent(mix, rule.flour) >= MOSTLY_THRESHOLD_PERCENT) return rule.suggestedRange;
  }
  return null;
}

/** Plain-English handling description from hydration and flour mix (§7, draft). */
export function describeDoughFeel(hydrationPercent: number, mix: FlourMix): string {
  const band = DOUGH_FEEL_BANDS.find((b) => hydrationPercent < b.maxHydrationPercent);
  const parts = [band ? band.text : ''];

  const thirstyShare = THIRSTY_FLOURS.reduce((sum, f) => sum + mixPercent(mix, f), 0);
  if (thirstyShare >= THIRSTY_MIX_THRESHOLD_PERCENT) parts.push(THIRSTY_FEEL_NOTE);
  if (mixPercent(mix, 'rye') >= RYE_FEEL_THRESHOLD_PERCENT) parts.push(RYE_FEEL_NOTE);

  return parts.filter(Boolean).join(' ');
}

/**
 * The core loaf math (SOURDOUGH_RULES.md §1).
 *
 * The rule this app must never get wrong: the starter brings its own flour and water
 * (assumed 100% hydration — half of each), so true hydration is measured against
 * TOTAL flour, and the starter's water is subtracted from the water to add.
 * Never compute water as hydration % × added flour.
 *
 * Assumes input has already passed validation.ts with no errors.
 */
export function calculateLoaf(input: CalculatorInput): CalculatorResult {
  const hydrationPercent = resolveHydrationPercent(input);

  // Starter % applies to ADDED flour (PRD example: 20% of 570g = 114g).
  const starterGrams = toGrams(input.addedFlourGrams * (input.starterPercent / 100));
  const starterFlourGrams = starterGrams * STARTER_FLOUR_FRACTION;
  const starterWaterGrams = starterGrams - starterFlourGrams;

  const totalFlourGrams = input.addedFlourGrams + starterFlourGrams;
  const totalWaterGrams = totalFlourGrams * (hydrationPercent / 100);
  const waterToAddGrams = toGrams(totalWaterGrams - starterWaterGrams);

  // Salt and malt are measured against TOTAL flour (DECISIONS.md #6).
  const saltGrams = toSmallGrams(totalFlourGrams * (input.saltPercent / 100));
  const maltGrams = input.diastaticMalt
    ? toSmallGrams(totalFlourGrams * (MALT_PERCENT / 100))
    : null;

  const flourBreakdown: FlourBreakdownLine[] = (
    Object.entries(input.flourMix) as [FlourType, number][]
  )
    .filter(([, pct]) => pct > 0)
    .map(([flour, pct]) => ({
      flour,
      grams: toGrams(input.addedFlourGrams * (pct / 100)),
    }));

  const totalDoughWeightGrams = toGrams(
    input.addedFlourGrams + waterToAddGrams + starterGrams + saltGrams + (maltGrams ?? 0),
  );

  const inclusionGuidance = input.inclusions.map((inclusion) => {
    const g = INCLUSION_GUIDANCE[inclusion];
    if (g.percentOfTotalFlour === null) return `${g.label}: ${g.note}`;
    const grams = toGrams(totalFlourGrams * (g.percentOfTotalFlour / 100));
    return `${g.label}: about ${grams}g (${g.percentOfTotalFlour}% of flour) — ${g.note}`;
  });

  return {
    flourBreakdown,
    starterGrams,
    starterFlourGrams,
    starterWaterGrams,
    totalFlourGrams,
    hydrationPercent,
    waterToAddGrams,
    saltGrams,
    maltGrams,
    totalDoughWeightGrams,
    doughFeel: describeDoughFeel(hydrationPercent, input.flourMix),
    suggestedHydration: suggestedHydrationForMix(input.flourMix),
    inclusionGuidance,
  };
}
