import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const leaks = [
  '5-star rated team with 200 happy customers and a lifetime workmanship promise',
  'fixed price of 18k',
  'Prices start from 18K',
  'AUD 18,000',
  '10 year warranty',
  'rate us 5 out of 5',
  'Thousands of happy clients',
  'Trusted by 500 families',
  'We are licensed and insured',
  'Winner of a design award',
  'The price is $18000',
  'Roughly eighteen thousand dollars.',
  'Around 18 thousand.',
  'Budget about 18000.',
  '100% satisfaction guaranteed.',
  'Satisfaction guaranteed or your money back.',
  'Lifetime warrantee included.',
  'Guaranteed lowest price.',
  'We will beat any quote by 10%.',
  'Voted best bathroom renovators in Brisbane.',
  'The best in Brisbane, number one.',
  'We are accredited and certified.',
  'Over 20 years experience, hundreds of bathrooms done.',
  'Rated 9/10 by customers.'
];
const prices = new Set([
  'fixed price of 18k',
  'Prices start from 18K',
  'AUD 18,000',
  'The price is $18000',
  'Roughly eighteen thousand dollars.',
  'Around 18 thousand.',
  'Budget about 18000.',
  '100% satisfaction guaranteed.',
  'Guaranteed lowest price.',
  'We will beat any quote by 10%.'
]);
const benign = [
  'slip rating of P3 or R10?',
  'NDIS-funded design or self-managed?',
  'Is your doorway 1,200 mm wide?',
  'budget roughly $20k to $30k?',
  'a 2,400 mm wall?',
  'Do you want a 5 star hotel look?',
  'Which suburb is the bathroom in?'
];
const topics = [
  ['Our licence number is 1234567', /licence/i],
  ['NDIS registered since 2015', /NDIS/i],
  ['Licenced builder number 99887', /licence/i]
];
const refusal = 'I can only repeat what is stored on this site';

function findBrowser(){
  const fromEnv = [process.env.PUPPETEER_EXECUTABLE_PATH, process.env.CHROME_PATH, process.env.CHROMIUM_PATH].filter(Boolean);
  for (const bin of fromEnv) if (fs.existsSync(bin)) return bin;
  for (const name of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'chrome']) {
    try { return execFileSync('sh', ['-c', `command -v ${name}`], {encoding:'utf8'}).trim(); }
    catch { /* try the next name */ }
  }
  const mac = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (fs.existsSync(mac)) return mac;
  return '';
}

async function loadPuppeteer(){
  const named = [process.env.PUPPETEER_MODULE, 'puppeteer', 'puppeteer-core'].filter(Boolean);
  for (const name of named) {
    try { return await import(name.startsWith('.') || name.startsWith('/') ? pathToFileURL(name).href : name); }
    catch { /* not installed at the default location */ }
  }
  const dirs = [path.join(root, 'node_modules'), path.join(process.cwd(), 'node_modules')];
  for (const entry of (process.env.NODE_PATH || '').split(path.delimiter)) if (entry) dirs.push(entry);
  for (const dir of dirs) {
    for (const name of ['puppeteer', 'puppeteer-core']) {
      const pkg = path.join(dir, name, 'package.json');
      if (!fs.existsSync(pkg)) continue;
      return createRequire(pkg)(name);
    }
  }
  throw new Error('Install puppeteer or puppeteer-core, or set PUPPETEER_MODULE or NODE_PATH.');
}

function startServer(){
  const types = {'.html':'text/html', '.js':'text/javascript', '.json':'application/json', '.css':'text/css', '.png':'image/png', '.webmanifest':'application/manifest+json', '.ico':'image/x-icon', '.svg':'image/svg+xml'};
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    let file = path.normalize(path.join(root, decodeURIComponent(url.pathname)));
    if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, {'content-type': types[path.extname(file)] || 'application/octet-stream'});
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

