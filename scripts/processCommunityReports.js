const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, '../data/sources/crowdsourced/community_reports.json');

function loadStore() {
  return JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
}

function submitTollReport({ plazaCode, plazaName, vehicleClass = 'car', amountInr, directionBearing = null, source = 'tollsense_app', reporterId = 'anon' }) {
  const store = loadStore();
  const report = {
    report_id: 'REP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    plaza_code: String(plazaCode).trim(),
    plaza_name: plazaName,
    vehicle_class: vehicleClass,
    reported_toll_inr: Number(amountInr),
    direction_bearing: directionBearing !== null ? Number(directionBearing) : null,
    source,
    reporter_id: reporterId,
    timestamp: new Date().toISOString()
  };

  store.reports.push(report);
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2) + '\n', 'utf8');

  const consensus = evaluateConsensus(store.reports, report.plaza_code, vehicleClass, store.min_consensus_threshold);

  return {
    status: 'recorded',
    report_id: report.report_id,
    consensus_reached: consensus.reached,
    consensus_toll_inr: consensus.toll,
    report_count: consensus.count
  };
}

function evaluateConsensus(reports, plazaCode, vehicleClass, threshold = 3) {
  const matching = reports.filter(r => r.plaza_code === plazaCode && r.vehicle_class === vehicleClass);
  if (matching.length === 0) return { reached: false, toll: null, count: 0 };

  const tally = {};
  for (const r of matching) {
    tally[r.reported_toll_inr] = (tally[r.reported_toll_inr] || 0) + 1;
  }

  for (const [tollStr, count] of Object.entries(tally)) {
    if (count >= threshold) {
      return { reached: true, toll: Number(tollStr), count };
    }
  }

  return { reached: false, toll: null, count: matching.length };
}

module.exports = { submitTollReport, evaluateConsensus };
