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

## 6. PRD adopted; interim defaults for its gaps (2026-07-11)

**Decision:** Iestyn's PRD is adopted as the scope source of truth (`PRD.md`), and
`SOURDOUGH_RULES.md` now carries its exact numbers. Where the PRD is silent, interim
defaults were chosen so work can proceed: salt = 2% of **total** flour (including starter
flour, ~12.5g on the standard loaf), diastatic malt = 0.5% of total flour, validation
ranges app-chosen. All are marked ⚠️ in the rules doc.
**Why:** Blocking on small gaps would stall the milestone; visible, flagged defaults are
easy to correct.
**Trade-off:** If Iestyn intended salt as 2% of added flour (11.4g), the calculator's
first output will be ~1g off until corrected. Verified against the PRD's own worked
example: 570g flour / 20% starter / 69% hydration → 376g water ✓.

## 7. Photo storage approach deferred to Loaf Log milestone (2026-07-11)

**Decision:** The PRD wants up to five photos per loaf entry, stored locally. Photos as
base64 strings would exhaust localStorage's ~5MB quota within a few loaves, so photos
will likely need IndexedDB (still local, no backend) and/or client-side downscaling. The
concrete choice is deferred until the Loaf Log milestone.
**Why:** No point designing storage before the pages that produce the data exist.
**Trade-off:** "localStorage only" in the PRD may become "browser-local storage only"
(localStorage + IndexedDB) — same spirit, needs Iestyn's OK when we get there.

## 8. Milestone 1 build choices (2026-07-11)

**Decision — Node.js installed locally, not system-wide.** This machine had no Node, npm,
or Homebrew. Node 22 LTS (v22.17.0, official nodejs.org build, checksum verified) was
installed to `~/.local/node` — user folder only, no admin password, removable by deleting
that folder. `scripts/dev.sh` puts it on the PATH and starts the dev server.
**Trade-off:** `npm` won't work in a plain terminal until `~/.local/node/bin` is added to
the shell PATH; use `scripts/dev.sh` or ask Claude to set up the shell profile.

**Decision — no router yet.** With one page, `App.tsx` renders the Loaf Calculator
directly. A router gets added when the second page (Starter Builder) exists.
**Trade-off:** Adding page two touches `App.tsx`; trivial at this size.

**Decision — live recalculation, no "Calculate" button.** Results update as you type;
invalid input shows a friendly message instead of results.
**Why:** Fewer taps with floury hands; you see numbers respond to changes, which teaches
the relationships.
**Trade-off:** Results shift while typing mid-number — acceptable for a prototype.

**Decision — one plain CSS file, no UI framework.** `src/index.css` holds the whole
design (~200 lines of commented, ordinary CSS).
**Why:** Learning goal — every visual choice is inspectable; no framework class soup.
**Trade-off:** More hand-written CSS as pages grow; revisit if it gets painful.

## 9. Milestone 2 build choices (2026-07-11)

**Decision — hand-rolled hash navigation instead of react-router.** ~20 lines in
`App.tsx`: the URL hash (`#/starter`) picks the page, `hashchange` keeps React in sync.
Back button and bookmarks work.
**Why:** One less dependency and no router concepts to learn; the whole mechanism is
readable in one screen.
**Trade-off:** No nested routes or URL params — fine for seven flat pages; swap for a
router if that changes.

**Decision — starter build targets need + 5g buffer, single feed.** Keep =
(need + 5g) ÷ (1 + 2X) rounded up. The 5g mirrors the PRD example (130g built for a
125g need). If the jar can't reach the target in one feed, the app explains and
suggests feeding again at peak or a higher ratio — it does not plan multi-feed builds.
**Trade-off:** Users starting from very little starter get advice, not a full schedule.
A multi-feed planner is a possible future milestone.

## 10. Milestone 3 build choices (2026-07-11)

**Decision — flour mix dropped from the planner's inputs.** The PRD lists "flour mix
from calculator" as a Bake Planner input, but no timing rule uses it — an input that
changes nothing would mislead. Starter % stays because it earns a coaching note
(more starter = faster fermentation).
**Trade-off:** Deviates from the PRD's input list; easy to add back if a flour-based
timing rule ever exists.

**Decision — clock times from range midpoints; ranges stay visible.** Each step shows
the honest range (e.g. bulk "4–6 hours"); the clock column uses the midpoint so the
plan reads as actual times of day. Closing line reminds that dough decides, not clocks.
**Trade-off:** Midpoint times will be wrong in one direction or the other — that's
inherent; the ranges and coaching language carry the honesty.

**Decision — each page stands alone (no shared state yet).** The planner asks for
starter % again rather than reading the calculator's value.
**Why:** Cross-page state is the Guided Bake / Loaf Log milestone's problem (a "current
bake session"); building it early would be overbuilding.
**Trade-off:** A number retyped once or twice until then.

## 11. Milestone 4 build choices (2026-07-11)

**Decision — Guided Bake progress persists in localStorage.** First use of the storage
layer (`src/storage/guidedBake.ts`): completed step ids + start timestamp, nothing
more. A bake spans a day or more, so a reload must not lose ticks. Defensive
throughout — junk or missing storage falls back to a fresh bake.

**Decision — step content lives in `src/lib/sourdough/bakeSteps.ts`, not in the
component.** It's coaching content with the PRD's four fields per step; tests assert
all fifteen steps carry every field and that bulk never says "double".

**Decision — one step expanded at a time, current step auto-follows.** Marking a step
complete collapses it and opens the next incomplete one; completed and upcoming steps
stay clickable to peek or un-tick. Fits the kitchen: the screen always shows what to
do now.

**Decision — "Log this bake" handoff deferred.** The PRD wants the final step to
pre-fill the Loaf Log, which doesn't exist yet. The completion card says so; the
handoff gets built with the Loaf Log milestone.
