# India Toll Plaza Database — FASTag Rates & Coordinates

[![Stars](https://img.shields.io/github/stars/ForceGT/india-toll-plazas?style=flat-square)](https://github.com/ForceGT/india-toll-plazas/stargazers)
[![Forks](https://img.shields.io/github/forks/ForceGT/india-toll-plazas?style=flat-square)](https://github.com/ForceGT/india-toll-plazas/network/members)
[![Last commit](https://img.shields.io/github/last-commit/ForceGT/india-toll-plazas?style=flat-square)](https://github.com/ForceGT/india-toll-plazas/commits/main)
[![License](https://img.shields.io/badge/license-Government%20Open%20Data-blue?style=flat-square)](#license--attribution)
[![Dataset](https://img.shields.io/badge/dataset-latest.json-green?style=flat-square)](https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json)

![India Toll Plazas Banner](static/banner-v3.png)

The most complete open-source dataset of **India toll plazas** with **FASTag toll rates**, GPS coordinates, and per-vehicle-class tariffs. Covers NHAI national highway toll plazas from [RajMargyatra](https://rajmargyatra.nhai.gov.in) plus curated state-highway entries — all in a single, machine-readable **India toll data JSON** file. Updated about monthly.

Whether you're building a **toll calculator**, doing route planning, or researching **NHAI national highway tolls** and **toll prices by state**, this is the dataset for you. No API key required.

**Repository:** [github.com/ForceGT/india-toll-plazas](https://github.com/ForceGT/india-toll-plazas)

---

## What's inside

Each record in the dataset represents one toll plaza and includes:

- **Name & location** — plaza name, state, highway number, and chainage
- **GPS coordinates** — latitude and longitude for mapping
- **Toll rates** — car, LCV, bus, multi-axle, and heavy commercial vehicle tariffs for single trip, return, and monthly pass where published
- **Data confidence** — `complete` (full rate card from NHAI), `partial` (state-sourced, some nulls), or `verified` (authoritative override, e.g. closed-loop expressways)

The dataset is free and open. Grab it with a single HTTP request — no signup, no API key.

---

## Coverage at a glance

<!-- STATE_STATS:START -->
**1,667 toll plazas** across **26 states/UTs** — dataset last updated 2026-06-05
<!-- STATE_STATS:END -->

Browse individual state pages below, or jump straight to [docs/states/](docs/states/) for the full listing.

<!-- STATE_TABLE:START -->
| State | Plazas | Highways | Confidence (c/p/v) | Updated | Browse |
|---|---|---|---|---|---|
| [Andhra Pradesh](docs/states/andhra-pradesh/README.md) | 100 | 36 | 91c / 9p | 2026-06-05 | [Browse](docs/states/andhra-pradesh/README.md) |
| [Assam](docs/states/assam/README.md) | 12 | 8 | 12c | 2026-06-05 | [Browse](docs/states/assam/README.md) |
| [Bihar](docs/states/bihar/README.md) | 43 | 21 | 43c | 2026-06-05 | [Browse](docs/states/bihar/README.md) |
| [Chhattisgarh](docs/states/chhattisgarh/README.md) | 25 | 9 | 25c | 2026-06-05 | [Browse](docs/states/chhattisgarh/README.md) |
| [Delhi](docs/states/delhi/README.md) | 21 | 11 | 21c | 2026-06-05 | [Browse](docs/states/delhi/README.md) |
| [Goa](docs/states/goa/README.md) | 1 | 1 | 1c | 2026-06-05 | [Browse](docs/states/goa/README.md) |
| [Gujarat](docs/states/gujarat/README.md) | 97 | 25 | 64c / 33p | 2026-06-05 | [Browse](docs/states/gujarat/README.md) |
| [Haryana](docs/states/haryana/README.md) | 87 | 25 | 71c / 16p | 2026-06-05 | [Browse](docs/states/haryana/README.md) |
| [Himachal Pradesh](docs/states/himachal-pradesh/README.md) | 15 | 4 | 4c / 11p | 2026-06-05 | [Browse](docs/states/himachal-pradesh/README.md) |
| [Jammu & Kashmir](docs/states/jammu-kashmir/README.md) | 8 | 2 | 8c | 2026-06-05 | [Browse](docs/states/jammu-kashmir/README.md) |
| [Jharkhand](docs/states/jharkhand/README.md) | 24 | 11 | 23c / 1p | 2026-06-05 | [Browse](docs/states/jharkhand/README.md) |
| [Karnataka](docs/states/karnataka/README.md) | 68 | 26 | 68c | 2026-06-05 | [Browse](docs/states/karnataka/README.md) |
| [Kerala](docs/states/kerala/README.md) | 11 | 5 | 11c | 2026-06-05 | [Browse](docs/states/kerala/README.md) |
| [Madhya Pradesh](docs/states/madhya-pradesh/README.md) | 109 | 53 | 109c | 2026-06-05 | [Browse](docs/states/madhya-pradesh/README.md) |
| [Maharashtra](docs/states/maharashtra/README.md) | 203 | 48 | 105c / 94p / 2v | 2026-06-05 | [Browse](docs/states/maharashtra/README.md) |
| [Meghalaya](docs/states/meghalaya/README.md) | 4 | 1 | 4c | 2026-06-05 | [Browse](docs/states/meghalaya/README.md) |
| [Odisha](docs/states/odisha/README.md) | 37 | 17 | 34c / 3p | 2026-06-05 | [Browse](docs/states/odisha/README.md) |
| [Punjab](docs/states/punjab/README.md) | 44 | 23 | 44c | 2026-06-05 | [Browse](docs/states/punjab/README.md) |
| [Punjab & Haryana (mixed)](docs/states/punjab-haryana/README.md) | 1 | 1 | 1c | 2026-06-05 | [Browse](docs/states/punjab-haryana/README.md) |
| [Rajasthan](docs/states/rajasthan/README.md) | 392 | 56 | 172c / 216p / 4v | 2026-06-05 | [Browse](docs/states/rajasthan/README.md) |
| [Tamil Nadu](docs/states/tamil-nadu/README.md) | 103 | 38 | 80c / 23p | 2026-06-05 | [Browse](docs/states/tamil-nadu/README.md) |
| [Telangana](docs/states/telangana/README.md) | 67 | 13 | 32c / 35p | 2026-06-05 | [Browse](docs/states/telangana/README.md) |
| [Unspecified](docs/states/unspecified/README.md) | 1 | 1 | 1c | 2026-06-05 | [Browse](docs/states/unspecified/README.md) |
| [Uttar Pradesh](docs/states/uttar-pradesh/README.md) | 134 | 53 | 134c | 2026-06-05 | [Browse](docs/states/uttar-pradesh/README.md) |
| [Uttarakhand](docs/states/uttarakhand/README.md) | 28 | 8 | 13c / 15p | 2026-06-05 | [Browse](docs/states/uttarakhand/README.md) |
| [West Bengal](docs/states/west-bengal/README.md) | 32 | 21 | 31c / 1p | 2026-06-05 | [Browse](docs/states/west-bengal/README.md) |
<!-- STATE_TABLE:END -->

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

## Data confidence

- **`data_source: "nhai"`** — National-highway pipeline from RajMargyatra; `data_confidence` is usually **`complete`**.
- **`data_source: "state"`** — Curated from `data/sources/states/*/…`; often **`partial`** (more `null`s). Do not assume full parity with NH rows.
- **`data_confidence: "verified"`** — Authoritative rate override applied (e.g. closed-loop expressways where routing APIs give wrong per-plaza splits).

For production use, always filter on `data_source` and `data_confidence` according to your quality needs.

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

Granular steps (same order as the script): `fetchNhaiData.js` → optional `getVehicleTypes.js` / `getStates.js` → `processNhai.js` → `processStateHighways.js` → `merge.js` → `generateReadmes.js`. After state JSON edits only: `npm run process-state && npm run merge && npm run generate-readmes`.

**Why not fetch NHAI from GitHub Actions only?** RajMargyatra often blocks cloud IPs; a normal residential / office connection works reliably.

**Layout (simplified):**

```text
data/
├── latest.json
├── sources/
│   ├── nhai.json
│   ├── state_highways.json   # output of merge from per-state files
│   └── states/               # per-state source JSON (pipeline inputs)
└── MM-YYYY/
    ├── tollplazas.json
    └── sources/
docs/
└── states/                   # generated per-state human/SEO pages
    ├── maharashtra/README.md
    └── …
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

**How do I get only "complete" rows?**
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
