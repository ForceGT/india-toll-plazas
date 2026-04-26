const fs = require('fs');
const path = require('path');
const { makeRequest } = require('./httpClient');

const API_URL = 'https://rajmargyatra.nhai.gov.in/nhai/api/getTollplazaDetails';

const headers = {
  'accept': 'application/json, text/plain, */*',
  'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
  'content-type': 'application/json',
  'origin': 'https://rajmargyatra.nhai.gov.in',
  'priority': 'u=1, i',
  'referer': 'https://rajmargyatra.nhai.gov.in/ataglance',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
};

// Configuration
const WORKER_COUNT = 3;
const DELAY_BETWEEN_WORKERS = 5000; // 5 seconds between worker starts
const CHECKPOINT_EVERY = 50; // Save progress every 50 plazas

class ParallelFetcher {
  constructor(plazas) {
    this.plazas = plazas;
    this.results = [];
    this.errors = [];
    this.processed = 0;
    this.cacheFile = path.join(__dirname, '../data/sources/.fetched_cache.json');
    this.loadCache();
  }

  loadCache() {
    if (fs.existsSync(this.cacheFile)) {
      try {
        const cached = JSON.parse(fs.readFileSync(this.cacheFile, 'utf8'));
        this.results = cached.results || [];
        this.processed = cached.processed || 0;
        console.log(`Loaded cache: ${this.processed} plazas already fetched`);
      } catch (e) {
        console.warn('Cache corrupted, starting fresh');
        this.results = [];
        this.processed = 0;
      }
    }
  }

  saveCheckpoint() {
    fs.writeFileSync(this.cacheFile, JSON.stringify({
      results: this.results,
      processed: this.processed,
      timestamp: new Date().toISOString()
    }, null, 2));
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetchWithRetry(plaza, retryCount = 0, maxRetries = 5) {
    try {
      const result = await makeRequest(API_URL, 'POST', { tollplaza_id: plaza.tollplaza_id }, headers);
      
      if (result.resultCode === 200 && result.payload && result.payload.length > 0) {
        return { success: true, data: result.payload[0] };
      }
      return { success: false, error: `Invalid response: ${result.resultString}` };
    } catch (error) {
      if (error.statusCode === 403 && retryCount < maxRetries) {
        const backoffMs = Math.min(5000 * Math.pow(2, retryCount), 120000);
        const jitter = backoffMs * 0.1 * Math.random();
        console.warn(`403 on plaza ${plaza.tollplaza_id}, retry ${retryCount + 1}/${maxRetries} after ${(backoffMs + jitter).toFixed(0)}ms`);
        await this.sleep(backoffMs + jitter);
        return this.fetchWithRetry(plaza, retryCount + 1, maxRetries);
      }
      return { success: false, error: error.message };
    }
  }

  async worker(workerId, queue) {
    console.log(`Worker ${workerId} started`);
    
    while (queue.length > 0) {
      const plaza = queue.shift();
      if (!plaza) break;

      process.stdout.write(`.`);
      const result = await this.fetchWithRetry(plaza);
      
      if (result.success) {
        this.results.push(result.data);
      } else {
        this.errors.push({ plaza: plaza.tollplaza_id, error: result.error });
      }
      
      this.processed++;
      
      // Save checkpoint every N plazas
      if (this.processed % CHECKPOINT_EVERY === 0) {
        console.log(`\nCheckpoint: ${this.processed}/${this.plazas.length}`);
        this.saveCheckpoint();
      }

      // Delay between requests
      await this.sleep(DELAY_BETWEEN_WORKERS);
    }
    
    console.log(`\nWorker ${workerId} finished`);
  }

  async fetchAll() {
    // Skip already processed plazas
    const remaining = this.plazas.slice(this.processed);
    
    if (remaining.length === 0) {
      console.log('All plazas already fetched!');
      return this.results;
    }

    console.log(`Fetching ${remaining.length} remaining plazas using ${WORKER_COUNT} workers...`);
    
    const workers = [];
    for (let i = 0; i < WORKER_COUNT; i++) {
      workers.push(this.worker(i, remaining));
      await this.sleep(1000); // Stagger worker start times
    }

    await Promise.all(workers);
    
    console.log(`\nCompleted: ${this.results.length} successful, ${this.errors.length} errors`);
    
    if (this.errors.length > 0) {
      console.log('\nFailed plazas:');
      this.errors.slice(0, 10).forEach(e => {
        console.log(`  - ${e.plaza}: ${e.error}`);
      });
      if (this.errors.length > 10) {
        console.log(`  ... and ${this.errors.length - 10} more`);
      }
    }

    // Final save
    this.saveCheckpoint();
    
    return this.results;
  }
}

async function main() {
  try {
    const plazasListFile = path.join(__dirname, '../data/sources/.temp_plazas_list.json');
    if (!fs.existsSync(plazasListFile)) {
      throw new Error('Plazas list file not found. Run fetchNhaiTollplazas.js first');
    }

    const plazas = JSON.parse(fs.readFileSync(plazasListFile, 'utf8'));
    const fetcher = new ParallelFetcher(plazas);
    const detailedPlazas = await fetcher.fetchAll();

    // Save final results
    const rawFile = path.join(__dirname, '../data/sources/.temp_raw_details.json');
    fs.writeFileSync(rawFile, JSON.stringify(detailedPlazas, null, 2));
    
    console.log(`\nFinal data saved: ${detailedPlazas.length} plazas`);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = ParallelFetcher;
