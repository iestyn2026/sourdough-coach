import { describe, expect, it } from 'vitest';
import { planBake } from './calculations';
import { validatePlannerInput, hasErrors } from './validation';
import type { PlannerInput } from './types';

/** A fixed Saturday morning so every test is deterministic. */
const NOW = new Date('2026-07-11T09:00:00');

const input = (overrides: Partial<PlannerInput> = {}): PlannerInput => ({
  tempBand: 'moderate',
  goal: 'now',
  starterPercent: 20,
  fridgeProof: true,
  ...overrides,
});

const at = (plan: ReturnType<typeof planBake>, id: string) => {
  const step = plan.steps.find((s) => s.id === id);
  if (!step) throw new Error(`no step ${id}`);
  return step.at;
};

describe('start now, moderate kitchen, fridge proof', () => {
  const plan = planBake(input(), NOW);

  it('walks the PRD step order', () => {
    expect(plan.steps.map((s) => s.id)).toEqual([
      'build-starter', 'mix', 'rest', 'folds', 'bulk', 'shape',
      'fridge-proof', 'preheat', 'bake',
    ]);
  });

  it('starts building starter right away', () => {
    expect(at(plan, 'build-starter')).toEqual(new Date('2026-07-11T09:00:00'));
  });

  it('mixes after the 4–7h starter peak (midpoint 5.5h → 2:30pm)', () => {
    expect(at(plan, 'mix')).toEqual(new Date('2026-07-11T14:30:00'));
  });

  it('folds start when bulk starts — they overlap on purpose', () => {
    expect(at(plan, 'folds')).toEqual(at(plan, 'bulk'));
  });

  it('shapes after the 4–6h bulk (midpoint 5h → 8:30pm)', () => {
    expect(at(plan, 'shape')).toEqual(new Date('2026-07-11T20:30:00'));
  });

  it('bakes tomorrow morning after the fridge proof', () => {
    expect(at(plan, 'bake')).toEqual(new Date('2026-07-12T07:30:00'));
    expect(plan.doneAt).toEqual(new Date('2026-07-12T08:15:00'));
  });

  it('shows ranges, not false precision', () => {
    expect(plan.steps.find((s) => s.id === 'bulk')?.durationLabel).toBe('4–6 hours');
  });

  it('coaches shaping by look and feel, never "doubled"', () => {
    const note = plan.steps.find((s) => s.id === 'bulk')?.note ?? '';
    expect(note).toContain('50–70%');
    expect(note).not.toContain('double');
  });

  it('has no warnings for this comfortable plan', () => {
    expect(plan.warnings).toEqual([]);
  });
});

describe('bake tomorrow morning (anchored backwards)', () => {
  it('puts the loaf in the oven at 8am sharp in a warm kitchen', () => {
    const plan = planBake(input({ goal: 'tomorrow-morning', tempBand: 'warm' }), NOW);
    expect(at(plan, 'bake')).toEqual(new Date('2026-07-12T08:00:00'));
    // Lead time: 4h peak + 15m mix + 45m rest + 4h bulk + 15m shape + 10h fridge
    // + 45m preheat = 20h exactly → start at noon today.
    expect(at(plan, 'build-starter')).toEqual(new Date('2026-07-11T12:00:00'));
    expect(plan.warnings).toEqual([]);
  });

  it('warns when the required start time has already passed', () => {
    // Moderate + fridge needs 22.5h of lead time → must start by 9:30am for an 8am
    // bake. At 10am that has already passed.
    const tenAm = new Date('2026-07-11T10:00:00');
    const plan = planBake(input({ goal: 'tomorrow-morning' }), tenAm);
    expect(at(plan, 'build-starter')).toEqual(new Date('2026-07-11T09:30:00'));
    expect(plan.warnings.some((w) => w.includes('already passed'))).toBe(true);
  });
});

describe('bake tomorrow evening', () => {
  it('anchors the bake at 6pm tomorrow', () => {
    const plan = planBake(input({ goal: 'tomorrow-evening' }), NOW);
    expect(at(plan, 'bake')).toEqual(new Date('2026-07-12T18:00:00'));
    expect(plan.warnings).toEqual([]);
  });
});

describe('fridge proof choice', () => {
  it('no fridge → short bench proof instead', () => {
    const plan = planBake(input({ fridgeProof: false }), NOW);
    const ids = plan.steps.map((s) => s.id);
    expect(ids).toContain('bench-proof');
    expect(ids).not.toContain('fridge-proof');
  });
});

describe('coaching notes', () => {
  it('cold kitchens get the overnight-bulk note', () => {
    const plan = planBake(input({ tempBand: 'cold' }), NOW);
    expect(plan.steps.find((s) => s.id === 'bulk')?.note).toContain('overnight');
  });

  it('unusual starter percentage shifts the ranges — and says so', () => {
    const plan = planBake(input({ starterPercent: 30 }), NOW);
    expect(plan.warnings.some((w) => w.includes('early end'))).toBe(true);
  });

  it('warns about a middle-of-the-night bake and suggests the fridge', () => {
    // Warm kitchen, no fridge, starting at noon: 4h + 1h + 4h + 15m + 1.5h + 45m → 23:30 bake.
    const noon = new Date('2026-07-11T12:00:00');
    const plan = planBake(input({ tempBand: 'warm', fridgeProof: false }), noon);
    expect(plan.warnings.some((w) => w.includes('night'))).toBe(true);
  });

  it('does not nag about night baking when the fridge makes timing flexible', () => {
    const plan = planBake(input(), NOW); // bake lands 7:30am anyway
    expect(plan.warnings).toEqual([]);
  });
});

describe('validatePlannerInput', () => {
  it('accepts the default', () => {
    expect(validatePlannerInput(input())).toEqual([]);
  });

  it('blocks impossible starter percentages', () => {
    expect(hasErrors(validatePlannerInput(input({ starterPercent: 80 })))).toBe(true);
  });
});
