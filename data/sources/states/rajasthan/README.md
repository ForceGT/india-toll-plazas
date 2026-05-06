# Rajasthan state highways (scaffold)

- **`state_highways.json`** — 220 rows from `data/sources/netc/netc_state_plazas.json` (`state_name: Rajasthan`, STATE subtype), built with `node scripts/scaffoldStateHighwaysFromNetc.js --state Rajasthan`.
- **`SCAFFOLD_CHECKLIST.txt`** — numbered `NETC…` + plaza name + city (from `location`) for curation.
- **`netc_plazas_master_list.json`** / **`netc_plazas_master_list.tsv`** — raw extract reference.

`car_single` / `car_return` are **null** until filled. Some NETC names still read awkwardly (e.g. `Khanpur Toll` → `Khanpur Toll Toll Plaza`); fix when you curate each row.

**Note:** `npm run merge` uses `data/sources/state_highways.json` (single file), not this folder. Append or merge Rajasthan into that pipeline when you publish to `data/latest.json`.

**Duplicate code in source:** e.g. **NETC536129** and **NETC536195** are both “Kaladera” in NETC — resolve when deduping.
