/**
 * loafLog.ts — persistence for Loaf Log entries (localStorage, PRD page 7).
 *
 * Storage layer: save/load only, no baking logic (ARCHITECTURE.md). Photos are
 * stored inside each entry as downscaled JPEG data URLs (see photos.ts and
 * DECISIONS.md #12), so the whole log lives under one key.
 *
 * Saving reports success/failure instead of throwing: photos make quota overflow a
 * real possibility, and the page needs to tell the user rather than lose their entry.
 */

import type { LoafEntry } from '../lib/sourdough/types';

const KEY = 'sourdough-coach:loaf-log';

function storageOrNull(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null; // some private-browsing modes throw on access
  }
}

function isEntry(value: unknown): value is LoafEntry {
  return (
    typeof value === 'object' && value !== null &&
    typeof (value as LoafEntry).id === 'string' &&
    typeof (value as LoafEntry).date === 'string' &&
    typeof (value as LoafEntry).photos === 'object'
  );
}

/** Newest first. Junk or missing data yields an empty log, never a crash. */
export function loadEntries(): LoafEntry[] {
  const storage = storageOrNull();
  if (!storage) return [];
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isEntry) : [];
  } catch {
    return [];
  }
}

/** Returns false when storage is full or unavailable — caller must tell the user. */
export function saveEntries(entries: LoafEntry[]): boolean {
  const storage = storageOrNull();
  if (!storage) return false;
  try {
    storage.setItem(KEY, JSON.stringify(entries));
    return true;
  } catch {
    return false; // almost always QuotaExceededError once photos accumulate
  }
}

export function addEntry(entry: LoafEntry): boolean {
  return saveEntries([entry, ...loadEntries()]);
}

export function deleteEntry(id: string): boolean {
  return saveEntries(loadEntries().filter((e) => e.id !== id));
}
