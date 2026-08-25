const fs = require('fs');
const path = require('path');

function loadCorridors() {
  if (loadCorridors._cache) return loadCorridors._cache;
  const filePath = path.join(__dirname, '../data/sources/curated/closed_loop_corridors.json');
  loadCorridors._cache = JSON.parse(fs.readFileSync(filePath, 'utf8')).corridors;
  return loadCorridors._cache;
}

function calculateClosedLoopToll(corridorKey, entryRampId, exitRampId, vehicleClass = 'car', roundToNearest = 5) {
  const corridors = loadCorridors();
  const corridor = corridors[corridorKey];
  if (!corridor) throw new Error('Invalid corridor key: ' + corridorKey);

  const entry = corridor.ramps.find(r => r.id === entryRampId);
  const exit = corridor.ramps.find(r => r.id === exitRampId);

  if (!entry || !exit) throw new Error('Invalid ramp ID: entry=' + entryRampId + ', exit=' + exitRampId);

  const ratePerKm = corridor.rates_per_km ? corridor.rates_per_km[vehicleClass] : undefined;
  if (ratePerKm == null) { throw new Error('Unknown vehicle class: ' + vehicleClass + ' for corridor ' + corridorKey); }

  const distanceKm = Math.round(Math.abs(exit.chainage_km - entry.chainage_km) * 100) / 100;
  const rawToll = distanceKm * ratePerKm;
  const tollAmount = roundToNearest > 0 ? Math.round(rawToll / roundToNearest) * roundToNearest : Math.round(rawToll);

  return {
    corridor: corridor.corridor_name,
    operator: corridor.operator,
    entry_ramp: entry.name,
    exit_ramp: exit.name,
    distance_km: distanceKm,
    rate_per_km: ratePerKm,
    vehicle_class: vehicleClass,
    toll_amount_inr: tollAmount
  };
}

function resolveDirectionalRate(plaza, vehicleHeadingBearing) {
  if (!plaza.directional || !plaza.directions) {
    return { direction: 'default', rate: plaza.car_single };
  }

  for (const [directionKey, config] of Object.entries(plaza.directions)) {
    const [minB, maxB] = config.bearing_bounds;
    let matches = false;

    if (minB <= maxB) {
      matches = vehicleHeadingBearing >= minB && vehicleHeadingBearing <= maxB;
    } else {
      matches = vehicleHeadingBearing >= minB || vehicleHeadingBearing <= maxB;
    }

    if (matches) {
      return {
        direction: directionKey,
        description: config.description,
        rate: config.car_single,
        full_rates: config
      };
    }
  }

  return { direction: 'unmatched_default', rate: plaza.car_single };
}

module.exports = { calculateClosedLoopToll, resolveDirectionalRate, loadCorridors };