/**
 * Fetch car toll rates for NETC STATE plazas in a given state via TollGuru API.
 *
 *   node scripts/fetchHaryanaTollGuruRates.js
 *   node scripts/fetchHaryanaTollGuruRates.js --state Jharkhand
 *   node scripts/fetchHaryanaTollGuruRates.js --state "West Bengal"
 *   node scripts/fetchHaryanaTollGuruRates.js --dry-run
 *   node scripts/fetchHaryanaTollGuruRates.js --out path/to/output.json
 *   node scripts/fetchStateTollGuruCarRates.js --state Maharashtra --offset 0 --limit 10
 *
 * Default `--state` is Haryana. Output defaults to
 * `data/sources/states/<stateKey>/tollguru_car_tolls.json` (e.g. westbengal for West Bengal).
 * After each plaza, **`tollguru_car_tolls.checkpoint.json`** is written (same folder) so rate limits / Ctrl+C still preserve progress.
 * With `--offset` or `--limit`, default output is
 * `tollguru_car_tolls.offset<N>.limit<M>.json` so batches do not overwrite full runs.
 */

const fs = require('fs');
const path = require('path');

// Configuration for TollGuru API
const TOLLGURU_CONFIG = {
  url: 'https://tollguru.com/api/trpc/calc.getRoutes?batch=1',
  headers: {
    'accept': '*/*',
    'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
    'content-type': 'application/json',
    'origin': 'https://tollguru.com',
    'priority': 'u=1, i',
    'referer': 'https://tollguru.com/toll-calculator-india',
    'sec-ch-ua': '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36',
    'x-trpc-source': 'react'
  },
  vehicle: '2AxlesAuto',
  rateLimitMs: 2000,
  timeoutMs: 10000
};

function stateKey(s) {
  return String(s || '')
    .replace(/\s+/g, '')
    .toLowerCase();
}

// CLI argument parsing
function parseArgs(argv) {
  const args = {
    dryRun: false,
    outPath: null,
    optimized: true,
    state: 'Haryana',
    offset: 0,
    limit: null
  };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dry-run') {
      args.dryRun = true;
    } else if (argv[i] === '--out' && argv[i + 1]) {
      args.outPath = path.resolve(argv[++i]);
    } else if (argv[i] === '--no-optimize') {
      args.optimized = false;
    } else if (argv[i] === '--state' && argv[i + 1]) {
      args.state = argv[++i].trim();
    } else if (argv[i] === '--offset' && argv[i + 1]) {
      const n = parseInt(argv[++i], 10);
      args.offset = Number.isFinite(n) && n >= 0 ? n : 0;
    } else if (argv[i] === '--limit' && argv[i + 1]) {
      const n = parseInt(argv[++i], 10);
      args.limit = Number.isFinite(n) && n > 0 ? n : null;
    }
  }
  return args;
}

function defaultTollGuruOutPath(root, slug, args) {
  const dir = path.join(root, 'data/sources/states', slug);
  if (args.offset > 0 || args.limit != null) {
    const lim = args.limit == null ? 'all' : String(args.limit);
    return path.join(dir, `tollguru_car_tolls.offset${args.offset}.limit${lim}.json`);
  }
  return path.join(dir, 'tollguru_car_tolls.json');
}

// Generate lat/lng coordinates offset from target point
function moveLatLng(lat, lng, distanceKm, bearingDegrees) {
  const R = 6371; // Earth's radius in km
  const bearingRad = bearingDegrees * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  const lngRad = lng * Math.PI / 180;
  
  const newLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(distanceKm / R) +
    Math.cos(latRad) * Math.sin(distanceKm / R) * Math.cos(bearingRad)
  );
  
  const newLngRad = lngRad + Math.atan2(
    Math.sin(bearingRad) * Math.sin(distanceKm / R) * Math.cos(latRad),
    Math.cos(distanceKm / R) - Math.sin(latRad) * Math.sin(newLatRad)
  );
  
  return {
    lat: newLatRad * 180 / Math.PI,
    lng: newLngRad * 180 / Math.PI
  };
}

