#!/usr/bin/env node
/* ============================================================
   FILA DE DISPARO ASSISTIDO — WhatsApp
   Monta uma página local (disparo.html) com os clientes que têm
   WhatsApp. Cada um abre a conversa JÁ com a mensagem preenchida;
   VOCÊ aperta Enter (mantém o número seguro e permite personalizar).
   Os NÃO enviados aparecem sempre em primeiro lugar.
   Uso:
     node motor/disparar.js                         (todos com WhatsApp)
     node motor/disparar.js couve-e-flor ...         (só esses slugs)
     node motor/disparar.js --pendentes slugA slugB  (marca só esses como
        NÃO enviado e o resto como JÁ enviado — reseta o estado da fila)
   Atalho: npm run disparar
   ⚠️ disparo.html NÃO vai pro repositório (tem telefones) — ver .gitignore.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CLIENTES = path.join(ROOT, 'clientes');
const PAGES_BASE = 'https://bruuhviiper-dev.github.io/sites-demo';

function buildPitch(name, onde, url){
  return 'Olá! Tudo bem? 😊\n'
    + 'Vi a ' + name + ' no Google e gostei muito do trabalho de vocês' + onde + '.\n'
    + 'Reparei que ainda não têm um site próprio, então montei uma demonstração gratuita, sem compromisso, de como ficaria:\n'
    + '👉 ' + url + '\n'
    + 'Dá uma olhada e me diz o que achou? Se gostar, a gente conversa. Se não, fica de presente. 🙏';
}

function main(){
  let argv = process.argv.slice(2);
  let pendentesMode = false, pendentes = [], filtro = [];
  if(argv[0] === '--pendentes'){ pendentesMode = true; pendentes = argv.slice(1); }
  else filtro = argv;

  const dirs = fs.readdirSync(CLIENTES).filter(function(d){
    return fs.existsSync(path.join(CLIENTES, d, 'data.json'));
  });

  const lista = [];
  const semWhats = [];
  for(const slug of dirs){
    if(!pendentesMode && filtro.length && filtro.indexOf(slug) === -1) continue;
    let data;
    try { data = JSON.parse(fs.readFileSync(path.join(CLIENTES, slug, 'data.json'), 'utf8')); }
    catch(e){ continue; }
    const name = (data.brand && data.brand.name) || slug;
    const wa = (data.contact && data.contact.whatsapp) ? String(data.contact.whatsapp).replace(/\D/g, '') : '';
    if(!wa){ semWhats.push(name); continue; }
    const cid = (data.contact && data.contact.cidade) ? String(data.contact.cidade).split(/[—-]/)[0].trim() : '';
    const onde = cid ? (' em ' + cid) : '';
    const url = PAGES_BASE + '/clientes/' + slug + '/' + slug + '.html';
    lista.push({
      slug: slug, name: name,
      phone: (data.contact && data.contact.phoneDisplay) || ('+' + wa),
      wa: wa, cidade: cid, url: url, msg: buildPitch(name, onde, url)
    });
  }

  // baseline de "já enviado": só no modo --pendentes (reseta o estado da fila)
  const baseline = {};
  lista.forEach(function(c){ baseline[c.slug] = pendentesMode ? (pendentes.indexOf(c.slug) === -1) : false; });
  const stamp = pendentesMode ? Date.now() : 0; // 0 = não reseta (preserva o que você já marcou)

  const html = render(lista, baseline, stamp);
  fs.writeFileSync(path.join(ROOT, 'disparo.html'), html, 'utf8');

  const nPend = lista.filter(function(c){ return !baseline[c.slug]; }).length;
  console.log('✓ Fila gerada: ' + lista.length + ' contato(s) com WhatsApp'
    + (pendentesMode ? ('  |  ' + nPend + ' pendente(s), ' + (lista.length - nPend) + ' marcados como já enviados') : ''));
  lista.forEach(function(c){ console.log('  ' + (baseline[c.slug] ? '· (enviado) ' : '• PENDENTE  ') + c.name + '  (' + c.phone + ')'); });
  if(semWhats.length) console.log('  (fora — sem WhatsApp: ' + semWhats.join(', ') + ')');
  console.log('\nAbra o arquivo: disparo.html   (deixe o WhatsApp Web logado antes)');
}

function render(lista, baseline, stamp){
  const dados = JSON.stringify(lista).replace(/</g, '\\u003c');
  const base = JSON.stringify(baseline).replace(/</g, '\\u003c');
  return '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">'
+ '<meta name="viewport" content="width=device-width, initial-scale=1">'
+ '<title>Fila de disparo — WhatsApp</title><style>'
+ '*{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,Segoe UI,Roboto,sans-serif;background:#0b141a;color:#e9edef;padding:24px;line-height:1.5}'
+ '.wrap{max-width:760px;margin:0 auto}h1{font-size:1.5rem;margin-bottom:6px}.sub{color:#8696a0;font-size:.92rem;margin-bottom:8px}'
+ '.warn{background:#222e35;border-left:3px solid #f0b232;padding:12px 14px;border-radius:8px;color:#d9c08a;font-size:.86rem;margin:14px 0 20px}'
+ '.bar{position:sticky;top:0;background:#0b141a;padding:12px 0;border-bottom:1px solid #222e35;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;z-index:5}'
+ '.prog{font-weight:600}.reset{background:none;border:1px solid #2a3942;color:#8696a0;border-radius:6px;padding:6px 12px;cursor:pointer;font-size:.8rem}'
+ '.divider{color:#5b6b76;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;margin:6px 0 12px;padding-top:8px;border-top:1px dashed #2a3942}'
+ '.card{background:#202c33;border:1px solid #2a3942;border-radius:12px;padding:18px;margin-bottom:14px;transition:opacity .3s}'
+ '.card.done{opacity:.4}.card h3{font-size:1.1rem}.meta{color:#8696a0;font-size:.84rem;margin:2px 0 12px}'
+ '.meta a{color:#53bdeb;text-decoration:none}.wa-num{color:#25d366;font-weight:700;font-size:.96rem}'
+ 'textarea{width:100%;background:#0b141a;color:#e9edef;border:1px solid #2a3942;border-radius:8px;padding:12px;font-family:inherit;font-size:.92rem;min-height:120px;resize:vertical}'
+ '.row{display:flex;gap:10px;align-items:center;margin-top:12px;flex-wrap:wrap}'
+ '.send{background:#00a884;color:#fff;border:none;border-radius:8px;padding:11px 20px;font-weight:600;cursor:pointer;font-size:.95rem;text-decoration:none;display:inline-flex;align-items:center;gap:8px}'
+ '.send:hover{background:#06cf9c}.mark{background:none;border:1px solid #2a3942;color:#8696a0;border-radius:8px;padding:11px 16px;cursor:pointer;font-size:.88rem}'
+ '.tag{font-size:.72rem;background:#0b141a;border:1px solid #2a3942;color:#8696a0;padding:3px 9px;border-radius:20px}.tag.ok{color:#00a884;border-color:#0a4}'
+ '</style></head><body><div class="wrap">'
+ '<h1>📲 Fila de disparo</h1>'
+ '<p class="sub">Deixe o <b>WhatsApp Web logado</b>. Clique em <b>Abrir WhatsApp</b> → a conversa abre com a mensagem pronta → aperte <b>Enter</b>. Os <b>não enviados</b> aparecem primeiro.</p>'
+ '<div class="warn">⚠️ Espace os envios e personalize quando der. Muitos disparos idênticos em pouco tempo parecem spam e podem bloquear seu número.</div>'
+ '<div class="bar"><span class="prog" id="prog"></span><button class="reset" id="reset">Limpar marcações</button></div>'
+ '<div id="list"></div></div>'
+ '<script>var DADOS=' + dados + ';var BASELINE=' + base + ';var STAMP=' + stamp + ';'
+ 'var KEY="disparo-enviados",SKEY="disparo-stamp";'
+ 'if(STAMP && localStorage.getItem(SKEY)!=String(STAMP)){localStorage.setItem(KEY,JSON.stringify(BASELINE));localStorage.setItem(SKEY,String(STAMP));}'
+ 'function store(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return {}}}'
+ 'function save(s){localStorage.setItem(KEY,JSON.stringify(s))}'
+ 'function sentOf(sl){var s=store();return (sl in s)?!!s[sl]:!!BASELINE[sl]}'
+ 'function setOne(sl,v){var s=store();s[sl]=v;save(s)}'
+ 'function esc(s){return (s==null?"":String(s)).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;"}[c]})}'
+ 'function prog(){var n=DADOS.filter(function(c){return sentOf(c.slug)}).length;document.getElementById("prog").textContent="Enviados: "+n+" de "+DADOS.length}'
+ 'function waLink(c){return "https://wa.me/"+c.wa+"?text="+encodeURIComponent(document.getElementById("msg-"+c.slug).value)}'
+ 'function card(c){var sent=sentOf(c.slug);return '
+ '"<div class=\\"card"+(sent?" done":"")+"\\" id=\\"card-"+c.slug+"\\">"+'
+ '"<h3>"+esc(c.name)+" <span class=\\"tag"+(sent?" ok":"")+"\\" id=\\"tag-"+c.slug+"\\">"+(sent?"✓ enviado":"pendente")+"</span></h3>"+'
+ '"<div class=\\"meta\\">📲 <span class=\\"wa-num\\">"+esc(c.phone)+"</span>"+(c.cidade?" · "+esc(c.cidade):"")+" · <a href=\\""+esc(c.url)+"\\" target=\\"_blank\\">ver site</a></div>"+'
+ '"<textarea id=\\"msg-"+c.slug+"\\">"+esc(c.msg)+"</textarea>"+'
+ '"<div class=\\"row\\">"+'
+ '"<a class=\\"send\\" id=\\"send-"+c.slug+"\\" target=\\"_blank\\" rel=\\"noopener\\">Abrir WhatsApp "+esc(c.phone)+" →</a>"+'
+ '"<button class=\\"mark\\" data-s=\\""+c.slug+"\\">Marcar enviado / desfazer</button>"+'
+ '"</div></div>"}'
+ 'function render(){'
+ 'var pend=DADOS.filter(function(c){return !sentOf(c.slug)});'
+ 'var done=DADOS.filter(function(c){return sentOf(c.slug)});'
+ 'var h=pend.map(card).join("");'
+ 'if(done.length){h+="<div class=\\"divider\\">Já enviados ("+done.length+")</div>"+done.map(card).join("")}'
+ 'document.getElementById("list").innerHTML=h;'
+ 'DADOS.forEach(function(c){var a=document.getElementById("send-"+c.slug);if(!a)return;var ta=document.getElementById("msg-"+c.slug);function sync(){a.href=waLink(c)}sync();ta.addEventListener("input",sync);a.addEventListener("click",function(){setOne(c.slug,true);setTimeout(render,250)})});'
+ 'document.querySelectorAll(".mark").forEach(function(b){b.addEventListener("click",function(){var sl=b.getAttribute("data-s");setOne(sl,!sentOf(sl));render()})});'
+ 'prog()}'
+ 'document.getElementById("reset").addEventListener("click",function(){if(confirm("Marcar TODOS como não enviado?")){save({});localStorage.removeItem(SKEY);render()}});'
+ 'render();'
+ '</script></body></html>';
}

main();
