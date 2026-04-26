const fs = require('fs');
const path = require('path');
const rateLimiter = require('./rateLimiter');
const { makeRequest } = require('./httpClient');

const API_URL = 'https://rajmargyatra.nhai.gov.in/nhai/api/getStateName';

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

async function getStates() {
  try {
    console.log('Fetching state names...');

    const result = await rateLimiter.request(async () => {
      return await makeRequest(API_URL, 'POST', {}, headers);
    });

    if (result.resultCode !== 200) {
      throw new Error(`API returned error: ${result.resultString}`);
    }

    const states = result.payload || [];
    console.log(`Successfully fetched ${states.length} states`);

    const statesFile = path.join(__dirname, '../data/sources/states.json');
    fs.writeFileSync(statesFile, JSON.stringify(states, null, 2));

    return states;
  } catch (error) {
    console.error('Error fetching states:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  getStates();
}

module.exports = getStates;
