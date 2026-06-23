/* Screenshot MOBILE (full page) p/ analisar responsividade.
   Uso: node motor/shot-mobile.js clientes/<slug>/<slug>.html [saida.png] */
const { chromium } = require('playwright-core');
const path = require('path'); const fs = require('fs');
const sleep = ms => new Promise(r => setTimeout(r, ms));
function findChromium(){
  const base = path.join(process.env.LOCALAPPDATA || (process.env.HOME+'/AppData/Local'), 'ms-playwright');
  const dir = fs.readdirSync(base).find(d => d.startsWith('chromium-') && !d.includes('headless'));
  for(const s of ['chrome-win64','chrome-win']){ const p=path.join(base,dir,s,'chrome.exe'); if(fs.existsSync(p)) return p; }
  throw new Error('chromium não encontrado');
}
(async () => {
  const html = path.resolve(process.argv[2]);
  const out = path.resolve(process.argv[3] || path.join(path.dirname(html),'_preview','mobile.png'));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const browser = await chromium.launch({ executablePath: findChromium() });
  const page = await (await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true })).newPage();
  await page.goto('file://'+html.replace(/\\/g,'/'), { waitUntil:'networkidle' });
  await sleep(1500);
  // força tudo visível (anula reveal-on-scroll e loader) p/ ver o layout real
  await page.addStyleTag({ content: '#loader{display:none!important}[data-rev]{opacity:1!important;transform:none!important}' });
  await sleep(600);
  await page.screenshot({ path: out, fullPage: true });
  await page.screenshot({ path: out.replace(/\.png$/,'-top.png'), fullPage: false });
  // menu aberto (estado do sanduíche)
  const burger = await page.$('#burger');
  if(burger){ await burger.click(); await sleep(700); await page.screenshot({ path: out.replace(/\.png$/,'-menu.png') }); }
  await browser.close();
  console.log('✓ '+out);
})().catch(e=>{ console.error(e); process.exit(1); });
