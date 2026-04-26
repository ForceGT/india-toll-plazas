const https = require('https');
const http = require('http');
const net = require('net');

function makeRequest(url, method, data, headers) {
  const useTailscaleExitNode = process.env.USE_TAILSCALE_EXIT_NODE === 'true';
  const exitNodeIp = process.env.TAILSCALE_EXIT_NODE_IP;

  if (useTailscaleExitNode && exitNodeIp) {
    return makeTailscaleTunnelRequest(url, method, data, headers, exitNodeIp);
  } else {
    return makeDirectRequest(url, method, data, headers);
  }
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

function makeTailscaleTunnelRequest(url, method, data, headers, exitNodeIp) {
  return new Promise((resolve, reject) => {
    // Parse the URL
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    
    console.log(`[Tailscale] Routing ${method} ${urlObj.hostname}${urlObj.pathname} through exit node ${exitNodeIp}`);

    // Create a tunnel connection to the exit node IP
    const socket = net.createConnection({
      host: exitNodeIp,
      port: isHttps ? 443 : 80
    });

    socket.on('error', (err) => {
      console.error(`[Tailscale] Socket error: ${err.message}`);
      reject(err);
    });

    socket.on('connect', () => {
      console.log(`[Tailscale] Connected to exit node, making request...`);
      
      const options = {
        method,
        hostname: urlObj.hostname,
        port: isHttps ? 443 : 80,
        path: urlObj.pathname + (urlObj.search || ''),
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
          ...headers,
          'Host': urlObj.hostname
        },
        createConnection: () => socket
      };

      const protocol = isHttps ? https : http;
      const req = protocol.request(options, (res) => {
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
              console.log(`[Tailscale] Request successful, status: ${res.statusCode}`);
              resolve(parsed);
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (err) => {
        console.error(`[Tailscale] Request error: ${err.message}`);
        reject(err);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });

    socket.setTimeout(15000, () => {
      console.error('[Tailscale] Socket timeout');
      socket.destroy();
      reject(new Error('Tailscale tunnel connection timeout'));
    });
  });
}

module.exports = { makeRequest };
