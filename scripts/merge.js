const fs = require('fs');
const path = require('path');

/**
 * Apply a hand-curated authoritative rate correction to a plaza, in place.
 * Used for closed-loop / ticket-system expressways where routing APIs report the wrong
 * per-plaza split, and for state-highway operator rate notifications (Rajasthan et al).
 * Overrides only the rate fields listed under `rates`, and stamps provenance
 * (rate_source, rate_source_url, rate_valid_until) plus data_confidence = "verified".
 */
function applyCuratedRates(entry, cur) {
  if (cur.rates) {
    for (const [field, value] of Object.entries(cur.rates)) {
      entry[field] = value;
    }
  }
  entry.data_confidence = 'verified';
  // expressway_rates.json historically uses `source_url`; state_rates files use `rate_source`.
  // Accept either, mapped onto the same output field.
  const source = cur.rate_source || cur.source_url;
  if (source) entry.rate_source = source;
  if (cur.rate_source_url) entry.rate_source_url = cur.rate_source_url;
  if (cur.rate_effective_date) entry.rate_effective_date = cur.rate_effective_date;
  if (cur.rate_valid_until) entry.rate_valid_until = cur.rate_valid_until;
}

/**
 * Load and combine every curated-override source: the single expressway_rates.json file
 * (closed-loop expressways) plus every JSON file under curated/state_rates/ (per-state,
 * per-operator rate notifications). All files share the same keying scheme
 * (`code:<tollplaza_code>` / `id:<tollplaza_id>`) and shape ({ plazas: { ... } }).
 *
 * Precedence when the same plaza key appears in more than one curated file (shouldn't
 * normally happen): the expressway file wins, since it exists specifically to correct
 * closed-loop splits that would otherwise be wrong; a conflict is logged so it can be
 * cleaned up. Within state_rates, first-loaded (alphabetical by filename) wins.
 */
function loadCuratedOverrides(sourcesDir) {
  const curatedDir = path.join(sourcesDir, 'curated');
  const merged = {};
  let fileCount = 0;

  const expresswayFile = path.join(curatedDir, 'expressway_rates.json');
  if (fs.existsSync(expresswayFile)) {
    const plazas = JSON.parse(fs.readFileSync(expresswayFile, 'utf8')).plazas || {};
    Object.assign(merged, plazas);
    fileCount++;
  }

  const stateRatesDir = path.join(curatedDir, 'state_rates');
  if (fs.existsSync(stateRatesDir)) {
    const files = fs.readdirSync(stateRatesDir)
      .filter(f => f.endsWith('.json'))
      .sort();
    for (const f of files) {
      const filePath = path.join(stateRatesDir, f);
      let plazas;
      try {
        plazas = JSON.parse(fs.readFileSync(filePath, 'utf8')).plazas || {};
      } catch (err) {
        console.warn(`Skipping malformed curated file ${f}: ${err.message}`);
        continue;
      }
      for (const [key, value] of Object.entries(plazas)) {
        if (Object.prototype.hasOwnProperty.call(merged, key)) {
          console.warn(`Curated override conflict for ${key} in ${f} — keeping earlier-loaded value`);
          continue;
        }
        merged[key] = value;
      }
      fileCount++;
    }
  }

  return { plazas: merged, fileCount };
}

async function mergeDataSources() {
  try {
    console.log('Merging data sources...');

    const sourcesDir = path.join(__dirname, '../data/sources');
    const nhaiFile = path.join(sourcesDir, 'nhai.json');
    const stateHighwaysFile = path.join(sourcesDir, 'state_highways.json');

    let nhaiPlazas = [];
    let statePlazas = [];

    if (fs.existsSync(nhaiFile)) {
      const content = fs.readFileSync(nhaiFile, 'utf8');
      nhaiPlazas = JSON.parse(content);
      console.log(`Loaded ${nhaiPlazas.length} NHAI plazas`);
    }

    if (fs.existsSync(stateHighwaysFile)) {
      const content = fs.readFileSync(stateHighwaysFile, 'utf8');
      statePlazas = JSON.parse(content);
      console.log(`Loaded ${statePlazas.length} state highway plazas`);
    }

    // Combine datasets
    const combined = [...nhaiPlazas, ...statePlazas];

    // Apply hand-curated authoritative rate corrections: closed-loop expressway per-plaza
    // splits that routing APIs get wrong (expressway_rates.json), plus per-state, per-operator
    // rate notifications (curated/state_rates/*.json). Applied before the directional overlay
    // so any directional ratios compute off the corrected base.
    const { plazas: curated, fileCount } = loadCuratedOverrides(sourcesDir);
    if (fileCount > 0) {
      let corrected = 0;
      for (const entry of combined) {
        const cur =
          (entry.tollplaza_code != null && curated[`code:${entry.tollplaza_code}`]) ||
          (entry.tollplaza_id != null && curated[`id:${entry.tollplaza_id}`]);
        if (cur) {
          applyCuratedRates(entry, cur);
          corrected++;
        }
      }
      console.log(`Applied curated rate corrections to ${corrected} plaza(s) (${Object.keys(curated).length} curated across ${fileCount} file(s))`);
    }

    // Sort by state, then by location (KM marker)
    combined.sort((a, b) => {
      const stateCompare = (a.state_name || '').localeCompare(b.state_name || '');
      if (stateCompare !== 0) return stateCompare;

      // Extract KM from location string if available
      const getKm = (loc) => {
        if (!loc) return 0;
        const match = loc.match(/[\d.]+/);
        return match ? parseFloat(match[0]) : 0;
      };

      return getKm(a.location) - getKm(b.location);
    });

    console.log(`Combined dataset: ${combined.length} total toll plazas`);

    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save merged data (minified only for size optimization)
    const latestFile = path.join(dataDir, 'latest.json');
    
    // Minified version for size optimization and direct API access
    fs.writeFileSync(latestFile, JSON.stringify(combined));
    const sizeKb = (fs.statSync(latestFile).size / 1024).toFixed(2);
    console.log(`Saved combined dataset to ${latestFile} (${sizeKb}KB)`);
    
    return combined;
  } catch (error) {
    console.error('Error merging data sources:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  mergeDataSources();
}

module.exports = mergeDataSources;
module.exports.mergeDataSources = mergeDataSources;
module.exports.applyCuratedRates = applyCuratedRates;
