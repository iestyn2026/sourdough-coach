# Decision log

One short entry per decision: what, why, and what was traded away. Append new entries at
the bottom. Revisiting a decision gets a *new* entry that references the old one — never
edit history.

---

## 1. Docs-first project setup (2026-07-11)

**Decision:** Write documentation and structure before any application code.
**Why:** The project's goal is understandability, not just working software. Docs written
first describe intent; docs written last describe whatever happened to get built.
**Trade-off:** Slower start; some docs (PRD, rules) begin as skeletons/drafts.

## 2. Vite + React + TypeScript, not Next.js (2026-07-11)

**Decision:** Plain single-page app built with Vite.
**Why:** Vite has minimal hidden behavior — every file's purpose is visible. Next.js adds
server rendering, file-based routing, and build conventions that would have to be learned
to be debugged, and the MVP needs none of them.
**Trade-off:** If a server becomes necessary (e.g. calling the Claude API for coaching),
one must be added deliberately — and logged here.

## 3. No backend; localStorage for persistence (2026-07-11)

**Decision:** MVP stores data in the browser only.
**Why:** Removes accounts, hosting, databases, and security surface entirely. One person's
bakes on one device don't need a server.
**Trade-off:** Data is per-browser and per-device; clearing browser data loses it. Logged
in `KNOWN_LIMITATIONS.md`.

## 4. Business logic isolated in `src/lib/sourdough/` (2026-07-11)

**Decision:** All rules, math, and validation are pure TypeScript functions, separate from
UI. `SOURDOUGH_RULES.md` is the plain-English source of truth the code must match, and
every rule gets a test.
**Why:** Iestyn can read the rules doc, read the tests, and verify the app's behavior
without reading React code.
**Trade-off:** A little more ceremony (passing values between layers) than mixing logic
into components.

## 5. Toolchain deferred until PRD confirmed (2026-07-11)

**Decision:** No `package.json` / npm install at setup time; scaffolding the toolchain is
the first build milestone after the PRD review.
**Why:** Avoids committing to tooling before requirements are seen, and keeps the setup
step purely about documentation and structure, as requested.
**Trade-off:** The placeholder `.ts` files aren't type-checked until then.
