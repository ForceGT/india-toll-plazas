# Usage examples — India toll plazas JSON

Stable URL for the combined dataset:

`https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json`

See also [README.md](./README.md) (overview), [SCHEMA.md](./SCHEMA.md) (field mapping), [STATE_HIGHWAYS.md](./STATE_HIGHWAYS.md) (contributing state rows).

---

## 1. One-liner counts (jq)

```bash
curl -sL 'https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json' \
  | jq '[.[] | .data_source] | group_by(.) | map({source: .[0], count: length})'
```

## 2. List plaza names in Karnataka (NHAI rows)

```bash
curl -sL 'https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json' \
  | jq -r '.[] | select(.state_name=="KARNATAKA" and .data_source=="nhai") | .tollplaza_name' | head
```

## 3. Car single toll + coordinates (CSV-style)

```bash
curl -sL 'https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json' \
  | jq -r '.[] | [.tollplaza_name, .state_name, .latitude, .longitude, .car_single] | @csv' \
  | head -20
```

## 4. Python: filter + sum approximate revenue (illustrative)

```python
import json
import urllib.request

URL = "https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json"

with urllib.request.urlopen(URL) as r:
    plazas = json.load(r)

def car_single(p):
    v = p.get("car_single")
    if v is None:
        return None
    try:
        return float(v)
    except (TypeError, ValueError):
        return None

with_rates = [p for p in plazas if car_single(p) is not None]
avg = sum(car_single(p) for p in with_rates) / len(with_rates)
print(len(plazas), "plazas,", len(with_rates), "with car_single,", f"avg car_single={avg:.2f} INR")
```

## 5. Node.js: stream to memory-safe batch (small repos OK full load)

```javascript
import { readFile } from 'node:fs/promises';

// For remote fetch in production, use undici or set a UA policy your org allows.
const url =
  'https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json';

const plazas = await fetch(url).then((r) => r.json());
const active = plazas.filter((p) => p.active === true);
console.log({ total: plazas.length, active: active.length });
```

## 6. TypeScript type sketch (informal)

```typescript
export type DataSource = 'nhai' | 'state';
export type DataConfidence = 'complete' | 'partial';

export interface TollPlaza {
  tollplaza_id: number;
  tollplaza_name: string;
  tollplaza_code: string;
  data_source: DataSource;
  data_confidence: DataConfidence;
  state_name: string;
  latitude: string;
  longitude: string;
  nh_no: string;
  car_single: string | null;
  active: boolean;
  last_updated: string;
  // …see SCHEMA.md for full list
}
```

## 7. Historical snapshot

Monthly folders under `data/MM-YYYY/` (see repo tree). Example:

`https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/05-2026/tollplazas.json`

Prefer **Releases** for tagged snapshots when available.

## 8. Data quality guardrails

Always branch on:

- `data_source`: `"nhai"` vs `"state"`
- `data_confidence`: `"complete"` vs `"partial"`

```javascript
function isAuthoritativeCarRate(p) {
  return p.data_source === 'nhai' && p.data_confidence === 'complete' && p.car_single != null;
}
```

## 9. Citation (papers / apps)

```text
ForceGT. (2026). india-toll-plazas: NHAI and state-highway toll plaza JSON dataset.
Retrieved from https://github.com/ForceGT/india-toll-plazas
```

Adjust year and attribution to match your publisher rules.
