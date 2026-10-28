const https = require('https');
const http = require('http');
const zlib = require('zlib');

// Persistent agents prevent socket churn and connection drops across 1,200+ requests
const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 25, timeout: 30000 });
const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 25, timeout: 30000 });

function makeRequest(url, method, data, headers) {
  return makeDirectRequest(url, method, data, headers);
}

function makeDirectRequest(url, method, data, headers) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const protocol = isHttps ? https : http;
    const agent = isHttps ? httpsAgent : httpAgent;

    const options = {
      method,
      agent,
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

    let isSettled = false;
    const safeResolve = (val) => {
      if (!isSettled) {
        isSettled = true;
        resolve(val);
      }
    };
    const safeReject = (err) => {
      if (!isSettled) {
        isSettled = true;
        reject(err);
      }
    };

    const req = protocol.request(url, options, (res) => {
      let stream = res;

      const encoding = res.headers['content-encoding'];
      if (encoding === 'gzip') {
        const gunzip = zlib.createGunzip();
        res.pipe(gunzip);
        stream = gunzip;
      } else if (encoding === 'deflate') {
        const inflate = zlib.createInflate();
        res.pipe(inflate);
        stream = inflate;
      } else if (encoding === 'br') {
        const brotli = zlib.createBrotliDecompress();
        res.pipe(brotli);
        stream = brotli;
      }

      res.on('error', safeReject);
      stream.on('error', safeReject);

      let body = '';
      stream.on('data', (chunk) => {
        body += chunk;
      });

      stream.on('end', () => {
        try {
          if (res.statusCode >= 400) {
            const error = new Error(`HTTP ${res.statusCode}: ${body.substring(0, 200)}`);
            error.statusCode = res.statusCode;
            error.body = body;
            error.headers = res.headers;
            safeReject(error);
          } else {
            const parsed = JSON.parse(body);
            safeResolve(parsed);
          }
        } catch (error) {
          safeReject(error);
        }
      });
    });

    req.on('error', safeReject);
    req.on('timeout', () => {
      req.destroy(new Error('Request timeout'));
      safeReject(new Error('Request timeout'));
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

module.exports = { makeRequest };