# State Toll Data: Automation Strategy + Rajasthan Pilot

> Status: PLANNED (approved direction, not yet implemented). Any agent picking this up: read this whole file, then start at Phase 1.
> Decisions below were confirmed with the user on 2026-07-06.

## Context

The dataset feeds a future Android Auto app that alerts drivers when a toll is approaching and their FASTag balance is below a configurable threshold. **National highway data is already solved**: `fetch-and-process.sh` pulls 1,202 plazas with full rate cards from the NHAI RajMargYatra API, fully automated, refreshed monthly.

The gap is **state-highway data**: 190 plazas across 10 states have (mostly car-only) rates; Rajasthan (220 plazas) and Telangana (35) are scaffolded with zero rates. The current approach — scraping TollGuru's reverse-engineered TRPC endpoint per-plaza — is not viable at scale: ~60–100 req/day, unreliable plaza names, wrong for closed-loop expressways, and ~3 weeks per state.

**Decisions made (with user):**
- Accuracy bar: **estimated rates are acceptable if labeled** (`data_confidence`) — the app mainly needs plaza location + approximate amount.
- Budget: **free sources only.** The "one-time pay TollGuru + cache" idea is rejected: publicly serving cached TollGuru data would violate their ToS; the legitimate "one-time cost" is curation labor over public government/operator notifications (zero license risk).
- Next state: **Rajasthan** (prior research done; operator concentration mapped).

**Core strategic answer** (from the 2026-06-05 research session, see `2026-06-05-002818-figure-out-how-to-collect-toll-data-for-rajasthan.txt`): state data cannot be fully automated, but it doesn't need per-plaza work either. **Curate by operator, not by plaza.** In Rajasthan, 3 operators (RSHA, RIDCOR, RSRDC) run ~130 of 220 plazas; the top 10 operators cover ~75%. One published rate notification covers dozens of plazas — a ~20× effort reduction. Maintenance is an annual re-check of ~10–15 documents per state, which is sustainable manually and partly automatable.

## Implementation

### Phase 1 — Operator worklist tooling
New script `scripts/analyzeOperators.js`:
- Input: `data/sources/netc/netc_state_plazas.json` (has `concessionaire_name`) + existing per-state scaffolds.
- For a given `--state`: group plazas by normalized operator name, rank by plaza count, emit `data/sources/states/<state>/operator_worklist.json` (operator → plaza codes, count, cumulative coverage %, curation status).
- This is the reusable playbook driver for every future state.

### Phase 2 — Curated state-rate overlay format
Extend the existing curated-override mechanism (`scripts/merge.js` → `applyCuratedRates()`, currently reads only `data/sources/curated/expressway_rates.json` with 2 plazas):
- New directory `data/sources/curated/state_rates/<state>__<operator>.json`, same keying (`code:<NETC code>` / `id:`), same fields (`rates`, `rate_source`, `rate_effective_date`, `rate_valid_until`) **plus `rate_source_url`**.
- `merge.js`: load all files under `curated/` (expressway file + state_rates glob), apply with precedence curated > NHAI > state-scaffold > estimated. Stamp `data_confidence: "verified"`.

### Phase 3 — Rajasthan pilot (curation, LLM-assisted)
- Locate the current RSHA, RIDCOR, RSRDC rate notifications (state gazette / operator sites / RTI-published PDFs) via web search; parse rate tables (Claude-assisted PDF extraction) into the Phase-2 format. Target: ~130 of 220 plazas verified from ~3 documents.
- Match notification rows to NETC plaza codes via name fuzzy-match against the scaffold (`data/sources/states/rajasthan/state_highways.json`); flag unmatched rows for manual review rather than guessing.
- Remaining ~90 plazas: fill **car rates only** as `data_confidence: "estimated"` using the existing `scripts/fetchStateTollGuruCarRates.js` checkpointed flow (slow-drip within free quota, internal cross-check only — estimated values are ours to publish as estimates, not cached TollGuru payloads) and/or a HERE freemium sweep (`scripts/probeHere.js` groundwork; label estimated, never overwrite verified/NHAI).

### Phase 4 — Maintenance loop
- NHAI: unchanged (monthly `fetch-and-process.sh`).
- New script `scripts/reportStaleRates.js`: scan `latest.json` for curated rates past `rate_valid_until` or `rate_effective_date` older than 12 months; print a re-check worklist with `rate_source_url`s. Run it as part of the monthly pipeline (warn-only step).
- `generateReadmes.js`: surface the confidence mix per state (verified / estimated / partial counts) so dataset consumers see provenance.

## Critical files
- `scripts/merge.js` — extend curated loader (multi-file) + precedence.
- `scripts/analyzeOperators.js` — new.
- `scripts/reportStaleRates.js` — new (pipeline step, warn-only).
- `data/sources/curated/state_rates/*.json` — new curated data.
- `fetch-and-process.sh` — add staleness step.
- Reuse as-is: `scripts/fetchStateTollGuruCarRates.js` (estimated fill), `scripts/tollguruClient.js`, `scripts/generateReadmes.js` (minor additions), NETC scaffolds.

## Explicitly out of scope (this iteration)
- Directional rates (`FORCEGT_DIRECTIONAL_DATA_SPEC.md`) — separate track, unchanged.
- Paid TollGuru/MapUp/HERE tiers — revisit only if free-source coverage stalls.
- Telangana and further states — run the same playbook after the Rajasthan pilot validates it.

## Verification
1. `node scripts/analyzeOperators.js --state rajasthan` → worklist shows operator ranking matching prior research (~3 operators ≈ 60%).
2. After curating one operator file: run `./fetch-and-process.sh` (or `node scripts/merge.js` directly) → `data/latest.json` shows Rajasthan plazas flipping to `data_confidence: "verified"` with populated `car_single`; total plaza count unchanged (overlay, not new rows).
3. `jq` confidence distribution before/after; spot-check 3 plazas against the source notification PDF.
4. `node scripts/generateReadmes.js` → Rajasthan state page renders rates with provenance.
5. Staleness report on a synthetic expired entry → flagged correctly.

## Effort estimate
- Tooling (Phases 1–2, 4): ~1 session.
- Rajasthan curation (Phase 3): ~2–3 sessions (dominated by finding the 3 notifications and code-matching).
- Each subsequent state: ~1–2 days using the same playbook; annual maintenance ~a few hours per state.
