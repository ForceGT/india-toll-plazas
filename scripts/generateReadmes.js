'use strict';
const fs = require('fs');
const path = require('path');

// Canonical state map. Key = state_name uppercased with all non-letters removed.
// Add new keys here whenever new name variants appear in the dataset.
const CANONICAL = {
  ANDHRAPRADESH:    { display: 'Andhra Pradesh',           slug: 'andhra-pradesh'   },
  ASSAM:            { display: 'Assam',                    slug: 'assam'            },
  BIHAR:            { display: 'Bihar',                    slug: 'bihar'            },
  CHHATTISGARH:     { display: 'Chhattisgarh',             slug: 'chhattisgarh'     },
  DELHI:            { display: 'Delhi',                    slug: 'delhi'            },
  GOA:              { display: 'Goa',                      slug: 'goa'              },
  GUJARAT:          { display: 'Gujarat',                  slug: 'gujarat'          },
  HARYANA:          { display: 'Haryana',                  slug: 'haryana'          },
  HIMACHALPRADESH:  { display: 'Himachal Pradesh',         slug: 'himachal-pradesh' },
  JAMMUANDKASHMIR:  { display: 'Jammu & Kashmir',          slug: 'jammu-kashmir'    },
  JHARKHAND:        { display: 'Jharkhand',                slug: 'jharkhand'        },
  KARNATAKA:        { display: 'Karnataka',                slug: 'karnataka'        },
  KERALA:           { display: 'Kerala',                   slug: 'kerala'           },
  MADHYAPRADESH:    { display: 'Madhya Pradesh',           slug: 'madhya-pradesh'   },
  MAHARASHTRA:      { display: 'Maharashtra',              slug: 'maharashtra'      },
  MEGHALAYA:        { display: 'Meghalaya',                slug: 'meghalaya'        },
  ODISHA:           { display: 'Odisha',                   slug: 'odisha'           },
  PUNJAB:           { display: 'Punjab',                   slug: 'punjab'           },
  PUNJABANDHARYANA: { display: 'Punjab & Haryana (mixed)', slug: 'punjab-haryana'   },
  RAJASTHAN:        { display: 'Rajasthan',                slug: 'rajasthan'        },
  TAMILNADU:        { display: 'Tamil Nadu',               slug: 'tamil-nadu'       },
  TELANGANA:        { display: 'Telangana',                slug: 'telangana'        },
  UTTARPRADESH:     { display: 'Uttar Pradesh',            slug: 'uttar-pradesh'    },
  UTTARAKHAND:      { display: 'Uttarakhand',              slug: 'uttarakhand'      },
  WESTBENGAL:       { display: 'West Bengal',              slug: 'west-bengal'      },
  '':               { display: 'Unspecified',              slug: 'unspecified'      },
};

function canonicalize(stateName) {
  if (stateName == null) return CANONICAL[''];
  const key = stateName.toUpperCase().replace(/[^A-Z]/g, '');
  return CANONICAL[key] || { display: stateName, slug: stateName.toLowerCase().replace(/[^a-z0-9]+/g, '-') };
}

function nhSortKey(nhNo) {
  if (!nhNo) return Infinity;
  const m = nhNo.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : Infinity;
}

function formatCoords(lat, lng) {
  if (lat == null || lng == null) return '';
  return `[${lat}, ${lng}](https://www.google.com/maps?q=${lat},${lng})`;
}

function formatDate(isoString) {
  if (!isoString) return '';
  return isoString.slice(0, 10);
}

function buildStateReadme(stateInfo) {
  const { display, highways, confidence, maxUpdated } = stateInfo;
  const plazas = stateInfo.plazas;

  const confParts = [];
  if (confidence.complete) confParts.push(`${confidence.complete} complete`);
  if (confidence.partial)  confParts.push(`${confidence.partial} partial`);
  if (confidence.verified) confParts.push(`${confidence.verified} verified`);

  const hwLabel = highways === 0
    ? 'state highways'
    : `${highways} national highway${highways !== 1 ? 's' : ''}`;

  const rows = [...plazas].sort((a, b) => {
    const diff = nhSortKey(a.nh_no) - nhSortKey(b.nh_no);
    if (diff !== 0) return diff;
    return (a.location || '').localeCompare(b.location || '');
  });

  const tableRows = rows.map(r => {
    const name   = (r.tollplaza_name || '').replace(/\|/g, '\\|');
    const nh     = r.nh_no || '';
    const loc    = (r.location || '').replace(/\|/g, '\\|');
    const coords = formatCoords(r.latitude, r.longitude);
    const rate   = r.car_single != null ? r.car_single : '';
    const conf   = r.data_confidence || '';
    return `| ${name} | ${nh} | ${loc} | ${coords} | ${rate} | ${conf} |`;
  }).join('\n');

  return `# Toll plazas in ${display} — India

Browse **${plazas.length} FASTag toll plazas** across ${hwLabel} in ${display}. Data sourced from [NHAI RajMargyatra](https://rajmargyatra.nhai.gov.in) and curated state sources.

**Coverage:** ${confParts.join(', ')} · **Last updated:** ${formatDate(maxUpdated) || 'unknown'}

[← All states](../../README.md) · [Download full dataset](../../../data/latest.json)

| Toll Plaza | NH | Location | Coordinates | Car (single ₹) | Confidence |
|---|---|---|---|---|---|
${tableRows}

---

*Data from [india-toll-plazas](https://github.com/ForceGT/india-toll-plazas) · [latest.json](../../../data/latest.json) · Updated monthly*
`;
}

