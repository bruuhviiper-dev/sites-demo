// Grava vídeo de apresentação + screenshots do index8.html (Fany Diresta)
// Usa playwright-core com o Chromium já instalado em ms-playwright.
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'apresentacao fany');
const FILE_URL = 'file://' + path.join(ROOT, 'index8.html').replace(/\\/g, '/');

// Localiza o executável do chromium dentro do cache do ms-playwright
function findChromium() {
  const base = path.join(process.env.LOCALAPPDATA || (process.env.HOME + '/AppData/Local'), 'ms-playwright');
  const dir = fs.readdirSync(base).find(d => d.startsWith('chromium-'));
  return path.join(base, dir, 'chrome-win64', 'chrome.exe');
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch({
    executablePath: findChromium(),
    args: ['--autoplay-policy=no-user-gesture-required']
  });

  // ---------- DESKTOP: vídeo gravado ----------
  const context = await browser.newContext({
    viewport: { width: 1440, height: 810 },
    recordVideo: { dir: OUT, size: { width: 1440, height: 810 } },
    deviceScaleFactor: 1
  });
  const page = await context.newPage();
  await page.goto(FILE_URL, { waitUntil: 'networkidle' });

  // Espera o loader sumir
  await sleep(2200);

  // Scroll suave de cima a baixo durante a gravação
  const total = await page.evaluate(() => document.body.scrollHeight - window.innerHeight);
  const steps = 90;
  for (let i = 0; i <= steps; i++) {
    const y = Math.round((i / steps) * total);
    await page.evaluate(_y => window.scrollTo({ top: _y, behavior: 'instant' }), y);
    await sleep(120);
  }
  await sleep(800);
  // Volta ao topo para encerrar com o hero
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  await sleep(1800);

  await context.close(); // grava o .webm

  // Renomeia o vídeo gerado
  const vids = fs.readdirSync(OUT).filter(f => f.endsWith('.webm'));
  if (vids.length) {
    fs.renameSync(path.join(OUT, vids[0]), path.join(OUT, '00_video_apresentacao.webm'));
    console.log('Video salvo: 00_video_apresentacao.webm');
  }

  // ---------- DESKTOP: screenshots por seção ----------
  const ctx2 = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.25 });
  const p2 = await ctx2.newPage();
  await p2.goto(FILE_URL, { waitUntil: 'networkidle' });
  await sleep(2000);

  const shots = [
    ['#inicio', '01_hero.png'],
    ['#sobre', '02_sobre.png'],
    ['#servicos', '03_servicos.png'],
    ['#produtos', '04_produtos.png'],
    ['#depoimentos', '05_depoimentos.png'],
    ['#instagram', '06_instagram.png'],
    ['#contato', '07_contato.png'],
  ];
  for (const [sel, name] of shots) {
    await p2.evaluate(s => document.querySelector(s)?.scrollIntoView(), sel);
    await sleep(1100);
    const el = await p2.$(sel);
    if (el) await el.screenshot({ path: path.join(OUT, name) });
    console.log('Screenshot:', name);
  }
  // Página completa
  await p2.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  await p2.screenshot({ path: path.join(OUT, '08_pagina_completa.png'), fullPage: true });
  console.log('Screenshot: 08_pagina_completa.png');
  await ctx2.close();

  // ---------- MOBILE: screenshots ----------
  const ctx3 = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
  const p3 = await ctx3.newPage();
  await p3.goto(FILE_URL, { waitUntil: 'networkidle' });
  await sleep(2000);
  await p3.screenshot({ path: path.join(OUT, '09_mobile_hero.png') });
  await p3.evaluate(() => document.querySelector('#servicos')?.scrollIntoView());
  await sleep(1000);
  await p3.screenshot({ path: path.join(OUT, '10_mobile_servicos.png') });
  await p3.evaluate(() => window.scrollTo(0, 0));
  await sleep(400);
  await p3.screenshot({ path: path.join(OUT, '11_mobile_completo.png'), fullPage: true });
  console.log('Screenshots mobile prontos');
  await ctx3.close();

  await browser.close();
  console.log('CONCLUIDO');
})().catch(e => { console.error(e); process.exit(1); });
