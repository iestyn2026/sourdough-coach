import { describe, expect, it } from 'vitest';
import { hasErrors, validateCalculatorInput } from './validation';
import { STANDARD_LOAF } from './examples';
import type { CalculatorInput } from './types';

const input = (overrides: Partial<CalculatorInput>): CalculatorInput => ({
  ...STANDARD_LOAF.input,
  ...overrides,
});

describe('validateCalculatorInput', () => {
  it('accepts the standard loaf with no issues', () => {
    expect(validateCalculatorInput(STANDARD_LOAF.input)).toEqual([]);
  });

  it('blocks impossible flour amounts', () => {
    const issues = validateCalculatorInput(input({ addedFlourGrams: 50 }));
    expect(hasErrors(issues)).toBe(true);
  });

  it('warns (but allows) unusual flour amounts', () => {
    const issues = validateCalculatorInput(input({ addedFlourGrams: 1500 }));
    expect(hasErrors(issues)).toBe(false);
    expect(issues[0].severity).toBe('warning');
  });

  it('requires a number when custom hydration is chosen', () => {
    const issues = validateCalculatorInput(
      input({ hydrationMode: 'custom', customHydrationPercent: undefined }),
    );
    expect(hasErrors(issues)).toBe(true);
  });

  it('warns about very wet custom hydration', () => {
    const issues = validateCalculatorInput(
      input({ hydrationMode: 'custom', customHydrationPercent: 85 }),
    );
    expect(issues).toEqual([
      expect.objectContaining({ severity: 'warning', field: 'hydration' }),
    ]);
  });

  it('speaks to bakers, not developers', () => {
    const issues = validateCalculatorInput(input({ saltPercent: 9 }));
    expect(issues[0].message).toContain('Salt');
    expect(issues[0].message).not.toMatch(/value|invalid|range|input/i);
  });

  it('blocks a flour mix that does not total 100%', () => {
    const issues = validateCalculatorInput(
      input({ flourMix: { 'high-grade-white': 60, rye: 20 } }),
    );
    expect(hasErrors(issues)).toBe(true);
    expect(issues[0].message).toContain('80%');
  });

  it('blocks non-numeric input rather than showing NaN results', () => {
    const issues = validateCalculatorInput(input({ addedFlourGrams: Number.NaN }));
    expect(hasErrors(issues)).toBe(true);
  });
});
