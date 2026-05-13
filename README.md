# India toll plazas

[![Stars](https://img.shields.io/github/stars/ForceGT/india-toll-plazas?style=flat-square)](https://github.com/ForceGT/india-toll-plazas/stargazers)
[![Forks](https://img.shields.io/github/forks/ForceGT/india-toll-plazas?style=flat-square)](https://github.com/ForceGT/india-toll-plazas/network/members)
[![Last commit](https://img.shields.io/github/last-commit/ForceGT/india-toll-plazas?style=flat-square)](https://github.com/ForceGT/india-toll-plazas/commits/main)
[![License](https://img.shields.io/badge/license-Government%20Open%20Data-blue?style=flat-square)](#license--attribution)
[![Dataset](https://img.shields.io/badge/dataset-latest.json-green?style=flat-square)](https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json)

![India Toll Plazas Banner](static/banner-v3.png)

Open **JSON** list of toll plazas in India: **NHAI** national highways (from [RajMargyatra](https://rajmargyatra.nhai.gov.in)) plus curated **state-highway** rows. Includes coordinates, per-vehicle **toll rates** (single / return / monthly / commercial where published), and operator / safety fields when the source provides them. **Updated about monthly.**

**Repository:** [github.com/ForceGT/india-toll-plazas](https://github.com/ForceGT/india-toll-plazas)

---

## Get the data

Stable URL (array of objects):

```text
https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json
```

Minimal Python:

```python
import json, urllib.request
url = "https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json"
plazas = json.loads(urllib.request.urlopen(url).read())
print(len(plazas), "records")
```

More languages, `jq` recipes, TypeScript sketch, and versioned snapshot URLs: **[USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)**

---

## Documentation

| | |
|--|--|
| **[SCHEMA.md](./SCHEMA.md)** | Every field, NHAI → JSON names, rate columns |
| **[STATE_HIGHWAYS.md](./STATE_HIGHWAYS.md)** | Adding or fixing state-highway plazas |
| **[USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)** | Filtering, aggregates, citations |
| **[CONTRIBUTING.md](./CONTRIBUTING.md)** | PRs, validation, dev workflow |

---

## Data you can trust

- **`data_source: "nhai"`** — National-highway pipeline; `data_confidence` is usually **`complete`**.
- **`data_source: "state"`** — Curated from `data/sources/states/*/…`; often **`partial`** (more `null`s). Do not assume full parity with NH rows.

For production, always filter on `data_source` and `data_confidence` the way your product needs.

---

## Updates & releases

- **`data/latest.json`** — current merged file (what most people use).
- **`data/MM-YYYY/`** — monthly snapshots when present; older trees may use `data/YYYY-MM-DD/`.
- **[Releases](https://github.com/ForceGT/india-toll-plazas/releases)** — notes when `data/latest.json` is updated on `main`.

---

## Contributing

- Wrong rate or coordinates? Open an **issue** with plaza id / name and an **official source** link.
- New state-highway data? See **[STATE_HIGHWAYS.md](./STATE_HIGHWAYS.md)** then `npm run merge` after editing under `data/sources/states/`.
- Code and process details: **[CONTRIBUTING.md](./CONTRIBUTING.md)**.

---

## Maintainers

<details>
<summary><strong>Local pipeline, monthly run, repo layout</strong></summary>

Full refresh (matches what maintainers run before pushing data):

```bash
./fetch-and-process.sh
```

Granular steps (same order as the script): `fetchNhaiData.js` → optional `getVehicleTypes.js` / `getStates.js` → `processNhai.js` → `processStateHighways.js` → `merge.js`. After state JSON edits only: `npm run process-state && npm run merge`.

**Why not fetch NHAI from GitHub Actions only?** RajMargyatra often blocks cloud IPs; a normal residential / office connection works reliably.

**Layout (simplified):**

```text
data/
├── latest.json
├── sources/
│   ├── nhai.json
│   ├── state_highways.json   # output of merge from per-state files
│   └── states/               # per-state source JSON
└── MM-YYYY/
    ├── tollplazas.json
    └── sources/
```

Workflows: [monthly-reminder.yml](.github/workflows/monthly-reminder.yml), [monthly-update.yml](.github/workflows/monthly-update.yml). Rate limits: [config/rate-limit.json](config/rate-limit.json).

</details>

---

## FAQ

<details>
<summary><strong>Common questions</strong></summary>

**Is this an official NHAI product?**  
No. Independent mirror and normalization. Verify money-critical values against NHAI / state notices.

**Do I need an API key?**  
No for the raw `latest.json` URL. For heavy traffic, mirror the file on your side instead of hammering GitHub raw.

**How do I get only “complete” rows?**  
Prefer `data_confidence == "complete"` and usually `data_source == "nhai"` for full rate columns.

**What about FASTag?**  
FASTag is how you pay; this file holds **published tariff-style amounts** by vehicle class, not bank transactions.

</details>

---

## License & attribution

Data ultimately traces to **NHAI** ([RajMargyatra](https://rajmargyatra.nhai.gov.in)) and curated state sources. Treat as **Government Open Data**–style reuse; confirm terms for your use case (maps, billing, fleet tools, etc.) with counsel if you need certainty.

Optional NETC-derived reference material: [`data/sources/netc/`](data/sources/netc/).

**Roadmap (high level):** GeoJSON export, rate history across snapshots, optional HTTP API, richer state coverage.

**Changelog:** [GitHub Releases](https://github.com/ForceGT/india-toll-plazas/releases) — freshness also in `last_updated` inside `latest.json`.
