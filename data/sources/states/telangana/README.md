# Telangana state highways (scaffold)

- **`state_highways.json`** — **35** rows from `data/sources/netc/netc_state_plazas.json` (`state_name: Telangana`, STATE subtype), built with:

  `node scripts/scaffoldStateHighwaysFromNetc.js --state Telangana`

- **`SCAFFOLD_CHECKLIST.txt`** — numbered `NETC…` + plaza name + city (from `location`).
- **`netc_plazas_master_list.json`** — NETC extract subset for Telangana.

Rates (`car_single`, etc.) are **null** until curated (TollGuru / official tariffs).

**TollGuru fetch:** `node scripts/fetchStateTollGuruCarRates.js --state Telangana` writes `tollguru_car_tolls.json` when the run **finishes**. While it runs, **`tollguru_car_tolls.checkpoint.json`** is updated after **each** plaza (survives rate limits / interrupts).

**Merge:** `npm run merge` uses **`data/sources/state_highways.json`** only — fold Telangana into your combine pipeline before publishing `data/latest.json`.
