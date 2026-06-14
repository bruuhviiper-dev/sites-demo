#!/usr/bin/env node
/* ============================================================
   GERADOR DE SITES — Fábrica de Templates
   Uso:
     node motor/gerar.js clientes/<slug>/data.json
   ou (gera a partir de um data.json em qualquer lugar):
     node motor/gerar.js caminho/para/data.json
   O site é salvo como clientes/<slug>/<slug>.html (nome = estabelecimento).
   ============================================================ */
const fs = require('fs');
const path = require('path');
const { detectarNicho } = require('./detectar-nicho');

const ROOT = path.resolve(__dirname, '..');
const ESTILOS_DIR = path.join(__dirname, 'estilos');
const ESTILOS = path.join(__dirname, 'estilos.json');
const NICHOS = path.join(__dirname, 'nichos.json');
const PAGES_BASE = 'https://bruuhviiper-dev.github.io/sites-demo';

/* hash estável a partir de um texto (para variar entre empresas) */
function hashStr(s){ let h=0; s=String(s||''); for(let i=0;i<s.length;i++){ h=(h*31 + s.charCodeAt(i))>>>0; } return h; }

/* ---- slug a partir do nome do estabelecimento ---- */
function slugify(s){
  return String(s||'site').normalize('NFD').replace(/[̀-ͯ]/g,'')
    .toLowerCase().replace(/&/g,' e ').replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'').replace(/-{2,}/g,'-') || 'site';
}

/* ---- merge profundo: base <- override (arrays substituem) ---- */
function merge(base, over){
  if(Array.isArray(over)) return over.slice();
  if(over && typeof over === 'object' && base && typeof base === 'object' && !Array.isArray(base)){
    const out = Object.assign({}, base);
    for(const k of Object.keys(over)) out[k] = merge(base[k], over[k]);
    return out;
  }
  return over === undefined ? base : over;
}

/* ---- nameHtml: destaca a 2ª palavra em dourado (premium) ---- */
function autoNameHtml(name){
  const parts = String(name||'').trim().split(/\s+/);
  if(parts.length < 2) return parts[0]||'';
  return parts[0] + ' <b>' + parts.slice(1).join(' ') + '</b>';
}

/* ---- mensagem de abordagem (texto puro, usada no link.md e no disparo) ---- */
function buildPitch(name, onde, url){
  return 'Olá! Tudo bem? 😊\n'
    + 'Vi a ' + name + ' no Google e gostei muito do trabalho de vocês' + onde + '.\n'
    + 'Reparei que ainda não têm um site próprio, então montei uma demonstração gratuita, sem compromisso, de como ficaria:\n'
    + '👉 ' + url + '\n'
    + 'Dá uma olhada e me diz o que achou? Se gostar, a gente conversa. Se não, fica de presente. 🙏';
}

/* ---- link.md: link do GitHub Pages + abordagem + disparo assistido (1 clique) ---- */
function buildLinkMd(site, slug){
  const url = PAGES_BASE + '/clientes/' + slug + '/' + slug + '.html';
  const name = (site.brand && site.brand.name) || slug;
  const cid = (site.contact && site.contact.cidade) ? String(site.contact.cidade).split(/[—-]/)[0].trim() : '';
  const onde = cid ? (' em ' + cid) : '';
  const wa = (site.contact && site.contact.whatsapp) ? String(site.contact.whatsapp).replace(/\D/g, '') : '';
  const pitch = buildPitch(name, onde, url);
  let md = '# ' + name + ' — Link & Abordagem\n\n';
  md += '## 🔗 Link do site (GitHub Pages)\n' + url + '\n\n';
  md += '## 📲 Abordagem pronta para WhatsApp\n';
  md += pitch.split('\n').map(function(l){ return '> ' + l; }).join('\n') + '\n';
  if(wa){
    md += '\n## ⚡ Disparo assistido (1 clique)\n';
    md += 'Com o WhatsApp Web aberto, clique no link: a conversa abre com a mensagem pronta — é só apertar **Enter**.\n\n';
    md += 'https://wa.me/' + wa + '?text=' + encodeURIComponent(pitch) + '\n';
  } else {
    md += '\n## ⚠️ Atenção\n- O Google Maps não trouxe WhatsApp — encontre o celular antes de enviar (fora do disparo).\n';
  }
  return md;
}

