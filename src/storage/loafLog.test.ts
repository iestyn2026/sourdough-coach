import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { addEntry, deleteEntry, loadEntries, saveEntries } from './loafLog';
import type { LoafEntry } from '../lib/sourdough/types';

function fakeStorage(opts: { full?: boolean } = {}): Storage {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => {
      if (opts.full) throw new DOMException('quota', 'QuotaExceededError');
      map.set(k, v);
    },
    removeItem: (k) => void map.delete(k),
    clear: () => map.clear(),
    key: (i) => [...map.keys()][i] ?? null,
    get length() {
      return map.size;
    },
  };
}

const entry = (overrides: Partial<LoafEntry> = {}): LoafEntry => ({
  id: 'loaf-1',
  createdAt: '2026-07-11T10:00:00Z',
  date: '2026-07-11',
  flourMix: '80% white, 20% wholemeal',
  water: '376g',
  starter: '114g',
  salt: '12.5g',
  roomTemp: 'about 22°C',
  bulkDuration: '5h',
  fridgeDuration: 'overnight',
  bakeTime: '45 min',
  notes: 'Best crumb yet.',
  rating: 8,
  photos: { crumb: 'data:image/jpeg;base64,abc' },
  ...overrides,
});

beforeEach(() => {
  (globalThis as { localStorage?: Storage }).localStorage = fakeStorage();
});

afterEach(() => {
  delete (globalThis as { localStorage?: Storage }).localStorage;
});

describe('loaf log storage', () => {
  it('round-trips an entry, photos included', () => {
    expect(addEntry(entry())).toBe(true);
    expect(loadEntries()).toEqual([entry()]);
  });

  it('keeps newest first', () => {
    addEntry(entry({ id: 'older' }));
    addEntry(entry({ id: 'newer' }));
    expect(loadEntries().map((e) => e.id)).toEqual(['newer', 'older']);
  });

  it('deletes by id', () => {
    addEntry(entry({ id: 'keep' }));
    addEntry(entry({ id: 'toss' }));
    expect(deleteEntry('toss')).toBe(true);
    expect(loadEntries().map((e) => e.id)).toEqual(['keep']);
  });

  it('reports failure instead of throwing when storage is full', () => {
    (globalThis as { localStorage?: Storage }).localStorage = fakeStorage({ full: true });
    expect(addEntry(entry())).toBe(false);
    expect(saveEntries([entry()])).toBe(false);
  });

  it('starts empty instead of crashing on junk data', () => {
    globalThis.localStorage.setItem('sourdough-coach:loaf-log', 'not json at all');
    expect(loadEntries()).toEqual([]);
    globalThis.localStorage.setItem('sourdough-coach:loaf-log', '[{"nope": true}, 42]');
    expect(loadEntries()).toEqual([]);
  });

  it('survives having no localStorage at all', () => {
    delete (globalThis as { localStorage?: Storage }).localStorage;
    expect(loadEntries()).toEqual([]);
    expect(addEntry(entry())).toBe(false);
  });
});
