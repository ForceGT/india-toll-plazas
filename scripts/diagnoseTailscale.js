#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const { execSync } = require('child_process');

console.log('========================================');
console.log('Tailscale Connectivity Diagnostic');
console.log('========================================\n');

// Check environment variables
console.log('1. Environment Variables:');
console.log(`   USE_TAILSCALE_EXIT_NODE: ${process.env.USE_TAILSCALE_EXIT_NODE}`);
console.log(`   TAILSCALE_EXIT_NODE_IP: ${process.env.TAILSCALE_EXIT_NODE_IP}`);

// Try to get Tailscale status
console.log('\n2. Tailscale Status:');
try {
  const tailscaleStatus = execSync('tailscale status 2>&1', { encoding: 'utf8' });
  console.log(tailscaleStatus);
} catch (error) {
  console.log(`   Error running tailscale status: ${error.message}`);
}

// Check network connectivity
console.log('\n3. Network Connectivity Tests:');

// Test DNS resolution
console.log('   Testing DNS resolution for rajmargyatra.nhai.gov.in...');
const dns = require('dns').promises;
dns.resolve4('rajmargyatra.nhai.gov.in')
  .then(addresses => {
    console.log(`   ✓ DNS resolved to: ${addresses.join(', ')}`);
    
    // Test HTTPS connection
    console.log('\n   Testing HTTPS connection to API...');
    const options = {
      hostname: 'rajmargyatra.nhai.gov.in',
      path: '/nhai/api/getTollplazaName',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      console.log(`   ✓ HTTP Status: ${res.statusCode}`);
      console.log(`   Headers: ${JSON.stringify(res.headers, null, 2)}`);
      
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`   Response length: ${body.length} bytes`);
        if (body.length < 500) {
          console.log(`   Response body: ${body.substring(0, 500)}`);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`   ✗ Connection error: ${error.message}`);
    });

    req.on('timeout', () => {
      console.log('   ✗ Request timeout');
      req.destroy();
    });

    req.write(JSON.stringify({}));
    req.end();
  })
  .catch(error => {
    console.log(`   ✗ DNS resolution failed: ${error.message}`);
  });

// Check if running in GitHub Actions
console.log('\n4. Environment Detection:');
console.log(`   GITHUB_ACTIONS: ${process.env.GITHUB_ACTIONS}`);
console.log(`   RUNNER_OS: ${process.env.RUNNER_OS}`);
console.log(`   CI: ${process.env.CI}`);
