/**
 * Builds a best-effort map: Wikipedia RJ SH list -> toll plazas in our dataset
 * that plausibly lie on or near each corridor (place-name overlap).
 * Wikipedia does not list toll plazas; this is heuristic for maintainer follow-up.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const WIKI_PAGE =
  'https://en.wikipedia.org/w/api.php?action=parse&page=List_of_state_highways_in_Rajasthan&prop=wikitext&format=json';
const USER_AGENT = 'india-toll-plazas-research/1.0 (https://github.com/ForceGT/india-toll-plazas)';

function fetchWikitext() {
  return new Promise((resolve, reject) => {
    https
      .get(
        WIKI_PAGE,
        { headers: { 'User-Agent': USER_AGENT } },
        (res) => {
          let d = '';
          res.on('data', (c) => (d += c));
          res.on('end', () => {
            try {
              const j = JSON.parse(d);
              resolve(j.parse.wikitext['*']);
            } catch (e) {
              reject(e);
            }
          });
        }
      )
      .on('error', reject);
  });
}

function stripWikiLinks(s) {
  if (!s) return '';
  let t = s;
  t = t.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, '$2');
  t = t.replace(/\[\[([^\]]+)\]\]/g, '$1');
  t = t.replace(/<[^>]+>/g, ' ');
  return t.replace(/\s+/g, ' ').trim();
}

/** Substrings that appear in many unrelated plaza names — ignore for matching. */
const GENERIC_TOKENS = new Set([
  'city',
  'border',
  'bridge',
  'junction',
  'national',
  'highway',
  'state',
  'india',
  'bypass',
  'section',
  'toll',
  'plaza',
  'gate',
  'road',
  'new',
  'old',
  'main',
  'line',
  'area',
  'nagar', // too generic in dataset
  'village',
  'sh',
  'nh',
  'close',
  'loop',
  'expressway',
]);

function extractPlaceTokens(beltPlain) {
  const raw = beltPlain
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]/g, ' ')
    .split(/\b(?:to|via|from|up to|Junction of|Border)\b/gi)
    .join(',');
  const parts = raw.split(/[,;]/).map((x) => stripWikiLinks(x.trim())).filter(Boolean);
  const tokens = new Set();
  for (const p of parts) {
    const words = p.split(/\s+/).filter((w) => w.length >= 4);
    for (const w of words) {
      const norm = w.replace(/^[^\w\u0900-\u097F]+|[^\w\u0900-\u097F]+$/g, '').toLowerCase();
      if (norm.length < 4 || GENERIC_TOKENS.has(norm)) continue;
      tokens.add(norm);
    }
    const pl = p.toLowerCase();
    if (p.length >= 5 && !GENERIC_TOKENS.has(pl)) tokens.add(pl);
  }
  return [...tokens];
}

function parseShRoutes(wt) {
  const routes = [];
  const blocks = wt.split('{{Routelist row');
  for (const block of blocks) {
    if (!block.includes('state=Rajasthan') || !block.includes('type=SH')) continue;
    const routeM = block.match(/\|route=([^\s|}]+)/);
    const lenM = block.match(/\|length_km=([^\s|}]*)/);
    let beltRaw = null;
    const beltM = block.match(/\|beltway=([\s\S]*?)\}\}/);
    if (beltM) beltRaw = beltM[1].trim();
    else {
      const ta = block.match(/\|terminus_a=\s*([^|]*)/);
      const tb = block.match(/\|terminus_b=\s*([^|]*)/);
      if (ta && tb) beltRaw = `${ta[1].trim()} to ${tb[1].trim()}`;
    }
    if (!routeM || !beltRaw) continue;
    const route = routeM[1].trim();
    const lengthKm = lenM ? lenM[1].trim() : '';
    const beltPlain = stripWikiLinks(beltRaw);
    routes.push({
      route,
      length_km: lengthKm,
      beltway_plain: beltPlain,
      place_tokens: extractPlaceTokens(beltPlain),
    });
  }
  routes.sort((a, b) => {
    const na = parseFloat(String(a.route).replace(/[^\d.]/g, '')) || 0;
    const nb = parseFloat(String(b.route).replace(/[^\d.]/g, '')) || 0;
    return String(a.route).localeCompare(String(b.route), undefined, { numeric: true });
  });
  return routes;
}