// Smart route generation based on learned success patterns
function generateRouteAttempts(targetLat, targetLng, offsetKm = 0.5, priorityBearing = null) {
  // Learned success patterns from Haryana analysis:
  // 0° (North-South): 83% of successes (5/6 plazas)
  // 135° (SE-NW): 17% of successes (1/6 plazas)
  
  let bearings;
  
  if (priorityBearing !== null) {
    // Use specific priority bearing first
    bearings = [priorityBearing];
  } else {
    // Use learned optimal order: North-South first (highest success), then others
    bearings = [
      0,    // North-South (HIGHEST SUCCESS - 83%)
      135,  // Southeast-Northwest (SECONDARY SUCCESS - 17%)
      90,   // East-West
      45    // Northeast-Southwest (lowest priority)
    ];
  }
  
  const routes = [];
  
  for (const bearing of bearings) {
    const oppositeBearing = (bearing + 180) % 360;
    
    const from = moveLatLng(parseFloat(targetLat), parseFloat(targetLng), offsetKm, oppositeBearing);
    const to = moveLatLng(parseFloat(targetLat), parseFloat(targetLng), offsetKm, bearing);
    
    routes.push({
      from,
      to,
      bearing: bearing,
      description: getBearingDescription(bearing),
      priority: bearing === 0 ? 'HIGH' : bearing === 135 ? 'MEDIUM' : 'LOW'
    });
  }
  
  return routes;
}

// Get description for bearing direction
function getBearingDescription(bearing) {
  const directions = {
    0: 'North-South',
    45: 'Northeast-Southwest',
    90: 'East-West',
    135: 'Southeast-Northwest'
  };
  return directions[bearing] || `${bearing}°`;
}

// Store and load successful route patterns for reuse across states
function saveSuccessfulPattern(state, plazaCode, bearing, coordinates, tollAmount) {
  const pattern = {
    state: state,
    plaza_code: plazaCode,
    successful_bearing: bearing,
    coordinates: coordinates,
    toll_amount: tollAmount,
    learned_at: new Date().toISOString()
  };
  
  // This could be expanded to save to a patterns file
  return pattern;
}

// Predict best bearing for a plaza based on learned patterns
function predictBestBearing(state, coordinates) {
  // For now, use learned Haryana patterns as baseline for all states
  // Future: load from saved patterns file
  
  const statePatterns = {
    'haryana': {
      primary_bearing: 0,    // North-South: 83% success
      secondary_bearing: 135, // SE-NW: 17% success
      success_rate: 0.375
    }
  };
  
  const pattern = statePatterns[state.toLowerCase()] || statePatterns['haryana'];
  
  return {
    primary: pattern.primary_bearing,
    secondary: pattern.secondary_bearing,
    confidence: pattern.success_rate
  };
}

// Generate route coordinates that pass through target plaza (single attempt)
function generateRouteThrough(targetLat, targetLng, offsetKm = 0.5, bearing = null) {
  // If no bearing specified, use North-South as default (most common for highways)
  if (bearing === null) {
    bearing = 0;
  }
  
  const oppositeBearing = (bearing + 180) % 360;
  
  const from = moveLatLng(parseFloat(targetLat), parseFloat(targetLng), offsetKm, oppositeBearing);
  const to = moveLatLng(parseFloat(targetLat), parseFloat(targetLng), offsetKm, bearing);
  
  return { from, to };
}

