/**
 * Collect all individual state highway files into the main state_highways.json
 * 
 * Reads from data/sources/states/star/state_highways.json
 * Writes to data/sources/state_highways.json
 * 
 * Usage:
 *   node scripts/collectStateHighways.js
 */

const fs = require('fs');
const path = require('path');

async function collectStateHighways() {
  try {
    console.log('Collecting state highway data from individual state files...');

    const sourcesDir = path.join(__dirname, '../data/sources');
    const statesDir = path.join(sourcesDir, 'states');
    const outputFile = path.join(sourcesDir, 'state_highways.json');

    // Ensure sources directory exists
    if (!fs.existsSync(sourcesDir)) {
      fs.mkdirSync(sourcesDir, { recursive: true });
    }

    let allStatePlazas = [];
    let stateCount = 0;

    // Check if states directory exists
    if (!fs.existsSync(statesDir)) {
      console.log('No states directory found. Creating empty state_highways.json');
      fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
      return [];
    }

    // Get all state subdirectories
    const stateDirectories = fs.readdirSync(statesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    console.log(`Found ${stateDirectories.length} state directories`);

    // Process each state
    for (const stateName of stateDirectories) {
      const stateFile = path.join(statesDir, stateName, 'state_highways.json');
      
      if (fs.existsSync(stateFile)) {
        try {
          const content = fs.readFileSync(stateFile, 'utf8');
          const statePlazas = JSON.parse(content);
          
          if (Array.isArray(statePlazas) && statePlazas.length > 0) {
            // Add state metadata if missing
            const processedPlazas = statePlazas.map(plaza => ({
              ...plaza,
              data_source: plaza.data_source || 'state',
              data_confidence: plaza.data_confidence || 'partial'
            }));
            
            allStatePlazas.push(...processedPlazas);
            console.log(`  ${stateName}: ${statePlazas.length} plazas`);
            stateCount++;
          } else {
            console.log(`  ${stateName}: empty or invalid JSON`);
          }
        } catch (error) {
          console.error(`  ${stateName}: failed to parse JSON - ${error.message}`);
        }
      } else {
        console.log(`  ${stateName}: no state_highways.json file`);
      }
    }

    // Sort by state name, then by tollplaza_id for consistency
    allStatePlazas.sort((a, b) => {
      const stateCompare = (a.state_name || '').localeCompare(b.state_name || '');
      if (stateCompare !== 0) return stateCompare;
      
      return (a.tollplaza_id || 0) - (b.tollplaza_id || 0);
    });

    // Remove duplicates by tollplaza_id (keep first occurrence)
    const uniquePlazas = [];
    const seenIds = new Set();
    
    for (const plaza of allStatePlazas) {
      if (!seenIds.has(plaza.tollplaza_id)) {
        uniquePlazas.push(plaza);
        seenIds.add(plaza.tollplaza_id);
      } else {
        console.log(`  Duplicate plaza ID ${plaza.tollplaza_id} (${plaza.tollplaza_name}) - skipping`);
      }
    }

    // Write collected data
    fs.writeFileSync(outputFile, JSON.stringify(uniquePlazas, null, 2));
    
    const fileSize = (fs.statSync(outputFile).size / 1024).toFixed(2);
    console.log(`\n✓ Collected ${uniquePlazas.length} state highway plazas from ${stateCount} states`);
    console.log(`✓ Saved to ${outputFile} (${fileSize}KB)`);
    
    if (uniquePlazas.length !== allStatePlazas.length) {
      console.log(`ℹ Removed ${allStatePlazas.length - uniquePlazas.length} duplicate entries`);
    }

    return uniquePlazas;
  } catch (error) {
    console.error('Error collecting state highway data:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  collectStateHighways();
}

module.exports = collectStateHighways;