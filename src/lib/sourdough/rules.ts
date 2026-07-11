/**
 * rules.ts — named constants and thresholds from docs/SOURDOUGH_RULES.md.
 *
 * Single responsibility: numbers with names. Every constant here must trace back to a
 * rule written in plain English in docs/SOURDOUGH_RULES.md — if a number changes here,
 * that doc changes in the same commit (see CLAUDE.md rule 4).
 *
 * Will contain, roughly:
 *   - DEFAULT_SALT_PERCENT, DEFAULT_STARTER_PERCENT
 *   - hydration/salt/starter/temperature validation ranges
 *   - fermentation reference points (baseline hours at reference temperature)
 *
 * No calculations here — just the values calculations.ts and validation.ts read from.
 *
 * Placeholder until the first build milestone.
 */

export {};
