#!/usr/bin/env node
/* ============================================================
   TESTE RIGOROSO (mobile-first + navbar) — antes de subir
   Abre cada site no Chrome/Edge do sistema (sem screenshot) e verifica:
     • todo link da navbar e CTA aponta para uma seção que EXISTE
     • mobile (375px): hambúrguer aparece e abre/fecha o menu
     • sem overflow horizontal (mobile-first) no mobile e no desktop
     • sem erros de JS no console
   Uso:
     node motor/testar.js                      (todos os clientes)
     node motor/testar.js couve-e-flor ...      (só esses slugs)
   Atalho: npm run testar
   Sai com código 2 se achar problema (bom p/ travar antes do push).
   ============================================================ */
const { chromium } = require('playwright-core');
const path = require('path'); const fs = require('fs');
const sleep = ms => new Promise(r => setTimeout(r, ms));

const ROOT = path.resolve(__dirname, '..');
const CLIENTES = path.join(ROOT, 'clientes');

function findBrowser(){
  const cands = [
    process.env.ProgramFiles + '\\Google\\Chrome\\Application\\chrome.exe',
    process.env['ProgramFiles(x86)'] + '\\Google\\Chrome\\Application\\chrome.exe',
    process.env['ProgramFiles(x86)'] + '\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env.ProgramFiles + '\\Microsoft\\Edge\\Application\\msedge.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe')
  ];
  for(const p of cands){ if(p && fs.existsSync(p)) return p; }
  throw new Error('Chrome/Edge não encontrado para o teste.');
}

function sites(){
  const filtro = process.argv.slice(2);
  return fs.readdirSync(CLIENTES).filter(function(d){
    const html = path.join(CLIENTES, d, d + '.html');
    return fs.existsSync(html) && (!filtro.length || filtro.indexOf(d) !== -1);
  }).map(function(d){ return { slug: d, file: path.join(CLIENTES, d, d + '.html') }; });
}

(async () => {
  const lista = sites();
  if(!lista.length){ console.log('Nenhum site para testar.'); process.exit(0); }
  const browser = await chromium.launch({ executablePath: findBrowser() });
  let problemas = 0;

  for (const s of lista) {
    console.log('\n===== ' + s.slug + ' =====');
    const errs = [];
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await ctx.newPage();
    page.on('pageerror', e => errs.push('JS: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
    await page.goto('file://' + s.file.replace(/\\/g, '/'), { waitUntil: 'load' });
    await page.waitForSelector('header a', { timeout: 5000 }).catch(()=>{});
    await sleep(400);

    const r = await page.evaluate(() => {
      function check(a){ const id=a.getAttribute('href').slice(1); return { label:a.textContent.trim().replace(/\s+/g,' ').slice(0,42), href:'#'+id, ok: id==='' || !!document.getElementById(id) }; }
      const header = document.querySelector('header');
      const nav = header ? [...header.querySelectorAll('a[href^="#"]')].map(check) : [];
      const ctas = [...document.querySelectorAll('main a[href^="#"]')].map(check);
      const burger = document.querySelector('.burger, .brg');
      const links = document.querySelector('.nav-links, .nl');
      const open0 = links ? (links.classList.contains('open') || links.classList.contains('op')) : null;
      if (burger) burger.click();
      const open1 = links ? (links.classList.contains('open') || links.classList.contains('op')) : null;
      return {
        nav: nav, ctas: ctas,
        burgerVisible: burger ? getComputedStyle(burger).display !== 'none' : null,
        toggled: (open0 === false && open1 === true),
        overflow: document.documentElement.scrollWidth - window.innerWidth
      };
    });

    r.nav.forEach(n => { if (!n.ok) { problemas++; console.log('  ✗ nav  "'+n.label+'" -> '+n.href+'  <== SEÇÃO NÃO EXISTE'); } });
    r.ctas.forEach(n => { if (!n.ok) { problemas++; console.log('  ✗ cta  "'+n.label+'" -> '+n.href+'  <== SEÇÃO NÃO EXISTE'); } });
    if (r.burgerVisible !== true) { problemas++; console.log('  ✗ hambúrguer não visível no mobile'); }
    if (!r.toggled) { problemas++; console.log('  ✗ menu não abriu ao clicar no hambúrguer'); }
    if (r.overflow > 1) { problemas++; console.log('  ✗ overflow horizontal de ' + r.overflow + 'px (mobile)'); }
    if (errs.length) { problemas += errs.length; errs.forEach(e => console.log('  ✗ ' + e)); }

    await page.setViewportSize({ width: 1440, height: 900 });
    await sleep(200);
    const d = await page.evaluate(() => {
      const burger = document.querySelector('.burger, .brg');
      return { burgerVisible: burger ? getComputedStyle(burger).display !== 'none' : null,
               overflow: document.documentElement.scrollWidth - window.innerWidth };
    });
    if (d.burgerVisible !== false) { problemas++; console.log('  ✗ hambúrguer ainda visível no desktop'); }
    if (d.overflow > 1) { problemas++; console.log('  ✗ overflow horizontal de ' + d.overflow + 'px (desktop)'); }

    const okNav = r.nav.every(n=>n.ok) && r.ctas.every(n=>n.ok);
    if (okNav && r.toggled && r.burgerVisible && r.overflow<=1 && d.burgerVisible===false && d.overflow<=1 && !errs.length)
      console.log('  ✓ ok (navbar, hambúrguer, mobile-first, sem erros)');

    await ctx.close();
  }

  await browser.close();
  console.log('\n========================================');
  console.log(problemas === 0 ? '✓ TUDO OK — pode subir' : '✗ ' + problemas + ' problema(s) — NÃO suba antes de corrigir');
  process.exit(problemas === 0 ? 0 : 2);
})().catch(e => { console.error(e); process.exit(1); });
