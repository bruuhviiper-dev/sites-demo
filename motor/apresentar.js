#!/usr/bin/env node
/* ============================================================
   GERADOR DE APRESENTAÇÃO (vídeo + screenshots)
   Uso: node motor/apresentar.js clientes/<slug>/<slug>.html
   Salva em clientes/<slug>/apresentacao/
   ============================================================ */
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

const sleep = ms => new Promise(r => setTimeout(r, ms));

function findChromium(){
  const base = path.join(process.env.LOCALAPPDATA || (process.env.HOME + '/AppData/Local'), 'ms-playwright');
  const dir = fs.readdirSync(base).find(d => d.startsWith('chromium-'));
  for(const sub of ['chrome-win64','chrome-win']){
    const p = path.join(base, dir, sub, 'chrome.exe');
    if(fs.existsSync(p)) return p;
  }
  throw new Error('Chromium não encontrado em ms-playwright');
}

(async () => {
  const htmlArg = process.argv[2];
  if(!htmlArg){ console.error('Uso: node motor/apresentar.js clientes/<slug>/<slug>.html'); process.exit(1); }
  const htmlPath = path.resolve(htmlArg);
  const OUT = path.join(path.dirname(htmlPath), 'apresentacao');
  fs.mkdirSync(OUT, { recursive: true });
  const URL = 'file://' + htmlPath.replace(/\\/g, '/');

  const browser = await chromium.launch({ executablePath: findChromium(), args: ['--autoplay-policy=no-user-gesture-required'] });

  /* ---- VÍDEO (desktop) ---- */
  const ctx = await browser.newContext({ viewport:{width:1440,height:810}, recordVideo:{dir:OUT,size:{width:1440,height:810}} });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil:'networkidle' });
  await sleep(2200);
  const total = await page.evaluate(() => document.body.scrollHeight - window.innerHeight);
  const steps = 90;
  for(let i=0;i<=steps;i++){ await page.evaluate(y => window.scrollTo({top:y,behavior:'instant'}), Math.round(i/steps*total)); await sleep(120); }
  await sleep(700);
  await page.evaluate(() => window.scrollTo({top:0,behavior:'smooth'}));
  await sleep(1600);
  await ctx.close();
  const vids = fs.readdirSync(OUT).filter(f => f.endsWith('.webm'));
  if(vids.length) fs.renameSync(path.join(OUT,vids[0]), path.join(OUT,'00_video_apresentacao.webm'));

  /* ---- SCREENSHOTS desktop por seção ---- */
  const ctx2 = await browser.newContext({ viewport:{width:1440,height:900}, deviceScaleFactor:1.25 });
  const p2 = await ctx2.newPage();
  await p2.goto(URL, { waitUntil:'networkidle' });
  await sleep(2000);
  const ids = ['inicio','sobre','servicos','produtos','depoimentos','instagram','contato'];
  let n = 1;
  for(const id of ids){
    const has = await p2.$('#'+id);
    if(!has) continue;
    await p2.evaluate(s => document.getElementById(s).scrollIntoView(), id);
    await sleep(1000);
    await has.screenshot({ path: path.join(OUT, String(n).padStart(2,'0')+'_'+id+'.png') });
    n++;
  }
  await p2.evaluate(() => window.scrollTo(0,0));
  await sleep(400);
  await p2.screenshot({ path: path.join(OUT, String(n).padStart(2,'0')+'_pagina_completa.png'), fullPage:true });
  await ctx2.close();

  /* ---- MOBILE ---- */
  const ctx3 = await browser.newContext({ viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true });
  const p3 = await ctx3.newPage();
  await p3.goto(URL, { waitUntil:'networkidle' });
  await sleep(2000);
  await p3.screenshot({ path: path.join(OUT, '90_mobile_hero.png') });
  await p3.evaluate(() => window.scrollTo(0,0));
  await sleep(300);
  await p3.screenshot({ path: path.join(OUT, '91_mobile_completo.png'), fullPage:true });
  await ctx3.close();

  await browser.close();
  console.log('✓ Apresentação salva em '+path.relative(process.cwd(), OUT));
})().catch(e => { console.error(e); process.exit(1); });
