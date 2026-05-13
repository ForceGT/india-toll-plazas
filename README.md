# India toll plaza data (NHAI + state highways) — JSON dataset

[![Stars](https://img.shields.io/github/stars/ForceGT/india-toll-plazas?style=flat-square)](https://github.com/ForceGT/india-toll-plazas/stargazers)
[![Forks](https://img.shields.io/github/forks/ForceGT/india-toll-plazas?style=flat-square)](https://github.com/ForceGT/india-toll-plazas/network/members)
[![Last commit](https://img.shields.io/github/last-commit/ForceGT/india-toll-plazas?style=flat-square)](https://github.com/ForceGT/india-toll-plazas/commits/main)
[![License](https://img.shields.io/badge/license-Government%20Open%20Data-blue?style=flat-square)](#license)
[![Dataset](https://img.shields.io/badge/dataset-latest.json-green?style=flat-square)](https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json)

![India Toll Plazas Banner](static/banner-v3.png)

**India toll plaza JSON** you can fetch in one HTTP GET: **NHAI**-sourced national-highway plazas (via [RajMargyatra](https://rajmargyatra.nhai.gov.in)) **merged** with curated **state-highway** toll rows, **coordinates**, multi-format **toll rates** (aligned with **FASTag** vehicle classes), and operator / safety fields. **Open data**; **updated monthly**.

**Canonical repo:** [github.com/ForceGT/india-toll-plazas](https://github.com/ForceGT/india-toll-plazas)

---

## On this page

- [At a glance](#at-a-glance)
- [Why this dataset](#why-this-dataset)
- [Quick start](#quick-start)
- [Data quality](#data-quality)
- [Field reference](#field-reference)
- [State highway coverage](#state-highway-coverage)
- [Updates, snapshots, releases](#updates-snapshots-releases)
- [Contributing](#contributing)
- [Repository layout](#repository-layout)
- [How data is built](#how-data-is-built)
- [Local development](#local-development)
- [Monthly maintainer workflow](#monthly-maintainer-workflow)
- [Attribution](#attribution)
- [Roadmap](#roadmap)
- [License](#license)
- [FAQ](#faq)

---

## At a glance

| | |
|--|--|
| **Artifact** | Single array JSON: [`data/latest.json`](https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json) |
| **National highways** | NHAI-style records (`data_source: "nhai"`), typically **1,100+** plazas with rich fields |
| **State highways** | Additional rows (`data_source: "state"`), variable completeness — see [`data_confidence`](#data-quality) |
| **Rates** | INR; per-vehicle **single / return / monthly / commercial** columns where available |
| **Cadence** | Maintainer-run fetch **monthly**; releases on `data/latest.json` pushes — see [`.github/workflows/monthly-update.yml`](.github/workflows/monthly-update.yml) |
| **Deep docs** | [SCHEMA.md](./SCHEMA.md) · [STATE_HIGHWAYS.md](./STATE_HIGHWAYS.md) · [CONTRIBUTING.md](./CONTRIBUTING.md) · [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md) |

---

## Why this dataset

| You need… | What this repo gives you |
|-----------|-------------------------|
| **Programmable toll data** | Stable **raw GitHub URL** — no API key for the public JSON snapshot |
| **NHAI + state** | One **merged** file; filter by `data_source` |
| **Route / map / logistics** | `latitude`, `longitude`, `state_name`, `nh_no`, chainage-style `location` text |
| **FASTag-style vehicle buckets** | Normalized columns: car, LCV, bus, multi-axle, 4–6 axle, 7+ axle, HCM/EME (see [SCHEMA.md](./SCHEMA.md)) |
| **Provenance** | `data_source`, `data_confidence`, `last_updated`, monthly folders + Releases |

Other public **India toll plaza** lists exist; this project optimizes for a **documented schema**, **monthly releases**, and **state-highway** extensions maintained in-repo.

---

## Quick start

### Latest file

```text
https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json
```

### Python

```python
import json
import urllib.request

url = "https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json"
with urllib.request.urlopen(url) as response:
    toll_plazas = json.loads(response.read())

print(f"Total toll plazas: {len(toll_plazas)}")
print("NHAI:", sum(1 for p in toll_plazas if p.get("data_source") == "nhai"))
print("State:", sum(1 for p in toll_plazas if p.get("data_source") == "state"))
```

### JavaScript (Node 18+ / modern browsers)

```javascript
const url =
  'https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json';
const toll_plazas = await fetch(url).then((r) => r.json());

console.log(`Total toll plazas: ${toll_plazas.length}`);
console.log(
  'Rajasthan sample:',
  toll_plazas.filter((p) => p.state_name === 'RAJASTHAN').length,
);
```

### curl + jq

```bash
curl -sL 'https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json' \
  | jq '[.[] | select(.state_name == "MAHARASHTRA")] | length'
```

### More examples

**jq filters, TypeScript sketch, historical URLs** → [USAGE_EXAMPLES.md](./USAGE_EXAMPLES.md)

---

## Data quality

### `data_source: "nhai"`

- `data_confidence` is **`"complete"`** for the normalized NH pipeline.
- Rich contractor, helpline, and project metadata when NHAI exposes it.

### `data_source: "state"`

- `data_confidence` is typically **`"partial"`** — expect more `null` fields (rates, contacts, emergency lines).
- Curated under `data/sources/states/*/state_highways.json`; run `npm run merge` after edits.

**Always** branch on `data_source` and `data_confidence` before production use.

---

## Field reference

Every record is a flat object. Identifiers and geography include:

- `tollplaza_id`, `tollplaza_name`, `tollplaza_code`, `data_source`, `data_confidence`
- `state_name`, `latitude`, `longitude`, `nh_no`, `location`

Toll amounts (INR, string or null): per vehicle class, four shapes each — e.g. `car_single`, `car_return`, `car_monthly`, `car_commercial` (same pattern for LCV, bus, multi-axle, 4–6 axle, 7+ axle, HCM).

Operational / safety examples: `contractor_name`, `helpline_crane`, `active`, `last_updated`.

**Full column list and NHAI → JSON mapping:** [SCHEMA.md](./SCHEMA.md)

---

## State highway coverage

### In-repo today (examples)

**Rajasthan** — sample plazas (coordinates may use OSM / Nominatim notes in `location`; refine booth pins over time).

**Gujarat** — curated rows under [`data/sources/states/gujarat/state_highways.json`](data/sources/states/gujarat/state_highways.json); verify against official GSRDC listings when merging:

- [Toll location](https://www.gsrdc.com/FrontDashboard/TollLocation)
- [Toll notification](https://www.gsrdc.com/FrontDashboard/TollNotification)

**Maharashtra** — scaffolded in places (many rates pending).

**More states** — see `data/sources/states/` and [STATE_HIGHWAYS.md](./STATE_HIGHWAYS.md) for contribution format.

---

## Updates, snapshots, releases

- **Monthly** maintainer push of refreshed `data/latest.json` (see [Monthly maintainer workflow](#monthly-maintainer-workflow)).
- **Versioned copies:** `data/MM-YYYY/tollplazas.json` plus `sources/nhai.json` and `sources/state_highways.json` (older snapshots may use `data/YYYY-MM-DD/` — check tree).
- **GitHub Releases:** tags like `vYYYY-MM-DD` when `data/latest.json` changes — summaries in release notes.

---

## Contributing

- **State rows:** follow [STATE_HIGHWAYS.md](./STATE_HIGHWAYS.md); merge path is `data/sources/states/<region>/state_highways.json` then `npm run merge`.
- **Process / code:** [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Bugs / corrections:** open an **Issue** with `tollplaza_id`, field name, and a **source link** (NHAI notice, state PDF, etc.).

---

## Repository layout

```text
data/
├── latest.json                 # merged NHAI + state (what most consumers want)
├── sources/
│   ├── nhai.json
│   ├── state_highways.json     # merged output of per-state files (after merge)
│   └── states/                 # per-state JSON + research notes
│       ├── gujarat/
│       ├── rajasthan/
│       └── …
└── MM-YYYY/                    # monthly snapshot (example: 05-2026/)
    ├── tollplazas.json
    └── sources/
        ├── nhai.json
        └── state_highways.json
```

---

## How data is built

1. **NHAI (RajMargyatra)** — scripts list plaza IDs, pull detail payloads, normalize to snake_case (see [SCHEMA.md](./SCHEMA.md)).
2. **State highways** — human-curated JSON merged into `data/latest.json`.
3. **Rate limiting** — queued requests, backoff on `429` — [`config/rate-limit.json`](config/rate-limit.json).

---

## Local development

```bash
# Full pipeline (fetch + process + merge + versioned copy) — matches production flow
./fetch-and-process.sh
```

Granular steps (same order as the shell script):

```bash
node ./scripts/fetchNhaiData.js
node ./scripts/getVehicleTypes.js    # optional
node ./scripts/getStates.js            # optional
node ./scripts/processNhai.js
node ./scripts/processStateHighways.js
node ./scripts/merge.js
```

After editing state JSON only: `npm run process-state && npm run merge`

**Requirements:** Node.js 16+, Bash, `jq` (for release helper workflows).

---

## Monthly maintainer workflow

1. GitHub Actions **reminder** fires (see [`.github/workflows/monthly-reminder.yml`](.github/workflows/monthly-reminder.yml)).
2. On a machine with **residential / NHAI-allowed** egress, run:

   ```bash
   bash ./fetch-and-process.sh
   ```

3. Commit + push `main` (especially `data/latest.json`).
4. **Release workflow** runs on `data/latest.json` changes — [`.github/workflows/monthly-update.yml`](.github/workflows/monthly-update.yml).

### Why not fully hands-off CI fetch?

NHAI endpoints often **block cloud runner IPs**. Local runs stay fast (~minutes) without VPN hacks.

---

## Attribution

- **NHAI / RajMargyatra:** [rajmargyatra.nhai.gov.in](https://rajmargyatra.nhai.gov.in)
- **NETC reference extracts (optional cross-check):** [`data/sources/netc/`](data/sources/netc/) — see folder README for refresh steps.

---

## Roadmap

- [ ] GeoJSON export for GIS stacks
- [ ] Historical rate diffs across snapshots
- [ ] Optional public **HTTP API** layer (separate deployment)
- [ ] Deeper state-highway rate completion

---

## License

This dataset is provided under the **Government Open Data License** framing used for NHAI-sourced facts. The upstream data is published by a **government** body; verify reuse terms for **your** jurisdiction and product (maps, billing, fleet SaaS, etc.) with legal counsel if needed.

---

## FAQ

### Is this an official NHAI or government product?

No. It is an **independent open-source mirror + normalization** of data exposed via NHAI’s RajMargyatra flows and curated state sources. Always verify business-critical numbers against official notices.

### Do I need an API key?

No for the public **`latest.json`** URL. Respect GitHub **raw** traffic fairly; for heavy use, mirror the file inside your infrastructure.

### How do I get only “complete” rows?

Filter `data_confidence == "complete"` (and usually `data_source == "nhai"` for toll-rate completeness).

### Where is FASTag?

FASTag is the **payment channel**; this dataset carries **published tariff-style columns** by vehicle class. It does not include private transaction feeds.

### Google is not sending traffic yet — why?

New repos often sit in a **sandbox period**; backlinks (blog posts, docs sites, Awesome lists), **stars**, and a clear README help.

---

## Changelog

Release notes: [GitHub Releases](https://github.com/ForceGT/india-toll-plazas/releases).

**Freshness:** read `last_updated` inside [`data/latest.json`](https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json).
