const fs = require('fs');
const path = require('path');

const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../config/rate-limit.json'), 'utf8')
);

class RateLimiter {
  constructor() {
    this.lastRequestTime = 0;
    this.queue = [];
    this.processing = false;
  }

  async request(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const { fn, resolve, reject } = this.queue.shift();
      const timeSinceLastRequest = Date.now() - this.lastRequestTime;
      const delayNeeded = Math.max(0, config.delayBetweenRequests - timeSinceLastRequest);

      if (delayNeeded > 0) {
        await this.sleep(delayNeeded);
      }

      try {
        this.lastRequestTime = Date.now();
        const result = await this.withRetry(fn);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }

    this.processing = false;
  }

  async withRetry(fn, retryCount = 0) {
    try {
      return await fn();
    } catch (error) {
      const statusCode = error.statusCode || error.code;
      if (statusCode === 429 && retryCount < config.maxRetries) {
        const backoffMs = Math.min(
          config.initialBackoffMs * Math.pow(config.backoffMultiplier, retryCount),
          config.maxBackoffMs
        );
        const jitter = backoffMs * 0.1 * Math.random();
        const totalDelay = backoffMs + jitter;

        console.log(`Rate limited. Retry ${retryCount + 1}/${config.maxRetries} after ${totalDelay.toFixed(0)}ms`);
        await this.sleep(totalDelay);
        return this.withRetry(fn, retryCount + 1);
      }
      throw error;
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = new RateLimiter();
