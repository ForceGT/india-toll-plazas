# State Highways Data Guide

Instructions for contributing and maintaining state highway toll plaza data.

## Overview

While NHAI (National Highways) toll data is automatically fetched via the RajMargyatra API, state highway toll data is manually curated. This guide explains how to add, update, and maintain state highway toll plaza records.

## Current Coverage

### States with Data
- *(To be populated as state highways are added)*

### States Needed
- Andhra Pradesh
- Arunachal Pradesh
- Assam
- Bihar
- Chhattisgarh
- Goa
- Gujarat
- Haryana
- Himachal Pradesh
- Jharkhand
- Karnataka
- Kerala
- Madhya Pradesh
- Manipur
- Meghalaya
- Mizoram
- Nagaland
- Odisha
- Punjab
- Rajasthan
- Sikkim
- Tamil Nadu
- Telangana
- Tripura
- Uttar Pradesh
- Uttarakhand
- West Bengal

## Data Collection

### Sources for State Highway Information

1. **Official State PWD/Highway Departments**
   - Example: Rajasthan State Highways Authority website

2. **State-specific toll portal/apps**
   - Many states have their own toll management systems

3. **Toll aggregator platforms**
   - FASTag payment platforms (ICICI, HDFC, etc.)
   - Google Maps/Apple Maps traffic data

4. **News articles and press releases**
   - State government announcements
   - Toll rate notifications

5. **Direct field surveys** (if available)

## Data Format

Each state highway toll plaza record must include all fields from the standard schema. Use `null` for fields where data is not available.

### Required Fields (minimum)

```json
{
  "tollplaza_id": 2001,
  "tollplaza_name": "Example State Toll Plaza",
  "tollplaza_code": "STT2001",
  "state_name": "MAHARASHTRA",
  "latitude": "19.5937",
  "longitude": "75.7123",
  "nh_no": null,
  "location": "Km 250.5 on State Highway 10",
  "chainage": null,
  "tollable_length": "25",
  "active": true,
  "toll_lanes": "2",
  "project_type": "State Highway",
  "project_lanes": null,
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
  "contractor_name": null,
  "incharge_name": null,
  "incharge_contact": null,
  "helpline_crane": null,
  "helpline_ambulance": null,
  "helpline_patrol": null,
  "emergency_services": null,
  "nearest_police_station": null,
  "police_station_contact": null,
  "nearest_hospitals": null
}
```

## Field Guidelines

### Identifiers
- **tollplaza_id**: Use a unique number. Start state IDs at 2000+ to avoid conflicts with NHAI (typically <1500)
- **tollplaza_name**: Official name of the toll plaza
- **tollplaza_code**: State-specific code if available, or create consistent format (e.g., "TN2001")

