#!/usr/bin/env node
/* Cria um link.md (link do Pages + abordagem de WhatsApp) para cada SITE ANTIGO
   em _arquivo/sites-antigos/. Uso: node motor/links-antigos.js */
const fs = require('fs');
const path = require('path');
const PAGES_BASE = 'https://bruuhviiper-dev.github.io/sites-demo';
const DIR = path.resolve(__dirname, '..', '_arquivo', 'sites-antigos');

const sites = [
  { slug: 'carol-garcia-dermatologia-veterinaria', name: 'Carol Garcia — Dermatologia Veterinária' },
  { slug: 'pet-shop-4-patas',                      name: 'Pet Shop 4 Patas' },
  { slug: 'clinica-sthetizar',                     name: 'Clínica Sthetizar' },
  { slug: 'clinica-hamonir',                       name: 'Clínica Hamonir' },
  { slug: 'carolina-mathias-estetica',             name: 'Carolina Mathias Estética' },
  { slug: 'sanso-studio-estetica-automotiva',      name: 'Sanso Studio — Estética Automotiva' },
  { slug: 'fany-diresta-estetica',                 name: 'Fany Diresta — Estética' }
];

sites.forEach(function(s){
  const url = PAGES_BASE + '/_arquivo/sites-antigos/' + s.slug + '.html';
  let md = '# ' + s.name + ' — Link & Abordagem\n\n';
  md += '## 🔗 Link do site (GitHub Pages)\n' + url + '\n\n';
  md += '## 📲 Abordagem pronta para WhatsApp\n';
  md += '> Olá! Tudo bem? 😊\n';
  md += '> Vi a ' + s.name + ' no Google e gostei muito do trabalho de vocês.\n';
  md += '> Reparei que ainda não têm um site próprio, então **montei uma demonstração gratuita**, sem compromisso, de como ficaria:\n>\n';
  md += '> 👉 ' + url + '\n>\n';
  md += '> Dá uma olhada e me diz o que achou? Se gostar, a gente conversa. Se não, fica de presente. 🙏\n\n';
  md += '## ⚠️ Atenção\n- Confirme o contato (WhatsApp) do negócio antes de enviar.\n';
  fs.writeFileSync(path.join(DIR, s.slug + '.link.md'), md, 'utf8');
  console.log('link.md: ' + s.slug);
});
console.log('Concluído: ' + sites.length + ' link.md de sites antigos.');
