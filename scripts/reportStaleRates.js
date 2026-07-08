const fs = require('fs');
const path = require('path');

/**
 * Warn-only maintenance report: flags curated/verified plaza rates that are due
 * for a re-check against their source notification. Two independent triggers:
 *   - rate_valid_until has passed (the notification itself says it expired)
 *   - rate_effective_date is more than 12 months old (annual re-check cadence,
 *     regardless of a longer-dated rate_valid_until — rates can be superseded by
 *     a newer notification even before the old one's stated validity ends)
 * Only applies to data_confidence === 'verified' rows (curated overrides from
 * data/sources/curated/expressway_rates.json and curated/state_rates/*.json) —
 * 'complete'/'partial'/'estimated' rows have no rate_source to re-check.
 *
 * This is informational only: it must never fail the pipeline, so it always
 * exits 0, even on internal errors (logged to stderr instead).
 */

const STALE_MONTHS = 12;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function monthsAgo(date, months) {
  const d = new Date(date.getTime());
  d.setMonth(d.getMonth() - months);
  return d;
}

function reportStaleRates() {
  const dataFile = path.join(__dirname, '../data/latest.json');
  if (!fs.existsSync(dataFile)) {
    console.warn('reportStaleRates: data/latest.json not found — skipping (nothing to check yet)');
    return;
  }

  let plazas;
  try {
    plazas = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (err) {
    console.warn(`reportStaleRates: could not parse data/latest.json — skipping (${err.message})`);
    return;
  }

  const now = new Date();
  const staleEffectiveCutoff = monthsAgo(now, STALE_MONTHS);

  const findings = [];

  for (const plaza of plazas) {
    if (plaza.data_confidence !== 'verified') continue;

    const reasons = [];

    if (plaza.rate_valid_until) {
      const validUntil = new Date(plaza.rate_valid_until);
      if (!isNaN(validUntil) && validUntil < now) {
        const daysExpired = Math.floor((now - validUntil) / MS_PER_DAY);
        reasons.push(`expired: rate_valid_until ${plaza.rate_valid_until} (${daysExpired} day(s) ago)`);
      }
    }

    if (plaza.rate_effective_date) {
      const effective = new Date(plaza.rate_effective_date);
      if (!isNaN(effective) && effective < staleEffectiveCutoff) {
        const monthsOld = Math.floor((now - effective) / (MS_PER_DAY * 30));
        reasons.push(`stale-effective-date: rate_effective_date ${plaza.rate_effective_date} (~${monthsOld} month(s) old, threshold ${STALE_MONTHS})`);
      }
    }

    if (reasons.length > 0) {
      findings.push({ plaza, reasons });
    }
  }

  console.log('========================================');
  console.log('Stale/expired rate re-check worklist');
  console.log('========================================');
  console.log(`Checked ${plazas.length} plaza(s), ${plazas.filter(p => p.data_confidence === 'verified').length} verified`);
  console.log(`Run date: ${now.toISOString().slice(0, 10)}`);
  console.log('');

  if (findings.length === 0) {
    console.log('No stale or expired verified rates found. Nothing to re-check.');
    console.log('========================================');
    return;
  }

  console.log(`Found ${findings.length} plaza(s) due for re-check:\n`);

  findings.forEach(({ plaza, reasons }, i) => {
    console.log(`${i + 1}. ${plaza.tollplaza_name || '(unnamed)'} [${plaza.tollplaza_code || plaza.tollplaza_id || 'no code'}]`);
    console.log(`   State: ${plaza.state_name || 'unknown'}`);
    console.log(`   rate_source: ${plaza.rate_source || '(none)'}`);
    if (plaza.rate_source_url) {
      console.log(`   rate_source_url: ${plaza.rate_source_url}`);
    }
    for (const reason of reasons) {
      console.log(`   - ${reason}`);
    }
    console.log('');
  });

  console.log('========================================');
}

if (require.main === module) {
  try {
    reportStaleRates();
  } catch (err) {
    // Warn-only step — never fail the pipeline.
    console.warn(`reportStaleRates: unexpected error — ${err.message}`);
  }
  process.exit(0);
}

module.exports = reportStaleRates;
