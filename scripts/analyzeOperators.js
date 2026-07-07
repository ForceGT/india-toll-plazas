/**
 * Analyze operator/concessionaire concentration for a state's highway plazas and emit a
 * hand-curatable worklist.
 *
 * Rationale (see FORCEGT plan, Phase 1): state-highway rate curation doesn't scale per-plaza,
 * but it does scale per-operator — a handful of concessionaires typically run most of a
 * state's plazas, and each publishes one rate notification covering dozens of them. This
 * script ranks operators by plaza count so curation effort can be spent top-down.
 *
 *   node scripts/analyzeOperators.js --state rajasthan
 *   node scripts/analyzeOperators.js --state maharashtra --out path/to/output.json
 *
 * Input:
 *   - data/sources/netc/netc_state_plazas.json   (authoritative concessionaire_name per plaza)
 *   - data/sources/states/<state>/state_highways.json  (per-state scaffold; stable plaza keys)
 *
 * Output (default data/sources/states/<state>/operator_worklist.json):
 *   operators ranked by plaza count descending, with running cumulative coverage % and a
 *   `curation_status` field ("not_started") meant to be hand-updated as each operator's rate
 *   notification gets located and curated into data/sources/curated/state_rates/.
 */

const fs = require('fs');
const path = require('path');

