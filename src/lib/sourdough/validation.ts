/**
 * validation.ts — input checking with human-readable messages.
 *
 * Errors block the calculation; warnings coach but allow (SOURDOUGH_RULES.md §6).
 * Messages talk to a home baker, never developer-speak. Ranges live in rules.ts.
 */

import type {
  CalculatorInput,
  PlannerInput,
  StarterBuildInput,
  ValidationIssue,
} from './types';
import { resolveHydrationPercent } from './calculations';
import {
  ADDED_FLOUR_RANGE,
  CUSTOM_RATIO_RANGE,
  HYDRATION_RANGE,
  MIX_TOTAL_TOLERANCE,
  SALT_RANGE,
  STARTER_HAVE_RANGE,
  STARTER_NEED_RANGE,
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

export function validateStarterBuildInput(input: StarterBuildInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const push = (issue: ValidationIssue | null) => issue && issues.push(issue);

  push(
    checkRange(
      input.haveGrams,
      STARTER_HAVE_RANGE,
      'haveGrams',
      'Enter how much starter is in your jar (even 1g works).',
      `That's an unusual amount of starter to have — most jars hold ${STARTER_HAVE_RANGE.warnMin}–${STARTER_HAVE_RANGE.warnMax}g.`,
    ),
  );

  push(
    checkRange(
      input.needGrams,
      STARTER_NEED_RANGE,
      'needGrams',
      `Starter needed should be between ${STARTER_NEED_RANGE.errorMin}g and ${STARTER_NEED_RANGE.errorMax}g.`,
      `Most home bakes need ${STARTER_NEED_RANGE.warnMin}–${STARTER_NEED_RANGE.warnMax}g of starter.`,
    ),
  );

  if (input.ratio === 'custom') {
    if (!Number.isFinite(input.customRatioPart)) {
      issues.push({
        severity: 'error',
        field: 'ratio',
        message: 'Enter the X in your custom 1:X:X ratio.',
      });
    } else {
      push(
        checkRange(
          input.customRatioPart!,
          CUSTOM_RATIO_RANGE,
          'ratio',
          `Custom ratios work between 1:${CUSTOM_RATIO_RANGE.errorMin} and 1:${CUSTOM_RATIO_RANGE.errorMax} parts flour and water.`,
          `Ratios beyond 1:${CUSTOM_RATIO_RANGE.warnMax}:${CUSTOM_RATIO_RANGE.warnMax} take much longer to peak.`,
        ),
      );
    }
  }

  return issues;
}

export function validatePlannerInput(input: PlannerInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const issue = checkRange(
    input.starterPercent,
    STARTER_RANGE,
    'starterPercent',
    `Starter needs to be between ${STARTER_RANGE.errorMin}% and ${STARTER_RANGE.errorMax}% of your flour.`,
    `Most beginner recipes use ${STARTER_RANGE.warnMin}–${STARTER_RANGE.warnMax}% starter.`,
  );
  if (issue) issues.push(issue);
  return issues;
}

export const hasErrors = (issues: ValidationIssue[]) =>
  issues.some((issue) => issue.severity === 'error');
