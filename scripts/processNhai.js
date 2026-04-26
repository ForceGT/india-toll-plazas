const fs = require('fs');
const path = require('path');

const FIELD_MAPPING = {
  'tollplaza_id': 'tollplaza_id',
  'tollplaza_name': 'tollplaza_name',
  'tollplaza_code': 'tollplaza_code',
  'state_name': 'state_name',
  'latitude': 'latitude',
  'longitude': 'longitude',
  'nh_no': 'nh_no',
  'Location': 'location',
  'Chainage': 'chainage',
  'TollableLength': 'tollable_length',
  'CarRate_single': 'car_single',
  'CarRate_multi': 'car_return',
  'CarRate_mth': 'car_monthly',
  'CarRate_comm_reg': 'car_commercial',
  'LCVRate_single': 'lcv_single',
  'LCVRate_multi': 'lcv_return',
  'LCVRate_Mth': 'lcv_monthly',
  'LCVRate_comm_reg': 'lcv_commercial',
  'BusRate_single': 'bus_single',
  'BusRate_multi': 'bus_return',
  'BusRate_Mth': 'bus_monthly',
  'BusRate_comm_reg': 'bus_commercial',
  'MultiAxleRate_single': 'multiaxle_single',
  'MultiAxleRate_multi': 'multiaxle_return',
  'MultiAxleRate_Mth': 'multiaxle_monthly',
  'MultiAxleRate_comm_reg': 'multiaxle_commercial',
  'FourToSixExel_Single': 'axle_4_6_single',
  'FourToSixExel_Return': 'axle_4_6_return',
  'FourToSixExel_Monthly': 'axle_4_6_monthly',
  'FourToSixExel_comm_reg': 'axle_4_6_commercial',
  'SevenOrmoreExel_Single': 'axle_7_plus_single',
  'SevenOrmoreExel_Return': 'axle_7_plus_return',
  'SevenOrmoreExel_Monthly': 'axle_7_plus_monthly',
  'SevenOrmoreExel_comm_reg': 'axle_7_plus_commercial',
  'HCM_EME_Single': 'hcm_single',
  'HCM_EME_Return': 'hcm_return',
  'hcm_eme_monthly': 'hcm_monthly',
  'hcm_eme_comm_reg': 'hcm_commercial',
  'DtEffectiveRates': 'rate_effective_date',
  'DtRateRevision': 'rate_revision_date',
  'concessions': 'concessions_info',
  'TypeOfProject': 'project_type',
  'Project_Lane': 'project_lanes',
  'Toll_Lane': 'toll_lanes',
  'active': 'active',
  'omtcontractorname': 'contractor_name',
  'inchargename': 'incharge_name',
  'inchargecontactdetail': 'incharge_contact',
  'helplinenumber_crane': 'helpline_crane',
  'helplinenumber_ambulance': 'helpline_ambulance',
  'helplinenumber_routepetrol': 'helpline_patrol',
  'Emergency_Services': 'emergency_services',
  'NearestPoliceStationName': 'nearest_police_station',
  'NearestPoliceStationNo': 'police_station_contact',
  'NearestHospitals': 'nearest_hospitals'
};

function normalizeNhaiData(rawPlaza) {
  const normalized = {};

  // Add metadata
  normalized.data_source = 'nhai';
  normalized.data_confidence = 'complete';

  // Map fields
  for (const [apiField, normalizedField] of Object.entries(FIELD_MAPPING)) {
    const value = rawPlaza[apiField];
    normalized[normalizedField] = value ?? null;
  }

  // Add timestamp
  normalized.last_updated = new Date().toISOString();

  return normalized;
}

async function processNhai() {
  try {
    console.log('Processing NHAI data...');

    const rawFile = path.join(__dirname, '../data/sources/.temp_raw_details.json');
    if (!fs.existsSync(rawFile)) {
      throw new Error('Raw details file not found. Run fetchNhaiDetails.js first');
    }

    const rawPlazas = JSON.parse(fs.readFileSync(rawFile, 'utf8'));
    const normalizedPlazas = rawPlazas.map(normalizeNhaiData);

    console.log(`Processed ${normalizedPlazas.length} NHAI toll plazas`);

    // Save normalized NHAI data
    const sourcesDir = path.join(__dirname, '../data/sources');
    if (!fs.existsSync(sourcesDir)) {
      fs.mkdirSync(sourcesDir, { recursive: true });
    }

    const nhaiFile = path.join(sourcesDir, 'nhai.json');
    fs.writeFileSync(nhaiFile, JSON.stringify(normalizedPlazas, null, 2));

    console.log(`Saved to ${nhaiFile}`);
    return normalizedPlazas;
  } catch (error) {
    console.error('Error processing NHAI data:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  processNhai();
}

module.exports = { processNhai, normalizeNhaiData };
