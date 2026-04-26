# Data Schema Reference

Complete documentation of all fields in the toll plaza dataset.

## Field Categories & Details

### Identifiers & Metadata

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `tollplaza_id` | Number | 305 | Unique identifier for the toll plaza |
| `tollplaza_name` | String | "Akhepura" | Name of the toll plaza |
| `tollplaza_code` | String | "330100" | Official toll plaza code |
| `data_source` | String | "nhai" or "state" | Source: NHAI toll plazas or State highways |
| `data_confidence` | String | "complete" or "partial" | Data completeness indicator |

### Location & Geography

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `state_name` | String | "RAJASTHAN" | State name (uppercase) |
| `latitude` | String | "27.50603" | Latitude coordinate (float as string) |
| `longitude` | String | "75.348401" | Longitude coordinate (float as string) |
| `nh_no` | String | "52" | National Highway number |
| `location` | String | "Km 324.638" | Specific KM marker on the highway |
| `chainage` | String | "Reengus - Sikar (Km 298.075 to Km 341.047)" | Route description with chainage |
| `tollable_length` | String | "36.182" | Length of tolled section in km |

### Toll Rates (28 fields total)

**Format**: Each vehicle type has 4 rate types:
1. `{vehicle_type}_single` - Single journey rate (INR)
2. `{vehicle_type}_return` - Return/multi-axle rate (INR)
3. `{vehicle_type}_monthly` - Monthly pass rate (INR)
4. `{vehicle_type}_commercial` - Commercial/registered vehicle rate (INR)

**Vehicle Types:**

#### Car
- `car_single` - Single journey (e.g., 75)
- `car_return` - Return trip (e.g., 110)
- `car_monthly` - Monthly pass (e.g., 2450)
- `car_commercial` - Commercial/registered (e.g., 35)

#### LCV (Light Commercial Vehicle)
- `lcv_single` - Single journey (e.g., 120)
- `lcv_return` - Return trip (e.g., 180)
- `lcv_monthly` - Monthly pass (e.g., 3955)
- `lcv_commercial` - Commercial/registered (e.g., 60)

#### Bus
- `bus_single` - Single journey (e.g., 250)
- `bus_return` - Return trip (e.g., 375)
- `bus_monthly` - Monthly pass (e.g., 8290)
- `bus_commercial` - Commercial/registered (e.g., 125)

#### MultiAxle (Heavy Multi-axle)
- `multiaxle_single` - Single journey (e.g., 270)
- `multiaxle_return` - Return trip (e.g., 405)
- `multiaxle_monthly` - Monthly pass (e.g., 9045)
- `multiaxle_commercial` - Commercial/registered (e.g., 135)

#### 4-6 Axle
- `axle_4_6_single` - Single journey (e.g., 390)
- `axle_4_6_return` - Return trip (e.g., 585)
- `axle_4_6_monthly` - Monthly pass (e.g., 13005)
- `axle_4_6_commercial` - Commercial/registered (e.g., 195)

#### 7+ Axle
- `axle_7_plus_single` - Single journey (e.g., 475)
- `axle_7_plus_return` - Return trip (e.g., 710)
- `axle_7_plus_monthly` - Monthly pass (e.g., 15830)
- `axle_7_plus_commercial` - Commercial/registered (e.g., 235)

#### HCM/EME (Heavy Commercial Motor / Emergency Medical Equipment)
- `hcm_single` - Single journey (e.g., 390)
- `hcm_return` - Return trip (e.g., 585)
- `hcm_monthly` - Monthly pass (e.g., 13005)
- `hcm_commercial` - Commercial/registered (e.g., 195)

**Rate Value Type**: String (representing INR amount)  
**Null Handling**: `null` when rate data is unavailable

### Rate Information

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `rate_effective_date` | String (ISO) | "2026-03-31T18:30:00.000Z" | Date when current rates became effective |
| `rate_revision_date` | String (ISO) | "2027-03-30T18:30:00.000Z" | Date of next planned rate revision |
| `concessions_info` | String | "The rate of monthly pass..." | Information about available concessions |

### Project Details

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `project_type` | String | "Public Funded" | Type of project (Public/PPP/etc.) |
| `project_lanes` | String | "4" | Total number of lanes in the project |
| `toll_lanes` | String | "12" | Number of dedicated toll collection lanes |
| `active` | Boolean | true | Whether the toll plaza is currently operational |

