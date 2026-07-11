import { describe, expect, it } from 'vitest';
import { calculateLoaf, describeDoughFeel, suggestedHydrationForMix } from './calculations';
import { EASY_WHOLEMEAL_LOAF, NAIVE_WRONG_WATER_GRAMS, STANDARD_LOAF } from './examples';

describe('the standard beginner loaf (PRD worked example)', () => {
  const result = calculateLoaf(STANDARD_LOAF.input);

  it('570g flour at 20% starter needs 114g starter (57g flour + 57g water)', () => {
    expect(result.starterGrams).toBe(STANDARD_LOAF.expected.starterGrams);
    expect(result.starterFlourGrams).toBe(STANDARD_LOAF.expected.starterFlourGrams);
    expect(result.starterWaterGrams).toBe(STANDARD_LOAF.expected.starterWaterGrams);
  });

  it('counts the starter flour: total flour is 627g, not 570g', () => {
    expect(result.totalFlourGrams).toBe(STANDARD_LOAF.expected.totalFlourGrams);
  });

  it('at 69% true hydration, water to add is 376g', () => {
    expect(result.waterToAddGrams).toBe(STANDARD_LOAF.expected.waterToAddGrams);
  });

  it('never makes the beginner mistake of 69% × 570g = 393g water', () => {
    expect(result.waterToAddGrams).not.toBe(NAIVE_WRONG_WATER_GRAMS);
  });

  it('salt is 2% of total flour: 12.5g', () => {
    expect(result.saltGrams).toBe(STANDARD_LOAF.expected.saltGrams);
  });

  it('total dough weight is about 1073g', () => {
    expect(result.totalDoughWeightGrams).toBe(STANDARD_LOAF.expected.totalDoughWeightGrams);
  });

  it('malt is off by default', () => {
    expect(result.maltGrams).toBeNull();
  });
});

describe('easy-mode wholemeal blend', () => {
  const result = calculateLoaf(EASY_WHOLEMEAL_LOAF.input);

  it('easy mode means 68% hydration', () => {
    expect(result.hydrationPercent).toBe(EASY_WHOLEMEAL_LOAF.expected.hydrationPercent);
  });

  it('500g flour at 20% starter and 68% hydration needs 324g water', () => {
    expect(result.starterGrams).toBe(EASY_WHOLEMEAL_LOAF.expected.starterGrams);
    expect(result.totalFlourGrams).toBe(EASY_WHOLEMEAL_LOAF.expected.totalFlourGrams);
    expect(result.waterToAddGrams).toBe(EASY_WHOLEMEAL_LOAF.expected.waterToAddGrams);
    expect(result.saltGrams).toBe(EASY_WHOLEMEAL_LOAF.expected.saltGrams);
  });

  it('splits the flour breakdown by mix percentages', () => {
    expect(result.flourBreakdown).toEqual([
      { flour: 'high-grade-white', grams: 400 },
      { flour: 'wholemeal', grams: 100 },
    ]);
  });

  it('suggests 69–72% hydration for 20% wholemeal (display only)', () => {
    expect(result.suggestedHydration).toBe(EASY_WHOLEMEAL_LOAF.expectedSuggestedHydration);
  });
});

describe('diastatic malt', () => {
  it('is 0.5% of total flour when toggled on (627g → 3.1g)', () => {
    const result = calculateLoaf({ ...STANDARD_LOAF.input, diastaticMalt: true });
    expect(result.maltGrams).toBe(3.1);
  });
});

describe('hydration guidance for flour mixes (SOURDOUGH_RULES.md §2)', () => {
  it.each([
    [{ 'high-grade-white': 100 }, '68–70%'],
    [{ 'plain-white': 100 }, '67–69%'],
    [{ 'high-grade-white': 85, spelt: 15 }, '68–70%'],
    [{ 'high-grade-white': 85, rye: 15 }, '68–70%'],
    [{ 'high-grade-white': 88, 'pearl-barley': 12 }, '68–70%'],
    [{ 'high-grade-white': 75, wholemeal: 25 }, '69–72%'],
  ] as const)('%o → %s', (mix, range) => {
    expect(suggestedHydrationForMix(mix)).toBe(range);
  });

  it('gives no suggestion for mixes outside the guidance table', () => {
    expect(suggestedHydrationForMix({ rye: 60, spelt: 40 })).toBeNull();
  });
});

describe('expected dough feel', () => {
  it('calls 69% hydration soft but manageable', () => {
    expect(describeDoughFeel(69, { 'high-grade-white': 100 })).toContain('manageable');
  });

  it('warns about stickiness for rye-heavy mixes', () => {
    expect(describeDoughFeel(69, { 'high-grade-white': 80, rye: 20 })).toContain('Rye');
  });

  it('calls very wet dough what it is', () => {
    expect(describeDoughFeel(80, { 'high-grade-white': 100 })).toContain('Very wet');
  });
});

describe('inclusions', () => {
  it('suggests amounts based on total flour', () => {
    const result = calculateLoaf({
      ...STANDARD_LOAF.input,
      inclusions: ['olives', 'rosemary'],
    });
    expect(result.inclusionGuidance).toHaveLength(2);
    expect(result.inclusionGuidance[0]).toContain('94g'); // 15% of 627g
    expect(result.inclusionGuidance[1]).toContain('tablespoons');
  });
});