// Same normalization used elsewhere in this repo (fetchStateTollGuruCarRates.js) so
// `--state` slugs line up with the data/sources/states/<slug>/ directory names and with
// netc_state_plazas.json's state_name field.
function stateKey(s) {
  return String(s || '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

// Normalize an operator/concessionaire name for grouping: trim, collapse internal whitespace,
// compare case-insensitively — but keep the first-seen trimmed form as the canonical display
// name (rather than forcing upper/lower case that wouldn't match how it appears in the
// notification a human will later go find).
function normalizeOperatorName(raw) {
  const display = String(raw || '').replace(/\s+/g, ' ').trim();
  const key = display.toLowerCase();
  return { key, display };
}

function parseArgs(argv) {
  const args = { state: null, outPath: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--state' && argv[i + 1]) {
      args.state = argv[++i].trim();
    } else if (argv[i] === '--out' && argv[i + 1]) {
      args.outPath = path.resolve(argv[++i]);
    }
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.state) {
    console.error('Usage: node scripts/analyzeOperators.js --state <stateKey> [--out path/to/output.json]');
    console.error('Example: node scripts/analyzeOperators.js --state rajasthan');
    process.exit(1);
  }

  const slug = stateKey(args.state);
  const root = path.join(__dirname, '..');
  const netcFile = path.join(root, 'data/sources/netc/netc_state_plazas.json');
  const scaffoldFile = path.join(root, 'data/sources/states', slug, 'state_highways.json');
  const outPath = args.outPath || path.join(root, 'data/sources/states', slug, 'operator_worklist.json');

  if (!fs.existsSync(scaffoldFile)) {
    console.error(`No scaffold found at ${path.relative(root, scaffoldFile)}. Is "${args.state}" a valid state slug under data/sources/states/?`);
    process.exit(1);
  }
  if (!fs.existsSync(netcFile)) {
    console.error(`Missing NETC source file: ${path.relative(root, netcFile)}`);
    process.exit(1);
  }

  console.error(`Loading scaffold: ${path.relative(root, scaffoldFile)}`);
  const scaffold = JSON.parse(fs.readFileSync(scaffoldFile, 'utf8'));
  if (!Array.isArray(scaffold) || scaffold.length === 0) {
    console.error(`Scaffold at ${path.relative(root, scaffoldFile)} is empty or not an array — nothing to analyze.`);
    process.exit(1);
  }

  console.error('Loading NETC state plazas data...');
  const netcData = JSON.parse(fs.readFileSync(netcFile, 'utf8'));
  const netcPlazas = netcData.plazas || [];

  // Index NETC plazas by their bare numeric code so scaffold's tollplaza_code (e.g.
  // "NETC536129") can be matched against netc_plaza_code (e.g. "536129").
  const netcByCode = new Map();
  for (const p of netcPlazas) {
    if (p.netc_plaza_code != null) netcByCode.set(String(p.netc_plaza_code), p);
  }

  let matchedFromNetc = 0;
  let fallbackFromScaffold = 0;
  let unassigned = 0;

  const operators = new Map(); // key -> { display, plazas: [] }

  for (const plaza of scaffold) {
    const code = plaza.tollplaza_code;
    const bareCode = code ? String(code).replace(/^NETC/i, '') : null;
    const netcMatch = bareCode ? netcByCode.get(bareCode) : null;

    let operatorRaw;
    if (netcMatch && netcMatch.concessionaire_name) {
      operatorRaw = netcMatch.concessionaire_name;
      matchedFromNetc++;
    } else if (plaza.contractor_name) {
      // Fall back to the scaffold's own contractor_name if this plaza's code isn't found in
      // the current NETC snapshot (e.g. a stale/renamed code). Keeps the script usable even
      // when the two sources have drifted slightly.
      operatorRaw = plaza.contractor_name;
      fallbackFromScaffold++;
    } else {
      operatorRaw = 'Unassigned / Unknown Operator';
      unassigned++;
    }

    const { key, display } = normalizeOperatorName(operatorRaw);
    if (!operators.has(key)) {
      operators.set(key, { display, plazas: [] });
    }
    operators.get(key).plazas.push({
      tollplaza_code: code != null ? code : null,
      tollplaza_id: plaza.tollplaza_id != null ? plaza.tollplaza_id : null,
      tollplaza_name: plaza.tollplaza_name || null
    });
  }

  console.error(
    `Matched ${matchedFromNetc}/${scaffold.length} plazas to a NETC concessionaire_name` +
    (fallbackFromScaffold ? `; ${fallbackFromScaffold} used scaffold contractor_name fallback` : '') +
    (unassigned ? `; ${unassigned} unassigned` : '')
  );

  const totalPlazas = scaffold.length;
  const ranked = Array.from(operators.values()).sort((a, b) => {
    if (b.plazas.length !== a.plazas.length) return b.plazas.length - a.plazas.length;
    return a.display.localeCompare(b.display);
  });

  let cumulative = 0;
  const operatorList = ranked.map((op, i) => {
    cumulative += op.plazas.length;
    return {
      rank: i + 1,
      operator_name: op.display,
      plaza_count: op.plazas.length,
      coverage_pct: round1((op.plazas.length / totalPlazas) * 100),
      cumulative_coverage_pct: round1((cumulative / totalPlazas) * 100),
      plaza_codes: op.plazas.map((p) => p.tollplaza_code).filter((c) => c != null),
      plazas: op.plazas,
      curation_status: 'not_started'
    };
  });

  const output = {
    source: {
      description: `Operator/concessionaire worklist for ${args.state} state-highway plazas`,
      state: args.state,
      state_slug: slug,
      scaffold_file: path.relative(root, scaffoldFile),
      netc_file: path.relative(root, netcFile),
      generated_at: new Date().toISOString(),
      generator: 'scripts/analyzeOperators.js'
    },
    total_plazas: totalPlazas,
    total_operators: operatorList.length,
    operators: operatorList
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n', 'utf8');

  console.error('\n=== OPERATOR WORKLIST SUMMARY ===');
  console.error(`State: ${args.state} (${totalPlazas} plazas, ${operatorList.length} distinct operators)`);
  const topN = Math.min(10, operatorList.length);
  for (let i = 0; i < topN; i++) {
    const op = operatorList[i];
    console.error(
      `  ${op.rank}. ${op.operator_name} — ${op.plaza_count} plazas (${op.coverage_pct}%), cumulative ${op.cumulative_coverage_pct}%`
    );
  }
  console.error(`Output written to: ${outPath}`);
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

module.exports = { parseArgs, stateKey, normalizeOperatorName };

if (require.main === module) {
  main();
}
