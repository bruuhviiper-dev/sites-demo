# 🏭 Fábrica de Sites — Templates premium para prospecção no Google Maps

Sistema para gerar **sites prontos** para empresas que não têm presença online,
encontradas no Google Maps. Um único template premium **flexível**, que se
**recolore e reconfigura por nicho** a partir de um arquivo de dados.

> Fluxo resumido: você manda os dados do Google Maps → eu monto o `data.json` →
> `gerar.js` cria o site com o nome do estabelecimento → `apresentar.js` grava
> vídeo + prints para você enviar na prospecção.

---

## 📂 Estrutura

```
veterinaria/
├── motor/                      # O "motor" da fábrica (não muda por cliente)
│   ├── estilos/                # BIBLIOTECA DE ESTILOS (layouts distintos)
│   │   ├── dark-luxury.html    #   • premium escuro, dourado, editorial dark
│   │   └── clean-editorial.html#   • claro, arejado, editorial natural (lista-revista)
│   ├── estilos.json            # Registro de estilos + quais estilos cada nicho usa
│   ├── nichos.json             # DNA por nicho: fonts + design + schemes de cor + textos
│   ├── detectar-nicho.js       # Identifica o nicho pela categoria do Google Maps
│   ├── prompts/                # Brief criativo exclusivo de cada nicho (.md)
│   ├── gerar.js                # data.json -> site (detecta nicho + escolhe estilo + cor)
│   ├── apresentar.js           # site .html -> vídeo + screenshots
│   └── screenshot.js           # screenshot rápido p/ conferir (sem vídeo)
│
├── clientes/                   # Um site gerado por estabelecimento
│   └── authentic-barbearia/
│       ├── authentic-barbearia.html   # ← o site (nome = estabelecimento)
│       ├── data.json                  # dados usados (editável)
│       └── apresentacao/              # vídeo + prints p/ prospecção
│
├── _arquivo/                   # Sites antigos e materiais (referência)
│   ├── sites-antigos/          # 7 sites já feitos, renomeados pelo nome real
│   ├── apresentacoes/          # apresentações antigas
│   └── imagens/
│
├── package.json
└── README.md  (este arquivo)
```

---

## ▶️ Como gerar um site novo

1. **Pegue os dados no Google Maps** do estabelecimento (nome, categoria,
   telefone, endereço, nota, avaliações, horário, instagram...).
2. **Crie/edite** `clientes/<slug>/data.json` (use a Authentic como modelo).
3. **Gere o site:**
   ```bash
   node motor/gerar.js clientes/<slug>/data.json
   ```
   Saída: `clientes/<slug>/<slug>.html`
4. **Publique no GitHub Pages** (gera + commit + push num passo só):
   ```bash
   npm run publicar -- <slug>
   ```
   Imprime o **link no ar** + lembra do `link.md` (abordagem de WhatsApp).
   Use depois de confirmar no Maps que a empresa **não tem site**.
5. **Gere a apresentação** (vídeo + prints):
   ```bash
   node motor/apresentar.js clientes/<slug>/<slug>.html
   ```
   Saída: `clientes/<slug>/apresentacao/`

> Atalhos: `npm run gerar -- clientes/<slug>/data.json`,
> `npm run publicar -- <slug>` e `npm run apresentar -- clientes/<slug>/<slug>.html`

---

## 🎨 Nichos: cada um tem visual PRÓPRIO (não é só cor)

O motor **identifica o nicho** pela categoria do Google Maps e aplica um **DNA de
design** distinto — tipografia, layout do hero, formato e personalidade mudam por
nicho. Uma barbearia não parece um restaurante.

| nicho | tipografia | hero | formato | personalidade |
|---|---|---|---|---|
| `estetica` | Cormorant serif | imagem à direita | suave | dark luxury, dourado/rosé/verde-água |
| `barbearia` | Oswald CAIXA ALTA | imagem à esquerda | reto | masculino, dourado/vermelho/verde |
| `restaurante` | Playfair serif | centralizado | arredondado | apetite, laranja/vinho/oliva |
| `automotivo` | Rajdhani tech | imagem à direita | reto | performance, vermelho/ciano/âmbar |
| `odontologia` | Poppins | imagem à direita | arredondado | clínico clean, azul/verde-água |
| `veterinaria` | Poppins | imagem à direita | arredondado | acolhedor, verde/azul |
| `petshop` | Poppins | centralizado | arredondado | lúdico, roxo/azul |
| `academia` | Oswald CAIXA ALTA | imagem à esquerda | reto | energia, verde-limão/laranja |
| `generico` | Cormorant serif | imagem à direita | suave | neutro premium (fallback) |

**Variação entre empresas do mesmo nicho:** cada nicho tem 2-3 **esquemas de cor**.
O motor escolhe um por "semente" do nome — duas barbearias saem com cores
diferentes, sem ficar igual. (Force com `"scheme": 0` ou `"theme": {...}` no data.json.)

