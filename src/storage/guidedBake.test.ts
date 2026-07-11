import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { clearProgress, loadProgress, saveProgress } from './guidedBake';

/** Minimal in-memory stand-in for window.localStorage. */
function fakeStorage(): Storage {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
    clear: () => map.clear(),
    key: (i) => [...map.keys()][i] ?? null,
    get length() {
      return map.size;
    },
  };
}

beforeEach(() => {
  (globalThis as { localStorage?: Storage }).localStorage = fakeStorage();
});

afterEach(() => {
  delete (globalThis as { localStorage?: Storage }).localStorage;
});

describe('guided bake progress storage', () => {
  it('round-trips progress', () => {
    saveProgress({ completedIds: ['build-starter', 'mix'], startedAt: '2026-07-11T09:00:00Z' });
    expect(loadProgress()).toEqual({
      completedIds: ['build-starter', 'mix'],
      startedAt: '2026-07-11T09:00:00Z',
    });
  });

  it('starts fresh when nothing is saved', () => {
    expect(loadProgress()).toEqual({ completedIds: [], startedAt: null });
  });

  it('starts fresh instead of crashing on junk data', () => {
    globalThis.localStorage.setItem('sourdough-coach:guided-bake', '{not json');
    expect(loadProgress()).toEqual({ completedIds: [], startedAt: null });
    globalThis.localStorage.setItem('sourdough-coach:guided-bake', '{"completedIds": 42}');
    expect(loadProgress()).toEqual({ completedIds: [], startedAt: null });
  });

  it('clears a bake', () => {
    saveProgress({ completedIds: ['mix'], startedAt: null });
    clearProgress();
    expect(loadProgress()).toEqual({ completedIds: [], startedAt: null });
  });

  it('survives having no localStorage at all', () => {
    delete (globalThis as { localStorage?: Storage }).localStorage;
    expect(loadProgress()).toEqual({ completedIds: [], startedAt: null });
    expect(() => saveProgress({ completedIds: ['mix'], startedAt: null })).not.toThrow();
  });
});
