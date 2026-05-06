# Maharashtra state highways (`state_highways.json`)

Curated NETC-backed toll plazas plus manual enrichment (TollGuru samples, Gazette chainage, MSRDC/Samruddhi context). Consumed into `data/latest.json` with NHAI rows (do not assume `npm run merge` if you rely on selective `latest.json` upserts).

## Deferred follow-ups (tackle later)

| Priority | `tollplaza_code` | Issue |
|----------|------------------|--------|
| High | **NETC540057** | **Bhiwandi Toll Plaza** — NETC coords ~17 km from Samruddhi gantry **NETC540056** (“Amane” / Bhiwandi sector). Reconcile duplicate vs wrong geocode; align car rates with TollGuru/operator. |
| Medium | **NETC536507** | **Degaon Toll** — IndeeyaInfrastructure; still boilerplate `concessions_info`, **null** `car_single` / `car_return`. Fill from TollGuru route or official tariff. |

All other rows in this file have non-null car toll fields for the usual workflow.

## Border check posts (MBCPNL)

Rows **NETC536140–536148**, **536150–536162** are **Maharashtra Border Check Post** facilities (`contractor_name`: MBCPNL). For typical cars we record **`car_single` / `car_return` = `"0"`** as **highway toll** in this dataset. Other fees (inspection, commercial categories, etc.) may apply — operator: [mahabcp.in](https://mahabcp.in/).

## Samruddhi Mahamarg notes

- **Gazette chainage** (`chainage` km/m) is official linear referencing along the project baseline — **not** lat/lng for TollGuru.
- Rows **NETC540033–540051** (Schedule II centres) include **distance × ₹/km**–derived **LMV `car_single`** for the slab **29/12/2025–31/03/2028** (₹2.06/km cars) as **segment allocation** between consecutive Schedule II points — **not** guaranteed to match TollGuru barrier quotes or FASTag line-by-line.
- **TollGuru** amounts remain documented in `concessions_info` where sampled; use for route-specific estimates.

## Related paths

- TollGuru batch exports: `tollguru_car_tolls.offset*.json` (same folder).
- NETC scaffold source: `data/sources/netc/netc_state_highways_scaffold.json`.
