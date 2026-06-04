/**
 * Probe the HERE Routing API v8 toll output for India — a VALIDATION harness, not a pipeline.
 *
 * Purpose: before deciding whether HERE is worth integrating, see what it actually returns for
 * Indian toll plazas — specifically whether it gives a per-plaza breakdown (useful) or only a
 * per-toll-SYSTEM / route total (same limitation as TollGuru, useless for closed-system splits).
 *
 * HERE has a free tier. Get a key at https://platform.here.com (Freemium plan), then:
 *   HERE_API_KEY=xxxxx node scripts/probeHere.js
 *   HERE_API_KEY=xxxxx node scripts/probeHere.js --case mumbai-pune    # one case only
 *
 * It prints the raw per-toll fares HERE returns for each test route in both directions, so you
 * can judge: (a) does HERE split Khalapur Rs.80 / Urse Rs.240, or flatten to ~Rs.320? (b) does it
 * differ by direction? (c) does it name/locate individual plazas?
 */

const { moveLatLng } = require('./tollguruClient');

const API_KEY = process.env.HERE_API_KEY;
const BASE = 'https://router.hereapi.com/v8/routes';

// Test cases. Each is run both forward (A) and reversed (B).
const CASES = [
  {
    id: 'mumbai-pune',
    label: 'Mumbai-Pune Expressway (CLOSED/ticket system — the hard case)',
    origin: { lat: 19.0300, lng: 73.1000, name: 'Kalamboli' },
    destination: { lat: 18.6400, lng: 73.7400, name: 'Kiwale' },
    via: [
      { lat: 18.800844, lng: 73.285159, name: 'Khalapur (real car=Rs.80)' },
      { lat: 18.760572, lng: 73.428056, name: 'Kusgaon' },
      { lat: 18.7173296, lng: 73.62628, name: 'Urse/Talegaon (real car=Rs.240)' }
    ]
  },
  {
    id: 'nh48-open',
    label: 'Open-barrier NH-48 plazas (NHAI: Khaniwade Rs.130, Charoti Rs.95) — does HERE match NHAI?',
    // Stretch of NH-48 north of Mumbai that crosses Khaniwade then Charoti.
    origin: { lat: 19.3000, lng: 72.8600, name: 'NH-48 south' },
    destination: { lat: 20.0500, lng: 72.9500, name: 'NH-48 north' },
    via: []
  }
];

function move(lat, lng, km, bearing) {
  const p = moveLatLng(lat, lng, km, bearing);
  return { lat: p.lat, lng: p.lng };
}

function fmt(pt) {
  return `${pt.lat.toFixed(6)},${pt.lng.toFixed(6)}`;
}

function buildUrl(origin, destination, via) {
  const params = new URLSearchParams();
  params.set('transportMode', 'car');
  params.set('origin', fmt(origin));
  params.set('destination', fmt(destination));
  params.set('return', 'summary,tolls');
  params.set('currency', 'INR');
  params.set('apikey', API_KEY);
  let url = `${BASE}?${params.toString()}`;
  // `via` must be repeated query params, in order.
  for (const v of via || []) url += `&via=${encodeURIComponent(fmt(v))}`;
  return url;
}

async function runDirection(origin, destination, via) {
  const res = await fetch(buildUrl(origin, destination, via));
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HTTP ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const route = data.routes?.[0];
  if (!route) return { total: 0, tolls: [], note: 'no route' };

  const tolls = [];
  let total = 0;
  for (const section of route.sections || []) {
    for (const toll of section.tolls || []) {
      // Classify fares by the `pass` field: no pass = single one-way; returnJourney = return;
      // validityPeriod (months) = monthly pass. Summing all of them is what produced garbage.
      const fares = toll.fares || [];
      const priceOf = (f) => f?.convertedPrice?.value ?? f?.price?.value ?? null;
      const single = priceOf(fares.find((f) => !f.pass));
      const ret = priceOf(fares.find((f) => f.pass && f.pass.returnJourney));
      const monthly = priceOf(fares.find((f) => f.pass && f.pass.validityPeriod));
      const loc = (toll.tollCollectionLocations || [])[0] || {};
      total += Number(single) || 0;
      tolls.push({
        name: loc.name || toll.tollSystem || 'Unknown',
        lat: loc.location?.lat ?? null,
        lng: loc.location?.lng ?? null,
        single,
        ret,
        monthly,
        system: toll.tollSystem || null
      });
    }
  }
  return { total, tolls };
}

async function main() {
  if (!API_KEY) {
    console.error('Set HERE_API_KEY. Get a free key at https://platform.here.com (Freemium plan).');
    process.exit(1);
  }
  const only = process.argv.includes('--case') ? process.argv[process.argv.indexOf('--case') + 1] : null;
  const cases = only ? CASES.filter((c) => c.id === only) : CASES;

  for (const c of cases) {
    console.log(`\n=== ${c.id}: ${c.label} ===`);
    console.log(`  via: ${(c.via || []).map((v) => v.name).join(' -> ') || '(none)'}`);
    const show = (dir, r) => {
      console.log(`  Direction ${dir}: single-fare total Rs.${r.total}`);
      r.tolls.forEach((t) =>
        console.log(`    - ${t.name} @ ${t.lat},${t.lng}: single=Rs.${t.single} return=Rs.${t.ret ?? '-'} monthly=Rs.${t.monthly ?? '-'}`)
      );
    };
    try {
      const a = await runDirection(c.origin, c.destination, c.via);
      show('A', a);
      const b = await runDirection(c.destination, c.origin, [...(c.via || [])].reverse());
      show('B', b);
      console.log(`  -> ${a.tolls.length} plaza(s) A / ${b.tolls.length} B; A total Rs.${a.total} vs B total Rs.${b.total}`);
    } catch (err) {
      console.error(`  ! failed: ${err.message}`);
    }
  }
  console.log('\nKey question: does the mumbai-pune case split Khalapur(80)/Urse(240), or flatten to ~320?');
}

if (require.main === module) {
  main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
}
