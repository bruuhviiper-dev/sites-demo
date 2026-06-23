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

/* ---- artigo certo p/ o nome (Dr. -> "o", Dra. -> "a", senão "a" p/ clínica) ---- */
function artigoNome(name){
  var n = String(name||'').trim();
  if(/^dr\.?\s/i.test(n) && !/^dra\.?\s/i.test(n)) return 'o ';
  return 'a ';
}

/* ---- MENSAGEM 1 (abertura): pede pra mandar o link, gera o "pode!" ----
   Não leva o link de propósito — o link vem na msg 2, depois do sim. */
function buildPitch(name, onde, url){
  return 'Oi, tudo bem? 👋\n'
    + 'Vi ' + artigoNome(name) + name + ' no Google e fiquei impressionado com o trabalho de vocês! 👏\n'
    + 'Sou daqui de Rio Preto e fiz um presente: montei uma demonstração de site pra vocês, de graça. Posso te mandar o link pra ver? 👀';
}

/* ---- link.md: link + SEQUÊNCIA DE FECHAMENTO (3 msgs) + objeções ---- */
function buildLinkMd(site, slug){
  const url = PAGES_BASE + '/clientes/' + slug + '/' + slug + '.html';
  const name = (site.brand && site.brand.name) || slug;
  const cid = (site.contact && site.contact.cidade) ? String(site.contact.cidade).split(/[—-]/)[0].trim() : '';
  const onde = cid ? (' em ' + cid) : '';
  const wa = (site.contact && site.contact.whatsapp) ? String(site.contact.whatsapp).replace(/\D/g, '') : '';
  const m1 = buildPitch(name, onde, url);
  const m2 = 'Aqui ó 👇 (abre direto no celular)\n'
    + '👉 ' + url + '\n\n'
    + 'Reparei que vocês já têm ótimas avaliações — o atendimento é excelente. Só falta isso aparecer no Google quando alguém pesquisa o serviço de vocês aqui' + onde + '. Quem não tem site acaba caindo no concorrente.\n'
    + 'Te ligo 5 minutinhos pra te explicar a ideia? Qual o melhor horário, manhã ou tarde?';
  const m3 = 'Funciona assim: o site fica no ar com o seu domínio (seunome.com.br), botão de WhatsApp e seu perfil otimizado no Google.\n'
    + 'Tô começando aqui' + onde + ' e quero alguns casos de sucesso, então a condição de lançamento tá:\n'
    + '• Setup R$ 397 (à vista ou em 3x)\n'
    + '• R$ 69/mês (hospedagem + domínio + ajustes sempre que precisar)\n'
    + 'E você só paga se gostar — coloco no ar, você vê funcionando, aí acertamos. Posso reservar a sua vaga?';

  let md = '# ' + name + ' — Link & Fechamento\n\n';
  md += '## 🔗 Link do site (GitHub Pages)\n' + url + '\n\n';
  md += '## 🎯 Sequência de fechamento (mande na ordem)\n\n';
  md += '### 1) Abertura — gera o "pode!"\n' + m1.split('\n').map(l=>'> '+l).join('\n') + '\n';
  if(wa){
    md += '\n**⚡ Disparo 1 clique (abertura):** https://wa.me/' + wa + '?text=' + encodeURIComponent(m1) + '\n';
  }
  md += '\n### 2) Quando ele responder — manda o link + leva pra ligação\n' + m2.split('\n').map(l=>'> '+l).join('\n') + '\n';
  md += '\n### 3) Fechamento — oferta com risco zero\n' + m3.split('\n').map(l=>'> '+l).join('\n') + '\n';
  md += '\n## 🛡️ Objeções\n';
  md += '- **"Já tenho Instagram"** → Perfeito! O site puxa quem pesquisa no Google e deixa seu Insta em destaque. Um alimenta o outro.\n';
  md += '- **"Quanto custa?" (cedo)** → Bem menos que agência. Mas antes te mostro funcionando — posso te ligar rapidinho?\n';
  md += '- **"Sem tempo"** → Por isso já deixei tudo pronto 🙂 Você só aprova. 5 minutinhos.\n';
  if(!wa) md += '\n## ⚠️ Atenção\n- O Google Maps não trouxe WhatsApp — ache o celular antes de enviar.\n';
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
