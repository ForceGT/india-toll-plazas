const fs = require('fs');
const { submitTollReport } = require('./processCommunityReports');


function parseIssueBody(bodyText = '') {
  const getValue = (header) => {
    const regex = new RegExp(`##+ \\s*`${header}[^\\n]*\\n+([^#]+)`i);
    const match = bodyText.match(regex);
    return match ? match[1].trim() : null;
  };

  return {
    plazaCode: getValue('NETC Plaza Code / NHAI ID'),
    plazaName: getValue('Plaza Name'),
    vehicleClass: getValue('Vehicle Class') || 'car',
    amountInr: getValue('Actual Toll Amount Paid \\(INR\\)'),
    directionBearing: getValue('Compass Bearing / Direction \\(Optional\\)'),
    reporterId: process.env.ISSUE_AUTHOR || 'github_contributor'
  };
}

main();

function main() {
  const body = process.env.ISSUE_BODY || '';
  if (!body) {
    console.log('No issue body provided. Exiting.');
    return;
  }

  const parsed = parseIssueBody(body);
  if (!parsed.plazaCode || !parsed.amountInr) {
    console.log('Invalid or incomplete toll report. Skipping.');
    return;
  }


  const result = submitTollReport({
    plazaCode: parsed.plazaCode,
    plazaName: parsed.plazaName || 'Unknown Plaza',
    vehicleClass: parsed.vehicleClass,
    amountInr: parsed.amountInr,
    directionBearing: parsed.directionBearing ? Number(parsed.directionBearing) : null,
    source: 'github_issue',
    reporterId: parsed.reporterId
  });


  console.log('REPORT_PROCESSED_SUCCESS');
  console.log(JSON.stringify(result, null, 2));
}
