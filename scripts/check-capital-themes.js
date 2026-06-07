#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dailyPath = path.join(root, 'daily-data.js');
const fallbackPath = path.join(root, 'capital-themes.js');
const indexPath = path.join(root, 'index.html');
const dailySource = fs.readFileSync(dailyPath, 'utf8');
const fallbackSource = fs.existsSync(fallbackPath) ? fs.readFileSync(fallbackPath, 'utf8') : '';
const indexSource = fs.readFileSync(indexPath, 'utf8');

const staleTerms = ['电力板块', '白酒板块', '超级电容'];
const dailyIsDynamic = dailySource.includes('function renderSectorHeatCard') &&
    dailySource.includes('sectors.map((sector, index) => renderSectorHeatCard');
const fallbackIsDynamic = fallbackSource.includes('window.buildSectorHeatHtml') &&
    fallbackSource.includes('renderDynamicCapitalThemeCard') &&
    indexSource.includes('capital-themes.js');
const stale = staleTerms.filter(term => dailySource.includes(term));

if (!dailyIsDynamic && !fallbackIsDynamic) {
    console.error('Capital themes panel is stale.');
    if (stale.length) console.error(`Stale static terms: ${stale.join(', ')}`);
    console.error('Missing dynamic daily-data.js and missing capital-themes.js runtime fallback.');
    process.exit(1);
}

if (stale.length && fallbackIsDynamic) {
    console.log(`Capital themes fallback active; daily-data.js still has stale terms: ${stale.join(', ')}`);
} else {
    console.log('Capital themes panel is dynamic.');
}
