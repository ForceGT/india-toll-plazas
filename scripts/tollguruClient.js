/**
 * Shared TollGuru client.
 *
 * Single source of truth for talking to the reverse-engineered TollGuru TRPC API.
 * Both scripts/fetchStateTollGuruCarRates.js (per-plaza state rates) and
 * scripts/fetchDirectionalRates.js (corridor directional rates) use this module so the
 * request shape, headers and response parsing live in exactly one place.
 *
 * The public TollGuru endpoint is heavily rate limited (~60-100 requests/day), so callers
 * are expected to space requests out and cache aggressively.
 */

// Configuration for the TollGuru API (mimics the public web client).
const TOLLGURU_CONFIG = {
  url: 'https://tollguru.com/api/trpc/calc.getRoutes?batch=1',
  headers: {
    'accept': '*/*',
    'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
    'content-type': 'application/json',
    'origin': 'https://tollguru.com',
    'priority': 'u=1, i',
    'referer': 'https://tollguru.com/toll-calculator-india',
    'sec-ch-ua': '"Google Chrome";v="147", "Not.A/Brand";v="8", "Chromium";v="147"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Mobile Safari/537.36',
    'x-trpc-source': 'react'
  },
  vehicle: '2AxlesAuto',
  rateLimitMs: 2000,
  timeoutMs: 10000
};

// Move a point distanceKm along bearingDegrees (clockwise from north). Haversine forward solution.
function moveLatLng(lat, lng, distanceKm, bearingDegrees) {
  const R = 6371; // Earth's radius in km
  const bearingRad = bearingDegrees * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  const lngRad = lng * Math.PI / 180;

  const newLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(distanceKm / R) +
    Math.cos(latRad) * Math.sin(distanceKm / R) * Math.cos(bearingRad)
  );

  const newLngRad = lngRad + Math.atan2(
    Math.sin(bearingRad) * Math.sin(distanceKm / R) * Math.cos(latRad),
    Math.cos(distanceKm / R) - Math.sin(latRad) * Math.sin(newLatRad)
  );

  return {
    lat: newLatRad * 180 / Math.PI,
    lng: newLngRad * 180 / Math.PI
  };
}

// Initial bearing (degrees clockwise from north) travelling from point 1 to point 2.
function bearingBetween(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (parseFloat(d) * Math.PI) / 180;
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const dLambda = toRad(parseFloat(lng2) - parseFloat(lng1));
  const y = Math.sin(dLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLambda);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

// Great-circle distance in km (used for spatial attribution of returned tolls to known plazas).
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (d) => (parseFloat(d) * Math.PI) / 180;
  const dLat = toRad(parseFloat(lat2) - parseFloat(lat1));
  const dLng = toRad(parseFloat(lng2) - parseFloat(lng1));
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Call the TollGuru API for a route.
 *
 * @param {{from:{lat,lng}, to:{lat,lng}}} route - start and end coordinates.
 * @param {string} vehicleType - TollGuru vehicle code (default 2AxlesAuto = car).
 * @param {Array<{lat,lng}>} waypoints - ordered intermediate points to force the route
 *        through a corridor of plazas. Empty for a simple point-to-point query.
 * @returns {Promise<object>} raw parsed JSON response.
 */
async function callTollGuruAPI(route, vehicleType = TOLLGURU_CONFIG.vehicle, waypoints = []) {
  const payload = {
    "0": {
      "json": {
        "from": route.from,
        "to": route.to,
        "waypoints": waypoints,
        "tags": [],
        "returnFloats": true,
        "departureTime": new Date().toISOString(),
        "units": { "currency": "INR" },
        "vehicle": { "type": vehicleType },
        "directionsFlag": true,
        "optimizeWaypoints": false,
        "applyHazmatRestriction": false,
        "serviceProvider": "gmaps"
      }
    }
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TOLLGURU_CONFIG.timeoutMs);

  try {
    const response = await fetch(TOLLGURU_CONFIG.url, {
      method: 'POST',
      headers: TOLLGURU_CONFIG.headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Surface statusCode so callers / the shared RateLimiter can back off on 429.
      const err = new Error(`HTTP ${response.status}: ${response.statusText}`);
      err.statusCode = response.status;
      throw err;
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Parse a TollGuru response into a normalized toll summary.
 * Returns the route-level total plus per-plaza toll details (name, cost, type, and lat/lng
 * when TollGuru includes them — needed to attribute tolls to known plazas on a corridor).
 */
function extractCarToll(apiResponse) {
  try {
    const result = apiResponse?.[0]?.result;
    if (!result || !result.data || !result.data.json) {
      return { amount: 0, summary: 'No result data', tollDetails: [] };
    }

    const jsonData = result.data.json;
    const routes = jsonData.routes;
    if (!routes || routes.length === 0) {
      return { amount: 0, summary: 'No routes found', tollDetails: [] };
    }

    const route = routes[0];
    const tolls = route.tolls || [];
    const hasTolls = route.summary?.hasTolls || false;
    const distance = route.summary?.distance?.value || 0;
    const distanceKm = Math.round((distance / 1000) * 10) / 10;

    if (tolls.length === 0 || !hasTolls) {
      return {
        amount: 0,
        summary: hasTolls ? 'Route has tolls but no details found' : 'No tolls on route',
        distance: distanceKm,
        hasTolls,
        tollDetails: []
      };
    }

    const routeCosts = route.costs || {};
    const totalTagCost = routeCosts.tag || routeCosts.tagAndCash || 0;
    const totalCashCost = routeCosts.cash || 0;
    const totalToll = totalTagCost || totalCashCost;

    const tollDetails = [];
    for (const toll of tolls) {
      const tagCost = toll.tagCost || toll.tagPriCost || 0;
      const cashCost = toll.cashCost || 0;
      const cost = tagCost || cashCost || 0;

      // TollGuru sometimes nests location under different keys; capture whatever is present
      // so callers can spatially match a toll to a known plaza.
      const lat = toll.lat ?? toll.latitude ?? toll.location?.lat ?? toll.geometry?.lat ?? null;
      const lng = toll.lng ?? toll.longitude ?? toll.location?.lng ?? toll.geometry?.lng ?? null;

      tollDetails.push({
        name: toll.name || 'Unknown',
        cost,
        currency: toll.currency || 'INR',
        tagCost,
        cashCost,
        tollType: toll.type || 'barrier',
        lat: lat != null ? parseFloat(lat) : null,
        lng: lng != null ? parseFloat(lng) : null
      });
    }

    return {
      amount: totalToll,
      summary: `${tolls.length} toll(s) found`,
      distance: distanceKm,
      hasTolls,
      tollDetails,
      routeCosts: {
        tag: totalTagCost,
        cash: totalCashCost,
        currency: route.costs?.currency || 'INR'
      }
    };
  } catch (error) {
    return { amount: 0, summary: `Parse error: ${error.message}`, error: error.message, tollDetails: [] };
  }
}

module.exports = {
  TOLLGURU_CONFIG,
  moveLatLng,
  bearingBetween,
  haversineKm,
  callTollGuruAPI,
  extractCarToll
};
