const fs = require('fs');
const path = require('path');

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

    // Save merged data (both prettified and minified)
    const latestFile = path.join(dataDir, 'latest.json');
    const latestMinFile = path.join(dataDir, 'latest.min.json');
    
    // Prettified version for readability
    fs.writeFileSync(latestFile, JSON.stringify(combined, null, 2));
    console.log(`Saved combined dataset to ${latestFile}`);
    
    // Minified version for size optimization and raw API access
    fs.writeFileSync(latestMinFile, JSON.stringify(combined));
    const prettySizeKb = (fs.statSync(latestFile).size / 1024).toFixed(2);
    const minSizeKb = (fs.statSync(latestMinFile).size / 1024).toFixed(2);
    console.log(`Prettified: ${prettySizeKb}KB | Minified: ${minSizeKb}KB (${((1 - minSizeKb/prettySizeKb) * 100).toFixed(1)}% smaller)`);
    
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
