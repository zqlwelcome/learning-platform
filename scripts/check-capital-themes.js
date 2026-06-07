#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const filePath = path.join(root, 'daily-data.js');
const source = fs.readFileSync(filePath, 'utf8');

const staleTerms = ['电力板块', '白酒板块', '超级电容'];
const missingTerms = ['function renderSectorHeatCard', 'sectors.map((sector, index) => renderSectorHeatCard'];
const stale = staleTerms.filter(term => source.includes(term));
const missing = missingTerms.filter(term => !source.includes(term));

if (stale.length || missing.length) {
    console.error('Capital themes panel is stale.');
    if (stale.length) console.error(`Stale static terms: ${stale.join(', ')}`);
    if (missing.length) console.error(`Missing dynamic hooks: ${missing.join(', ')}`);
    process.exit(1);
}

console.log('Capital themes panel is dynamic.');