**Detecção automática:** teste com `node motor/detectar-nicho.js "Pizzaria"`.
Se o nicho não for reconhecido, cai em `generico`.

**Prompt exclusivo por nicho:** o brief criativo de cada nicho (tom, seções,
o que destacar) está em `motor/prompts/<nicho>.md` — é o guia para escrever os
textos de cada site.

Para um **nicho novo**: copie um bloco em `nichos.json`, ajuste `fonts`/`design`/
`schemes`/textos, adicione o padrão em `detectar-nicho.js` e crie o prompt em
`motor/prompts/`.

---

## 🎭 Biblioteca de ESTILOS (layouts diferentes — não é só cor)

O ponto mais importante: **estilo único por cliente**. Cada estilo é um **layout
completamente diferente** (estrutura, tipografia, seções), não o mesmo esqueleto
recolorido. Ficam em `motor/estilos/` e todos leem o mesmo `data.json`.

| estilo | cara | quando usar |
|---|---|---|
| `dark-luxury` | escuro, dourado, grade de cards, editorial dark | barbearia, automotivo, academia, estética premium |
| `clean-editorial` | claro, arejado, tipografia gigante, serviços em **lista-revista** | salão, restaurante, odontologia, vet, pet |

**Como o motor escolhe:** `motor/estilos.json` define quais estilos cada nicho pode
usar. O gerador escolhe um por "semente" do nome → **duas empresas do mesmo nicho
saem com LAYOUTS diferentes**, não só cor. Força com `"estilo": "clean-editorial"`
no data.json.

**Adicionar um estilo novo:**
1. Crie `motor/estilos/<nome>.html` (copie um existente; ele lê `window.SITE`).
2. Registre em `motor/estilos.json` (em `estilos` e nos nichos de `porNicho`).
3. A identidade visual (cores base, tipografia) pertence ao ESTILO; só a cor de
   destaque (`--accent`) vem do nicho. Assim qualquer estilo serve qualquer nicho.

> Conforme a biblioteca cresce, a variedade aumenta: com 3-4 estilos por nicho,
> dezenas de empresas recebem sites que não se parecem entre si.

---

## 🧩 Como o `data.json` funciona

O gerador **mescla**: `nichos.json` (base do nicho) **←** `data.json` (cliente
sobrescreve). Ou seja, no `data.json` você só precisa colocar o que é específico
da empresa; o resto vem do preset.

Campos principais (todos opcionais, exceto `nicho` e `brand.name`):

```jsonc
{
  "categoria": "Barbearia",        // categoria do Maps -> nicho é DETECTADO sozinho
  "nicho": "barbearia",            // (opcional) força o nicho, ignora a detecção
  "estilo": "clean-editorial",     // (opcional) força o LAYOUT; senão varia pelo nome
  "scheme": 0,                     // (opcional) força o esquema de cor; senão varia pelo nome
  "slug": "authentic-barbearia",   // nome do arquivo/pasta (opcional, gerado do nome)
  "brand": { "name": "...", "tagline": "...", "nameHtml": "..." },
  "hero": { "eyebrow", "titleHtml", "sub", "badge", "ctaPrimary", "ctaGhost", "image" },
  "about": { "paragraphs":[], "stats":[{num,suffix,label}], "timeline":[], "certs":[] },
  "services": { "items":[{ "icon","name","desc","price" }] },
  "products": { "show": true|false, "items":[{cat,tag,nome,desc,preco}] },
  "testimonials": { "items":[{ "stars","quote","name","meta" }] },
  "instagram": { "show", "handle", "url" },
  "contact": { "whatsapp","phoneDisplay","instagramUrl","address","hours","mapsEmbed" },
  "footer": { "tagline" }
}
```

- **Desligar uma seção:** `"products": { "show": false }` (vale p/ products,
  testimonials, instagram).
- **Ícones disponíveis** (campo `icon`): `scissors, cut, star, sparkle, heart,
  check, shield, paw, tooth, car, wrench, drop, face, leaf, dumbbell, fork,
  scale, cam, hand, pin, clock, phone, home`.
- **WhatsApp:** o formulário e o botão flutuante já montam o link
  `wa.me` automaticamente a partir de `contact.whatsapp` (só dígitos, com DDI 55).
- **Imagens:** ponha o caminho/URL em `hero.image`, `about.image`,
  `products[].image`. Sem imagem, usa placeholder elegante com as iniciais.

---

## ✅ O que sempre conferir antes de enviar para o cliente

- [ ] **WhatsApp** real em `contact.whatsapp` (formato `55DDNNNNNNNNN`)
- [ ] **Instagram** real (`instagram.url` / `handle`) — Maps às vezes só dá "instagram.com"
- [ ] **Preços** dos serviços (Maps quase nunca traz — ficam "Sob consulta")
- [ ] **Horário** completo (Maps mostra só "fecha às XX:XX")
- [ ] **Fotos** reais (hero, sobre, galeria) se a empresa fornecer
- [ ] **Link de agendamento** (ex.: Trinks) se houver
```
