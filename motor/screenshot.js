#!/usr/bin/env node
/* Screenshot rápido (sem vídeo) para conferir um site.
   Uso: node motor/screenshot.js clientes/<slug>/<slug>.html [secao] */
const { chromium } = require('playwright-core');
const path = require('path'); const fs = require('fs');
const sleep = ms => new Promise(r => setTimeout(r, ms));
function findChromium(){
  const base = path.join(process.env.LOCALAPPDATA || (process.env.HOME+'/AppData/Local'), 'ms-playwright');
  const dir = fs.readdirSync(base).find(d => d.startsWith('chromium-'));
  for(const s of ['chrome-win64','chrome-win']){ const p=path.join(base,dir,s,'chrome.exe'); if(fs.existsSync(p)) return p; }
  throw new Error('chromium não encontrado');
}
(async () => {
  const html = path.resolve(process.argv[2]);
  const sec = process.argv[3] || 'inicio';
  const OUT = path.join(path.dirname(html), '_preview');
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ executablePath: findChromium() });
  const page = await (await browser.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:1.1 })).newPage();
  await page.goto('file://'+html.replace(/\\/g,'/'), { waitUntil:'networkidle' });
  await sleep(2200);
  const el = await page.$('#'+sec);
  if(el){ await el.scrollIntoViewIfNeeded(); await sleep(900); await el.screenshot({ path: path.join(OUT, sec+'.png') }); }
  await browser.close();
  console.log('✓ '+path.relative(process.cwd(), path.join(OUT, sec+'.png')));
})().catch(e=>{ console.error(e); process.exit(1); });
