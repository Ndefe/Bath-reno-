/* Builds the catalogue the website serves.
   The source file keeps supplier prices and the margin. It lives in tools/ and is not uploaded to GitHub Pages.
   The public file keeps sell rates only. */
const fs = require('fs');
const path = require('path');
const MARGIN = 0.27;
const srcPath = path.join(__dirname, 'catalogue-source.json');
const outPath = path.join(__dirname, '..', 'catalogue.json');
const src = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
const a = src.cost_assumptions;

function sellPerM2(labour) {
  return (labour + a.adhesive_grout) / (1 - MARGIN) * 0.25;
}
const SELL = {
  standard: sellPerM2(a.tile_labour),
  large: sellPerM2(a.tile_labour_large),
  feature: sellPerM2(a.tile_labour_feature)
};
function isLarge(tile) {
  const m = String(tile && tile.size_mm || '').match(/(\d+(?:\.\d+)?)\s*x\s*(\d+(?:\.\d+)?)/i);
  if (!m) return false;
  return +m[1] >= 600 && +m[2] >= 600;
}
function patternSell(pkg) {
  const floor = (pkg.tiles || []).find(t => t.role === 'floor');
  return {
    floor: isLarge(floor) ? SELL.large : SELL.standard,
    wall: SELL.standard,
    feature: SELL.feature
  };
}
const patternByPackage = {};
for (const pkg of src.packages || []) patternByPackage[pkg.id] = patternSell(pkg);

const PRICE_KEYS = ['price_per_m2', 'price_unit', 'box_or_unit_price', 'm2_per_box', 'price_note', 'price_verified', 'price_source', 'rrp'];
function publicProduct(p) {
  const out = {};
  for (const [k, v] of Object.entries(p)) {
    if (PRICE_KEYS.includes(k)) continue;
    if (k === 'note' && /\$|margin|0\.73/i.test(String(v || ''))) continue;
    out[k] = v;
  }
  return out;
}
function publicPackage(pkg) {
  const pricing = pkg.pricing || {};
  return {
    id: pkg.id,
    name: pkg.name,
    tier: pkg.tier,
    description: pkg.description,
    tiles: (pkg.tiles || []).map(publicProduct),
    items: (pkg.items || []).map(publicProduct),
    pricing: {
      base_fee: pricing.base_fee,
      rate_per_m2: pricing.rate_per_m2,
      formula: 'price = base_fee + rate_per_m2 * floor_area_m2 (inc GST)',
      includes: pricing.includes || ''
    }
  };
}
function publicExtra(ex) {
  const out = { id: ex.id, name: ex.name, price: ex.price, unit: ex.unit };
  if (ex.id === 'pattern_lay') {
    out.price = null;
    out.unit = 'm2';
    out.patternSell = patternByPackage;
  }
  return out;
}
const pub = {
  business: src.business,
  region: src.region,
  currency: src.currency,
  prices_include_gst: src.prices_include_gst,
  date_checked: src.date_checked,
  pricing_model: 'price = base_fee + rate_per_m2 * floor area; bath and extras separate. Figures are sell prices, incl. GST.',
  packages: (src.packages || []).map(publicPackage),
  extras: (src.extras || []).map(publicExtra)
};
fs.writeFileSync(outPath, JSON.stringify(pub, null, 2) + '\n');
const text = fs.readFileSync(outPath, 'utf8');
if (/margin|cost_assumptions|rrp|price_per_m2|27%/.test(text)) {
  console.error('Public catalogue still has a cost or margin field');
  process.exit(1);
}
console.log('Wrote', outPath, 'bytes', text.length);
