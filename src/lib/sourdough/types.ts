/**
 * types.ts — shared data shapes for the sourdough domain.
 *
 * Single responsibility: define WHAT the data looks like. No logic, no constants.
 */

/** The six flours the Loaf Calculator supports (PRD page 2). */
export type FlourType =
  | 'high-grade-white'
  | 'plain-white'
  | 'wholemeal'
  | 'rye'
  | 'spelt'
  | 'pearl-barley';

/**
 * A flour mix as percentages of the ADDED flour, e.g. { 'high-grade-white': 80,
 * 'wholemeal': 20 }. Percentages must total 100 (validation.ts enforces this).
 */
export type FlourMix = Partial<Record<FlourType, number>>;

/** Easy = 68%, Standard = 69%, Custom = user's own number (SOURDOUGH_RULES.md §2). */
export type HydrationMode = 'easy' | 'standard' | 'custom';

export type Inclusion = 'olives' | 'seeds' | 'rosemary';

/** Everything the user enters on the Loaf Calculator page. */
export interface CalculatorInput {
  /** Flour weighed into the dough, EXCLUDING flour inside the starter. */
  addedFlourGrams: number;
  flourMix: FlourMix;
  hydrationMode: HydrationMode;
  /** Only read when hydrationMode is 'custom'. */
  customHydrationPercent?: number;
  /** Percent of ADDED flour (per the PRD example: 20% of 570g = 114g starter). */
  starterPercent: number;
  /** Percent of TOTAL flour, including starter flour (DECISIONS.md #6). */
  saltPercent: number;
  diastaticMalt: boolean;
  inclusions: Inclusion[];
}

export interface FlourBreakdownLine {
  flour: FlourType;
  grams: number;
}

/** Everything the Loaf Calculator page displays. */
export interface CalculatorResult {
  flourBreakdown: FlourBreakdownLine[];
  starterGrams: number;
  /** Flour and water inside the starter — shown so the math is inspectable. */
  starterFlourGrams: number;
  starterWaterGrams: number;
  totalFlourGrams: number;
  hydrationPercent: number;
  waterToAddGrams: number;
  saltGrams: number;
  /** null when the diastatic malt toggle is off. */
  maltGrams: number | null;
  totalDoughWeightGrams: number;
  /** Plain-English description of how the dough will feel to handle. */
  doughFeel: string;
  /** Suggested hydration range for this flour mix — display only, never applied. */
  suggestedHydration: string | null;
  /** One line per selected inclusion, with suggested amount. */
  inclusionGuidance: string[];
}

// ---- Starter Builder (PRD page 3) ----

/** 1:X:X = one part existing starter, X parts flour, X parts water, by weight. */
export type FeedRatioName = '1:1:1' | '1:2:2' | '1:3:3' | 'custom';

export type StarterFlour = 'white' | 'rye' | 'spelt' | 'mix';

/** The four room-temperature bands used throughout the app (SOURDOUGH_RULES.md §3–4). */
export type TempBandId = 'cold' | 'cool' | 'moderate' | 'warm';

/** Everything the user enters on the Starter Builder page. */
export interface StarterBuildInput {
  /** Starter currently in the jar. */
  haveGrams: number;
  /** Active starter the recipe needs. */
  needGrams: number;
  ratio: FeedRatioName;
  /** The X in 1:X:X — only read when ratio is 'custom'. */
  customRatioPart?: number;
  starterFlour: StarterFlour;
  tempBand: TempBandId;
}

/** A workable single-feed plan: exactly what to keep, discard, and feed. */
export interface StarterBuildPlan {
  kind: 'plan';
  keepGrams: number;
  discardGrams: number;
  feedFlourGrams: number;
  feedWaterGrams: number;
  /** What's in the jar after feeding = keep + flour + water. */
  totalGrams: number;
  /** What's left after the bake takes what it needs — seed for next time. */
  leftoverGrams: number;
  /** The whole plan as one friendly sentence (PRD example format). */
  instructions: string;
  /** e.g. "4–7 hours" for the chosen temperature band. */
  peakHoursLabel: string;
}

/** Not enough starter in the jar to reach the target in one feed at this ratio. */
export interface StarterBuildShortfall {
  kind: 'not-enough';
  /** What feeding everything they have at this ratio would produce. */
  oneFeedTotalGrams: number;
  message: string;
}

export type StarterBuildResult = StarterBuildPlan | StarterBuildShortfall;

// ---- Bake Planner (PRD page 4) ----

export type BakeGoal = 'now' | 'tomorrow-morning' | 'tomorrow-evening';

/** Everything the user enters on the Bake Planner page. */
export interface PlannerInput {
  tempBand: TempBandId;
  goal: BakeGoal;
  /** Percent of added flour, as in the calculator. Affects coaching notes only. */
  starterPercent: number;
  fridgeProof: boolean;
}

export interface PlanStep {
  id: string;
  label: string;
  /** When this step starts. */
  at: Date;
  /** Human-readable duration or range, e.g. "4–6 hours". */
  durationLabel: string;
  note?: string;
}

export interface BakePlan {
  steps: PlanStep[];
  /** When the loaf comes out of the oven. */
  doneAt: Date;
  /** Coaching caveats — infeasible start time, late-night bake, unusual starter %. */
  warnings: string[];
}

// ---- Loaf Log (PRD page 7) ----

/** The five photo moments the PRD asks for. */
export type PhotoSlot = 'after-mix' | 'before-shaping' | 'shaped' | 'baked' | 'crumb';

/**
 * One logged loaf. Every field is optional (PRD: "optional fields") — this is a
 * diary, not a form to fight with. Amounts and durations are free text on purpose:
 * "376g", "about 6h", "overnight" are all valid diary entries, and no math is ever
 * done on them.
 */
export interface LoafEntry {
  id: string;
  /** ISO timestamp of when the entry was saved. */
  createdAt: string;
  /** Bake date, yyyy-mm-dd. */
  date: string;
  flourMix: string;
  water: string;
  starter: string;
  salt: string;
  roomTemp: string;
  bulkDuration: string;
  fridgeDuration: string;
  bakeTime: string;
  notes: string;
  /** 1–10, or null when unrated. */
  rating: number | null;
  /** Downscaled JPEG data URLs, keyed by photo moment. */
  photos: Partial<Record<PhotoSlot, string>>;
}

/** errors block calculation; warnings coach but allow (SOURDOUGH_RULES.md §6). */
export type IssueSeverity = 'error' | 'warning';

export type IssueField =
  | 'addedFlourGrams'
  | 'flourMix'
  | 'hydration'
  | 'starterPercent'
  | 'saltPercent'
  | 'haveGrams'
  | 'needGrams'
  | 'ratio';

export interface ValidationIssue {
  severity: IssueSeverity;
  field: IssueField;
  /** Beginner-friendly, plain English — never developer-speak. */
  message: string;
}
