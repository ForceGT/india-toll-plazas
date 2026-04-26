const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class PuppeteerFetcher {
  constructor() {
    this.browser = null;
  }

  async initialize() {
    try {
      console.log('Launching Puppeteer browser...');
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
          '--allow-running-insecure-content'
        ]
      });
      console.log('Browser launched successfully');
    } catch (error) {
      console.error('Failed to launch browser:', error.message);
      throw error;
    }
  }

  async fetchTollplazaNames() {
    const page = await this.browser.newPage();
    
    try {
      console.log('Fetching toll plaza names via browser...');
      
      // Navigate to the actual website first to establish context
      try {
        await page.goto('https://rajmargyatra.nhai.gov.in/ataglance', {
          waitUntil: 'networkidle2',
          timeout: 30000
        }).catch(() => {
          console.log('Note: Could not load page, will try direct fetch anyway');
        });
      } catch (e) {
        console.log('Page load timeout (expected in some environments)');
      }

      // Make direct API call with proper error handling
      const result = await page.evaluate(async () => {
        try {
          const response = await fetch('https://rajmargyatra.nhai.gov.in/nhai/api/getTollplazaName', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json, text/plain, */*',
              'Referer': 'https://rajmargyatra.nhai.gov.in/'
            },
            body: JSON.stringify({}),
            mode: 'cors',
            credentials: 'omit'
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          return await response.json();
        } catch (err) {
          return { error: err.message };
        }
      });

      if (result.error) {
        throw new Error(`Fetch error: ${result.error}`);
      }

      if (result.resultCode === 200 && result.payload) {
        console.log(`Successfully fetched ${result.payload.length} toll plazas`);
        
        // Save to file
        const tempFile = path.join(__dirname, '../data/sources/.temp_plazas_list.json');
        fs.writeFileSync(tempFile, JSON.stringify(result.payload, null, 2));
        
        return result.payload;
      } else {
        throw new Error(`API returned error: ${result.resultString || 'Unknown error'}`);
      }
    } finally {
      await page.close();
    }
  }

  async fetchTollplazaDetail(tollplazaId, delay = 1500) {
    const page = await this.browser.newPage();
    
    try {
      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, delay));

      // Don't navigate, just evaluate
      const result = await page.evaluate(async (id) => {
        try {
          const response = await fetch('https://rajmargyatra.nhai.gov.in/nhai/api/getTollplazaDetails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json, text/plain, */*'
            },
            body: JSON.stringify({ tollplaza_id: id }),
            mode: 'cors',
            credentials: 'omit'
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          return await response.json();
        } catch (err) {
          return { error: err.message };
        }
      }, tollplazaId);

      if (result.error) {
        return { success: false, error: result.error };
      }

      if (result.resultCode === 200 && result.payload && result.payload.length > 0) {
        return { success: true, data: result.payload[0] };
      } else {
        return { success: false, error: result.resultString || 'Unknown error' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      await page.close();
    }
  }

  async fetchAllPlazaDetails(plazas) {
    console.log(`Fetching details for ${plazas.length} toll plazas...`);
    
    const results = [];
    const errors = [];
    
    const CONCURRENT_PAGES = 1; // Start with 1 to be conservative
    
    for (let i = 0; i < plazas.length; i += CONCURRENT_PAGES) {
      const batch = plazas.slice(i, i + CONCURRENT_PAGES);
      
      const promises = batch.map((plaza, idx) => 
        this.fetchTollplazaDetail(plaza.tollplaza_id, idx * 2500 + 1500)
      );
      
      const batchResults = await Promise.all(promises);
      
      for (let j = 0; j < batchResults.length; j++) {
        const result = batchResults[j];
        if (result.success) {
          results.push(result.data);
          process.stdout.write('.');
        } else {
          errors.push({ plaza: batch[j].tollplaza_id, error: result.error });
          process.stdout.write('F');
        }
        
        if ((results.length + errors.length) % 50 === 0) {
          console.log(`\nProgress: ${results.length}/${plazas.length}`);
        }
      }
    }
    
    console.log(`\n\nCompleted: ${results.length} successful, ${errors.length} errors`);
    
    if (errors.length > 0 && errors.length <= 20) {
      console.log('Failed plazas:');
      errors.forEach(e => {
        console.log(`  - ${e.plaza}: ${e.error}`);
      });
    }

    // Save results
    const rawFile = path.join(__dirname, '../data/sources/.temp_raw_details.json');
    fs.writeFileSync(rawFile, JSON.stringify(results, null, 2));
    
    return results;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      console.log('Browser closed');
    }
  }
}

async function main() {
  let fetcher = null;
  
  try {
    fetcher = new PuppeteerFetcher();
    await fetcher.initialize();

    // Step 1: Fetch plaza names
    const plazas = await fetcher.fetchTollplazaNames();
    
    // Step 2: Fetch all plaza details
    const details = await fetcher.fetchAllPlazaDetails(plazas);
    
    console.log(`\nFinal: ${details.length} plazas with details`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    if (fetcher) {
      await fetcher.close();
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = PuppeteerFetcher;
