const fs = require('fs');
const path = require('path');
const rateLimiter = require('./rateLimiter');
const { makeRequest } = require('./httpClient');

const API_URL = 'https://rajmargyatra.nhai.gov.in/nhai/api/getTollplazaName';

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

async function fetchTollplazaNames() {
  try {
    console.log('Fetching all toll plaza names...');
    console.log(`URL: ${API_URL}`);
    
    const result = await rateLimiter.request(async () => {
      return await makeRequest(API_URL, 'POST', {}, headers);
    });

    if (result.resultCode !== 200) {
      throw new Error(`API returned error: ${result.resultString}`);
    }

    const plazas = result.payload || [];
    console.log(`Successfully fetched ${plazas.length} toll plazas`);

    // Save to temporary file
    const tempFile = path.join(__dirname, '../data/sources/.temp_plazas_list.json');
    fs.writeFileSync(tempFile, JSON.stringify(plazas, null, 2));

    return plazas;
  } catch (error) {
    console.error('Error fetching toll plaza names:', error.message);
    if (error.statusCode === 403) {
      console.error('403 Forbidden: The API may be blocking requests. Possible causes:');
      console.error('  - Rate limiting enforced by server');
      console.error('  - IP blocking by server');
      console.error('  - Request headers not matching expected format');
      console.error('  - CORS policy rejection');
      console.error('\nTry:');
      console.error('  - Increase delay in config/rate-limit.json');
      console.error('  - Run from a browser context or proxy');
      console.error('  - Check if API requires authentication');
    }
    process.exit(1);
  }
}

if (require.main === module) {
  fetchTollplazaNames();
}

module.exports = fetchTollplazaNames;
