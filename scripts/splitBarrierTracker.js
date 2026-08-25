const fs = require('fs');
const path = require('path');

function loadSplitCorridors() {
  if (loadSplitCorridors._cache) return loadSplitCorridors._cache;
  const p = path.join(__dirname, '../data/sources/curated/split_barrier_corridors.json');
  loadSplitCorridors._cache = JSON.parse(fs.readFileSync(p, 'utf8')).corridors;
  return loadSplitCorridors._cache;
}

function resolveSplitBarrierToll(corridorKey, plazaCode, vehicleBearing, vehicleClass = 'car') {
  const corridors = loadSplitCorridors();
  const corridor = corridors[corridorKey];
  if (!corridor) throw new Error('Unknown split corridor: ' + corridorKey);

  let matchedDirection = null;
  for (const [dirKey, config] of Object.entries(corridor.directions)) {
    const [minB, maxB] = config.bearing_bounds;
    const matches = minB <= maxB ? (vehicleBearing >= minB && vehicleBearing <= maxB) : (vehicleBearing >= minB || vehicleBearing <= maxB);
    if (matches) { matchedDirection = { dirKey, ...config }; break; }
  }

  if (!matchedDirection) return { corridor: corridor.corridor_name, status: 'direction_unmatched', default_total: corridor.total_toll_car };

  const barrier = matchedDirection.barriers.find(b => b.plaza_id === plazaCode || b.plaza_name.toLowerCase() === plazaCode.toLowerCase());
  if (!barrier) throw new Error('Plaza ' + plazaCode + ' not part of ' + corridorKey);

  return {
    corridor: corridor.corridor_name,
    operator: corridor.operator,
    direction: matchedDirection.dirKey,
    description: matchedDirection.description,
    current_plaza: barrier.plaza_name,
    barrier_sequence: barrier.sequence,
    barrier_role: barrier.role,
    toll_amount_inr: barrier.toll_car,
    corridor_total_inr: corridor.total_toll_car
  };
}

function trackCorridorProgress(corridorKey, entryRampId, currentKm, exitRampId, ratePerKm = 1.73) {
  const totalTripKm = Math.abs(exitRampId.chainage_km - entryRampId.chainage_km);
  const completedKm = Math.abs(currentKm - entryRampId.chainage_km);
  const remainingKm = Math.max(0, totalTripKm - completedKm);
  const progressPercent = Math.min(100, Math.round((completedKm / totalTripKm) * 100));
  const accruedToll = Math.round(completedKm * ratePerKm);
  const finalExpectedToll = Math.round(totalTripKm * ratePerKm / 5) * 5;

  return {
    corridor: corridorKey,
    progress_percent: progressPercent,
    distance_completed_km: Math.round(completedKm * 10) / 10,
    distance_remaining_km: Math.round(remainingKm * 10) / 10,
    accrued_toll_inr: accruedToll,
    final_trip_toll_inr: finalExpectedToll
  };
}

module.exports = { resolveSplitBarrierToll, trackCorridorProgress, loadSplitCorridors };