function buildStateTableRow(stateInfo) {
  const { display, slug, highways, confidence, maxUpdated } = stateInfo;
  const plazas = stateInfo.plazas;

  const confParts = [];
  if (confidence.complete) confParts.push(`${confidence.complete}c`);
  if (confidence.partial)  confParts.push(`${confidence.partial}p`);
  if (confidence.verified) confParts.push(`${confidence.verified}v`);
  const confCell = confParts.join(' / ') || '—';

  const link   = `[${display}](docs/states/${slug}/README.md)`;
  const browse = `[Browse](docs/states/${slug}/README.md)`;
  return `| ${link} | ${plazas.length} | ${highways || '—'} | ${confCell} | ${formatDate(maxUpdated) || '—'} | ${browse} |`;
}

function generateReadmes() {
  const dataFile = path.join(__dirname, '../data/latest.json');
  if (!fs.existsSync(dataFile)) {
    console.error('data/latest.json not found — run the pipeline first');
    process.exit(1);
  }

  const plazas = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  console.log(`Loaded ${plazas.length} plazas from data/latest.json`);

  // Group by canonical state
  const byState = new Map();
  for (const plaza of plazas) {
    const canon = canonicalize(plaza.state_name);
    if (!byState.has(canon.slug)) {
      byState.set(canon.slug, {
        display:    canon.display,
        slug:       canon.slug,
        plazas:     [],
        nhNos:      new Set(),
        confidence: { complete: 0, partial: 0, verified: 0 },
        maxUpdated: null,
      });
    }
    const s = byState.get(canon.slug);
    s.plazas.push(plaza);
    if (plaza.nh_no) s.nhNos.add(plaza.nh_no);
    const conf = plaza.data_confidence;
    if (conf === 'complete' || conf === 'partial' || conf === 'verified') s.confidence[conf]++;
    if (plaza.last_updated && (!s.maxUpdated || plaza.last_updated > s.maxUpdated)) {
      s.maxUpdated = plaza.last_updated;
    }
  }

  const states = [...byState.values()]
    .map(s => ({ ...s, highways: s.nhNos.size }))
    .sort((a, b) => a.display.localeCompare(b.display));

  // Write per-state READMEs
  const docsStatesDir = path.join(__dirname, '../docs/states');
  for (const stateInfo of states) {
    const dir = path.join(docsStatesDir, stateInfo.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'README.md'), buildStateReadme(stateInfo));
  }
  console.log(`Wrote ${states.length} per-state README files to docs/states/`);

  // Update main README marker regions
  const readmePath = path.join(__dirname, '../README.md');
  if (!fs.existsSync(readmePath)) {
    console.warn('README.md not found — skipping marker update');
    return;
  }

  let readme = fs.readFileSync(readmePath, 'utf8');

  const totalPlazas = plazas.length;
  const maxDataset  = states.map(s => s.maxUpdated).filter(Boolean).sort().pop() || 'unknown';
  const statsLine   = `**${totalPlazas.toLocaleString()} toll plazas** across **${states.length} states/UTs** — dataset last updated ${formatDate(maxDataset)}`;

  readme = readme.replace(
    /<!-- STATE_STATS:START -->[\s\S]*?<!-- STATE_STATS:END -->/,
    `<!-- STATE_STATS:START -->\n${statsLine}\n<!-- STATE_STATS:END -->`
  );

  const tableHeader = '| State | Plazas | Highways | Confidence (c/p/v) | Updated | Browse |\n|---|---|---|---|---|---|';
  const tableBody   = states.map(buildStateTableRow).join('\n');

  readme = readme.replace(
    /<!-- STATE_TABLE:START -->[\s\S]*?<!-- STATE_TABLE:END -->/,
    `<!-- STATE_TABLE:START -->\n${tableHeader}\n${tableBody}\n<!-- STATE_TABLE:END -->`
  );

  fs.writeFileSync(readmePath, readme);
  console.log(`Updated README.md state table (${states.length} states, ${totalPlazas} plazas)`);
}

if (require.main === module) {
  generateReadmes();
}

module.exports = generateReadmes;
