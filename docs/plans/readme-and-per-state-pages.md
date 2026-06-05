# README overhaul + auto-generated per-state toll-plaza pages

> **Status:** Approved plan, not yet implemented. Safe for any agent (e.g. Sonnet) to pick up and
> execute end-to-end. Authored 2026-06-05.

## Context

The repo publishes `data/latest.json` (1,389 toll plazas across ~26 Indian states). The current
`README.md` is serviceable but reads like a maintainer reference: it does not tell a first-time or
non-technical visitor *what states are covered, how many plazas/highways each has, or how trustworthy
the data is*, and there is no per-state browsing surface. For an open dataset, the README is the #1
SEO landing page and the main credibility signal.

Goal: make the main README human-readable and Google-indexable (clear headings, descriptive link
text, a live state-coverage table with counts + confidence + freshness), and add a per-state
`README.md` for **every** state listing each plaza's name, coordinates, and car rate. Because the
dataset refreshes ~monthly, all generated content is produced by a **script wired into the pipeline**
so it never drifts.

Decisions confirmed with the user:
- **Scope:** every state present in `latest.json` (~26), not just the 12 curated-source folders.
- **Maintenance:** a generator script, run as a pipeline step (not hand-maintained).
- **Location:** `docs/states/<state-slug>/README.md` (new generated docs tree, kept clearly separate
  from the input/curation tree under `data/sources/states/*`).

## Relationship to the existing `data/sources/states/` tree (no migration)

The two per-state trees have **opposite roles** and both must exist:

- `data/sources/states/<state>/state_highways.json` is a **pipeline INPUT** — `collectStateHighways.js:46`
  reads it to build `state_highways.json` → `merge.js` → `latest.json`. Moving or deleting it breaks
  the build. Its sibling files (`tollguru_*.json`, `SCAFFOLD_CHECKLIST.txt`, and the 3 maintainer
  `README.md` worklists for maharashtra/rajasthan/telangana) are maintainer artifacts and stay put.
- `docs/states/<state>/README.md` is **generated OUTPUT** — derived from `latest.json` for human/SEO
  browsing.

So this is not an old→new migration: nothing is copied or removed from `data/sources/`. The generator
only writes under `docs/` and the marked regions of the root `README.md`. The internal maintainer
worklists are intentionally left in `data/sources/` (they are TODOs, not public listings).

## Key facts found during exploration

- `data/latest.json`: 1,389 plazas. Confidence: 1,199 `complete`, 188 `partial`, 2 `verified`.
  Source: 1,199 `nhai`, 190 `state`. `last_updated` ≈ `2026-05-13`.
- State names are inconsistent and need normalization: `ANDHRA PRADESH`/`ANDHRAPRADESH`,
  `TAMIL NADU`/`TAMILNADU`, `HIMACHAL PRADESH`/`HIMACHALPRADESH`, `WEST BENGAL`/`WESTBENGAL`,
  a one-off `PUNJAB AND HARYANA` (1 row), and 1 `null` state.
- Row fields available for tables: `tollplaza_name`, `nh_no` (null on state-sourced rows),
  `location`, `latitude`, `longitude`, `car_single`, `data_source`, `data_confidence`.
- Existing `data/sources/states/<state>/README.md` (e.g. Maharashtra) are **maintainer worklists** —
  leave them untouched; the new public pages live under `docs/states/`.
- Pipeline is `fetch-and-process.sh` (steps 1–8, ends at `merge.js`); `package.json` has matching
  `npm` scripts. Reuse this wiring.

## Implementation

### 1. New: `scripts/generateReadmes.js`

Single Node script (no new deps; same style as `scripts/merge.js`). Run after `merge.js`.

- **Load** `data/latest.json`.
- **Normalize state names** via a small canonical map keyed on `state_name` upper-cased with
  non-letters stripped → `{ display: "Tamil Nadu", slug: "tamil-nadu" }`. Fold the dup variants
  listed above together. Map the lone `PUNJAB AND HARYANA` row and `null` to a clear bucket
  (`Punjab & Haryana (mixed)` / `Unspecified`); keep this map at the top of the file so it's
  easy to extend.
