import { describe, expect, it } from 'vitest';
import { GUIDED_BAKE_STEPS } from './bakeSteps';

describe('Guided Bake steps (PRD page 5)', () => {
  it('has the PRD\'s fifteen steps in order', () => {
    expect(GUIDED_BAKE_STEPS.map((s) => s.id)).toEqual([
      'build-starter', 'mix', 'rest', 'fold-1', 'fold-2', 'fold-3', 'bulk',
      'shape', 'banneton', 'preheat', 'score', 'bake-lid-on', 'bake-lid-off',
      'cool', 'log',
    ]);
  });

  it('every step carries all four PRD fields, non-empty', () => {
    for (const step of GUIDED_BAKE_STEPS) {
      expect(step.what.length, step.id).toBeGreaterThan(20);
      expect(step.why.length, step.id).toBeGreaterThan(20);
      expect(step.lookFeel.length, step.id).toBeGreaterThan(20);
      expect(step.mistake.length, step.id).toBeGreaterThan(20);
    }
  });

  it('bulk coaches 50–70%, never doubling', () => {
    const bulk = GUIDED_BAKE_STEPS.find((s) => s.id === 'bulk')!;
    expect(bulk.lookFeel).toContain('50–70%');
    expect(bulk.mistake).toContain('NOT double');
  });

  it('step ids are unique', () => {
    const ids = GUIDED_BAKE_STEPS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
