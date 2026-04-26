const fs = require('fs');
const path = require('path');

const REQUIRED_FIELDS = [
  'tollplaza_id', 'tollplaza_name', 'tollplaza_code', 'state_name',
  'latitude', 'longitude', 'nh_no', 'location', 'chainage', 'tollable_length',
  'car_single', 'car_return', 'car_monthly', 'car_commercial',
  'lcv_single', 'lcv_return', 'lcv_monthly', 'lcv_commercial',
  'bus_single', 'bus_return', 'bus_monthly', 'bus_commercial',
  'multiaxle_single', 'multiaxle_return', 'multiaxle_monthly', 'multiaxle_commercial',
  'axle_4_6_single', 'axle_4_6_return', 'axle_4_6_monthly', 'axle_4_6_commercial',
  'axle_7_plus_single', 'axle_7_plus_return', 'axle_7_plus_monthly', 'axle_7_plus_commercial',
  'hcm_single', 'hcm_return', 'hcm_monthly', 'hcm_commercial',
  'rate_effective_date', 'rate_revision_date', 'concessions_info',
  'project_type', 'project_lanes', 'toll_lanes', 'active',
  'contractor_name', 'incharge_name', 'incharge_contact',
  'helpline_crane', 'helpline_ambulance', 'helpline_patrol', 'emergency_services',
  'nearest_police_station', 'police_station_contact', 'nearest_hospitals'
];

function normalizeStateHighwayData(stateHighwayEntry) {
  const normalized = {};

  // Add metadata
  normalized.data_source = 'state';
  normalized.data_confidence = 'partial';

  // Initialize all fields
  for (const field of REQUIRED_FIELDS) {
    normalized[field] = stateHighwayEntry[field] ?? null;
  }

  // Add timestamp
  normalized.last_updated = new Date().toISOString();

  return normalized;
}

async function processStateHighways() {
  try {
    console.log('Processing state highways data...');

    const sourcesDir = path.join(__dirname, '../data/sources');
    if (!fs.existsSync(sourcesDir)) {
      fs.mkdirSync(sourcesDir, { recursive: true });
    }

    const stateHighwaysFile = path.join(sourcesDir, 'state_highways.json');

    let stateHighways = [];
    if (fs.existsSync(stateHighwaysFile)) {
      const content = fs.readFileSync(stateHighwaysFile, 'utf8');
      stateHighways = JSON.parse(content);
    } else {
      console.log('No state_highways.json found. Creating empty file with template.');
      stateHighways = [];
      fs.writeFileSync(stateHighwaysFile, JSON.stringify([], null, 2));
    }

    const normalizedStateHighways = stateHighways.map(normalizeStateHighwayData);

    console.log(`Processed ${normalizedStateHighways.length} state highway toll plazas`);

    // Overwrite with normalized version
    fs.writeFileSync(stateHighwaysFile, JSON.stringify(normalizedStateHighways, null, 2));

    return normalizedStateHighways;
  } catch (error) {
    console.error('Error processing state highways data:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  processStateHighways();
}

module.exports = { processStateHighways, normalizeStateHighwayData };