### Location
- **state_name**: UPPERCASE state abbreviation
- **latitude/longitude**: Decimal format (e.g., "19.5937")
- **location**: Description, e.g., "Km 250.5 on SH-10"
- **nh_no**: Leave as `null` for state highways (use "NH-X" if it's an upgraded NH)

### Toll Rates
- **Format**: String representation of INR amount (e.g., "50", "2450")
- **Include what you have**: If only car rates available, include those and leave others as `null`
- **Source in comments**: When submitting PR, mention which rates are sourced from where

### Operational Information
- **contractor_name**: Include if available
- **incharge_contact**: Phone number or email
- **helpline numbers**: Include if available (format as string, comma-separated for multiple numbers)

### Boolean Fields
- **active**: `true` if operational, `false` if closed/under construction

## Contributing New State Highway Data

### Step 1: Prepare Your Data

Collect information for one or more toll plazas in a state:
- Basic info (name, location, coordinates)
- Available toll rates
- Operational details (if accessible)
- Contact information (if public)

### Step 2: Format as JSON

```json
{
  "tollplaza_id": 2101,
  "tollplaza_name": "XYZ Toll Plaza",
  "tollplaza_code": "GJ2101",
  ...
}
```

### Step 3: Validate Format

Ensure:
- All required fields are present (use `null` for missing data)
- Field names match schema exactly (snake_case)
- Rates are strings (not numbers)
- State names are UPPERCASE
- Coordinates are valid decimal format

### Step 4: Submit Pull Request

1. Update `data/sources/state_highways.json` with your new entries
2. In PR description, include:
   - State(s) you're adding
   - Number of toll plazas
   - Data sources used
   - Date of data collection
   - Any caveats or uncertainties

**Example PR description:**
```
Add state highway toll data for Gujarat

- Added 5 toll plazas: Salasar, Mehsana, Nadiad, Godhra, Panchmahal
- Data sources: Gujarat State PWD website + field surveys
- Toll rates: As of Jan 2026
- Note: Rates for HCV vehicles not yet available, marked as null
```

## Updating Existing Data

When toll rates change or new information becomes available:

1. Locate the plaza by `tollplaza_id`
2. Update relevant fields
3. Update `last_updated` timestamp to current date
4. Submit PR with update explanation

## Data Quality Standards

### Minimum Quality (Acceptable)
- ✓ Name, location, coordinates
- ✓ At least car toll rates
- ✓ Active/inactive status
- ✓ Source documentation

### Good Quality
- ✓ All above
- ✓ Multiple vehicle type rates
- ✓ Contractor/in-charge information
- ✓ Recent data (within 3 months)

### Excellent Quality
- ✓ All above
- ✓ All vehicle type rates
- ✓ Emergency contact numbers
- ✓ Nearby services info
- ✓ Rate revision dates
- ✓ Very recent data (within 1 month)

## Handling Incomplete Data

For missing fields:
- Use `null` (not empty string, not "N/A", not 0)
- In PR comments, explain why data is unavailable
- Suggest where future contributors might find it

**Good example:**
```json
{
  "contractor_name": null,
  "incharge_contact": null
}
```

**Not recommended:**
```json
{
  "contractor_name": "Not available",
  "incharge_contact": "N/A"
}
```

## Verifying Coordinates

When adding location coordinates:

1. Use Google Maps or OpenStreetMap to verify
2. Ensure coordinates point to toll plaza location
3. Check lat/long order (latitude first, then longitude)
4. Format consistently (up to 5-6 decimal places)

**Valid:** `19.5937`, `75.7123`  
**Valid:** `19.593724`, `75.712354`  
**Invalid:** `75.7123, 19.5937` (reversed order)

## Rate Documentation

When documenting toll rates:

1. **Always include effective date** if available
2. **Note rate type**: single, return, monthly, commercial
3. **Source format consistency**: 
   - Rates in INR
   - No currency symbols (use "50", not "₹50" or "$50")
   - String format (use "50", not 50)

4. **Special cases**:
   - Return journeys: use `{vehicle_type}_return` field
   - Monthly passes: use `{vehicle_type}_monthly` field
   - Commercial: use `{vehicle_type}_commercial` field

## Review Checklist

Before submitting a PR for state highways, verify:

- [ ] All required fields present (use `null` for missing)
- [ ] Tollplaza IDs unique and >= 2000
- [ ] Field names are snake_case
- [ ] State names are UPPERCASE
- [ ] Coordinates are valid decimals
- [ ] Rates are strings (e.g., "50" not 50)
- [ ] Active boolean is true/false (not string)
- [ ] JSON is valid (no trailing commas, etc.)
- [ ] Data sources cited in PR description
- [ ] No personally identifying information exposed
- [ ] Rate information dated and sourced

## Common Mistakes to Avoid

❌ **Mistake**: Using number for rates
```json
"car_single": 50
```
✅ **Correct**: Use string
```json
"car_single": "50"
```

---

❌ **Mistake**: Inconsistent state names
```json
"state_name": "maharashtra"
```
✅ **Correct**: Uppercase
```json
"state_name": "MAHARASHTRA"
```

---

❌ **Mistake**: Reversed coordinates
```json
"latitude": "75.7123",
"longitude": "19.5937"
```
✅ **Correct**: Lat first, long second
```json
"latitude": "19.5937",
"longitude": "75.7123"
```

---

❌ **Mistake**: Empty strings for missing data
```json
"contractor_name": ""
```
✅ **Correct**: Use null
```json
"contractor_name": null
```

## FAQ

**Q: Can I add toll plazas for multiple states in one PR?**  
A: Yes, but keep PR focused and organized. One PR per state is preferred.

**Q: How often should state highway data be updated?**  
A: Whenever you find new/updated information. Monthly alongside NHAI updates would be ideal.

**Q: Can I submit data I collected via GPS on my own road trips?**  
A: Yes! Personal surveys are valuable. Please note in PR that data is from field survey with dates.

**Q: What if toll rates change?**  
A: Update the record, add the new `rate_effective_date`, and open a PR.

**Q: Should I include seasonal toll rates?**  
A: For now, include the current/default rates. Future versions may support seasonal variations.

**Q: How do I know if coordinates are accurate enough?**  
A: 4-5 decimal places (100m accuracy) is good. 6 decimal places (10m) is excellent.

## Contact & Questions

- Open a GitHub Issue for questions
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for general guidelines
- Check [SCHEMA.md](./SCHEMA.md) for field specifications

---

**Thank you for contributing to this dataset!** Your efforts help make highway toll information accessible to all Indians. 🚗
