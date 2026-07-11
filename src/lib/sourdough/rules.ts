/**
 * rules.ts — named constants and thresholds from docs/SOURDOUGH_RULES.md.
 *
 * Single responsibility: numbers (and coaching sentences) with names. Every value here
 * traces back to a rule in docs/SOURDOUGH_RULES.md — if a value changes here, that doc
 * changes in the same commit (CLAUDE.md rule 4). No calculations in this file.
 */

import type {
  FeedRatioName,
  FlourType,
  Inclusion,
  StarterFlour,
  TempBandId,
} from './types';

// ---- Defaults (SOURDOUGH_RULES.md §1–2, from the PRD) ----

export const DEFAULT_ADDED_FLOUR_GRAMS = 570;
export const DEFAULT_STARTER_PERCENT = 20;
export const DEFAULT_SALT_PERCENT = 2;
export const HYDRATION_EASY_PERCENT = 68;
export const HYDRATION_STANDARD_PERCENT = 69;

/** Starter is assumed 100% hydration: equal parts flour and water by weight. */
export const STARTER_FLOUR_FRACTION = 0.5;

/** ⚠️ Interim default, not in the PRD (DECISIONS.md #6). */
export const MALT_PERCENT = 0.5;

// ---- Flour types (PRD page 2) ----

export const FLOUR_TYPES: readonly FlourType[] = [
  'high-grade-white',
  'plain-white',
  'wholemeal',
  'rye',
  'spelt',
  'pearl-barley',
];

export const FLOUR_LABELS: Record<FlourType, string> = {
  'high-grade-white': 'High-grade white / bread flour',
  'plain-white': 'Plain white flour',
  wholemeal: 'Wholemeal',
  rye: 'Rye',
  spelt: 'Spelt',
  'pearl-barley': 'Pearl barley',
};

// ---- Hydration guidance for flour mixes (SOURDOUGH_RULES.md §2) ----
// Display only — the app NEVER changes the water automatically (explicit PRD rule).
// Checked top to bottom; the first match wins.

export const MIX_HYDRATION_GUIDANCE: ReadonlyArray<{
  flour: FlourType;
  minPercent: number;
  maxPercent: number;
  suggestedRange: string;
}> = [
  { flour: 'wholemeal', minPercent: 10, maxPercent: 30, suggestedRange: '69–72%' },
  { flour: 'rye', minPercent: 10, maxPercent: 20, suggestedRange: '68–70%' },
  { flour: 'spelt', minPercent: 10, maxPercent: 20, suggestedRange: '68–70%' },
  { flour: 'pearl-barley', minPercent: 10, maxPercent: 15, suggestedRange: '68–70%' },
];

/** "Mostly X flour" means X is at least half the mix. */
export const MOSTLY_THRESHOLD_PERCENT = 50;

export const MOSTLY_HYDRATION_GUIDANCE: ReadonlyArray<{
  flour: FlourType;
  suggestedRange: string;
}> = [
  { flour: 'plain-white', suggestedRange: '67–69%' },
  { flour: 'high-grade-white', suggestedRange: '68–70%' },
];

// ---- Expected dough feel (⚠️ draft wording, SOURDOUGH_RULES.md §7) ----
// Checked top to bottom; first band whose maxHydration the dough is under wins.

export const DOUGH_FEEL_BANDS: ReadonlyArray<{
  maxHydrationPercent: number;
  text: string;
}> = [
  {
    maxHydrationPercent: 66,
    text: 'Firm and easy to handle — a confidence-building dough.',
  },
  {
    maxHydrationPercent: 69.5,
    text: 'Soft and slightly tacky, but manageable — lightly wet hands help.',
  },
  {
    maxHydrationPercent: 72,
    text: 'Noticeably sticky and slack — keep your hands wet and move confidently.',
  },
  {
    maxHydrationPercent: Infinity,
    text: 'Very wet and loose — expect some spreading and tricky shaping.',
  },
];