// Sleep utility for rate limiting
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Call TollGuru API with generated route
async function callTollGuruAPI(route, vehicleType = '2AxlesAuto') {
  const payload = {
    "0": {
      "json": {
        "from": route.from,
        "to": route.to,
        "waypoints": [],
        "tags": [],
        "returnFloats": true,
        "departureTime": new Date().toISOString(),
        "units": {"currency": "INR"},
        "vehicle": {"type": vehicleType},
        "directionsFlag": true,
        "optimizeWaypoints": false,
        "applyHazmatRestriction": false,
        "serviceProvider": "gmaps"
      }
    }
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TOLLGURU_CONFIG.timeoutMs);

  try {
    const response = await fetch(TOLLGURU_CONFIG.url, {
      method: 'POST',
      headers: TOLLGURU_CONFIG.headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Extract toll amount from TollGuru API response
function extractCarToll(apiResponse) {
  try {
    // Navigate the TollGuru response structure to find toll data
    const result = apiResponse?.[0]?.result;
    if (!result || !result.data || !result.data.json) {
      return { amount: 0, summary: 'No result data' };
    }

    const jsonData = result.data.json;
    const routes = jsonData.routes;
    
    if (!routes || routes.length === 0) {
      return { amount: 0, summary: 'No routes found' };
    }

    // Look for toll information in the first route
    const route = routes[0];
    const tolls = route.tolls || [];
    const hasTolls = route.summary?.hasTolls || false;
    const distance = route.summary?.distance?.value || 0;
    const distanceKm = Math.round(distance / 1000 * 10) / 10; // Convert meters to km, round to 1 decimal
    
    if (tolls.length === 0 || !hasTolls) {
      return { 
        amount: 0, 
        summary: hasTolls ? 'Route has tolls but no details found' : 'No tolls on route',
        distance: distanceKm,
        hasTolls: hasTolls
      };
    }

    // Extract route-level total costs (preferred method)
    const routeCosts = route.costs || {};
    const totalTagCost = routeCosts.tag || routeCosts.tagAndCash || 0;
    const totalCashCost = routeCosts.cash || 0;
    
    // Use FasTag cost as primary, fall back to cash cost
    let totalToll = totalTagCost || totalCashCost;
    
    // Extract individual toll details
    const tollDetails = [];
    
    for (const toll of tolls) {
      // Check different cost fields in order of preference
      const tagCost = toll.tagCost || toll.tagPriCost || 0;
      const cashCost = toll.cashCost || 0;
      const cost = tagCost || cashCost || 0;
      
      tollDetails.push({
        name: toll.name || 'Unknown',
        cost: cost,
        currency: toll.currency || 'INR',
        tagCost: tagCost,
        cashCost: cashCost,
        tollType: toll.type || 'barrier'
      });
    }

    return {
      amount: totalToll,
      summary: `${tolls.length} toll(s) found`,
      distance: distanceKm,
      hasTolls: hasTolls,
      tollDetails: tollDetails,
      routeCosts: {
        tag: totalTagCost,
        cash: totalCashCost,
        currency: route.costs?.currency || 'INR'
      }
    };

  } catch (error) {
    return { 
      amount: 0, 
      summary: `Parse error: ${error.message}`,
      error: error.message
    };
  }
}

// Main extraction function
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const root = path.join(__dirname, '..');
  const sourcePath = path.join(root, 'data/sources/netc/netc_state_plazas.json');

  const targetKey = stateKey(args.state);
  const slug = targetKey;
  const outPath = args.outPath || defaultTollGuruOutPath(root, slug, args);
  const checkpointPath = outPath.replace(/\.json$/i, '.checkpoint.json');

  console.error('Loading NETC state plazas data...');
  const netcData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const allPlazas = netcData.plazas || [];

  const statePlazas = allPlazas.filter(
    (plaza) => stateKey(plaza.state_name) === targetKey
  );

  console.error(
    `Found ${statePlazas.length} STATE plazas for --state ${args.state} (match key: ${targetKey})`
  );

  if (statePlazas.length === 0) {
    console.error(`No plazas found for state "${args.state}". Use NETC spelling (e.g. WestBengal or "West Bengal").`);
    process.exit(1);
  }

  let validPlazas = statePlazas.filter((plaza) => 
    plaza.latitude && plaza.longitude && 
    !isNaN(parseFloat(plaza.latitude)) && !isNaN(parseFloat(plaza.longitude))
  );

  validPlazas.sort((a, b) =>
    String(a.netc_plaza_code).localeCompare(String(b.netc_plaza_code), undefined, { numeric: true })
  );

  const totalValidInState = validPlazas.length;
  const off = args.offset;
  const lim = args.limit;
  const batchPlazas =
    lim == null ? validPlazas.slice(off) : validPlazas.slice(off, off + lim);
  validPlazas = batchPlazas;

  console.error(`${totalValidInState} plazas have valid coordinates (state-wide)`);
  if (off > 0 || lim != null) {
    console.error(
      `Batch: offset=${off} limit=${lim == null ? 'all' : lim} → processing ${validPlazas.length} plazas`
    );
  }

  if (validPlazas.length === 0) {
    console.error('No plazas in this batch (check --offset / --limit).');
    process.exit(1);
  }

  if (args.dryRun) {
    console.error('Dry run mode - would process:');
    validPlazas.forEach((plaza, i) => {
      console.error(`  ${i + 1}. ${plaza.plaza_name} (${plaza.netc_plaza_code}) - ${plaza.latitude},${plaza.longitude}`);
    });
    console.error(`Output would go to: ${outPath}`);
    return;
  }

  // Process each plaza
  const results = [];
  const startTime = Date.now();

  function writeCheckpointPartial() {
    const successfulExtractions = results.filter((r) => r.success && r.toll_amount_inr > 0).length;
    const payload = {
      source: {
        description: `TollGuru car toll extraction for ${args.state} STATE plazas (CHECKPOINT — incomplete if aborted)`,
        output_file: path.relative(root, outPath),
        checkpoint_file: path.relative(root, checkpointPath),
        input_file: path.relative(root, sourcePath),
        extracted_at: new Date().toISOString(),
        extractor: 'scripts/fetchStateTollGuruCarRates.js',
        api: 'TollGuru reverse-engineered API',
      },
      extraction_metadata: {
        state: args.state,
        vehicle_type: TOLLGURU_CONFIG.vehicle,
        incomplete_run: results.length < validPlazas.length,
        plazas_completed: results.length,
        plazas_total_this_batch: validPlazas.length,
        successful_extractions_so_far: successfulExtractions,
        batch_offset: off,
        batch_limit: lim,
        rate_limit_delay_ms: TOLLGURU_CONFIG.rateLimitMs,
      },
      plazas: results,
    };
    fs.mkdirSync(path.dirname(checkpointPath), { recursive: true });
    fs.writeFileSync(checkpointPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
    console.error(`  [checkpoint] ${results.length}/${validPlazas.length} plazas → ${checkpointPath}`);
  }

  for (let i = 0; i < validPlazas.length; i++) {
    const plaza = validPlazas[i];
    const plazaStartTime = Date.now();
    
    console.error(`Processing ${i + 1}/${validPlazas.length}: ${plaza.plaza_name} (${plaza.netc_plaza_code})`);

    try {
      let bestResult = null;
      let allAttempts = [];
      
      // Smart bearing prediction based on learned patterns
      const prediction = predictBestBearing(slug, [plaza.latitude, plaza.longitude]);
      
      // Try primary bearing first (North-South has 83% success rate)
      console.error(`  → Trying primary bearing: ${prediction.primary}° (${getBearingDescription(prediction.primary)}) - confidence: ${(prediction.confidence * 100).toFixed(1)}%`);
      
      const primaryRoute = generateRouteAttempts(plaza.latitude, plaza.longitude, 0.5, prediction.primary)[0];
      
      try {
        // Call TollGuru API for primary bearing
        const apiResponse = await callTollGuruAPI(primaryRoute, TOLLGURU_CONFIG.vehicle);
        const tollData = extractCarToll(apiResponse);
        
        // Store attempt details
        const attemptResult = {
          route_bearing: primaryRoute.bearing,
          route_description: primaryRoute.description,
          route_priority: primaryRoute.priority,
          route_coordinates: { from: primaryRoute.from, to: primaryRoute.to },
          toll_amount: tollData.amount,
          total_tolls_found: tollData.tollDetails ? tollData.tollDetails.length : 0,
          distance_km: tollData.distance || 0,
          summary: tollData.summary,
          toll_details: tollData.tollDetails || []
        };
        
        allAttempts.push(attemptResult);
        
        // If primary bearing succeeds, use it (saves 3 API calls!)
        if (tollData.amount > 0 || (tollData.tollDetails && tollData.tollDetails.length > 0)) {
          bestResult = {
            netc_plaza_code: plaza.netc_plaza_code,
            plaza_name: plaza.plaza_name,
            coordinates: [plaza.latitude, plaza.longitude],
            concessionaire_name: plaza.concessionaire_name,
            toll_amount_inr: tollData.amount,
            route_generated: { from: primaryRoute.from, to: primaryRoute.to },
            route_bearing: primaryRoute.bearing,
            route_description: primaryRoute.description,
            route_priority: primaryRoute.priority,
            api_response_summary: {
              total_tolls_found: tollData.tollDetails ? tollData.tollDetails.length : 0,
              route_distance_km: tollData.distance || 0,
              summary: tollData.summary
            },
            toll_details: tollData.tollDetails || [],
            success: tollData.amount > 0,
            extracted_at: new Date().toISOString(),
            processing_time_ms: Date.now() - plazaStartTime,
            route_attempts: allAttempts,
            api_calls_saved: 3 // Would have made 4 calls, only made 1
          };
          
          console.error(`  ✅ PRIMARY SUCCESS: ₹${tollData.amount} (${tollData.summary}) - saved 3 API calls!`);
        } else {
          console.error(`  ❌ Primary failed, trying fallback bearings...`);
          
          // If primary fails, try remaining bearings
          const fallbackRoutes = generateRouteAttempts(plaza.latitude, plaza.longitude, 0.5).slice(1);
          
          for (let attemptIndex = 0; attemptIndex < fallbackRoutes.length; attemptIndex++) {
            const route = fallbackRoutes[attemptIndex];
            
            try {
              // Rate limiting between attempts
              await sleep(1000);
              
              const apiResponse = await callTollGuruAPI(route, TOLLGURU_CONFIG.vehicle);
              const tollData = extractCarToll(apiResponse);
              
              const attemptResult = {
                route_bearing: route.bearing,
                route_description: route.description,
                route_priority: route.priority,
                route_coordinates: { from: route.from, to: route.to },
                toll_amount: tollData.amount,
                total_tolls_found: tollData.tollDetails ? tollData.tollDetails.length : 0,
                distance_km: tollData.distance || 0,
                summary: tollData.summary,
                toll_details: tollData.tollDetails || []
              };
              
              allAttempts.push(attemptResult);
              
              // If we found tolls, use this as the best result
              if (tollData.amount > 0 || (tollData.tollDetails && tollData.tollDetails.length > 0)) {
                bestResult = {
                  netc_plaza_code: plaza.netc_plaza_code,
                  plaza_name: plaza.plaza_name,
                  coordinates: [plaza.latitude, plaza.longitude],
                  concessionaire_name: plaza.concessionaire_name,
                  toll_amount_inr: tollData.amount,
                  route_generated: { from: route.from, to: route.to },
                  route_bearing: route.bearing,
                  route_description: route.description,
                  route_priority: route.priority,
                  api_response_summary: {
                    total_tolls_found: tollData.tollDetails ? tollData.tollDetails.length : 0,
                    route_distance_km: tollData.distance || 0,
                    summary: tollData.summary
                  },
                  toll_details: tollData.tollDetails || [],
                  success: tollData.amount > 0,
                  extracted_at: new Date().toISOString(),
                  processing_time_ms: Date.now() - plazaStartTime,
                  route_attempts: allAttempts,
                  api_calls_saved: 3 - attemptIndex
                };
                
                console.error(`  ✓ Found toll on fallback attempt ${attemptIndex + 2} (${route.description}): ₹${tollData.amount} (${tollData.summary})`);
                break; // Stop trying other directions once we find tolls
              }
              
            } catch (attemptError) {
              console.error(`  ! Route attempt ${attemptIndex + 2} (${route.description}) failed: ${attemptError.message}`);
              allAttempts.push({
                route_bearing: route.bearing,
                route_description: route.description,
                route_priority: route.priority,
                error: attemptError.message
              });
            }
          }
        }
        
      } catch (primaryError) {
        console.error(`  ! Primary bearing failed: ${primaryError.message}`);
        allAttempts.push({
          route_bearing: primaryRoute.bearing,
          route_description: primaryRoute.description,
          route_priority: primaryRoute.priority,
          error: primaryError.message
        });
      }
      
      // If no successful result found, use the first attempt as baseline
      if (!bestResult) {
        const firstAttempt = allAttempts[0] || {};
        const route = primaryRoute;
        
        bestResult = {
          netc_plaza_code: plaza.netc_plaza_code,
          plaza_name: plaza.plaza_name,
          coordinates: [plaza.latitude, plaza.longitude],
          concessionaire_name: plaza.concessionaire_name,
          toll_amount_inr: firstAttempt.toll_amount || 0,
          route_generated: route ? { from: route.from, to: route.to } : null,
          route_bearing: route ? route.bearing : null,
          route_description: route ? route.description : null,
          api_response_summary: {
            total_tolls_found: firstAttempt.total_tolls_found || 0,
            route_distance_km: firstAttempt.distance_km || 0,
            summary: firstAttempt.summary || 'All route attempts failed'
          },
          toll_details: firstAttempt.toll_details || [],
          success: false,
          extracted_at: new Date().toISOString(),
          processing_time_ms: Date.now() - plazaStartTime,
          route_attempts: allAttempts
        };
        
        console.error(`  ✗ No tolls found in any direction (tried ${allAttempts.length} routes)`);
      }

      results.push(bestResult);

    } catch (error) {
      console.error(`  ✗ API error: ${error.message}`);
      
      results.push({
        netc_plaza_code: plaza.netc_plaza_code,
        plaza_name: plaza.plaza_name,
        coordinates: [plaza.latitude, plaza.longitude],
        concessionaire_name: plaza.concessionaire_name,
        toll_amount_inr: 0,
        success: false,
        error: error.message,
        extracted_at: new Date().toISOString(),
        processing_time_ms: Date.now() - plazaStartTime
      });
    }

    writeCheckpointPartial();

    // Rate limiting (except for last request)
    if (i < validPlazas.length - 1) {
      await sleep(TOLLGURU_CONFIG.rateLimitMs);
    }
  }

  // Generate summary statistics
  const successfulExtractions = results.filter(r => r.success && r.toll_amount_inr > 0).length;
  const hitRate = successfulExtractions / validPlazas.length;
  const totalProcessingTime = Date.now() - startTime;
  const averageProcessingTime = totalProcessingTime / validPlazas.length;

  // Create output structure following project patterns
  const output = {
    source: {
      description: `TollGuru car toll extraction for ${args.state} STATE plazas`,
      output_file: path.relative(root, outPath),
      input_file: path.relative(root, sourcePath),
      extracted_at: new Date().toISOString(),
      extractor: 'scripts/fetchStateTollGuruCarRates.js',
      api: 'TollGuru reverse-engineered API'
    },
    extraction_metadata: {
      state: args.state,
      vehicle_type: TOLLGURU_CONFIG.vehicle,
      total_plazas: validPlazas.length,
      total_plazas_in_state_with_coords: totalValidInState,
      batch_offset: off,
      batch_limit: lim,
      successful_extractions: successfulExtractions,
      hit_rate: parseFloat(hitRate.toFixed(3)),
      rate_limit_delay_ms: TOLLGURU_CONFIG.rateLimitMs,
      total_processing_time_ms: totalProcessingTime,
      average_processing_time_ms: Math.round(averageProcessingTime)
    },
    plazas: results
  };

  // Write output file
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2) + '\n', 'utf8');
  try {
    if (fs.existsSync(checkpointPath)) fs.unlinkSync(checkpointPath);
  } catch (_) {
    /* ignore */
  }

  // Summary report
  console.error('\n=== EXTRACTION SUMMARY ===');
  console.error(`Total plazas processed: ${validPlazas.length}`);
  console.error(`Successful extractions: ${successfulExtractions}`);
  console.error(`Hit rate: ${(hitRate * 100).toFixed(1)}%`);
  console.error(`Total processing time: ${(totalProcessingTime / 1000).toFixed(1)}s`);
  console.error(`Output written to: ${outPath}`);

  if (successfulExtractions > 0) {
    const tollAmounts = results.filter(r => r.toll_amount_inr > 0).map(r => r.toll_amount_inr);
    const minToll = Math.min(...tollAmounts);
    const maxToll = Math.max(...tollAmounts);
    const avgToll = tollAmounts.reduce((a, b) => a + b, 0) / tollAmounts.length;
    
    console.error(`Toll amount range: ₹${minToll} - ₹${maxToll} (avg: ₹${avgToll.toFixed(0)})`);
  }
}

// Export functions for testing
module.exports = {
  generateRouteThrough,
  generateRouteAttempts,
  callTollGuruAPI,
  extractCarToll,
  parseArgs,
  moveLatLng,
  getBearingDescription,
  predictBestBearing,
  saveSuccessfulPattern,
  stateKey
};

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}