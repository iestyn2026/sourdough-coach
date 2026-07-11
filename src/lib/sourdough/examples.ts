/**
 * examples.ts — worked examples that double as test fixtures.
 *
 * Every number here was worked out by hand from docs/SOURDOUGH_RULES.md, so a human
 * can verify them on paper. Tests import these fixtures and assert the code produces
 * exactly these numbers. If an example ever disagrees with SOURDOUGH_RULES.md, the
 * docs win and the example is wrong.
 */

import type { CalculatorInput } from './types';

/**
 * The standard beginner loaf — the PRD's own worked example (SOURDOUGH_RULES.md §1).
 *
 * By hand:
 *   starter        = 20% × 570g            = 114g  (57g flour + 57g water)
 *   total flour    = 570 + 57              = 627g
 *   total water    = 69% × 627             = 432.63g
 *   water to add   = 432.63 − 57           = 375.63 → 376g  (PRD says ≈370–380g ✓)
 *   salt           = 2% × 627              = 12.54 → 12.5g
 *   dough weight   = 570 + 376 + 114 + 12.5 = 1072.5 → 1073g
 */
export const STANDARD_LOAF: { input: CalculatorInput; expected: Record<string, number> } = {
  input: {
    addedFlourGrams: 570,
    flourMix: { 'high-grade-white': 100 },
    hydrationMode: 'standard',
    starterPercent: 20,
    saltPercent: 2,
    diastaticMalt: false,
    inclusions: [],
  },
  expected: {
    hydrationPercent: 69,
    starterGrams: 114,
    starterFlourGrams: 57,
    starterWaterGrams: 57,
    totalFlourGrams: 627,
    waterToAddGrams: 376,
    saltGrams: 12.5,
    totalDoughWeightGrams: 1073,
  },
};

/**
 * The naive-math trap (SOURDOUGH_RULES.md §1): 69% × 570g = 393.3 → 393g.
 * This is the WRONG water amount — it ignores the starter entirely. The test asserts
 * the calculator does NOT produce it.
 */
export const NAIVE_WRONG_WATER_GRAMS = 393;

/**
 * Easy-mode wholemeal blend — checks hydration presets and mix handling.
 *
 * By hand:
 *   starter      = 20% × 500        = 100g (50g flour + 50g water)
 *   total flour  = 500 + 50         = 550g
 *   total water  = 68% × 550        = 374g
 *   water to add = 374 − 50         = 324g
 *   salt         = 2% × 550         = 11g
 *   breakdown    = 80% × 500 = 400g white, 20% × 500 = 100g wholemeal
 *   wholemeal is 20% → suggested hydration range is 69–72% (display only)
 */
export const EASY_WHOLEMEAL_LOAF: {
  input: CalculatorInput;
  expected: Record<string, number>;
  expectedSuggestedHydration: string;
} = {
  input: {
    addedFlourGrams: 500,
    flourMix: { 'high-grade-white': 80, wholemeal: 20 },
    hydrationMode: 'easy',
    starterPercent: 20,
    saltPercent: 2,
    diastaticMalt: false,
    inclusions: [],
  },
  expected: {
    hydrationPercent: 68,
    starterGrams: 100,
    totalFlourGrams: 550,
    waterToAddGrams: 324,
    saltGrams: 11,
  },
  expectedSuggestedHydration: '69–72%',
};
