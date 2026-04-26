const https = require('https');

function makeRequest(url, method, data, headers) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = https.request(url, options, (res) => {
      let body = '';

      res.on('data', chunk => {
        body += chunk;
      });

      res.on('end', () => {
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
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

module.exports = { makeRequest };
