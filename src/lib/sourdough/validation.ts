/**
 * validation.ts — input checking with human-readable messages.
 *
 * Single responsibility: decide whether user input is usable, and explain problems in
 * plain English a home baker understands ("85% hydration is very wet dough — tricky to
 * handle by hand"), never in developer-speak ("value out of range").
 *
 * Two severities, per docs/SOURDOUGH_RULES.md §5:
 *   - error   — the calculation can't proceed (negative weight, hydration over 100%)
 *   - warning — unusual but allowed; the user is coached, not blocked
 *
 * Ranges come from rules.ts. Pure functions only — no UI, no side effects.
 *
 * Placeholder until the first build milestone.
 */

export {};
