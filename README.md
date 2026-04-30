# India Toll Plazas Dataset

![India Toll Plazas Banner](static/banner-v3.png)

An open-source, regularly updated dataset of toll plazas across Indian national highways and state highways. Data is sourced from the National Highways Authority of India (NHAI) via the RajMargyatra web application and supplemented with state highway toll data.

## Overview

This repository maintains a clean, curated dataset of toll plazas with:
- **Toll plaza locations** (latitude, longitude, state, NH number)
- **Current toll rates** for all vehicle types (Car, LCV, Bus, Multi-axle, 4-6 axle, 7+ axle, HCM/EME)
- **Toll rates in multiple formats** (single, return/multi, monthly, commercial registration)
- **Operational information** (contractor, in-charge contact, helpline numbers)
- **Emergency services** information
- **Project details** (type, chainage, lanes, etc.)

**Data Sources:**
- **NHAI (National Highways)**: ~1191 toll plazas with comprehensive data
- **State Highways**: 5 toll plazas (Rajasthan) with curated data

## Quick Start

### Access the Latest Data

The latest combined dataset is always available at:

```
https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json
```

### Using Python

```python
import json
import urllib.request

url = "https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json"
with urllib.request.urlopen(url) as response:
    toll_plazas = json.loads(response.read())

print(f"Total toll plazas: {len(toll_plazas)}")

nhai_count = sum(1 for p in toll_plazas if p['data_source'] == 'nhai')
state_count = sum(1 for p in toll_plazas if p['data_source'] == 'state')

print(f"NHAI: {nhai_count}, State Highways: {state_count}")
```

### Using JavaScript/Node.js

```javascript
const toll_plazas = await fetch(
  'https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json'
).then(r => r.json());

console.log(`Total toll plazas: ${toll_plazas.length}`);

const rajasthanPlazas = toll_plazas.filter(p => p.state_name === 'RAJASTHAN');
console.log(`Plazas in Rajasthan: ${rajasthanPlazas.length}`);
```

### Using cURL

```bash
curl https://raw.githubusercontent.com/ForceGT/india-toll-plazas/main/data/latest.json | jq '.[] | select(.state_name == "MAHARASHTRA")'
```

## Data Structure

Each toll plaza record contains the following fields:

### Identifiers & Metadata (5 fields)
- `tollplaza_id` - Unique identifier (number)
- `tollplaza_name` - Name of the toll plaza (string)
- `tollplaza_code` - Toll plaza code (string)
- `data_source` - Source of data: `"nhai"` or `"state"` (string)
- `data_confidence` - Data completeness: `"complete"` (NHAI) or `"partial"` (state highways) (string)

### Location & Geography (5 fields)
- `state_name` - State name (string)
- `latitude` - Latitude coordinate (string, float-like)
- `longitude` - Longitude coordinate (string, float-like)
- `nh_no` - National Highway number (string)
- `location` - KM marker/location description (string)

### Toll Rates (28 fields)
Each vehicle type has 4 rate formats: single, return, monthly, commercial

**Car Rates:**
- `car_single`, `car_return`, `car_monthly`, `car_commercial`

**LCV (Light Commercial Vehicle) Rates:**
- `lcv_single`, `lcv_return`, `lcv_monthly`, `lcv_commercial`

**Bus Rates:**
- `bus_single`, `bus_return`, `bus_monthly`, `bus_commercial`

**Multi-Axle Rates:**
- `multiaxle_single`, `multiaxle_return`, `multiaxle_monthly`, `multiaxle_commercial`

**4-6 Axle Rates:**
- `axle_4_6_single`, `axle_4_6_return`, `axle_4_6_monthly`, `axle_4_6_commercial`

**7+ Axle Rates:**
- `axle_7_plus_single`, `axle_7_plus_return`, `axle_7_plus_monthly`, `axle_7_plus_commercial`

**HCM/EME (Heavy Commercial Motor) Rates:**
- `hcm_single`, `hcm_return`, `hcm_monthly`, `hcm_commercial`

**Note:** Rates are in Indian Rupees (INR). `null` values indicate data not available for that rate type.

