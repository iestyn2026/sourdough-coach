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

/** errors block calculation; warnings coach but allow (SOURDOUGH_RULES.md §6). */
export type IssueSeverity = 'error' | 'warning';

export type IssueField =
  | 'addedFlourGrams'
  | 'flourMix'
  | 'hydration'
  | 'starterPercent'
  | 'saltPercent';

export interface ValidationIssue {
  severity: IssueSeverity;
  field: IssueField;
  /** Beginner-friendly, plain English — never developer-speak. */
  message: string;
}