### Operational Information

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `contractor_name` | String | "Ms Skylark Infra Engineering Pvt. Ltd." | Name of the operating contractor |
| `incharge_name` | String | "Plaza Controller" | Name/title of person in charge |
| `incharge_contact` | String | "8130007039" | Contact number of in-charge |

*Note: For state highways, these fields may be `null`*

### Emergency Services

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `helpline_crane` | String | "8003111555" | Helpline for vehicle assistance/crane |
| `helpline_ambulance` | String | "8003111555" | Ambulance/medical emergency helpline |
| `helpline_patrol` | String | "8003111555, 9414805018, 9549254582" | Traffic patrol/road assistance numbers |
| `emergency_services` | String | "1033, 1073, 108, 102" | Emergency service codes |

*Note: For state highways, these fields may be `null`*

### Nearby Services

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `nearest_police_station` | String | "Ranoli" | Name of nearest police station |
| `police_station_contact` | String | "01576-220363" | Contact number of police station |
| `nearest_hospitals` | String | "1) SURAJ Hospital..." | Information about nearby hospitals |

*Note: For state highways, these fields may be `null`*

### Metadata

| Field | Type | Example | Description |
|-------|------|---------|-------------|
| `last_updated` | String (ISO) | "2026-04-26T12:00:00Z" | ISO timestamp when record was last updated |

## Data Type Conversions

When working with the data:

- **Numeric rates**: Parse strings as floats/integers
  ```javascript
  const rate = parseFloat(plaza.car_single); // 75
  ```

- **Coordinates**: Parse as floats for mapping
  ```javascript
  const coords = [parseFloat(plaza.latitude), parseFloat(plaza.longitude)];
  ```

- **Timestamps**: Parse as ISO dates
  ```javascript
  const updated = new Date(plaza.last_updated);
  ```

## Null Handling

Fields are set to `null` when:
- Data is not available from the source
- Field doesn't apply to that toll plaza type
- Data confidence is "partial" (state highways)

Always check for `null` before using a field:

```javascript
const contractor = plaza.contractor_name ?? "Not available";
const rate = plaza.car_single ? parseFloat(plaza.car_single) : 0;
```

## Example Record (NHAI - Complete Data)

```json
{
  "tollplaza_id": 305,
  "tollplaza_name": "Akhepura",
  "tollplaza_code": "330100",
  "data_source": "nhai",
  "data_confidence": "complete",
  "state_name": "RAJASTHAN",
  "latitude": "27.50603",
  "longitude": "75.348401",
  "nh_no": "52",
  "location": "Km 324.638",
  "chainage": "Reengus - Sikar (Km 298.075 to Km 341.047)",
  "tollable_length": "36.182",
  "car_single": "75",
  "car_return": "110",
  "car_monthly": "2450",
  "car_commercial": "35",
  "lcv_single": "120",
  "lcv_return": "180",
  "lcv_monthly": "3955",
  "lcv_commercial": "60",
  "bus_single": "250",
  "bus_return": "375",
  "bus_monthly": "8290",
  "bus_commercial": "125",
  "multiaxle_single": "270",
  "multiaxle_return": "405",
  "multiaxle_monthly": "9045",
  "multiaxle_commercial": "135",
  "axle_4_6_single": "390",
  "axle_4_6_return": "585",
  "axle_4_6_monthly": "13005",
  "axle_4_6_commercial": "195",
  "axle_7_plus_single": "475",
  "axle_7_plus_return": "710",
  "axle_7_plus_monthly": "15830",
  "axle_7_plus_commercial": "235",
  "hcm_single": "390",
  "hcm_return": "585",
  "hcm_monthly": "13005",
  "hcm_commercial": "195",
  "rate_effective_date": "2026-03-31T18:30:00.000Z",
  "rate_revision_date": "2027-03-30T18:30:00.000Z",
  "concessions_info": "The rate of monthly pass for local non-commercial vehicle residing within a distance of 20 Km from the toll plazas for the FY 2026-27 shall be ₹ 350.00/.",
  "project_type": "Public Funded",
  "project_lanes": "4",
  "toll_lanes": "12",
  "active": true,
  "contractor_name": "Ms Skylark Infra Engineering Pvt. Ltd.",
  "incharge_name": "Plaza Controller",
  "incharge_contact": "8130007039",
  "helpline_crane": "8003111555",
  "helpline_ambulance": "8003111555",
  "helpline_patrol": "8003111555, 9414805018, 9549254582",
  "emergency_services": "1033, 1073, 108, 102",
  "nearest_police_station": "Ranoli",
  "police_station_contact": "01576-220363",
  "nearest_hospitals": "1) SURAJ Hospital Shrimadhopur Bus Stand Palsana Sikar Rajasthan Ph.094140 00222 (2) Govt Hospital Shishu Sheeshyoo Rajasthan (3) Bayochemic Chikitsalaya Ranoli Rajasthan Ph.094132 46442",
  "last_updated": "2026-04-26T00:00:00Z"
}
```