### Rate Information (3 fields)
- `rate_effective_date` - Date when current rates became effective (ISO string or null)
- `rate_revision_date` - Date of next rate revision (ISO string or null)
- `concessions_info` - Information about available concessions (string or null)

### Project Details (5 fields)
- `project_type` - Type of project (e.g., "Public Funded") (string)
- `chainage` - Route description with chainage (string)
- `tollable_length` - Length of tolled section in km (string, float-like)
- `project_lanes` - Number of project lanes (string, number-like)
- `toll_lanes` - Number of toll collection lanes (string, number-like)

### Operational (4 fields)
- `active` - Whether toll plaza is active (boolean)
- `contractor_name` - Name of contractor/operator (string or null)
- `incharge_name` - Name of person in charge (string or null)
- `incharge_contact` - Contact number of in-charge (string or null)

### Emergency Services (4 fields)
- `helpline_crane` - Crane helpline number (string or null)
- `helpline_ambulance` - Ambulance helpline number (string or null)
- `helpline_patrol` - Patrol/traffic helpline number (string or null)
- `emergency_services` - Emergency services codes (string or null)

### Nearby Services (3 fields)
- `nearest_police_station` - Name of nearest police station (string or null)
- `police_station_contact` - Police station contact (string or null)
- `nearest_hospitals` - Information about nearby hospitals (string or null)

### Metadata (2 fields)
- `last_updated` - ISO timestamp of last data update (ISO string)

## Understanding Data Quality

### NHAI Toll Plazas (`data_source: "nhai"`)
- **Completeness**: `data_confidence: "complete"`
- All fields are populated with comprehensive data from NHAI
- Includes detailed contractor and emergency service information

### State Highway Toll Plazas (`data_source: "state"`)
- **Completeness**: `data_confidence: "partial"`
- Some fields may be `null`, especially:
  - Detailed toll rates (if exact rates unavailable)
  - Contractor information
  - Emergency helpline numbers
  - Service information

When using data, always check `data_source` and `data_confidence` to understand data quality.

## State Highway Coverage

### Currently Covered States

**Rajasthan** (5 toll plazas — coords from OpenStreetMap / Nominatim where noted in `location`)
- Sitarampura Toll Plaza (ring road; OSM booth polygon centroid)
- Jaipur–Phagi segment toll (TOI rates; anchor near Phagi town per OSM)
- Shahpura, Kekri, Malpura — RJ SH 12 toll anchors (Wikipedia-listed stations; **town centroids**, refine booth pin later)

