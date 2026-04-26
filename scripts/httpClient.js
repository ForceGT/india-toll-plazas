const https = require('https');
const http = require('http');
const zlib = require('zlib');

function makeRequest(url, method, data, headers) {
  return makeDirectRequest(url, method, data, headers);
}

function makeDirectRequest(url, method, data, headers) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="121", "Google Chrome";v="121"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        ...headers
      },
      timeout: 30000
    };

    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.request(url, options, (res) => {
      let stream = res;

      // Handle compression
      if (res.headers['content-encoding'] === 'gzip') {
        stream = res.pipe(zlib.createGunzip());
      } else if (res.headers['content-encoding'] === 'deflate') {
        stream = res.pipe(zlib.createInflate());
      } else if (res.headers['content-encoding'] === 'br') {
        stream = res.pipe(zlib.createBrotliDecompress());
      }

      let body = '';

      stream.on('data', chunk => {
        body += chunk;
      });

      stream.on('end', () => {
        try {
          if (res.statusCode >= 400) {
            const error = new Error(`HTTP ${res.statusCode}: ${body.substring(0, 200)}`);
            error.statusCode = res.statusCode;
            error.body = body;
            error.headers = res.headers;
            reject(error);
          } else {
            const parsed = JSON.parse(body);
            resolve(parsed);
          }
        } catch (error) {
          reject(error);
        }
      });

      stream.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

module.exports = { makeRequest };
