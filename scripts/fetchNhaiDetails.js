const fs = require('fs');
const path = require('path');
const rateLimiter = require('./rateLimiter');
const { makeRequest } = require('./httpClient');

const API_URL = 'https://rajmargyatra.nhai.gov.in/nhai/api/getTollplazaDetails';

const headers = {
  'accept': 'application/json, text/plain, */*',
  'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
  'content-type': 'application/json',
  'origin': 'https://rajmargyatra.nhai.gov.in',
  'priority': 'u=1, i',
  'referer': 'https://rajmargyatra.nhai.gov.in/ataglance',
  'sec-ch-ua': '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
  'sec-ch-ua-mobile': '?1',
  'sec-ch-ua-platform': '"Android"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'user-agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36'
};

async function fetchTollplazaDetails(plazas) {
  try {
    console.log(`Fetching details for ${plazas.length} toll plazas...`);

    const detailedPlazas = [];
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < plazas.length; i++) {
      const plaza = plazas[i];
      
      try {
        const result = await rateLimiter.request(async () => {
          return await makeRequest(
            API_URL,
            'POST',
            { tollplaza_id: plaza.tollplaza_id },
            headers
          );
        });

        if (result.resultCode === 200 && result.payload && result.payload.length > 0) {
          detailedPlazas.push(result.payload[0]);
          successCount++;
          
          if ((i + 1) % 50 === 0) {
            console.log(`Progress: ${i + 1}/${plazas.length} plazas fetched`);
          }
        }
      } catch (error) {
        errorCount++;
        console.warn(`Error fetching details for plaza ${plaza.tollplaza_id}: ${error.message}`);
      }
    }

    console.log(`Completed: ${successCount} successful, ${errorCount} errors`);

    // Save raw details
    const rawFile = path.join(__dirname, '../data/sources/.temp_raw_details.json');
    fs.writeFileSync(rawFile, JSON.stringify(detailedPlazas, null, 2));

    return detailedPlazas;
  } catch (error) {
    console.error('Error in fetch details process:', error.message);
    process.exit(1);
  }
}

async function main() {
  try {
    const plazasListFile = path.join(__dirname, '../data/sources/.temp_plazas_list.json');
    if (!fs.existsSync(plazasListFile)) {
      throw new Error('Plazas list file not found. Run fetchNhaiTollplazas.js first');
    }

    const plazas = JSON.parse(fs.readFileSync(plazasListFile, 'utf8'));
    await fetchTollplazaDetails(plazas);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = fetchTollplazaDetails;