- **Aggregate per canonical state:** plaza count, distinct `nh_no` count ("highways covered"),
  confidence breakdown (`complete`/`partial`/`verified`), source breakdown, count with a `car_single`,
  and the max `last_updated`.
- **Write per-state pages** to `docs/states/<slug>/README.md`, each containing:
  - H1 `# Toll plazas in <State> — India` (keyword-rich, SEO).
  - One-line intro + a small summary line (N plazas, M highways, confidence mix, last updated).
  - A markdown table sorted by `nh_no` then `location`:
    `Toll Plaza | NH | Location | Coordinates | Car (single ₹) | Confidence`.
    Coordinates rendered as a `lat, lng` Google-Maps link (`https://www.google.com/maps?q=lat,lng`)
    for usability + crawlable outbound links. Blank cells for null fields.
  - A back-link to the root README and to `data/latest.json`.
- **Update the main README state table** by replacing content between HTML markers
  `<!-- STATE_TABLE:START -->` … `<!-- STATE_TABLE:END -->` (so hand-written prose is preserved and
  only the table regenerates). Table columns:
  `State | Plazas | Highways | Confidence (complete/partial/verified) | Updated | Browse`, where
  **State** and **Browse** link to the per-state page. Also refresh a
  `<!-- STATE_STATS:START/END -->` line with totals (total plazas, total states, dataset last-updated
  date).
- Idempotent: rewrites files in place; safe to run every pipeline pass. Log a summary
  (states written, total plazas) like the other scripts.

### 2. Rewrite `README.md` for humans + SEO

Keep the working sections (Get the data, Documentation links, Updates, Contributing, FAQ, License)
but restructure the top for a non-technical reader and search engines:

- **Descriptive H1 + lead paragraph** packed with natural keywords: "toll plaza", "FASTag toll
  rates", "NHAI national highway tolls", "toll prices by state", "India toll data JSON".
- **"What's inside" plain-language section** — what a row is, that it has location + car/truck/bus
  rates, that it's free and open.
- **Coverage at a glance** — the auto-generated `STATE_STATS` line + `STATE_TABLE` (markers inserted
  here; populated by the generator). This is the SEO centerpiece and the per-state nav.
- **"Browse by state"** intro sentence pointing at `docs/states/`.
- Tighten existing sections; ensure every link uses descriptive anchor text (not bare URLs) for SEO.
- Leave the maintainer `<details>` block, but add the new generator step to the pipeline list.

The generator and the hand-written prose coexist via the marker comments — running the script only
touches the marked regions.

### 3. Wire into the pipeline

- `fetch-and-process.sh`: add a **Step 9** after merge —
  `node ./scripts/generateReadmes.js` (renumber the "Step N/8" labels to /9). Non-fatal warning on
  failure (docs generation shouldn't block a data run), matching the optional-step pattern already
  used for `getVehicleTypes.js`.
- `package.json`: add `"generate-readmes": "node scripts/generateReadmes.js"`.

## Files

- **New:** `scripts/generateReadmes.js`
- **New (generated):** `docs/states/<slug>/README.md` × ~26
- **Modified:** `README.md` (manual rewrite + marker regions), `fetch-and-process.sh`, `package.json`
- **Untouched:** everything under `data/sources/states/` (pipeline inputs + maintainer notes)

## Verification

1. `node scripts/generateReadmes.js` → check console summary (≈26 states, 1,389 plazas).
2. Confirm `docs/states/` has one folder per canonical state and that dup variants are folded
   (e.g. a single `tamil-nadu` with 103 plazas, single `andhra-pradesh` with 95) — no
   `ANDHRAPRADESH`/`ANDHRA PRADESH` split.
3. Spot-check `docs/states/maharashtra/README.md` (200 rows) and `docs/states/uttarakhand/README.md`
   (15 rows): coordinates link to Google Maps, car rates present, nulls render as blank.
4. Open `README.md`: the `STATE_TABLE` region is filled, totals line correct, per-state links
   resolve, and the surrounding hand-written prose is intact.
5. Re-run the generator: output is byte-identical (idempotent), proving safe for monthly runs.
6. `git status` review: only `scripts/generateReadmes.js`, `README.md`, `fetch-and-process.sh`,
   `package.json`, and the new `docs/states/**` appear — nothing under `data/sources/states/*` changes.
