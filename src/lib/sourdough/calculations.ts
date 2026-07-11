/**
 * calculations.ts — the math, as pure functions.
 *
 * Same inputs always give the same outputs; no browser APIs, no side effects.
 * Every rule implemented here is written in plain English in docs/SOURDOUGH_RULES.md,
 * and examples.ts holds hand-checked fixtures the tests assert.
 */

import type {
  BakePlan,
  CalculatorInput,
  CalculatorResult,
  FlourBreakdownLine,
  FlourMix,
  FlourType,
  PlanStep,
  PlannerInput,
  StarterBuildInput,
  StarterBuildResult,
} from './types';
import {
  BUILD_BUFFER_GRAMS,
  BULK_TARGET_GUIDANCE,
  DOUGH_FEEL_BANDS,
  FEED_RATIOS,
  LATE_FRIDGE_WARNING,
  NIGHT_BAKE_WARNING,
  OVERNIGHT_BULK_NOTE,
  PLAN_TIMES,
  STARTER_FLOUR_FEED_WORDS,
  STARTER_PEAK_NOTE,
  STARTER_SPEED_NOTE,
  TEMP_BANDS,
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

// ---- Starter Builder (SOURDOUGH_RULES.md §3) ----

/** The X in 1:X:X for whatever ratio the user picked. */
export function resolveRatioPart(input: StarterBuildInput): number {
  return input.ratio === 'custom'
    ? (input.customRatioPart ?? FEED_RATIOS['1:2:2'])
    : FEED_RATIOS[input.ratio];
}

/**
 * Single-feed starter build plan (SOURDOUGH_RULES.md §3).
 *
 * Feeding at 1:X:X multiplies what you keep by (1 + 2X). So to end up with the target
 * (need + a small buffer to keep the starter alive), work backwards:
 *   keep = target ÷ (1 + 2X), rounded up to whole grams; feed = X × keep flour + water.
 *
 * The point the PRD insists on: the user does NOT need to feed everything in the jar.
 *
 * Assumes input has already passed validation.ts with no errors.
 */
export function buildStarter(input: StarterBuildInput): StarterBuildResult {
  const x = resolveRatioPart(input);
  const growthFactor = 1 + 2 * x;
  const targetGrams = input.needGrams + BUILD_BUFFER_GRAMS;
  const keepGrams = Math.ceil(targetGrams / growthFactor);

  if (keepGrams > input.haveGrams) {
    const oneFeedTotalGrams = Math.round(input.haveGrams * growthFactor);
    return {
      kind: 'not-enough',
      oneFeedTotalGrams,
      message:
        `Feeding all ${input.haveGrams}g of your starter at 1:${x}:${x} gives about ` +
        `${oneFeedTotalGrams}g — short of the ${targetGrams}g you need. Either feed it ` +
        `all now and feed again once it doubles, or pick a higher ratio like 1:3:3.`,
    };
  }

  const feedFlourGrams = Math.ceil(keepGrams * x);
  const feedWaterGrams = feedFlourGrams;
  const totalGrams = keepGrams + feedFlourGrams + feedWaterGrams;
  const discardGrams = input.haveGrams - keepGrams;
  const flourWord = STARTER_FLOUR_FEED_WORDS[input.starterFlour];

  // Same shape as the PRD's example sentence, so it reads like a coach's note.
  const discardPart = discardGrams > 0 ? `, discard ${discardGrams}g` : '';
  const instructions =
    `You have ${input.haveGrams}g starter but only need ${input.needGrams}g active ` +
    `starter. Keep ${keepGrams}g${discardPart}, then feed ${keepGrams}g starter + ` +
    `${feedFlourGrams}g ${flourWord} + ${feedWaterGrams}g water = ${totalGrams}g total.`;

  const band = TEMP_BANDS.find((b) => b.id === input.tempBand) ?? TEMP_BANDS[2];

  return {
    kind: 'plan',
    keepGrams,
    discardGrams,
    feedFlourGrams,
    feedWaterGrams,
    totalGrams,
    leftoverGrams: totalGrams - input.needGrams,
    instructions,
    peakHoursLabel: band.starterPeakHours,
  };
}

// ---- Bake Planner (SOURDOUGH_RULES.md §4) ----

const MINUTE_MS = 60_000;
const addMinutes = (d: Date, minutes: number) => new Date(d.getTime() + minutes * MINUTE_MS);

/** Round up to the next 5 minutes so "start now" plans read cleanly. */
const roundUpTo5Minutes = (d: Date) =>
  new Date(Math.ceil(d.getTime() / (5 * MINUTE_MS)) * 5 * MINUTE_MS);

const hoursLabel = (h: number) => (h === 1 ? 'about 1 hour' : `about ${h} hours`);

/** "1:40 am" — 12-hour clock, used in warnings (the UI formats step times itself). */
const clockLabel = (d: Date) =>
  d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();

/**
 * A rough bake timeline (SOURDOUGH_RULES.md §4).
 *
 * Ranges shown on each step come straight from the temperature tables; the clock
 * times are placed using the midpoints of those ranges (⚠️ planner choice). "Start
 * now" works forward from `now`; the tomorrow goals anchor the bake time and work
 * backwards to find the start.
 *
 * Times are estimates for planning your day — the dough's look and feel decide when
 * to actually move on, and the notes say so.
 */
export function planBake(input: PlannerInput, now: Date): BakePlan {
  const band = TEMP_BANDS.find((b) => b.id === input.tempBand) ?? TEMP_BANDS[2];
  const t = PLAN_TIMES;

  const peakMinutes = band.starterPeakMidHours * 60;
  const bulkMinutes = band.bulkMidHours * 60;
  const proofMinutes = input.fridgeProof ? t.fridgeProofHours * 60 : t.benchProofMinutes;
  const minutesBeforeBake =
    peakMinutes + t.mixMinutes + t.restMinutes + bulkMinutes + t.shapeMinutes +
    proofMinutes + t.preheatMinutes;

  const warnings: string[] = [];
  let start: Date;

  if (input.goal === 'now') {
    start = roundUpTo5Minutes(now);
  } else {
    // Anchor the oven-in time at tomorrow 08:00 or 18:00, then walk backwards.
    const bakeAt = new Date(now);
    bakeAt.setDate(bakeAt.getDate() + 1);
    bakeAt.setHours(
      input.goal === 'tomorrow-morning' ? t.morningBakeHour : t.eveningBakeHour,
      0, 0, 0,
    );
    start = addMinutes(bakeAt, -minutesBeforeBake);
    if (start < now) {
      warnings.push(
        `To have the loaf in the oven by ${input.goal === 'tomorrow-morning' ? '8am' : '6pm'} ` +
          `tomorrow, you'd need to start at a time that's already passed. The plan below ` +
          `shows those times anyway — consider "Start now" or a later bake goal.`,
      );
    }
  }

  const steps: PlanStep[] = [];
  let clock = start;
  const step = (id: string, label: string, durationLabel: string, note?: string) =>
    steps.push({ id, label, at: clock, durationLabel, note });

  step('build-starter', 'Build starter', band.starterPeakHours, STARTER_PEAK_NOTE);
  clock = addMinutes(clock, peakMinutes);

  step('mix', 'Mix dough', `${t.mixMinutes} minutes`);
  clock = addMinutes(clock, t.mixMinutes);

  step('rest', 'Rest', `${t.restMinutes} minutes`, 'Cover the dough and let the flour fully hydrate.');
  clock = addMinutes(clock, t.restMinutes);

  // Folds happen DURING the first stretch of bulk — same start time, on purpose.
  step(
    'folds',
    'Stretch & folds',
    `${t.foldCount} folds, ${t.foldIntervalMinutes} minutes apart`,
    'Wet your hands; stretch one side up and fold it over. Turn, repeat all four sides.',
  );
  step(
    'bulk',
    'Bulk fermentation',
    band.bulkHours,
    input.tempBand === 'cold' ? `${BULK_TARGET_GUIDANCE} ${OVERNIGHT_BULK_NOTE}` : BULK_TARGET_GUIDANCE,
  );
  clock = addMinutes(clock, bulkMinutes);

  step('shape', 'Shape', `${t.shapeMinutes} minutes`);
  clock = addMinutes(clock, t.shapeMinutes);

  if (input.fridgeProof) {
    step(
      'fridge-proof',
      'Fridge proof (in banneton)',
      t.fridgeProofLabel,
      'Seam side up, covered. Cold dough scores better and bakes with a better crust.',
    );
  } else {
    step('bench-proof', 'Bench proof', hoursLabel(t.benchProofMinutes / 60));
  }
  clock = addMinutes(clock, proofMinutes);

  step(
    'preheat',
    'Preheat oven, Dutch oven inside',
    `${t.preheatMinutes} minutes`,
    'Home oven dials overshoot or undershoot — a long preheat matters more than the dial.',
  );
  clock = addMinutes(clock, t.preheatMinutes);

  step('bake', 'Bake', `about ${t.bakeMinutes} minutes`);
  clock = addMinutes(clock, t.bakeMinutes);

  const doneAt = clock;

  // ⚠️ Coaching nudges (see rules.ts): timing tables assume ~20% starter.
  if (Math.abs(input.starterPercent - 20) >= 5) {
    warnings.push(STARTER_SPEED_NOTE(input.starterPercent));
  }

  // Practicality rules for "start now" (Iestyn, 2026-07-11 — SOURDOUGH_RULES.md §4):
  // the loaf should reach the fridge before midnight; plans that keep you up through
  // the night should recommend starting fresh tomorrow instead.
  if (input.goal === 'now') {
    if (input.fridgeProof) {
      const fridgeAt = steps.find((s) => s.id === 'fridge-proof')!.at;
      if (fridgeAt.getDate() !== start.getDate()) {
        warnings.push(LATE_FRIDGE_WARNING(clockLabel(fridgeAt)));
      }
    } else {
      const bakeHour = steps[steps.length - 1].at.getHours();
      if (bakeHour >= 22 || bakeHour < 6) {
        warnings.push(NIGHT_BAKE_WARNING);
      }
    }
  }

  return { steps, doneAt, warnings };
}
