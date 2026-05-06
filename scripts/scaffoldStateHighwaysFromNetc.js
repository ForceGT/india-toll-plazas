/**
 * Build data/sources/states/<region>/state_highways.json from netc_state_plazas.json
 * by filtering NETC state_name (exact match on PDF extract spelling).
 *
 * Usage:
 *   node scripts/scaffoldStateHighwaysFromNetc.js --state Maharashtra
 *   node scripts/scaffoldStateHighwaysFromNetc.js --state Gujarat --dry-run
 */

const fs = require('fs');
const path = require('path');

const NETC_PATH = path.join(__dirname, '../data/sources/netc/netc_state_plazas.json');

const UPPER_STATE = {
  Maharashtra: 'MAHARASHTRA',
  Gujarat: 'GUJARAT',
  Rajasthan: 'RAJASTHAN',
  MadhyaPradesh: 'MADHYA PRADESH',
  UttarPradesh: 'UTTAR PRADESH',
  Karnataka: 'KARNATAKA',
  TamilNadu: 'TAMIL NADU',
  Telangana: 'TELANGANA',
  Haryana: 'HARYANA',
  AndhraPradesh: 'ANDHRA PRADESH',
  Uttarakhand: 'UTTARAKHAND',
  HimachalPradesh: 'HIMACHAL PRADESH',
  Odisha: 'ODISHA',
  Jharkhand: 'JHARKHAND',
  WestBengal: 'WEST BENGAL',
};

function usage() {
  console.error(`Usage: node scripts/scaffoldStateHighwaysFromNetc.js --state <NetcStateName> [--dry-run]

Examples:
  node scripts/scaffoldStateHighwaysFromNetc.js --state Maharashtra
  node scripts/scaffoldStateHighwaysFromNetc.js --state Gujarat --dry-run

Netc state_name must match netc_state_plazas.json exactly (e.g. Maharashtra, Gujarat, Rajasthan).`);
  process.exit(1);
}

function nextTollplazaIdBase() {
  const statesDir = path.join(__dirname, '../data/sources/states');
  let max = 0;
  for (const d of fs.readdirSync(statesDir)) {
    const p = path.join(statesDir, d, 'state_highways.json');
    if (!fs.existsSync(p)) continue;
    const rows = JSON.parse(fs.readFileSync(p, 'utf8'));
    for (const r of rows) {
      const id = Number(r.tollplaza_id);
      if (Number.isFinite(id) && id > max) max = id;
    }
  }
  return max + 1;
}

function rowFromNetc(p, tollplaza_id, stateDisplay) {
  const code = p.netc_plaza_code;
  let name = (p.plaza_name || 'Unknown').trim();
  while (/\s*Toll\s*Plaza\s*$/i.test(name)) {
    name = name.replace(/\s*Toll\s*Plaza\s*$/i, '').trim();
  }
  name = name || 'Unknown';
  const city = (p.city || '').trim();
  const lat = p.latitude != null ? String(p.latitude) : null;
  const lng = p.longitude != null ? String(p.longitude) : null;
  const locParts = [
    `NETC ${code}`,
    name,
    city ? `${city}, ${stateDisplay}` : stateDisplay,
    lat && lng ? `${lat},${lng}` : null,
  ].filter(Boolean);
  return {
    data_source: 'state',
    data_confidence: 'partial',
    tollplaza_id,
    tollplaza_name: `${name} Toll Plaza`,
    tollplaza_code: `NETC${code}`,
    state_name: UPPER_STATE[p.state_name] || stateDisplay.toUpperCase().replace(/\s+/g, ' '),
    latitude: lat,
    longitude: lng,
    nh_no: null,
    location: locParts.join('; '),
    chainage: null,
    tollable_length: null,
    car_single: null,
    car_return: null,
    car_monthly: null,
    car_commercial: null,
    lcv_single: null,
    lcv_return: null,
    lcv_monthly: null,
    lcv_commercial: null,
    bus_single: null,
    bus_return: null,
    bus_monthly: null,
    bus_commercial: null,
    multiaxle_single: null,
    multiaxle_return: null,
    multiaxle_monthly: null,
    multiaxle_commercial: null,
    axle_4_6_single: null,
    axle_4_6_return: null,
    axle_4_6_monthly: null,
    axle_4_6_commercial: null,
    axle_7_plus_single: null,
    axle_7_plus_return: null,
    axle_7_plus_monthly: null,
    axle_7_plus_commercial: null,
    hcm_single: null,
    hcm_return: null,
    hcm_monthly: null,
    hcm_commercial: null,
    rate_effective_date: null,
    rate_revision_date: null,
    concessions_info:
      `${stateDisplay} state highway (NETC). Vehicle rates and exemptions not yet researched in this dataset; fill from official tariffs / PWD / operator notices / TollGuru as applicable. Source plaza list: data/sources/netc/netc_state_plazas.json.`,
    project_type: 'State Highway (NETC)',
    project_lanes: null,
    toll_lanes: null,
    active: true,
    contractor_name: p.concessionaire_name || null,
    incharge_name: null,
    incharge_contact: null,
    helpline_crane: null,
    helpline_ambulance: null,
    helpline_patrol: null,
    emergency_services: null,
    nearest_police_station: null,
    police_station_contact: null,
    nearest_hospitals: null,
    last_updated: new Date().toISOString(),
  };
}

function parseArgs() {
  const argv = process.argv.slice(2);
  let state = null;
  let dryRun = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--state' && argv[i + 1]) {
      state = argv[++i];
    } else if (argv[i] === '--dry-run') {
      dryRun = true;
    }
  }
  return { state, dryRun };
}

function main() {
  const { state: netcState, dryRun } = parseArgs();
  if (!netcState) usage();

  const raw = JSON.parse(fs.readFileSync(NETC_PATH, 'utf8'));
  const list = raw.plazas.filter((p) => p.state_name === netcState);
  if (list.length === 0) {
    console.error(`No plazas with state_name === "${netcState}" in ${NETC_PATH}`);
    process.exit(1);
  }

  list.sort((a, b) => a.netc_plaza_code.localeCompare(b.netc_plaza_code, undefined, { numeric: true }));

  const display = netcState.replace(/([a-z])([A-Z])/g, '$1 $2');
  let idBase = nextTollplazaIdBase();
  const out = list.map((p) => rowFromNetc(p, idBase++, display));

  const slug = netcState.replace(/[^a-zA-Z]/g, '').toLowerCase() || 'state';
  const outDir = path.join(__dirname, '../data/sources/states', slug);
  const outFile = path.join(outDir, 'state_highways.json');

  console.log(`${netcState}: ${out.length} plazas → ${path.relative(process.cwd(), outFile)}`);
  if (dryRun) {
    console.log(JSON.stringify(out[0], null, 2));
    return;
  }

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n');
}

main();