/** Flours that drink extra water; ≥ this share of the mix earns the note below. */
export const THIRSTY_FLOURS: readonly FlourType[] = ['wholemeal', 'rye', 'pearl-barley'];
export const THIRSTY_MIX_THRESHOLD_PERCENT = 20;
export const THIRSTY_FEEL_NOTE =
  'Whole-grain flours soak up water, so it may feel a little drier than the number suggests.';

export const RYE_FEEL_THRESHOLD_PERCENT = 15;
export const RYE_FEEL_NOTE = 'Rye makes dough stickier and less stretchy — that is normal.';

// ---- Inclusions (⚠️ interim amounts, SOURDOUGH_RULES.md §8) ----

export const INCLUSION_GUIDANCE: Record<
  Inclusion,
  { label: string; percentOfTotalFlour: number | null; note: string }
> = {
  olives: {
    label: 'Olives',
    percentOfTotalFlour: 15,
    note: 'pitted and well drained — fold in at the first stretch and fold',
  },
  seeds: {
    label: 'Seeds',
    percentOfTotalFlour: 10,
    note: 'toasted if you like — fold in at the first stretch and fold',
  },
  rosemary: {
    label: 'Rosemary',
    percentOfTotalFlour: null,
    note: '1–2 tablespoons, finely chopped — add with the salt',
  },
};

// ---- Starter building (SOURDOUGH_RULES.md §3) ----

/** The X in 1:X:X for the preset ratios. */
export const FEED_RATIOS: Record<Exclude<FeedRatioName, 'custom'>, number> = {
  '1:1:1': 1,
  '1:2:2': 2,
  '1:3:3': 3,
};

/**
 * ⚠️ Build this much more than the recipe needs, so a seed of starter survives the
 * bake (the PRD example builds 130g for a 125g need).
 */
export const BUILD_BUFFER_GRAMS = 5;

export const STARTER_FLOUR_LABELS: Record<StarterFlour, string> = {
  white: 'White',
  rye: 'Rye',
  spelt: 'Spelt',
  mix: 'Mix',
};

/** How the starter flour reads inside the feeding instructions. */
export const STARTER_FLOUR_FEED_WORDS: Record<StarterFlour, string> = {
  white: 'white flour',
  rye: 'rye flour',
  spelt: 'spelt flour',
  mix: 'your flour mix',
};

/** ⚠️ App-added coaching note, not from the PRD. */
export const WHOLEGRAIN_STARTER_NOTE =
  'Rye and spelt feeds often peak a little sooner — start checking early.';

/** The ratio beginners should reach for (Iestyn, 2026-07-11 — SOURDOUGH_RULES.md §3). */
export const RECOMMENDED_RATIO: FeedRatioName = '1:2:2';

/**
 * One-line guidance per ratio (Iestyn, 2026-07-11). Peak times assume a moderate
 * kitchen (~21–24°C); the temperature-band estimate in the results shifts with room
 * temperature.
 */
export const RATIO_GUIDANCE: Record<FeedRatioName, string> = {
  '1:1:1':
    'Equal parts starter, flour, and water — peaks fastest (usually 4–6 hours) but weakens quickly once there.',
  '1:2:2':
    'One part starter, two parts flour, two parts water — the standard balance for daily feeding and normal baking windows (6–8 hours).',
  '1:3:3':
    'One part starter, three parts flour, three parts water — slowest to peak (8–12 hours), which extends your baking window.',
  custom:
    'Bigger X means a slower peak and a longer baking window; smaller X peaks faster but weakens sooner.',
};

/** Shown verbatim with every timing estimate (PRD requirement). */
export const STARTER_PEAK_NOTE =
  'Use when doubled, bubbly, and domed, or just starting to flatten.';

// ---- Room temperature bands (SOURDOUGH_RULES.md §3–4) ----

/**
 * Peak/bulk ranges come from the PRD (SOURDOUGH_RULES.md §3–4). The `Mid` values are
 * ⚠️ the midpoints the planner uses to place clock times — ranges are what's shown.
 */
