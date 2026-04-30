/**
 * Builds docs/RAJASTHAN_SH_WEB_SEARCH_DIGEST.md — per RJ SH notes from a fixed
 * "web research" knowledge map + default row text. Re-run when overrides change.
 * Does not call live web APIs (batch search was manual / assistant-led Apr 2026).
 */
const fs = require('fs');
const path = require('path');

const MAP_PATH = path.join(__dirname, '../data/sources/rajasthan_sh_toll_map.json');
const OUT_PATH = path.join(__dirname, '../docs/RAJASTHAN_SH_WEB_SEARCH_DIGEST.md');

/** Curated: route key = Wikipedia `route=` (e.g. "1", "12", "37A") */
const WEB_RESEARCH_OVERRIDES = {
  '1':
    'RSRDC tender (third-party index): repair/maintenance of toll plazas on **Bharatpur–Bayana–Gangapur–Bhadoti SH-01** — named plazas **Veerampur** (km 26.500), **Suroth** (km 64.500), **Sewa** (km 108.270). Source: [TenderShark — RSRDC Bharatpur… SH 01](https://www.tendershark.com/details/rajasthan-tender/rajasthan-state-road-development-and-construction-corporation/fa753a55-f9d6-49c4-8645-59985787eccc). **Rates:** use tender / PIU — not in open summary.',
  '9A':
    'Tender index: **toll tax on Chechat–Undwa road SH-9A** (2-year collection). Source: [FirstTender listing](https://www.firsttender.com/tenders-detail-23092342580.html). **Rates:** not in snippet.',
  '12':
    'English Wikipedia article claims **three toll stations** along the corridor at **Shahpura**, **Kekri**, and **Malpura** (may be dated; verify operationally). Source: [State Highway 12 (Rajasthan)](https://en.wikipedia.org/wiki/State_Highway_12_(Rajasthan)). **Commercial FASTag-style pages** discuss Jaipur–Phagi toll chains but often mix NH plazas — e.g. [tollbetween Jaipur–Phagi](https://www.tollbetween.com/rates/toll-charges-from-jaipur-to-phagi.php).',
  '22':
    'RSRDC sector notices: **fee collection agency** for **SH-22 BOT** (Mandrayal–Karauli / Mahuwa–Hindaun corridor class). Source class: [RSRDC toll SH tenders category](https://www.rajasthan-tenders.co.in/latest/rsrdc-toll-sh06-tenders/) and bid-aggregator mirrors. **Rates:** not in open snippet.',
  '37A':
    'RSRDC / Highways tender class: **SH-37A** (Dudu–Malpura–Todaraisingh–Chann BOT-type sections) — maintenance at toll plazas over km ranges (e.g. ~0–104 km band in notices). Source class: same [RSRDC SH toll tender indexes](https://www.rajasthan-tenders.co.in/latest/rsrdc-toll-sh06-tenders/). **Rates:** not consolidated publicly in one PDF found.',
  '66':
    'Tender-type references: **user fee collection on SH-66** (Siwana–Samdari–Balesar section). Source class: RSRDC / Rajasthan Highways e-tender aggregators (Nov 2025 window cited in search snippets). **Verify** current award on [eProc Rajasthan](https://eproc.rajasthan.gov.in/).',
  '6':
    'Dedicated tender category **RSRDC toll SH-06** (portal aggregation). Source: [rajasthan-tenders.co.in — rsrdc toll sh06](https://www.rajasthan-tenders.co.in/latest/rsrdc-toll-sh06-tenders/). **Rates:** per booth contract.',
  '90':
    'Secondary reporting: **SH-90** (Jaipur–Nagaur corridor, declared ~2015). Search snippets reference **Govindi** toll area (~km 74, Nagaur) in maintenance/work contexts — **not a full rate sheet**. Background: [TOI print — PWD new SHs](https://timesofindia.indiatimes.com/articleshowprint/46810384.cms). **Treat as lead only.**',
};

const COMMON_AGGREGATORS = [
  '[TollGuru — Rajasthan](https://tollguru.com/rajasthan-toll-roads) — mixed NH/SH; rarely tags RJ SH numbers.',
  '[datais.info — Rajasthan toll booths](https://datais.info/TollInformation/India/Fastag/Rajasthan/) — plaza pages usually **NH-xx / chainage**, not RJ SH.',
  '[IHMCL NH toll plaza PDFs](https://ihmcl.co.in/) — **national** highway inventory, not state highway numbering.',
];

const DEFAULT_NOTE =
  '**No indexed page found** that names this exact **RJ SH** designation together with current toll **rates** in this web-research pass (Apr 2026). Corridor may still have RSRDC/BOT tolls: search [**RSRDC toll / toll collection**](https://www.rajasthan-tenders.co.in/latest/toll-collection-rsrdc-tenders/) and maps for towns on the route.';

function main() {
  const j = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));
  const routes = j.routes;

  let md = `# Rajasthan RJ SH — web search digest\n\n`;
  md += `**Generated:** ${new Date().toISOString()}\n\n`;
  md += `**Scope:** This file complements [RAJASTHAN_SH_TOLL_MAP.md](./RAJASTHAN_SH_TOLL_MAP.md) (heuristic dataset overlap). It records what **open-web / tender-index** search readily surfaces **by route number**, not a complete field survey.\n\n`;
  md += `**Limitation:** We did **not** run ninety-two independent search-engine queries (one per highway). Findings come from **batch queries** (RSRDC, Wikipedia subpages, aggregator sites, tender mirrors) and **manual mapping** to SH numbers where those sources explicitly say **SH-xx**.\n\n`;
  md += `**Typical pattern:** Public web lists toll plazas by **name + NH number**; **RJ SH** appears more often in **PWD/RSRDC tenders** and occasional **news / Wikipedia** than in consumer toll-rate tables.\n\n`;
  md += `## Sources that cover Rajasthan tolls (usually without RJ SH codes)\n\n`;
  for (const c of COMMON_AGGREGATORS) md += `- ${c}\n`;
  md += `\n**Named plaza example (NH-centric listing):** [Sitarampura](https://datais.info/TollInformation/India/Fastag/Rajasthan/TollBooth-Sitarampura.html) — sources describe **NH-148C** / ring-road context; **aligning** that booth to a single Wikipedia RJ SH row requires map verification.\n\n`;
  md += `## Per-route web index (${routes.length} rows)\n\n`;
  md += `| RJ SH | km | Web research note (Apr 2026) |\n`;
  md += `|-------|-----|-----------------------------|\n`;

  for (const r of routes) {
    const key = String(r.sh_route);
    const km = r.length_km || '—';
    const note = WEB_RESEARCH_OVERRIDES[key] || DEFAULT_NOTE;
    const cell = note.replace(/\|/g, '\\|').replace(/\n/g, ' ');
    md += `| **${key}** | ${km} | ${cell} |\n`;
  }

  md += `\n## How to refresh\n\n`;
  md += `1. Re-run broader searches (RSRDC, \`"SH XX" toll Rajasthan\`, district news).\n`;
  md += `2. Add or edit entries in \`WEB_RESEARCH_OVERRIDES\` inside \`scripts/buildRajasthanWebSearchDigest.js\`.\n`;
  md += `3. Run: \`node scripts/buildRajasthanWebSearchDigest.js\`\n`;

  fs.writeFileSync(OUT_PATH, md);
  console.log('Wrote', OUT_PATH);
}

main();
