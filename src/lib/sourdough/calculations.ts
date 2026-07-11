/**
 * calculations.ts — the math, as pure functions.
 *
 * Single responsibility: given valid inputs, compute results. Pure means: same inputs
 * always give the same outputs, no browser APIs, no storage, no side effects. That is
 * what makes every function here directly testable against docs/SOURDOUGH_RULES.md.
 *
 * Will contain, roughly:
 *   - ingredient weights from baker's percentages (flour → water, salt, starter grams)
 *   - true hydration, counting the flour and water inside the starter
 *     (SOURDOUGH_RULES.md §2 — the classic beginner mistake this app must not make)
 *   - recipe scaling (target dough weight → ingredient list)
 *   - bulk fermentation time estimate from dough temperature (SOURDOUGH_RULES.md §3)
 *
 * Constants come from rules.ts; input checking lives in validation.ts, not here.
 *
 * Placeholder until the first build milestone.
 */

export {};
