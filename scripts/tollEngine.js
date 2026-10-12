const fs = require('fs');
const path = require('path');

function loadCorridors() {
  if (loadCorridors._cache) return loadCorridors._cache;
  const filePath = path.join(__dirname, '../data/sources/curated/closed_loop_corridors.json');
  if (!fs.existsSync(filePath)) return {};
  loadCorridors._cache = JSON.parse(fs.readFileSync(filePath, 'utf8')).corridors || {};
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
  if (ratePerKm == null) throw new Error('Unknown vehicle class: ' + vehicleClass + ' for corridor ' + corridorKey);

  const distanceKm = Math.round(Math.abs(exit.chainage_km - entry.chainage_km) * 100) / 100;
  const rawToll = distanceKm * ratePerKm;
  const tollAmount = roundToNearest > 0 ? Math.round(rawToll / roundToNearest) * roundToNearest : Math.round(rawToll);

  return {
    corridor: corridor.corridor_name,
    entry_ramp: entry.name,
    exit_ramp: exit.name,
    distance_km: distanceKm,
    vehicle_class: vehicleClass,
    rate_per_km: ratePerKm,
    toll_amount_inr: tollAmount,
    resolution_type: 'closed_loop_distance'
  };
}

function resolvePlazaToll(plaza, options = {}) {
  const { direction = null, vehicleClass = 'car' } = options;
  const rateKey = vehicleClass === 'car' ? 'car_single' : `${vehicleClass}_single`;

  if (direction) {
    const dirNorm = String(direction).toLowerCase().trim();
    const candidateA = plaza.dir_a;
    const candidateB = plaza.dir_b;

    if (candidateA && (dirNorm === 'dir_a' || dirNorm === 'a' || (candidateA.direction_label && candidateA.direction_label.toLowerCase().includes(dirNorm)))) {
      const amt = candidateA[rateKey] ?? candidateA.car_single;
      if (amt !== undefined) {
        return {
          tollplaza_name: plaza.tollplaza_name,
          tollplaza_code: plaza.tollplaza_code,
          direction: candidateA.direction_label || 'dir_a',
          vehicle_class: vehicleClass,
          toll_amount_inr: parseFloat(amt),
          resolution_type: 'directional_rate'
        };
      }
    }

    if (candidateB && (dirNorm === 'dir_b' || dirNorm === 'b' || (candidateB.direction_label && candidateB.direction_label.toLowerCase().includes(dirNorm)))) {
      const amt = candidateB[rateKey] ?? candidateB.car_single;
      if (amt !== undefined) {
        return {
          tollplaza_name: plaza.tollplaza_name,
          tollplaza_code: plaza.tollplaza_code,
          direction: candidateB.direction_label || 'dir_b',
          vehicle_class: vehicleClass,
          toll_amount_inr: parseFloat(amt),
          resolution_type: 'directional_rate'
        };
      }
    }
  }

  const baseRate = plaza[rateKey] ?? plaza.car_single ?? 0;
  return {
    tollplaza_name: plaza.tollplaza_name,
    tollplaza_code: plaza.tollplaza_code,
    vehicle_class: vehicleClass,
    toll_amount_inr: parseFloat(baseRate) || 0,
    resolution_type: 'standard_flat_rate'
  };
}

module.exports = {
  calculateClosedLoopToll,
  resolvePlazaToll,
  loadCorridors
};