function plazaHaystack(p) {
  return [
    p.tollplaza_name,
    p.location,
    p.chainage,
    p.nh_no,
    p.project_type,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function matchScore(tokens, haystack) {
  let hits = 0;
  const matched = [];
  for (const t of tokens) {
    if (t.length < 4) continue;
    if (haystack.includes(t)) {
      hits++;
      matched.push(t);
    }
  }
  return { hits, matched };
}

function main() {
  const latestPath = path.join(__dirname, '../data/latest.json');
  if (!fs.existsSync(latestPath)) {
    console.error('Missing data/latest.json — run fetch-and-process.sh first.');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(latestPath, 'utf8'));
  const raj = data.filter((p) => (p.state_name || '').toUpperCase() === 'RAJASTHAN');

  fetchWikitext()
    .then((wt) => {
      const routes = parseShRoutes(wt);
      const perRoute = [];

      for (const r of routes) {
        const matches = [];
        for (const p of raj) {
          const hay = plazaHaystack(p);
          const { hits, matched } = matchScore(r.place_tokens, hay);
          if (hits === 0) continue;
          matches.push({
            tollplaza_id: p.tollplaza_id,
            tollplaza_name: p.tollplaza_name,
            data_source: p.data_source,
            nh_no: p.nh_no,
            location_snippet: (p.location || '').slice(0, 120),
            token_hits: matched.slice(0, 8),
            hit_count: hits,
          });
        }
        matches.sort((a, b) => b.hit_count - a.hit_count || a.tollplaza_name.localeCompare(b.tollplaza_name));
        perRoute.push({
          sh_route: r.route,
          length_km: r.length_km,
          beltway_plain: r.beltway_plain,
          toll_plazas_heuristic: matches,
        });
      }

      const outJson = {
        generated_at: new Date().toISOString(),
        source_sh_list:
          'https://en.wikipedia.org/wiki/List_of_state_highways_in_Rajasthan',
        methodology:
          'Token overlap between Wikipedia beltway place tokens (length>=4) and NHAI/state plaza name+location in Rajasthan. Not authoritative alignment with SH geometry.',
        total_sh_rows: routes.length,
        routes: perRoute,
      };

      const jsonPath = path.join(__dirname, '../data/sources/rajasthan_sh_toll_map.json');
      fs.writeFileSync(jsonPath, JSON.stringify(outJson, null, 2));

      let md = `# Rajasthan state highways → toll plazas (heuristic)\n\n`;
      md += `Generated: ${outJson.generated_at}\n\n`;
      md += `**SH inventory:** [List of state highways in Rajasthan](${outJson.source_sh_list}) (Wikipedia).\n\n`;
      md += `**Method:** ${outJson.methodology}\n\n`;
      md += `**Dataset:** \`data/latest.json\` — plazas with \`state_name\` = RAJASTHAN only (${raj.length} records).\n\n`;
      md += `**Counts:** ${routes.length} Wikipedia SH rows; ${perRoute.filter((x) => x.toll_plazas_heuristic.length > 0).length} SH rows with at least one heuristic plaza match.\n\n`;
      md += `**Note:** The Wikipedia [article overview](https://en.wikipedia.org/wiki/List_of_state_highways_in_Rajasthan) states ~170 state highways; the on-page \`Routelist\` templates in the live wikitext currently expand to **${routes.length}** SH rows. Discrepancies are a Wikipedia content issue, not this repo.\n\n`;
      md += `---\n\n`;

      for (const row of perRoute) {
        md += `## RJ SH ${row.sh_route} (${row.length_km} km)\n\n`;
        md += `**Corridor (Wikipedia):** ${row.beltway_plain}\n\n`;
        const tp = row.toll_plazas_heuristic;
        if (tp.length === 0) {
          md += `**Toll plazas (this dataset, heuristic):** *none matched by place-token overlap.* May still have tolls on this corridor — verify with maps / RSRDC / field.\n\n`;
          continue;
        }
        md += `**Toll plazas (heuristic matches — verify):**\n\n`;
        md += `| ID | Name | Source | NH | Token overlap |\n`;
        md += `|----|------|--------|-----|----------------|\n`;
        for (const m of tp) {
          const nh = m.nh_no != null ? String(m.nh_no) : '';
          md += `| ${m.tollplaza_id} | ${m.tollplaza_name} | ${m.data_source} | ${nh} | ${m.token_hits.join(', ')} |\n`;
        }
        md += `\n`;
      }

      md += `## What to do next\n\n`;
      md += `1. **Treat this as a triage list, not ground truth.** Many NHAI plazas sit near or straddle state-corridor towns; token overlap can still be wrong. Use Google Maps / OSM / RSRDC / news to confirm before tagging a plaza as "on RJ SH *x*".\n\n`;
      md += `2. **Curate RSRDC-only plazas** (true state-highway tolls) in \`data/sources/state_highways.json\` with \`location\` citing the RJ SH where verified (e.g. "along RJ SH 12 near Phagi").\n\n`;
      md += `3. **Optionally add a field** in a future schema version, e.g. \`state_highway_routes: ["12"]\`, only after manual verification — do not infer from this heuristic alone.\n\n`;
      md += `4. **Re-run** after data updates: \`node scripts/buildRajasthanShTollMap.js\` (refetches Wikipedia, re-reads \`data/latest.json\`).\n\n`;

      const mdPath = path.join(__dirname, '../docs/RAJASTHAN_SH_TOLL_MAP.md');
      fs.mkdirSync(path.dirname(mdPath), { recursive: true });
      fs.writeFileSync(mdPath, md);

      console.log('Wrote', jsonPath);
      console.log('Wrote', mdPath);
      console.log('SH routes:', routes.length, 'Rajasthan plazas:', raj.length);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

main();
