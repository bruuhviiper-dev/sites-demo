# Fábrica de Sites — instruções do projeto

Gerador de **sites prontos** para empresas sem presença online, achadas no Google
Maps. Um motor recolore/reconfigura um template por **nicho** a partir de um
`data.json`. Repo publicado em GitHub Pages (`sites-demo`).

Fluxo: **usuário cola os dados do Maps no chat → eu pesquiso o estabelecimento →
monto o `data.json` → gero → entrego o link → publico após o OK.**

**É um gerador de DEMONSTRAÇÃO** para fechar cliente. Cada site tem que sair
**único** — nada de template recolorido igual ao do vizinho do mesmo nicho. Se o
cliente fechar, o site/sistema real é trabalhado depois (outra etapa).

---

## ⚡ CONTRATO: quando o usuário colar dados de um estabelecimento

Faça SEMPRE, na ordem, sem perguntar de volta (a não ser que falte algo crítico):

### 1. Detectar o nicho
Pela categoria do Maps. Nichos válidos:
`estetica, barbearia, restaurante, automotivo, odontologia, veterinaria,
petshop, academia, tatuagem, moda, psicologia, contabilidade, imobiliaria`
(fallback: `generico`). Confira com `node motor/detectar-nicho.js "<categoria>"`.
Se a detecção errar, ponha `"nicho": "<chave>"` no `data.json`.

### 2. Ler o brief do nicho
Abra `motor/prompts/<nicho>.md` e siga o tom, as seções e o que destacar. É o
guia para escrever os textos. (Estilo/layout o gerador escolhe sozinho pela
semente do nome — só force com `"estilo"` se o usuário pedir.)

### 2.5 Pesquisar o estabelecimento (redes sociais) — OBRIGATÓRIO
Use `WebSearch`/`WebFetch` para achar Instagram/Facebook/site do lugar pelo
nome + cidade. Objetivo: deixar a demo **com a cara real do estabelecimento**:
- **@ real do Instagram** e link (o Maps às vezes só dá "instagram.com").
- **Pratos/serviços reais, especialidades, vibe** → vira copy específica.
- **Fotos reais** (URL pública) p/ `hero.image`/`about.image` quando der.
- Confirmar horário, bairro, diferencial ("ao vivo", "delivery", "pet friendly"...).
Só use o que achar de fonte real. Nada confirmado → não inventa (ver regra abaixo).

### 3. Montar o `data.json` em `clientes/<slug>/data.json`
O gerador **mescla** `nichos.json` (base) ← `data.json` (cliente). Então só
escreva o que é específico da empresa; o resto vem do preset.
- **Use só dados reais** do que o usuário colou. **Nunca invente** telefone,
  endereço, nota, Instagram nem depoimentos.
- **Preços:** o Maps quase nunca traz → deixe `"Sob consulta"`.
- **WhatsApp:** `contact.whatsapp` só dígitos com DDI: `55DDNNNNNNNNN`.
- **Escreva copy ÚNICA** (hero, sobre, serviços) a partir do nome/categoria/região
  e do que achou nas redes — é o que torna a demo única. **Sobrescreva** os textos
  do preset (`hero.title`, `hero.sub`, `about.paragraphs`, nomes/descrições de
  serviços): se deixar o preset, dois sites do mesmo nicho saem iguais.
- **Garanta variação visual:** o gerador varia estilo+cor pela semente do nome.
  Se já existe outra empresa do mesmo nicho em `clientes/`, confira o estilo dela
  e, se necessário, force outro com `"estilo"`/`"scheme"` para não repetir.
- Esquema do `data.json` completo: ver `README.md` (seção "Como o data.json funciona").
- Ícones válidos (`icon`): `scissors, cut, star, sparkle, heart, check, shield,
  paw, tooth, car, wrench, drop, face, leaf, dumbbell, fork, scale, cam, hand,
  pin, clock, phone, home`.
- Desligar seção sem dados: `"products": { "show": false }` (idem testimonials, instagram).

### 4. Gerar
```
node motor/gerar.js clientes/<slug>/data.json
```
Quando o usuário confirmar que o estabelecimento NÃO tem site e quiser publicar:
```
npm run publicar -- <slug>      # gera + commit + push (Pages) + imprime o link no ar
```

### 5. Entregar — SEMPRE com link.md
O `gerar.js`/`publicar.js` **sempre** criam `clientes/<slug>/link.md` (link do
GitHub Pages + abordagem pronta de WhatsApp para enviar manualmente). Garantido —
nunca pule. Confira que ele existe e mostre o conteúdo ao usuário em toda geração.
Mostre o conteúdo de `clientes/<slug>/link.md` (link do Pages + abordagem de
WhatsApp já pronta). Aponte qualquer campo que ficou faltando (ver checklist).

---

## ✅ Antes de enviar para o cliente
- [ ] **WhatsApp** real (`55DDNNNNNNNNN`) — sem ele a abordagem não funciona
- [ ] **Instagram** real (o Maps às vezes só dá "instagram.com")
- [ ] **Horário** e **endereço** corretos
- [ ] Registros obrigatórios quando o nicho pede: **CRC** (contabilidade),
      **CRECI** (imobiliaria) — preencher em `about.certs`
- [ ] Se faltou contato no Maps → o `link.md` já avisa; reforce ao usuário

---

## 🔁 Variação entre empresas do mesmo nicho
O gerador escolhe **estilo (layout)** e **esquema de cor** pela semente do nome,
então duas empresas do mesmo nicho saem diferentes. Cada nicho tem 2–3 estilos
em `motor/estilos.json`. Forçar: `"estilo": "<chave>"` ou `"scheme": <n>` no data.json.

## 🧱 Estrutura (não mexer sem motivo)
`motor/` = o motor (gerar.js, publicar.js, detectar-nicho.js, nichos.json,
estilos.json, estilos/, prompts/). `clientes/<slug>/` = um site gerado +
`data.json` + `link.md`. Detalhes completos no `README.md`.

## Comandos
| ação | comando |
|---|---|
| detectar nicho | `node motor/detectar-nicho.js "<categoria>"` |
| gerar | `node motor/gerar.js clientes/<slug>/data.json` |
| publicar (gerar+push) | `npm run publicar -- <slug>` |
| apresentação (vídeo+prints) | `node motor/apresentar.js clientes/<slug>/<slug>.html` |