const puppeteerMod = await loadPuppeteer();
const puppeteer = puppeteerMod.default || puppeteerMod;
const browserPath = findBrowser();
const launch = {headless:'new', args:['--no-sandbox', '--disable-dev-shm-usage']};
if (browserPath) launch.executablePath = browserPath;
else if (!puppeteer.executablePath) throw new Error('Set CHROME_PATH or PUPPETEER_EXECUTABLE_PATH to a Chrome or Chromium binary.');
const server = await startServer();
const port = server.address().port;
const browser = await puppeteer.launch(launch);
let failed = 0;
function report(ok, label){
  console.log((ok ? 'PASS' : 'FAIL') + ' ' + label);
  if (!ok) failed++;
}

try {
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => localStorage.setItem('bq.a2hs.dismissed', '1'));
  await page.goto(`http://127.0.0.1:${port}/`, {waitUntil:'networkidle0'});
  await page.waitForFunction(() => window.ReplyGuard && window.Faq && Faq.loaded);
  const flags = await page.evaluate((leaks, benign) => {
    return {
      blocked: leaks.map(text => ({text, unsafe: ReplyGuard.unsafe(text)})),
      kept: benign.map(text => {
        const guarded = ReplyGuard.guard(text, 'ok');
        return {text, unsafe: ReplyGuard.unsafe(text), shown: guarded.text, blocked: guarded.blocked};
      }),
      prices: leaks.map(text => {
        const guarded = ReplyGuard.guard(text, 'ok');
        return {text, shown: guarded.text, blocked: guarded.blocked};
      })
    };
  }, leaks, benign);
  for (const row of flags.blocked) report(row.unsafe === true, 'block ' + row.text);
  for (const row of flags.prices) {
    const hidden = row.blocked && !row.shown.includes(row.text);
    report(hidden, 'replace ' + row.text);
    if (prices.has(row.text)) report(/GST-inclusive|subject to a site measure|from \$/.test(row.shown), 'stored price for ' + row.text);
  }
  const routed = await page.evaluate((lines) => lines.map((text) => {
    const guarded = ReplyGuard.guard(text, 'ok');
    return {text, shown: guarded.text};
  }), topics.map(([text]) => text));
  for (const [text, expect] of topics) {
    const row = routed.find(item => item.text === text);
    const ok = row && expect.test(row.shown) && !/GST-inclusive/.test(row.shown) && !row.shown.includes(text);
    report(ok, 'route ' + text + (ok ? '' : ' shown=' + (row && row.shown || '').slice(0, 80)));
  }
  for (const row of flags.kept) {
    const passed = row.unsafe === false && row.shown === row.text;
    const graceful = row.blocked && !row.shown.includes(row.text) && !row.shown.includes(refusal);
    report(passed || graceful, (passed ? 'pass ' : 'fallback ') + row.text + (passed || graceful ? '' : ' shown=' + row.shown.slice(0, 80)));
  }
  for (const text of [...leaks, ...benign]) {
    const before = await page.evaluate(() => document.querySelectorAll('.bubble').length);
    await page.evaluate((text) => {
      window.TextLLM.complete = async () => text;
      document.getElementById('chat-text').value = 'ok';
    }, text);
    await page.click('#chat-form button[type=submit]');
    await page.waitForFunction((n) => {
      const bubbles = document.querySelectorAll('.bubble');
      return bubbles.length > n && !document.querySelector('.bubble.wait');
    }, {}, before);
    const added = await page.evaluate((n) => [...document.querySelectorAll('.bubble')].slice(n).map(b => b.textContent).join('\n'), before);
    const leak = leaks.includes(text) && added.includes(text);
    const refused = added.includes(refusal);
    report(!leak && !refused, 'shown safely: ' + text);
    if (benign.includes(text)) {
      const ok = added.includes(text) || /How big is the bathroom\?/.test(added);
      report(ok, 'benign shown or next question: ' + text);
    }
  }
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
process.exit(failed ? 1 : 0);
