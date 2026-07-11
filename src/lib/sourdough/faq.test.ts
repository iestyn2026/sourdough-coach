import { describe, expect, it } from 'vitest';
import { FAQ_CATEGORIES } from './faq';

const questions = (id: string) =>
  FAQ_CATEGORIES.find((c) => c.id === id)!.entries.map((e) => e.question);

describe('Troubleshooting content (PRD page 6)', () => {
  it('covers every PRD starter question', () => {
    expect(questions('starter')).toEqual([
      'What does 1:1:1 mean?',
      'Why discard starter?',
      'What if my starter peaked too early?',
      'How do I revive starter after travel?',
      'Can I feed starter rye or spelt?',
      'How do I store starter for 1 week, 2 weeks, or 4 weeks?',
    ]);
  });

  it('covers every PRD dough question', () => {
    expect(questions('dough')).toEqual([
      'Why is my dough sticky?',
      'Why did it not rise?',
      'Should dough double?',
      'Can I leave dough overnight?',
      'Should I fridge before or after shaping?',
      'What is seam side up?',
      'Why did it stick to the banneton?',
      'Do I need rice flour?',
    ]);
  });

  it('covers every PRD baking question', () => {
    expect(questions('baking')).toEqual([
      'Why is my crust soft?',
      'Why is my loaf flat?',
      'Why is my crumb gummy?',
      'Why did it burst randomly?',
      'How deep should I score?',
      'Why does my oven temperature matter?',
    ]);
  });

  it('covers every PRD ingredients question', () => {
    expect(questions('ingredients')).toEqual([
      'What does rye do?',
      'What does spelt do?',
      'What does pearl barley flour do?',
      'What is diastatic malt?',
      'Should I add olives or seeds?',
    ]);
  });

  it('keeps answers short and practical (PRD requirement)', () => {
    for (const category of FAQ_CATEGORIES) {
      for (const entry of category.entries) {
        expect(entry.answer.length, entry.id).toBeGreaterThan(50);
        expect(entry.answer.length, entry.id).toBeLessThan(600);
      }
    }
  });

  it('answers agree with the app\'s own rules', () => {
    const all = FAQ_CATEGORIES.flatMap((c) => c.entries);
    const doubling = all.find((e) => e.id === 'should-double')!;
    expect(doubling.answer).toContain('No');
    expect(doubling.answer).toContain('50–70%');
    expect(all.find((e) => e.id === 'score-depth')!.answer).toContain('1cm');
    expect(all.find((e) => e.id === 'diastatic-malt')!.answer).toContain('0.5%');
  });

  it('entry ids are unique across all categories', () => {
    const ids = FAQ_CATEGORIES.flatMap((c) => c.entries.map((e) => e.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});
