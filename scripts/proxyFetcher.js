const https = require('https');
const http = require('http');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { HttpProxyAgent } = require('http-proxy-agent');

class ProxyFetcher {
  constructor() {
    this.proxyCache = [];
    this.currentProxyIndex = 0;
    this.useProxy = process.env.USE_PROXY !== 'false'; // Default true
  }

  async getRandomProxy() {
    try {
      console.log('Fetching random proxy from GimmeProxy...');
      
      return new Promise((resolve, reject) => {
        https.get('https://gimmeproxy.com/api/getProxy?curl=true', (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              // Response format: ip:port
              const proxy = data.trim();
              if (proxy && proxy.includes(':')) {
                console.log(`Got proxy: ${proxy}`);
                resolve(proxy);
              } else {
                reject(new Error('Invalid proxy format'));
              }
            } catch (e) {
              reject(e);
            }
          });
        }).on('error', reject);
      });
    } catch (error) {
      console.warn('Failed to get proxy from GimmeProxy:', error.message);
      return null;
    }
  }

  async getPubProxy() {
    try {
      console.log('Fetching proxy from PubProxy...');
      
      return new Promise((resolve, reject) => {
        https.get('http://api.pubproxy.com/get?type=http&format=json', (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const parsed = JSON.parse(data);
              if (parsed.data && parsed.data.ip && parsed.data.port) {
                const proxy = `${parsed.data.ip}:${parsed.data.port}`;
                console.log(`Got PubProxy: ${proxy}`);
                resolve(proxy);
              } else {
                reject(new Error('No proxy in response'));
              }
            } catch (e) {
              reject(e);
            }
          });
        }).on('error', reject);
      });
    } catch (error) {
      console.warn('Failed to get proxy from PubProxy:', error.message);
      return null;
    }
  }

  async getWorkingProxy() {
    // Try multiple proxy sources
    const proxies = [];

    // Try GimmeProxy first
    const gimmeProxy = await this.getRandomProxy();
    if (gimmeProxy) proxies.push(gimmeProxy);

    // Try PubProxy
    const pubProxy = await this.getPubProxy();
    if (pubProxy) proxies.push(pubProxy);

    if (proxies.length === 0) {
      console.warn('No proxies available, will try direct connection');
      return null;
    }

    return proxies[Math.floor(Math.random() * proxies.length)];
  }

  getProxyAgent(proxyUrl) {
    if (!proxyUrl) return null;

    const agentUrl = proxyUrl.startsWith('http') ? proxyUrl : `http://${proxyUrl}`;
    return {
      httpAgent: new HttpProxyAgent(agentUrl),
      httpsAgent: new HttpsProxyAgent(agentUrl)
    };
  }

  async makeRequestWithProxy(url, method, data, headers, retryCount = 0, maxRetries = 3) {
    if (!this.useProxy) {
      // Direct connection, no proxy
      return this.makeDirectRequest(url, method, data, headers);
    }

    try {
      // Get a proxy
      const proxyUrl = await this.getWorkingProxy();
      
      if (!proxyUrl) {
        console.log('No proxy available, trying direct connection...');
        return this.makeDirectRequest(url, method, data, headers);
      }

      return await this.makeRequestThroughProxy(url, method, data, headers, proxyUrl);
    } catch (error) {
      if (retryCount < maxRetries) {
        console.warn(`Request failed, retry ${retryCount + 1}/${maxRetries}...`);
        await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
        return this.makeRequestWithProxy(url, method, data, headers, retryCount + 1, maxRetries);
      }
      throw error;
    }
  }

  makeDirectRequest(url, method, data, headers) {
    return new Promise((resolve, reject) => {
      const options = new URL(url);
      options.method = method;
      options.headers = {
        'Content-Type': 'application/json',
        ...headers
      };

      const protocol = url.startsWith('https') ? https : http;
      const req = protocol.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode >= 400) {
              const error = new Error(`HTTP ${res.statusCode}`);
              error.statusCode = res.statusCode;
              error.body = body;
              reject(error);
            } else {
              resolve(JSON.parse(body));
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      if (data) req.write(JSON.stringify(data));
      req.end();
    });
  }

  makeRequestThroughProxy(url, method, data, headers, proxyUrl) {
    return new Promise((resolve, reject) => {
      const proxyAgent = this.getProxyAgent(proxyUrl);
      if (!proxyAgent) {
        return this.makeDirectRequest(url, method, data, headers)
          .then(resolve)
          .catch(reject);
      }

      const options = new URL(url);
      options.method = method;
      options.headers = {
        'Content-Type': 'application/json',
        ...headers
      };
      options.httpAgent = proxyAgent.httpAgent;
      options.httpsAgent = proxyAgent.httpsAgent;

      const protocol = url.startsWith('https') ? https : http;
      const req = protocol.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode >= 400) {
              const error = new Error(`HTTP ${res.statusCode} via proxy ${proxyUrl}`);
              error.statusCode = res.statusCode;
              error.body = body;
              reject(error);
            } else {
              resolve(JSON.parse(body));
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      if (data) req.write(JSON.stringify(data));
      req.end();
    });
  }
}

module.exports = new ProxyFetcher();