## Example Record (State Highway - Partial Data)

```json
{
  "tollplaza_id": 1001,
  "tollplaza_name": "Example State Toll Plaza",
  "tollplaza_code": "STATE001",
  "data_source": "state",
  "data_confidence": "partial",
  "state_name": "MAHARASHTRA",
  "latitude": "19.5937",
  "longitude": "75.7123",
  "nh_no": null,
  "location": "Km 250.5",
  "chainage": null,
  "tollable_length": "25",
  "car_single": "50",
  "car_return": null,
  "car_monthly": null,
  "car_commercial": null,
  "lcv_single": null,
  "lcv_return": null,
  "lcv_monthly": null,
  "lcv_commercial": null,
  "bus_single": null,
  "bus_return": null,
  "bus_monthly": null,
  "bus_commercial": null,
  "multiaxle_single": null,
  "multiaxle_return": null,
  "multiaxle_monthly": null,
  "multiaxle_commercial": null,
  "axle_4_6_single": null,
  "axle_4_6_return": null,
  "axle_4_6_monthly": null,
  "axle_4_6_commercial": null,
  "axle_7_plus_single": null,
  "axle_7_plus_return": null,
  "axle_7_plus_monthly": null,
  "axle_7_plus_commercial": null,
  "hcm_single": null,
  "hcm_return": null,
  "hcm_monthly": null,
  "hcm_commercial": null,
  "rate_effective_date": null,
  "rate_revision_date": null,
  "concessions_info": null,
  "project_type": "State Highway",
  "project_lanes": null,
  "toll_lanes": "2",
  "active": true,
  "contractor_name": null,
  "incharge_name": null,
  "incharge_contact": null,
  "helpline_crane": null,
  "helpline_ambulance": null,
  "helpline_patrol": null,
  "emergency_services": null,
  "nearest_police_station": null,
  "police_station_contact": null,
  "nearest_hospitals": null,
  "last_updated": "2026-04-26T00:00:00Z"
}
```

## API Field Mapping

Original API field names → Normalized schema names:

| API Field | Schema Field | Notes |
|-----------|--------------|-------|
| `CarRate_single` | `car_single` | Normalized to snake_case |
| `BusRate_multi` | `bus_return` | "multi" renamed to "return" for clarity |
| `DtEffectiveRates` | `rate_effective_date` | Human-readable name |
| `omtcontractorname` | `contractor_name` | Fixed typo, normalized |
| `inchargename` | `incharge_name` | Normalized |
| `inchargecontactdetail` | `incharge_contact` | Shortened, normalized |
| `helplinenumber_crane` | `helpline_crane` | Shortened, normalized |

See [processNhai.js](./scripts/processNhai.js) for complete mapping logic.

## Common Queries

### Get all toll plazas in a state

```javascript
const maharashtaPlazas = data.filter(p => p.state_name === 'MAHARASHTRA');
```

### Get only NHAI toll plazas

```javascript
const nhaiPlazas = data.filter(p => p.data_source === 'nhai');
```

### Get all active toll plazas

```javascript
const activePlazas = data.filter(p => p.active === true);
```

### Find toll plazas with complete data

```javascript
const completePlazas = data.filter(p => p.data_confidence === 'complete');
```

### Get car rates for specific plaza

```javascript
const plaza = data.find(p => p.tollplaza_id === 305);
if (plaza) {
  const rates = {
    single: parseFloat(plaza.car_single),
    return: parseFloat(plaza.car_return),
    monthly: parseFloat(plaza.car_monthly),
    commercial: parseFloat(plaza.car_commercial)
  };
}
```

### Calculate total toll revenue potential

```javascript
const totalRevenue = data.reduce((sum, plaza) => {
  const singleTrips = plaza.car_single ? parseFloat(plaza.car_single) : 0;
  return sum + singleTrips;
}, 0);
```

---

For more information, see [README.md](./README.md) or [STATE_HIGHWAYS.md](./STATE_HIGHWAYS.md).