export const TEMP_BANDS: ReadonlyArray<{
  id: TempBandId;
  label: string;
  rangeLabel: string;
  starterPeakHours: string;
  starterPeakMidHours: number;
  bulkHours: string;
  bulkMidHours: number;
}> = [
  { id: 'cold', label: 'Cold', rangeLabel: '15–18°C', starterPeakHours: '8–12 hours', starterPeakMidHours: 10, bulkHours: '8–12 hours', bulkMidHours: 10 },
  { id: 'cool', label: 'Cool', rangeLabel: '18–21°C', starterPeakHours: '6–9 hours', starterPeakMidHours: 7.5, bulkHours: '6–8 hours', bulkMidHours: 7 },
  { id: 'moderate', label: 'Moderate', rangeLabel: '21–24°C', starterPeakHours: '4–7 hours', starterPeakMidHours: 5.5, bulkHours: '4–6 hours', bulkMidHours: 5 },
  { id: 'warm', label: 'Warm', rangeLabel: '24–26°C', starterPeakHours: '3–5 hours', starterPeakMidHours: 4, bulkHours: '3–5 hours', bulkMidHours: 4 },
];

// ---- Bake Planner (SOURDOUGH_RULES.md §4) ----

/** ⚠️ Step durations the PRD leaves unspecified — draft defaults, in minutes. */
export const PLAN_TIMES = {
  mixMinutes: 15,
  restMinutes: 45,
  foldCount: 3,
  foldIntervalMinutes: 30,
  shapeMinutes: 15,
  fridgeProofHours: 10, // shown as the 8–12h range
  fridgeProofLabel: '8–12 hours',
  benchProofMinutes: 90,
  preheatMinutes: 45,
  bakeMinutes: 45,
  /** ⚠️ What "tomorrow morning/evening" mean as oven-in times. */
  morningBakeHour: 8,
  eveningBakeHour: 18,
} as const;

/** PRD default guidance, verbatim — never tell users dough must double (§5). */
export const BULK_TARGET_GUIDANCE =
  'Shape when the dough has risen around 50–70%, looks puffy, has rounded edges, ' +
  'shows bubbles around the sides, and jiggles slightly.';

/** PRD note for cold kitchens (§4). */
export const OVERNIGHT_BULK_NOTE =
  'In a cold room, an overnight room-temperature bulk can be appropriate if the dough ' +
  'has only risen 20–40% after several hours.';

/** ⚠️ App-added nudge; the timing tables assume roughly 20% starter. */
export const STARTER_SPEED_NOTE = (percent: number) =>
  `Your plan uses ${percent}% starter — the timing ranges assume about 20%. More ` +
  `starter ferments faster, less ferments slower, so lean toward the ` +
  `${percent > 20 ? 'early' : 'late'} end of each range.`;

// ---- Validation boundaries (⚠️ app-chosen, SOURDOUGH_RULES.md §6) ----
// Outside error range: calculation is blocked. Outside warn range: coached, not blocked.

export interface Range {
  errorMin: number;
  errorMax: number;
  warnMin: number;
  warnMax: number;
}

export const ADDED_FLOUR_RANGE: Range = { errorMin: 100, errorMax: 2000, warnMin: 300, warnMax: 1000 };
export const HYDRATION_RANGE: Range = { errorMin: 50, errorMax: 110, warnMin: 65, warnMax: 75 };
export const STARTER_RANGE: Range = { errorMin: 5, errorMax: 50, warnMin: 15, warnMax: 25 };
export const SALT_RANGE: Range = { errorMin: 0, errorMax: 4, warnMin: 1.8, warnMax: 2.2 };

/** Flour-mix percentages may be off 100% by at most this much (rounding slack). */
export const MIX_TOTAL_TOLERANCE = 0.5;

export const STARTER_HAVE_RANGE: Range = { errorMin: 1, errorMax: 2000, warnMin: 10, warnMax: 500 };
export const STARTER_NEED_RANGE: Range = { errorMin: 10, errorMax: 2000, warnMin: 50, warnMax: 300 };
export const CUSTOM_RATIO_RANGE: Range = { errorMin: 0.5, errorMax: 10, warnMin: 1, warnMax: 5 };
