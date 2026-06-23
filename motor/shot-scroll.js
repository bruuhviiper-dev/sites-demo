/* Screenshot do VIEWPORT após rolar até uma seção (menu fechado, estado real).
   Uso: node motor/shot-scroll.js <html> <#secao> <saida.png> */
const { chromium } = require('playwright-core');
const path = require('path'); const fs = require('fs');
const sleep = ms => new Promise(r => setTimeout(r, ms));
function findChromium(){
  const base = path.join(process.env.LOCALAPPDATA, 'ms-playwright');
  const dir = fs.readdirSync(base).find(d => d.startsWith('chromium-') && !d.includes('headless'));
  for(const s of ['chrome-win64','chrome-win']){ const p=path.join(base,dir,s,'chrome.exe'); if(fs.existsSync(p)) return p; }
  throw new Error('chromium não encontrado');
}
(async () => {
  const html = path.resolve(process.argv[2]);
  const sel = process.argv[3] || '#contato';
  const out = path.resolve(process.argv[4] || path.join(path.dirname(html),'_preview','scroll.png'));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const browser = await chromium.launch({ executablePath: findChromium() });
  const page = await (await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true })).newPage();
  await page.goto('file://'+html.replace(/\\/g,'/'), { waitUntil:'networkidle' });
  await sleep(1800);
  await page.evaluate(s => { const el=document.querySelector(s); if(el) el.scrollIntoView({block:'start'}); }, sel);
  await sleep(1200);
  await page.screenshot({ path: out, fullPage: false });
  await browser.close();
  console.log('✓ '+out);
})().catch(e=>{ console.error(e); process.exit(1); });
