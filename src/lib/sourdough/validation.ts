/**
 * validation.ts — input checking with human-readable messages.
 *
 * Errors block the calculation; warnings coach but allow (SOURDOUGH_RULES.md §6).
 * Messages talk to a home baker, never developer-speak. Ranges live in rules.ts.
 */

import type { CalculatorInput, ValidationIssue } from './types';
import { resolveHydrationPercent } from './calculations';
import {
  ADDED_FLOUR_RANGE,
  HYDRATION_RANGE,
  MIX_TOTAL_TOLERANCE,
  SALT_RANGE,
  STARTER_RANGE,
  type Range,
} from './rules';

function checkRange(
  value: number,
  range: Range,
  field: ValidationIssue['field'],
  errorMessage: string,
  warningMessage: string,
): ValidationIssue | null {
  if (!Number.isFinite(value) || value < range.errorMin || value > range.errorMax) {
    return { severity: 'error', field, message: errorMessage };
  }
  if (value < range.warnMin || value > range.warnMax) {
    return { severity: 'warning', field, message: warningMessage };
  }
  return null;
}

export function validateCalculatorInput(input: CalculatorInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const push = (issue: ValidationIssue | null) => issue && issues.push(issue);

  push(
    checkRange(
      input.addedFlourGrams,
      ADDED_FLOUR_RANGE,
      'addedFlourGrams',
      `Flour needs to be between ${ADDED_FLOUR_RANGE.errorMin}g and ${ADDED_FLOUR_RANGE.errorMax}g.`,
      `That's an unusual amount — most home loaves use ${ADDED_FLOUR_RANGE.warnMin}–${ADDED_FLOUR_RANGE.warnMax}g of flour.`,
    ),
  );

  if (input.hydrationMode === 'custom' && !Number.isFinite(input.customHydrationPercent)) {
    issues.push({
      severity: 'error',
      field: 'hydration',
      message: 'Enter your custom hydration percentage.',
    });
  } else {
    push(
      checkRange(
        resolveHydrationPercent(input),
        HYDRATION_RANGE,
        'hydration',
        `Hydration needs to be between ${HYDRATION_RANGE.errorMin}% and ${HYDRATION_RANGE.errorMax}%.`,
        `Wetter dough is harder to handle — ${HYDRATION_RANGE.warnMin}–${HYDRATION_RANGE.warnMax}% is the beginner sweet spot.`,
      ),
    );
  }

  push(
    checkRange(
      input.starterPercent,
      STARTER_RANGE,
      'starterPercent',
      `Starter needs to be between ${STARTER_RANGE.errorMin}% and ${STARTER_RANGE.errorMax}% of your flour.`,
      `Most beginner recipes use ${STARTER_RANGE.warnMin}–${STARTER_RANGE.warnMax}% starter.`,
    ),
  );

  push(
    checkRange(
      input.saltPercent,
      SALT_RANGE,
      'saltPercent',
      `Salt needs to be between ${SALT_RANGE.errorMin}% and ${SALT_RANGE.errorMax}%.`,
      `Most loaves taste right with ${SALT_RANGE.warnMin}–${SALT_RANGE.warnMax}% salt.`,
    ),
  );

  const mixTotal = Object.values(input.flourMix).reduce(
    (sum, pct) => sum + (Number.isFinite(pct) ? pct : 0),
    0,
  );
  if (Math.abs(mixTotal - 100) > MIX_TOTAL_TOLERANCE) {
    issues.push({
      severity: 'error',
      field: 'flourMix',
      message: `Your flour mix adds up to ${mixTotal}% — it needs to total 100%.`,
    });
  }

  return issues;
}

export const hasErrors = (issues: ValidationIssue[]) =>
  issues.some((issue) => issue.severity === 'error');
