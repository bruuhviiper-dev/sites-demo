#!/usr/bin/env node
/* ============================================================
   PUBLICAR — gera o site E coloca no ar (GitHub Pages) num passo só.
   Uso:
     node motor/publicar.js clientes/<slug>/data.json
     node motor/publicar.js <slug>            (usa clientes/<slug>/data.json)
   O que faz:
     1) roda o gerador (mesmo motor de sempre)
     2) git add -A + commit + push  (publica no GitHub Pages)
     3) imprime o LINK no ar + lembra do link.md (abordagem WhatsApp)
   Atalho: npm run publicar -- <slug>
   ============================================================ */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const GERAR = path.join(__dirname, 'gerar.js');
const PAGES_BASE = 'https://bruuhviiper-dev.github.io/sites-demo';

function run(cmd, args, opts){
  return execFileSync(cmd, args, Object.assign({ cwd: ROOT, encoding: 'utf8' }, opts));
}

function main(){
  let arg = process.argv[2];
  if(!arg){ console.error('Uso: node motor/publicar.js <slug>  (ou caminho do data.json)'); process.exit(1); }

  // aceita slug OU caminho de data.json
  let dataPath = arg;
  if(!/\.json$/i.test(arg)) dataPath = path.join('clientes', arg, 'data.json');
  if(!fs.existsSync(path.resolve(ROOT, dataPath)) && !fs.existsSync(dataPath)){
    console.error('✗ Não achei o data.json: ' + dataPath); process.exit(1);
  }

  /* 1) GERA — captura a saída pra descobrir slug/nicho/marca, mas também mostra */
  console.log('▶ Gerando site...');
  let out;
  try { out = run('node', [GERAR, dataPath]); }
  catch(e){ console.error('✗ Falha ao gerar o site.'); console.error(e.stdout || e.message); process.exit(1); }
  process.stdout.write(out);

  const slug  = (out.match(/clientes[\/\\]([^\/\\]+)[\/\\]\1\.html/) || [])[1];
  const nicho = (out.match(/Nicho:\s*([^\s|]+)/) || [])[1] || '';
  const marca = (out.match(/Marca:\s*(.+)\s*$/m) || [])[1] || slug || '';
  if(!slug){ console.error('✗ Não consegui identificar o slug gerado.'); process.exit(1); }

  /* 2) PUBLICA — add + commit + push */
  console.log('\n▶ Publicando no GitHub Pages...');
  run('git', ['add', '-A']);

  const status = run('git', ['status', '--porcelain']).trim();
  if(status){
    const msg = 'feat: publica ' + marca + (nicho ? ' (' + nicho + ')' : '');
    try { run('git', ['commit', '-m', msg]); console.log('  commit: ' + msg); }
    catch(e){ console.error('  (aviso) commit falhou:\n' + (e.stdout || e.message)); }
  } else {
    console.log('  nada novo pra commitar (site já estava versionado).');
  }

  let pushed = true;
  try { run('git', ['push']); }
  catch(e){ pushed = false; console.error('  ✗ push falhou — rode "git push" manualmente:\n' + (e.stdout || e.message)); }

  /* 3) LINK no ar */
  const url = PAGES_BASE + '/clientes/' + slug + '/' + slug + '.html';
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(pushed ? '✓ NO AR (pode levar ~1 min pra atualizar):' : '⚠ Gerado, mas NÃO publicado (faça git push):');
  console.log('  ' + url);
  console.log('  Abordagem WhatsApp: clientes/' + slug + '/link.md');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main();
