# CLAUDE.md — Working rules for this project

This is Iestyn's first AI-built app. The goal is **not just "make it work"** — it is to
build something he can understand, inspect, change, and improve over time. Not a black box.

## Rules

1. **Build only the milestone explicitly requested.** Do not build ahead, add speculative
   features, or "round out" the app beyond what was asked. If a request is ambiguous about
   scope, ask before building.

2. **Do not overbuild.** Prefer the simplest implementation that satisfies the milestone.
   No new dependencies, abstractions, or config unless the current task genuinely needs
   them — and when one is added, log why in `docs/DECISIONS.md`.

3. **Keep business logic out of UI components.** All sourdough rules, calculations, and
   validation live in `src/lib/sourdough/` as pure, testable TypeScript functions. UI
   components call these functions; they never contain baking math or thresholds themselves.

4. **Update the docs when the code changes.** Specifically:
   - Baking rule or calculation changed → update `docs/SOURDOUGH_RULES.md`
   - Technical or product decision made → append to `docs/DECISIONS.md`
   - Meaningful user-visible or structural change → append to `docs/CHANGELOG.md`
   - New assumption or shortcut taken → append to `docs/KNOWN_LIMITATIONS.md`
   - Structure or stack changed → update `docs/ARCHITECTURE.md`
   A change is not done until its docs are updated.

5. **Explain in plain English.** When summarizing work, explain what changed and why in
   terms Iestyn can verify himself — reference the rule in `SOURDOUGH_RULES.md` or the
   test that proves it, not just the code.

6. **Every rule gets a test.** Logic in `src/lib/sourdough/` is covered by tests that read
   as plain statements of the rules (e.g. "500g flour at 75% hydration needs 375g water").

## Document map

| File | Purpose |
|---|---|
| `docs/PRD.md` | Product vision and MVP scope |
| `docs/SOURDOUGH_RULES.md` | Baking rules and calculations, in plain English — the source of truth the code must match |
| `docs/ARCHITECTURE.md` | Stack, layers, and folder structure |
| `docs/DECISIONS.md` | Log of decisions and trade-offs, newest last |
| `docs/CHANGELOG.md` | Meaningful changes, newest first |
| `docs/KNOWN_LIMITATIONS.md` | Current assumptions, shortcuts, and gaps |
