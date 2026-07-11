/**
 * guidedBake.ts — persistence for Guided Bake progress (localStorage).
 *
 * Storage layer: save/load only, no baking logic (ARCHITECTURE.md). A bake spans a
 * day or more, so progress must survive page reloads. Everything is defensive — if
 * storage is unavailable or holds junk, the app falls back to a fresh bake rather
 * than crashing.
 */

export interface GuidedBakeProgress {
  completedIds: string[];
  /** ISO timestamp of when the first step was completed; null for a fresh bake. */
  startedAt: string | null;
}

const KEY = 'sourdough-coach:guided-bake';

export const EMPTY_PROGRESS: GuidedBakeProgress = { completedIds: [], startedAt: null };

function storageOrNull(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null; // some private-browsing modes throw on access
  }
}

export function loadProgress(): GuidedBakeProgress {
  const storage = storageOrNull();
  if (!storage) return EMPTY_PROGRESS;
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' && parsed !== null &&
      Array.isArray((parsed as GuidedBakeProgress).completedIds) &&
      (parsed as GuidedBakeProgress).completedIds.every((id) => typeof id === 'string')
    ) {
      const p = parsed as GuidedBakeProgress;
      return { completedIds: p.completedIds, startedAt: p.startedAt ?? null };
    }
    return EMPTY_PROGRESS;
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function saveProgress(progress: GuidedBakeProgress): void {
  try {
    storageOrNull()?.setItem(KEY, JSON.stringify(progress));
  } catch {
    // Storage full or unavailable — the bake continues, just without persistence.
  }
}

export function clearProgress(): void {
  try {
    storageOrNull()?.removeItem(KEY);
  } catch {
    // Nothing to do.
  }
}
