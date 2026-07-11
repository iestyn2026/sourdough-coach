/**
 * types.ts — shared data shapes for the sourdough domain.
 *
 * Single responsibility: define WHAT the data looks like. No logic, no constants,
 * no functions — just TypeScript interfaces and types used by the other files.
 *
 * Will contain (once the PRD is confirmed), roughly:
 *   - Recipe        — flour weight, hydration %, salt %, starter % (baker's percentages)
 *   - Starter       — hydration ratio (assumed 100% for MVP), amount
 *   - BakeSession   — a recipe plus real-world context: dough temperature, start time,
 *                     user observations, outcome notes
 *   - ValidationIssue — a machine-readable code plus a human-readable message
 *
 * Placeholder until the first build milestone.
 */

export {};
