# 403 Forbidden Error - NHAI API

## Issue
GitHub Actions workflow is receiving `HTTP 403 Forbidden` when trying to fetch toll plaza data from the NHAI API.

## Root Cause
The NHAI RajMargyatra API appears to be implementing some form of rate limiting or request blocking, likely to prevent automated scraping. This is common with public APIs that don't have formal rate limiting documentation.

## Possible Causes

1. **Rate Limiting** (Most Likely)
   - API detects rapid requests and blocks them
   - Different servers may have different thresholds
   - GitHub Actions may be rate limited more aggressively

2. **IP Blocking**
   - GitHub Actions servers may be in a blocklist
   - Different IP ranges may be treated differently

3. **Header Validation**
   - API may check for specific headers and reject unfamiliar patterns
   - User-Agent or Referer headers might be insufficient

4. **CORS / Request Pattern**
   - API may only allow requests from browser contexts
   - POST requests from non-browser clients rejected

## Solutions Implemented ✅

### 1. Increased Rate Limiting (CONFIG UPDATED)
```json
{
  "delayBetweenRequests": 2000,      // 500ms → 2000ms (4x slower)
  "maxRetries": 10,                   // 5 → 10 (more persistence)
  "initialBackoffMs": 5000,           // 1000ms → 5000ms
  "maxBackoffMs": 60000,              // 30000ms → 60000ms
  "backoffMultiplier": 2
}
```

### 2. Better Error Diagnostics
- HTTP error responses now include response body
- 403 errors show diagnostic suggestions
- Helps identify if it's a real API block vs rate limit

## Next Steps to Try

### Option 1: Further Reduce Request Rate (Local Testing)
Edit `config/rate-limit.json`:
```json
{
  "delayBetweenRequests": 5000,   // 5 seconds between requests
  "maxRetries": 15,
  "initialBackoffMs": 10000,      // 10 seconds initial backoff
  "maxBackoffMs": 120000,         // Up to 2 minutes
  "backoffMultiplier": 2
}
```

Then test locally:
```bash
./fetch-and-process.sh
```

### Option 2: Test Direct API Access
```bash
# Direct curl to test if API is accessible
curl -X POST 'https://rajmargyatra.nhai.gov.in/nhai/api/getTollplazaName' \
  -H 'Content-Type: application/json' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' \
  --data '{}'
```

### Option 3: Contact NHAI
- Check if there's an official API documentation
- Request API access or rate limit exceptions
- Ask about automated data access policies

### Option 4: Use Browser-Based Approach
- The API works fine in browser (RajMargyatra web app)
- Could use Puppeteer/Playwright to automate browser
- More complex but guaranteed to work

### Option 5: Cache Data Locally
- Manual fetch first time (when it works)
- Cache data in repository
- Only update monthly
- Reduces API calls significantly

## Recommended Approach

**Start with Option 1** (further reduce rate):
1. Update `config/rate-limit.json` with slower delays
2. Test locally with `./fetch-and-process.sh`
3. Monitor for success
4. Push updated config
5. Re-run GitHub Actions

If Option 1 doesn't work, then try **Option 2** (test direct API) to determine if it's automation being blocked or actual rate limiting.

## Files Modified

- ✅ `config/rate-limit.json` - Increased delays and retries
- ✅ `scripts/httpClient.js` - Better error messages
- ✅ `scripts/fetchNhaiTollplazas.js` - Diagnostic logging
- ✅ `.github/workflows/monthly-update.yml` - Fixed permissions (earlier commit)

## Testing Locally

```bash
cd /Users/gtxtreme/Documents/india-toll-plazas

# Full pipeline
./fetch-and-process.sh

# Just fetch first
node scripts/fetchNhaiTollplazas.js
```

## References

- NHAI RajMargyatra: https://rajmargyatra.nhai.gov.in
- API Endpoints: 
  - `getTollplazaName` - List all toll plazas
  - `getTollplazaDetails` - Details per plaza
  - `getVehicletype` - Vehicle mappings
  - `getStateName` - State mappings

---

**Last Updated**: April 26, 2026  
**Status**: Investigating - Enhanced diagnostics and rate limiting applied
