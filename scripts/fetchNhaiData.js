const httpClient = require('./httpClient');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'https://rajmargyatra.nhai.gov.in/nhai/api';
const CONCURRENT_REQUESTS = 5;
const DELAY_BETWEEN_BATCHES = 200;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchTollplazaNames() {
  console.log('Fetching all toll plaza names...');
  console.log(`URL: ${API_BASE_URL}/getTollplazaName`);
  
  try {
    const data = await httpClient.makeRequest(
      `${API_BASE_URL}/getTollplazaName`,
      'POST',
      {},
      {
        'Referer': 'https://rajmargyatra.nhai.gov.in/ataglance'
      }
    );
    
    if (data.resultCode === 200 && data.payload) {
      console.log(`Successfully fetched ${data.payload.length} toll plazas`);
      
      const tempFile = path.join(__dirname, '../data/sources/.temp_plazas_list.json');
      fs.writeFileSync(tempFile, JSON.stringify(data.payload, null, 2));
      
      return data.payload;
    } else {
      throw new Error(`API returned: ${data.resultString || 'Unknown error'}`);
    }
  } catch (error) {
    console.error(`Error fetching toll plaza names: ${error.message}`);
    throw error;
  }
}

async function fetchTollplazaDetail(tollplazaId) {
  try {
    const data = await httpClient.makeRequest(
      `${API_BASE_URL}/getTollplazaDetails`,
      'POST',
      { tollplaza_id: tollplazaId },
      {
        'Referer': 'https://rajmargyatra.nhai.gov.in/ataglance'
      }
    );
    
    if (data.resultCode === 200 && data.payload && data.payload.length > 0) {
      return { success: true, data: data.payload[0] };
    } else {
      return { success: false, error: data.resultString || 'No data' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function fetchAllPlazaDetails(plazas) {
  console.log(`Fetching details for ${plazas.length} toll plazas (${CONCURRENT_REQUESTS} concurrent)...`);
  
  const results = [];
  const errors = [];
  let completed = 0;
  
  for (let i = 0; i < plazas.length; i += CONCURRENT_REQUESTS) {
    const batch = plazas.slice(i, i + CONCURRENT_REQUESTS);
    
    const promises = batch.map(plaza => fetchTollplazaDetail(plaza.tollplaza_id));
    const batchResults = await Promise.all(promises);
    
    for (let j = 0; j < batchResults.length; j++) {
      const result = batchResults[j];
      completed++;
      
      if (result.success) {
        results.push(result.data);
        process.stdout.write('.');
      } else {
        errors.push({ plaza: batch[j].tollplaza_id, error: result.error });
        process.stdout.write('F');
      }
      
      if (completed % 50 === 0) {
        console.log(`\nProgress: ${results.length}/${plazas.length}`);
      }
    }
    
    if (i + CONCURRENT_REQUESTS < plazas.length) {
      await sleep(DELAY_BETWEEN_BATCHES);
    }
  }
  
  console.log(`\n\nCompleted: ${results.length} successful, ${errors.length} errors`);
  
  if (errors.length > 0 && errors.length <= 20) {
    console.log('Failed plazas:');
    errors.forEach(e => {
      console.log(`  - ${e.plaza}: ${e.error}`);
    });
  }

  const rawFile = path.join(__dirname, '../data/sources/.temp_raw_details.json');
  fs.writeFileSync(rawFile, JSON.stringify(results, null, 2));
  
  return results;
}

async function main() {
  try {
    const plazas = await fetchTollplazaNames();
    const details = await fetchAllPlazaDetails(plazas);
    
    console.log(`\nFinal: ${details.length} plazas with details`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { fetchTollplazaNames, fetchAllPlazaDetails };
