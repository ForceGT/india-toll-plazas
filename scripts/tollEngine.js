const fs = require('fs');
const path = require('path');

function resolveDirectionalRate(plaza, bearing) {
  if (!plaza.directional || !plaza.directions) return null;
  for (const [key, cfg] of Object.entries(plaza.directions)) {
    const [minB, maxB] = cfg.bearing_bounds;
    let m = minB <= maxB ? (bearing >= minB && bearing <= maxB) : (bearing >= minB || bearing <= maxB);
    if (m) return { direction: key, rate: cfg.car_single || cfg.toll_car || 0, full: cfg };
  }
  return null;
}

function resolveTollForPlaza(plaza, options = {}) {
  const { vehicleClass = 'car', vehicleHeadingBearing = null, corridorKey = null,
    entryRampId = null, exitRampId = null } = options;
  const plazaCode = String(plaza.plaza_code || plaza.netc_code || plaza.id || '');


  try {
    const communityStorePath = path.join(__dirname, '../data/sources/crowdsourced/community_reports.json');
    if (fs.existsSync(communityStorePath) && plazaCode) {
      const store = JSON.parse(fs.readFileSync(communityStorePath, 'utf8'));
      const reports = store.reports || [];
      const matching = reports.filter(r => r.plaza_code === plazaCode && r.vehicle_class === vehicleClass);
      const tally = {};
      for (const r of matching) tally[r.reported_toll_inr] = (tally[r.reported_toll_inr] || 0) + 1;
      for (const [tollStr, count] of Object.entries(tally)) {
        if (count >= (store.min_consensus_threshold || 3)) {
          return { plaza_name: plaza.name || plaza.plaza_name, toll_amount_inr: Number(tollStr), vehicle_class: vehicleClass, resolution_type: 'crowdsourced_consensur', confidence: 'high_community', report_count: count };
        }
      }
    }
  } catch (e) {}


  if (vehicleHeadingBearing !== null) {
    const dirRes = resolveDirectionalRate(plaza, vehicleHeadingBearing);
    if (dirRes) {
      return { plaza_name: plaza.name || plaza.plaza_name, direction: dirRes.direction, toll_amount_inr: dirRes.rate, vehicle_class: vehicleClass, resolution_type: 'directional_bearing', confidence: 'verified' };
    }
  }


  const baseToll = plaza.rates_by_class ? (plaza.rates_by_class[vehicleClass] || plaza.car_single) : (plaza.car_single || 0);
  return {
    plaza_name: plaza.name || plaza.plaza_name,
    toll_amount_inr: baseToll,
    vehicle_class: vehicleClass,
    resolution_type: 'static_flat_rate',
    confidence: plaza.data_confidence || 'standard'
  };
}

function calculateTripTolls(plazaList = [], options = {}) {
  let totalToll = 0;
  const breakdown = [];
  for (const p of plazaList) {
    const result = resolveTollForPlaza(p, options);
    breakdown.push(result);
    totalToll += (result.toll_amount_inr || 0);
  }
  return {
    total_toll_inr: totalToll,
    plaza_count: plazaList.length,
    vehicle_class: options.vehicleClass || 'car',
    breakdown: breakdown
  };
}

module.exports = {
  resolveTollForPlaza,
  resolveDirectionalRate,
  calculateTripTolls: calculateTripTolls,
  calculateTripToll: calculateTripTolls
};
