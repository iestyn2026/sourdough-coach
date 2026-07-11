import { describe, expect, it } from 'vitest';
import { buildStarter } from './calculations';
import { validateStarterBuildInput, hasErrors } from './validation';
import { EVERYDAY_STARTER_BUILD, PRD_STARTER_BUILD } from './examples';
import type { StarterBuildInput } from './types';

const input = (overrides: Partial<StarterBuildInput>): StarterBuildInput => ({
  ...EVERYDAY_STARTER_BUILD.input,
  ...overrides,
});

describe('the PRD starter example (80g on hand, 125g needed, 1:2.75:2.75)', () => {
  const result = buildStarter(PRD_STARTER_BUILD.input);

  it('keep 20g, discard 60g, feed 55g flour + 55g water = 130g', () => {
    expect(result).toMatchObject(PRD_STARTER_BUILD.expected);
  });

  it('reads like the PRD example sentence', () => {
    expect(result.kind).toBe('plan');
    if (result.kind === 'plan') {
      expect(result.instructions).toBe(
        'You have 80g starter but only need 125g active starter. Keep 20g, discard 60g, ' +
          'then feed 20g starter + 55g white flour + 55g water = 130g total.',
      );
    }
  });
});

describe('everyday 1:2:2 build', () => {
  const result = buildStarter(EVERYDAY_STARTER_BUILD.input);

  it('keep 26g, discard 54g, feed 52g + 52g = 130g', () => {
    expect(result).toMatchObject(EVERYDAY_STARTER_BUILD.expected);
  });

  it('names the chosen starter flour in the instructions', () => {
    if (result.kind === 'plan') expect(result.instructions).toContain('rye flour');
  });

  it('estimates peak time from the temperature band (cool → 6–9 hours)', () => {
    if (result.kind === 'plan') expect(result.peakHoursLabel).toBe('6–9 hours');
  });
});

describe('when the jar cannot reach the target in one feed', () => {
  it('says what one feed would give and suggests a way forward', () => {
    const result = buildStarter(input({ haveGrams: 10, needGrams: 200, ratio: '1:1:1' }));
    expect(result.kind).toBe('not-enough');
    if (result.kind === 'not-enough') {
      expect(result.oneFeedTotalGrams).toBe(30); // 10g × (1 + 2×1)
      expect(result.message).toContain('30g');
      expect(result.message).toContain('feed again');
    }
  });
});

describe('edge cases', () => {
  it('skips the discard step when nothing needs discarding', () => {
    const result = buildStarter(input({ haveGrams: 26 }));
    if (result.kind === 'plan') {
      expect(result.discardGrams).toBe(0);
      expect(result.instructions).not.toContain('discard');
    }
  });

  it('builds a small buffer so some starter survives the bake', () => {
    const result = buildStarter(EVERYDAY_STARTER_BUILD.input);
    if (result.kind === 'plan') expect(result.totalGrams).toBeGreaterThan(125);
  });
});

describe('validateStarterBuildInput', () => {
  it('accepts both worked examples with no issues', () => {
    expect(validateStarterBuildInput(PRD_STARTER_BUILD.input)).toEqual([]);
    expect(validateStarterBuildInput(EVERYDAY_STARTER_BUILD.input)).toEqual([]);
  });

  it('requires the X when the custom ratio is chosen', () => {
    const issues = validateStarterBuildInput(
      input({ ratio: 'custom', customRatioPart: undefined }),
    );
    expect(hasErrors(issues)).toBe(true);
  });

  it('blocks an empty jar', () => {
    expect(hasErrors(validateStarterBuildInput(input({ haveGrams: 0 })))).toBe(true);
  });

  it('warns on unusually large starter needs', () => {
    const issues = validateStarterBuildInput(input({ needGrams: 400 }));
    expect(hasErrors(issues)).toBe(false);
    expect(issues[0].severity).toBe('warning');
  });
});