**Research (Wikipedia SH list → plazas in this dataset):** [docs/RAJASTHAN_SH_TOLL_MAP.md](docs/RAJASTHAN_SH_TOLL_MAP.md) — heuristic place-name overlap for each [RJ state highway](https://en.wikipedia.org/wiki/List_of_state_highways_in_Rajasthan) row; re-run with `node scripts/buildRajasthanShTollMap.js` after updates.

*More states coming soon through community contributions. See [STATE_HIGHWAYS.md](./STATE_HIGHWAYS.md) for how to contribute.*

## Data Updates

Data is updated **monthly** (1st of each month, 00:00 UTC) via GitHub Actions.

### Accessing Historical Data

All monthly snapshots are available in the `data/` directory:
- `data/latest.json` - Current snapshot
- `data/{YYYY-MM-DD}/tollplazas.json` - Versioned snapshots by date
- `data/{YYYY-MM-DD}/sources/nhai.json` - NHAI data for that month
- `data/{YYYY-MM-DD}/sources/state_highways.json` - State data for that month

### GitHub Releases

Each monthly update creates a GitHub Release tagged as `v{YYYY-MM-DD}` with data summary.

## Contributing

### Adding State Highway Data

State highways are maintained in `data/sources/state_highways.json`. To contribute:

1. Follow the format specified in [STATE_HIGHWAYS.md](./STATE_HIGHWAYS.md)
2. Ensure all required fields are present (use `null` for unavailable data)
3. Provide data source reference in your PR
4. Submit a pull request

### Reporting Issues

If you find:
- **Data inaccuracies**: Open an issue with the specific plaza ID and correction
- **Missing toll plazas**: Check [STATE_HIGHWAYS.md](./STATE_HIGHWAYS.md) for contribution guidelines
- **Rate discrepancies**: Provide source reference and updated rates

## Directory Structure

```
data/
├── latest.json                        # Latest combined dataset
├── sources/
│   ├── nhai.json                     # Latest NHAI toll plazas
│   └── state_highways.json           # State highway toll plazas
└── {YYYY-MM-DD}/
    ├── tollplazas.json               # Combined dataset snapshot
    └── sources/
        ├── nhai.json                 # NHAI snapshot for that date
        └── state_highways.json       # State snapshot for that date
```

## Technical Details

### Fetch & Processing

Data is automatically fetched from:
1. **NHAI APIs** (via RajMargyatra):
   - `getTollplazaName` - List all toll plaza IDs
   - `getTollplazaDetails` - Detailed info for each plaza
   - `getVehicletype` - Vehicle type mappings
   - `getStateName` - State name mappings

2. **State Highways** - Manually curated `data/sources/state_highways.json`

### Rate Limiting

Requests implement:
- **Request queue**: 500ms delay between requests (configurable)
- **Exponential backoff**: For 429 (Too Many Requests) responses
- **Maximum retries**: 5 attempts

See `config/rate-limit.json` for configuration.

### Field Normalization

Raw API field names are normalized to snake_case for consistency:
- `CarRate_single` → `car_single`
- `BusRate_multi` → `bus_return`
- `DtEffectiveRates` → `rate_effective_date`

See [SCHEMA.md](./SCHEMA.md) for complete mapping.

## Local Development

### Running the Update Script

```bash
# Fetch and process all data
./fetch-and-process.sh

# Or run individual steps
node scripts/fetchNhaiTollplazas.js    # Fetch plaza IDs
node scripts/fetchNhaiDetails.js       # Fetch plaza details
node scripts/processNhai.js             # Normalize NHAI data
node scripts/processStateHighways.js    # Normalize state data
node scripts/merge.js                   # Merge all sources
```

### Requirements

- Node.js 16+
- Bash
- jq (for GitHub Actions release creation)

## Data Update Process

### Monthly Updates

This dataset is updated **monthly on the 1st of each month**.

**How updates work:**
1. Automated GitHub Actions reminder is triggered at **10:00 AM IST**
2. You receive a reminder issue in this repository
3. You run the fetch script locally:
   ```bash
   bash ./fetch-and-process.sh
   ```
4. Once completed (~3-4 minutes), push the changes:
   ```bash
   git push origin main
   ```
5. GitHub Actions automatically creates a release with the new dataset

### Why Local Execution?

The NHAI API blocks requests from cloud infrastructure (GitHub Actions runners) due to IP-based rate limiting. The fetch script must be run from a residential IP address to succeed.

**Workaround attempted:** Tailscale VPN routing through a phone's residential IP was explored but proved unreliable due to:
- Tailscale daemon startup delays in CI/CD environments
- Exit node availability dependency on phone being powered on
- OAuth credential issues with GitHub Actions

**Solution:** Running the script locally ensures reliable, fast data collection without external dependencies.

### Estimated Time

- **Fetch & Process**: ~3-4 minutes
- **Push to GitHub**: < 1 minute
- **Release Creation**: Automatic
- **Total Time**: ~5 minutes

## Data Sources & Attribution

- **NHAI Data**: National Highways Authority of India ([rajmargyatra.nhai.gov.in](https://rajmargyatra.nhai.gov.in))
- **License**: Government Open Data License

## Future Roadmap

- [ ] GeoJSON format for mapping applications
- [ ] Real-time traffic data integration
- [ ] FASTag transaction data (if public API available)
- [ ] Historical rate changes tracking
- [ ] API endpoint for querying data

## License

This dataset is provided under the **Government Open Data License**. The source data comes from NHAI, a government organization, and is in the public domain.

## Support & Feedback

- **Issues**: Report bugs, inaccuracies, or missing data via GitHub Issues
- **Discussions**: Share use cases and ask questions in GitHub Discussions
- **Contributions**: See contributing guidelines above

## Changelog

See [GitHub Releases](../../releases) for monthly update summaries and data statistics.

---

**Last Updated**: See `latest_updated` field in `data/latest.json`  
**Data Freshness**: Updated monthly (1st of each month)  
**Total Plazas**: Check latest.json for current count
