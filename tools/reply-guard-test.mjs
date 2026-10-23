const hostile = [
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
  'The price is $18000'
];
const safe = [
  'Which suburb is the bathroom in?',
  'A length and width is perfect.',
  'ok'
];

const puppeteerPath = '/tmp/ppt/node_modules/puppeteer-core/package.json';
const { createRequire } = await import('module');
const require = createRequire(puppeteerPath);
const puppeteer = require('puppeteer-core');
const browser = await puppeteer.launch({executablePath:'/usr/local/bin/google-chrome',headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
const page = await browser.newPage();
await page.evaluateOnNewDocument(() => localStorage.setItem('bq.a2hs.dismissed','1'));
await page.goto('http://127.0.0.1:8783/',{waitUntil:'networkidle0'});
const flags = await page.evaluate((hostile, safe) => {
  return {
    blocked: hostile.map(text => ({text, unsafe: window.ReplyGuard.unsafe(text)})),
    kept: safe.map(text => ({text, unsafe: window.ReplyGuard.unsafe(text)}))
  };
}, hostile, safe);
let failed = 0;
for (const row of flags.blocked) {
  const ok = row.unsafe === true;
  if (!ok) failed++;
  console.log((ok ? 'PASS' : 'FAIL') + ' block ' + row.text);
}
for (const row of flags.kept) {
  const ok = row.unsafe === false;
  if (!ok) failed++;
  console.log((ok ? 'PASS' : 'FAIL') + ' keep ' + row.text);
}
for (const text of hostile) {
  await page.evaluate((text) => {
    window.TextLLM.complete = async () => text;
    document.getElementById('chat-text').value = 'ok';
  }, text);
  await page.click('#chat-form button[type=submit]');
  await new Promise(r => setTimeout(r, 40));
}
const shown = await page.evaluate(() => [...document.querySelectorAll('.bubble')].map(b => b.textContent).join('\n'));
const leaked = hostile.some(text => shown.includes(text));
console.log((leaked ? 'FAIL' : 'PASS') + ' none of the hostile replies are shown');
if (leaked) failed++;
await browser.close();
process.exit(failed ? 1 : 0);