function main(){
  const dataArg = process.argv[2];
  if(!dataArg){ console.error('Uso: node motor/gerar.js clientes/<slug>/data.json'); process.exit(1); }
  const dataPath = path.resolve(dataArg);
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const nichos = JSON.parse(fs.readFileSync(NICHOS, 'utf8'));

  /* nicho: usa o do data.json OU detecta pela categoria do Google Maps */
  const categoriaTxt = [data.categoria, data.category, data.nichoTexto,
    (data.googleMaps && (data.googleMaps.categoria || data.googleMaps.category))].filter(Boolean).join(' ');
  const nicheKey = data.nicho || detectarNicho(categoriaTxt) || 'generico';
  const preset = nichos[nicheKey] || nichos.generico;
  if(!nichos[nicheKey]) console.warn('Aviso: nicho "'+nicheKey+'" não encontrado, usando "generico".');
  console.log('  Nicho detectado: '+nicheKey + (data.nicho ? ' (informado no data.json)' : ' (auto, de "'+categoriaTxt+'")'));

  /* mescla preset (base) <- data (cliente) */
  let site = merge(JSON.parse(JSON.stringify(preset)), data);
  delete site._doc; delete site.nicho;

  /* VARIAÇÃO entre empresas do mesmo nicho:
     escolhe 1 dos schemes de cor pela "semente" do nome (estável por empresa).
     data.theme (override manual) ou data.scheme (índice) têm prioridade. */
  const schemes = site.schemes || [];
  if(!data.theme && schemes.length){
    const idx = (data.scheme != null) ? (data.scheme % schemes.length)
                                      : (hashStr(site.brand && site.brand.name) % schemes.length);
    site.theme = schemes[idx];
    console.log('  Esquema de cor: #'+idx+'  (accent '+schemes[idx].accent+')');
  }
  delete site.schemes;

  /* defaults inteligentes da marca */
  site.brand = site.brand || {};
  if(!site.brand.nameHtml && site.brand.name) site.brand.nameHtml = autoNameHtml(site.brand.name);
  site.meta = site.meta || {};
  if(!site.meta.title) site.meta.title = (site.brand.name||'Site') + (site.brand.tagline ? ' — '+site.brand.tagline : '');
  if(!site.meta.description) site.meta.description = (site.hero && site.hero.sub) || site.meta.title;

  /* ESCOLHE O ESTILO (layout) — biblioteca de estilos por nicho.
     data.estilo força; senão escolhe entre os estilos do nicho pela semente do nome
     (empresas do mesmo nicho podem sair com LAYOUTS diferentes, não só cor). */
  const lib = JSON.parse(fs.readFileSync(ESTILOS, 'utf8'));
  const disponiveis = (lib.porNicho[nicheKey] || lib.porNicho._default).filter(e => lib.estilos[e]);
  let estiloKey;
  if(data.estilo && lib.estilos[data.estilo]) estiloKey = data.estilo;
  else estiloKey = disponiveis[hashStr((site.brand.name || '') + '|estilo') % disponiveis.length];
  const estiloArq = path.join(ESTILOS_DIR, lib.estilos[estiloKey].arquivo);
  console.log('  Estilo (layout): '+estiloKey+'  ('+lib.estilos[estiloKey].desc+')');

  /* injeta no estilo escolhido (escapa < para não quebrar o </script>) */
  const tpl = fs.readFileSync(estiloArq, 'utf8');
  const json = JSON.stringify(site).replace(/</g, '\\u003c');
  const out = tpl.replace('/*__SITE__*/ null', json);

  /* destino: clientes/<slug>/<slug>.html  (nome = estabelecimento) */
  const slug = data.slug || slugify(site.brand.name);
  const destDir = path.join(ROOT, 'clientes', slug);
  fs.mkdirSync(destDir, { recursive: true });
  const htmlFile = path.join(destDir, slug + '.html');
  fs.writeFileSync(htmlFile, out, 'utf8');

  /* guarda o data.json usado junto, pra editar depois */
  const savedData = path.join(destDir, 'data.json');
  if(path.resolve(savedData) !== dataPath) fs.writeFileSync(savedData, JSON.stringify(data, null, 2), 'utf8');

  fs.writeFileSync(path.join(destDir, 'link.md'), buildLinkMd(site, slug), 'utf8');

  console.log('✓ Site gerado: clientes/'+slug+'/'+slug+'.html');
  console.log('  link.md criado com a abordagem de WhatsApp');
  console.log('  Nicho: '+nicheKey+'  |  Marca: '+site.brand.name);
  return htmlFile;
}

main();
