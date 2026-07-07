const fs = require('fs');
const path = require('path');
const https = require('https');
const { makeRequest } = require('./httpClient');

/**
 * Auto-refresh the NETC Plaza Master PDF reference copy in data/sources/netc/.
 *
 * netc.org.in's own "Toll Plaza" page is backed by a Strapi CMS API
 * (GET /api/toll-plaza/detail?locale=en, no auth) whose response always points
 * at the current month's Plaza Master PDF via data.toll_plaza.items[0].file.
 * This script checks that field against whatever Plaza_Master_*.pdf is
 * currently in data/sources/netc/, and downloads + swaps it in if the remote
 * filename has changed (i.e. NETC published a newer release).
 *
 * This PDF is a supplementary cross-check reference only (see netc/README.md)
 * — it does not feed merge.js — so this script deliberately does NOT
 * regenerate plaza_master_extracted.txt or edit netc/README.md. Per the repo's
 * existing convention, that stays a manual step (see README's "Regenerate text
 * extract" section) since it requires the pdfminer.six CLI tool.
 */

const API_URL = 'https://www.netc.org.in/api/toll-plaza/detail?locale=en';
const BASE_URL = 'https://www.netc.org.in';
const NETC_DIR = path.join(__dirname, '../data/sources/netc');

const headers = {
  'Accept': 'application/json, text/plain, */*',
  'Referer': 'https://www.netc.org.in/toll-plaza',
  'Origin': 'https://www.netc.org.in',
};

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, {
      headers: {
        'Accept': 'application/pdf,*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Referer': 'https://www.netc.org.in/toll-plaza',
      },
      timeout: 60000,
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow a single redirect hop.
        downloadFile(res.headers.location, destPath).then(resolve, reject);
        return;
      }
      if (res.statusCode >= 400) {
        reject(new Error(`HTTP ${res.statusCode} downloading ${url}`));
        return;
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => fileStream.close(() => resolve()));
      fileStream.on('error', reject);
    });
    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Download timeout'));
    });
  });
}

function findLocalPlazaMasterFiles() {
  if (!fs.existsSync(NETC_DIR)) return [];
  return fs.readdirSync(NETC_DIR).filter(f => /^Plaza_Master_.*\.pdf$/i.test(f));
}

async function fetchNetcPlazaMaster() {
  console.log('Checking NETC Plaza Master for updates...');

  const result = await makeRequest(API_URL, 'GET', null, headers);

  const items = result && result.data && result.data.toll_plaza && result.data.toll_plaza.items;
  const remoteFile = items && items[0] && items[0].file;

  if (!remoteFile) {
    throw new Error('Unexpected API response shape — data.toll_plaza.items[0].file not found');
  }

  const remoteFilename = path.basename(remoteFile);
  const localFiles = findLocalPlazaMasterFiles();

  if (localFiles.length > 1) {
    console.warn(`Warning: expected exactly one Plaza_Master_*.pdf in data/sources/netc/, found ${localFiles.length}: ${localFiles.join(', ')}`);
  }

  const localFilename = localFiles[0] || null;

  if (localFilename === remoteFilename) {
    console.log(`NETC Plaza Master is up to date (${remoteFilename}).`);
    return { updated: false, filename: remoteFilename };
  }

  console.log(`New Plaza Master PDF found: ${remoteFilename}${localFilename ? ` (was ${localFilename})` : ' (no local copy currently present)'}`);

  const destPath = path.join(NETC_DIR, remoteFilename);
  const remoteUrl = `${BASE_URL}${remoteFile}`;
  console.log(`Downloading ${remoteUrl} ...`);
  await downloadFile(remoteUrl, destPath);
  console.log(`Saved new Plaza Master PDF to ${destPath}`);

  for (const f of localFiles) {
    fs.unlinkSync(path.join(NETC_DIR, f));
    console.log(`Removed old Plaza Master PDF: ${f}`);
  }

  console.log('A new Plaza Master PDF was downloaded. Manual follow-up required per data/sources/netc/README.md:');
  console.log('  - regenerate plaza_master_extracted.txt with pdf2txt.py');
  console.log('  - update the file table in data/sources/netc/README.md');

  return { updated: true, filename: remoteFilename };
}

if (require.main === module) {
  fetchNetcPlazaMaster().catch((error) => {
    console.error('Error fetching NETC Plaza Master:', error.message);
    process.exit(1);
  });
}

module.exports = fetchNetcPlazaMaster;
