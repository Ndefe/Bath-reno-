import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

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
const launch = {headless:'new', args:['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader']};
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

async function openPlanner(page){
  await page.setViewport({width:375, height:667, hasTouch:true, isMobile:true, deviceScaleFactor:1});
  await page.evaluateOnNewDocument(() => localStorage.setItem('bq.a2hs.dismissed', '1'));
  await page.goto('http://127.0.0.1:' + port + '/', {waitUntil:'domcontentloaded'});
  await page.evaluate(() => document.querySelector('nav button[data-view=planner]').click());
  await page.waitForFunction(() => document.querySelector('#pl-canvas canvas'));
  await page.evaluate(() => {
    document.getElementById('pl-stage').scrollIntoView({block:'center'});
    window.Planner.addItem('toilet');
  });
  await new Promise(r => setTimeout(r, 300));
}

try {
  const page = await browser.newPage();
  const logs = [];
  page.on('console', msg => logs.push(msg.text()));
  page.on('pageerror', err => logs.push(String(err)));
  await openPlanner(page);
  const swipe = await page.evaluate(async () => {
    const canvas = document.querySelector('#pl-canvas canvas');
    const rect = canvas.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = () => {
      const c = window.Planner._.camera.position;
      return Math.hypot(c.x, c.y - 0.9, c.z);
    };
    const fire = (type, id, x, y) => canvas.dispatchEvent(new PointerEvent(type, {
      pointerId:id, pointerType:'touch', clientX:x, clientY:y, pageX:x + scrollX, pageY:y + scrollY, bubbles:true, cancelable:true
    }));
    const before = dist();
    fire('pointerdown', 9, cx, cy);
    fire('pointermove', 9, cx, cy + 90);
    fire('pointercancel', 9, cx, cy + 90);
    fire('pointerup', 9, cx, cy + 90);
    const afterSwipe = canvas.style.touchAction;
    const start = 120;
    const end = 240;
    fire('pointerdown', 3, cx - start / 2, cy);
    fire('pointerdown', 4, cx + start / 2, cy);
    for (let i = 1; i <= 4; i++) {
      const s = start + (end - start) * (i / 4);
      fire('pointermove', 3, cx - s / 2, cy);
      fire('pointermove', 4, cx + s / 2, cy);
    }
    fire('pointerup', 3, cx - end / 2, cy);
    fire('pointerup', 4, cx + end / 2, cy);
    await new Promise(r => setTimeout(r, 80));
    const after = dist();
    return {before, after, delta: Math.abs(after - before), touchAction: afterSwipe, touchAfter: canvas.style.touchAction};
  });
  report(swipe.touchAction === 'pan-y' && swipe.delta > 0.05 && swipe.touchAfter === 'pan-y',
    'vertical swipe then pinch still moves the camera ' + JSON.stringify(swipe));
  await page.evaluate(() => document.querySelector('#pl-views [data-view=eye]').click());
  await new Promise(r => setTimeout(r, 800));
  const pinch = await page.evaluate(async () => {
    const canvas = document.querySelector('#pl-canvas canvas');
    const rect = canvas.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const hit = (x, y) => {
      const el = document.elementFromPoint(x, y);
      return el && (el.id || el.tagName);
    };
    const dist = () => {
      const c = window.Planner._.camera.position;
      return Math.hypot(c.x, c.y - 0.9, c.z);
    };
    const before = dist();
    const start = 200;
    const end = start * before / 6.04;
    const fire = (type, id, x, y) => canvas.dispatchEvent(new PointerEvent(type, {
      pointerId:id, pointerType:'touch', clientX:x, clientY:y, pageX:x + scrollX, pageY:y + scrollY, bubbles:true, cancelable:true
    }));
    const runs = [];
    for (let n = 0; n < 3; n++) {
      const from = dist();
      const closeTo = start * from / 6.04;
      fire('pointerdown', 1, cx - start / 2, cy);
      fire('pointerdown', 2, cx + start / 2, cy);
      for (let i = 1; i <= 6; i++) {
        const s = start + (closeTo - start) * (i / 6);
        fire('pointermove', 1, cx - s / 2, cy);
        fire('pointermove', 2, cx + s / 2, cy);
      }
      fire('pointerup', 1, cx - closeTo / 2, cy);
      fire('pointerup', 2, cx + closeTo / 2, cy);
      await new Promise(r => setTimeout(r, 30));
      runs.push(dist());
    }
    const pad = document.getElementById('pl-float').getBoundingClientRect();
    const undo = document.getElementById('pl-undo').getBoundingClientRect();
    const undoEl = document.elementFromPoint(undo.left + undo.width / 2, undo.top + undo.height / 2);
    const overlaps = (x, y) => x >= pad.left && x <= pad.right && y >= pad.top && y <= pad.bottom;
    return {
      before, end, runs,
      left: hit(cx - 100, cy), right: hit(cx + 100, cy),
      padCoversCentre: overlaps(cx - 100, cy) || overlaps(cx + 100, cy),
      undo: undoEl && undoEl.id,
      padH: Math.round(pad.height),
      timeoutMs: window.RenderService.timeoutMs,
      hasCancel: typeof window.RenderService.cancel
    };
  });
  report(pinch.runs.every(d => Math.abs(d - 6.04) < 0.05), 'pinch-close x3 ends at 6.04 ' + JSON.stringify(pinch.runs));
  report(!pinch.padCoversCentre && pinch.left === 'CANVAS' && pinch.right === 'CANVAS', 'centre +/-100 hits the canvas ' + JSON.stringify(pinch));
  report(pinch.undo === 'pl-undo', 'undo is the control over the room');
  const widths = [[360, 667], [375, 667], [390, 844], [412, 915], [1280, 800]];
  for (const [width, height] of widths) {
    await page.setViewport({width, height, hasTouch:true, isMobile:true, deviceScaleFactor:1});
    await page.evaluate(() => document.getElementById('pl-stage').scrollIntoView({block:'center'}));
    await new Promise(r => setTimeout(r, 200));
    const pad = await page.evaluate(() => {
      const view = {w: window.innerWidth, h: window.innerHeight};
      const padEl = document.getElementById('pl-float');
      const padRect = padEl.getBoundingClientRect();
      const canvas = document.querySelector('#pl-canvas canvas').getBoundingClientRect();
      const ccx = canvas.left + canvas.width / 2;
      const ccy = canvas.top + canvas.height / 2;
      const buttons = [...padEl.querySelectorAll('button')].map(b => {
        const r = b.getBoundingClientRect();
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;
        const hit = document.elementFromPoint(x, y);
        return {
          id: b.id || b.getAttribute('aria-label'),
          x: Math.round(r.left),
          right: Math.round(r.right),
          h: Math.round(r.height),
          inView: r.left >= -1 && r.right <= view.w + 1 && r.top >= -1 && r.bottom <= view.h + 1,
          tall: r.height >= 43.5,
          hit: !!(hit && (hit === b || b.contains(hit)))
        };
      });
      const tops = new Set(buttons.map(b => {
        const el = document.getElementById(b.id) || [...padEl.querySelectorAll('button')].find(n => (n.id || n.getAttribute('aria-label')) === b.id);
        return Math.round(el.getBoundingClientRect().top);
      }));
      const phone = view.w <= 860;
      const tools = phone ? [] : ['pl-plan', 'pl-walk', 'pl-client'].map(id => {
        const el = document.getElementById(id);
        const r = el.getBoundingClientRect();
        const x = r.left + r.width / 2;
        const y = r.top + r.height / 2;
        const hit = document.elementFromPoint(x, y);
        return {id, hit: hit && hit.id, covered: x >= padRect.left && x <= padRect.right && y >= padRect.top && y <= padRect.bottom};
      });
      const undo = document.getElementById('pl-undo').getBoundingClientRect();
      const undoHit = document.elementFromPoint(undo.left + undo.width / 2, undo.top + undo.height / 2);
      return {
        buttons,
        rows: tops.size,
        scrolls: padEl.scrollWidth > padEl.clientWidth + 1,
        centreCovered: [ccx - 100, ccx + 100].some(x => x >= padRect.left && x <= padRect.right && ccy >= padRect.top && ccy <= padRect.bottom),
        panel: document.getElementById('pl-del').textContent + '|' + document.getElementById('pl-clear').textContent,
        tools,
        phone,
        undoHit: undoHit && undoHit.id,
        undoTall: undo.height >= 43.5,
        undoInView: undo.top >= -1 && undo.bottom <= view.h + 1 && undo.left >= -1 && undo.right <= view.w + 1
      };
    });
    const wanted = ['Nudge up', 'Nudge left', 'pl-rot-fab', 'Nudge right', 'Nudge down', 'pl-flip', 'pl-dup', 'pl-fab-del', 'pl-fab-clear'];
    const byId = Object.fromEntries(pad.buttons.map(b => [b.id, b]));
    const missing = wanted.filter(id => !byId[id]);
    const bad = pad.buttons.filter(b => !b.inView || !b.tall || !b.hit);
    const toolsOk = pad.phone ? (pad.undoHit === 'pl-undo' && pad.undoTall && pad.undoInView) : pad.tools.every(t => t.hit === t.id && !t.covered);
    report(missing.length === 0 && bad.length === 0 && pad.rows === 2 && !pad.scrolls && !pad.centreCovered && toolsOk && pad.panel === 'Delete item|Clear all',
      'pad buttons reachable at ' + width + ' ' + JSON.stringify({rows: pad.rows, scrolls: pad.scrolls, centreCovered: pad.centreCovered, panel: pad.panel, tools: pad.tools, bad, missing}));
  }
  await page.setViewport({width:375, height:667, hasTouch:true, isMobile:true, deviceScaleFactor:1});
  const views = await page.evaluate(async () => {
    const shot = (type) => {
      const cam = window.Planner._.camera;
      const dir = new THREE.Vector3();
      cam.getWorldDirection(dir);
      const items = (window.Planner._.design && window.Planner._.design.items) || [];
      const it = items.find(i => i.type === type);
      const aim = it ? {x: it.x - cam.position.x, z: it.z - cam.position.z} : {x: 0, z: 0};
      const flat = Math.hypot(dir.x, dir.z) || 1;
      const toward = Math.hypot(aim.x, aim.z) || 1;
      return {
        pos: [+cam.position.x.toFixed(2), +cam.position.y.toFixed(2), +cam.position.z.toFixed(2)],
        look: [+(dir.x / flat).toFixed(3), +(dir.z / flat).toFixed(3)],
        facing: (dir.x * aim.x + dir.z * aim.z) / (flat * toward)
      };
    };
    document.querySelector('#pl-views [data-view=vanity]').click();
    await new Promise(r => setTimeout(r, 800));
    const vanity = shot('vanity');
    document.querySelector('#pl-views [data-view=shower]').click();
    await new Promise(r => setTimeout(r, 800));
    const shower = shot('shower');
    const dot = vanity.look[0] * shower.look[0] + vanity.look[1] * shower.look[1];
    return {vanity, shower, dot: +dot.toFixed(3)};
  });
  report(views.vanity.facing > 0.8 && views.shower.facing > 0.8 && views.dot < 0.35,
    'vanity and shower are different views ' + JSON.stringify(views));
  await page.evaluate(() => document.querySelector('#pl-views [data-view=eye]').click());
  await new Promise(r => setTimeout(r, 800));
  report(pinch.timeoutMs === 60000 && pinch.hasCancel === 'function', 'timeout is 60000 and cancel exists');
  const ignored = logs.filter(line => /Ignored attempt to cancel a touchmove|pointercancel/i.test(line));
  report(ignored.length === 0, 'no touch-cancel noise ' + ignored.slice(0, 3).join(' | '));

  const service = await page.evaluate(async () => {
    const hangs = () => new Promise((_resolve, reject) => {});
    const origFetch = window.fetch;
    const origTimeout = window.setTimeout;
    window.fetch = (_url, opts) => new Promise((_resolve, reject) => {
      if (opts && opts.signal) opts.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    });
    const delays = [];
    window.setTimeout = (fn, ms, ...rest) => {
      delays.push(ms);
      if (ms === window.RenderService.timeoutMs) return origTimeout(fn, 0);
      return origTimeout(fn, ms, ...rest);
    };
    let timeoutCode = '';
    try { await window.RenderService.generate({prompt:'room', seed:1}); }
    catch (err) { timeoutCode = err && err.code; }
    window.setTimeout = origTimeout;
    const pending = window.RenderService.generate({prompt:'room', seed:2});
    window.RenderService.cancel();
    let cancelCode = '';
    try { await pending; }
    catch (err) { cancelCode = err && err.code; }
    window.fetch = origFetch;
    return {timeoutCode, cancelCode, saw: delays.includes(60000)};
  });
  report(service.timeoutCode === 'timeout' && service.saw, '60s timeout aborts the render ' + JSON.stringify(service));
  report(service.cancelCode === 'cancel', 'cancel aborts the render ' + JSON.stringify(service));

  const ui = await page.evaluate(async () => {
    window.fetch = (_url, opts) => new Promise((_resolve, reject) => {
      if (opts && opts.signal) opts.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
    });
    document.getElementById('pl-fab-render').scrollIntoView({block:'center'});
    document.getElementById('pl-fab-render').click();
    await new Promise(r => setTimeout(r, 40));
    const mid = {
      label: document.getElementById('pl-fab-render').textContent,
      status: document.getElementById('pl-fab-status').textContent,
      error: document.getElementById('pl-fab-status').classList.contains('is-error')
    };
    document.getElementById('pl-fab-render').click();
    await new Promise(r => setTimeout(r, 40));
    return {
      mid,
      label: document.getElementById('pl-fab-render').textContent,
      status: document.getElementById('pl-fab-status').textContent,
      error: document.getElementById('pl-fab-status').classList.contains('is-error')
    };
  });
  report(ui.mid.label === 'Cancel' && ui.label === 'Render' && ui.status === '' && !ui.error, 'cancel resets the button and status ' + JSON.stringify(ui));
  await page.close();
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
process.exit(failed ? 1 : 0);
