# 🧭 Blueprints por nicho — estudo de diversificação estrutural

> **Princípio:** diversificar o **esqueleto**, não a pele. Recolorir e trocar fonte
> não basta — dois sites com a mesma ordem de seções e o mesmo hero parecem iguais.
> Cada nicho deve ter uma **seção protagonista** e uma **mecânica de conversão**
> próprias. Este documento é o mapa para isso.

---

## 1. O que torna um layout REALMENTE diferente
Não é cor/fonte. São estes eixos:

1. **Arquétipo de hero** (a primeira impressão muda de função por nicho).
2. **Seção protagonista** (em torno do que a página é construída).
3. **Quais seções existem e em que ordem** (o "blueprint").
4. **Padrão de layout** das listas (grid, índice, ementa, lookbook, tabela…).
5. **Mecânica de conversão** (reserva, orçamento, agendamento, catálogo, simulação…).
6. **Densidade/mood** (arejado e calmo vs denso e enérgico).

## 2. Catálogo de ARQUÉTIPOS DE HERO
- **H1 · Editorial split** — título grande + foto lateral (atual; usar com parcimônia).
- **H2 · Full-bleed imersivo** — foto/vídeo cobrindo a tela, título sobreposto (restaurante, academia, estética, fotografia).
- **H3 · Vitrine/busca** — hero com barra de busca ou destaques em cards (imobiliária, classificados).
- **H4 · Prova/credencial** — hero sóbrio com selo de autoridade e números (advocacia, saúde, contabilidade).
- **H5 · Oferta/calculadora** — hero com benefício quantificado / simulação (energia solar, serviços com orçamento).
- **H6 · Catálogo direto** — hero curto e a grade de produtos/coleções já aparece (moda, pet, varejo).

## 3. Catálogo de MÓDULOS ESTRUTURAIS (blocos que diferenciam de verdade)
Reusáveis, montados conforme o blueprint do nicho:
- `catalogo` — grade de itens com filtro (imóveis, produtos, coleções).
- `cardapio` — ementa agrupada por categoria com preço (restaurante).
- `planos` — tabela de planos/preços comparativa (academia, assinaturas, serviços).
- `agenda` — booking/horários (estética, barbearia, saúde, odontologia) — embed Trinks/Calendly.
- `antes-depois` — slider comparativo (estética, automotiva, reforma, odontologia).
- `portfolio` — galeria masonry de trabalhos (fotografia, arquitetura, tatuagem, móveis planejados).
- `simulacao` — calculadora/lead de orçamento (energia solar, construção, eventos).
- `cobertura` — mapa/lista de área de atuação (serviços técnicos, imobiliária, delivery).
- `equipe` — grid de profissionais (clínica, advocacia, salão).
- `linha-tempo` — trajetória/experiência (advocacia, contabilidade, empresas tradicionais).
- `processo` — passos (genérico, mas ordem/nº varia).
- `cardapio-do-dia` / `destaques` — itens rotativos.
- `faixa` — marquee de destaques/benefícios.

## 4. BLUEPRINT POR NICHO
Formato: **objetivo · hero · protagonista · módulos-chave · conversão · mood**

| nicho | objetivo | hero | protagonista | módulos-chave | conversão | mood |
|---|---|---|---|---|---|---|
| **restaurante** | dar fome + facilitar pedido | H2 full-bleed (prato) | `cardapio` | faixa, galeria-pratos, horário | reserva/WhatsApp/iFood | quente, apetitoso |
| **estetica/beleza** | desejo + transformação | H2 imersivo | `antes-depois` + `agenda` | serviços c/ preço, galeria, Instagram | agendamento (Trinks) | editorial, sofisticado |
| **barbearia** | atitude + recorrência | H2 escuro bold | lista de serviços c/ preço | galeria de cortes, `agenda`, mapa | agendar/WhatsApp | masculino, alto contraste |
| **pet shop** | afeto + conveniência | H6 lúdico | `catalogo` (produtos) | benefícios (entrega/banho), depoimentos | WhatsApp/loja | alegre, arredondado |
| **veterinaria** | confiança no cuidado | H4 acolhedor | serviços + `equipe` | urgência 24h, convênios, mapa | agendar/WhatsApp | clean, acolhedor |
| **imobiliaria** | vitrine de imóveis | H3 busca/destaques | `catalogo` de imóveis | `cobertura`, processo, corretor | lead/WhatsApp | premium, confiável |
| **academia** | energia + resultado | H2 movimento | `planos` (tabela) | modalidades, grade de aulas, transformações | matrícula/aula grátis | enérgico, denso |
| **advocacia** | autoridade + confiança | H4 credencial | áreas em índice | `processo`, `equipe`, `linha-tempo`, depoimentos | consulta/WhatsApp | sóbrio, clássico |
| **contabilidade** | tranquilidade | H4 credencial | serviços + `processo` | segmentos, `linha-tempo` | WhatsApp/proposta | corporativo |
| **saude/clinica** | cuidado + confiança | H4 calmo | tratamentos + `equipe` | convênios, `agenda`, FAQ | agendamento | calmo, clean |
| **odontologia** | sorriso + confiança | H4/H2 | `antes-depois` | tratamentos, `agenda`, convênios | agendar | clean, claro |
| **energia-solar** | ROI/economia | H5 simulação | `simulacao` + números | benefícios, soluções, `processo` | simulação/WhatsApp | tech, escuro |
| **moda/boutique** | lookbook/coleção | H6 editorial | `catalogo` de coleções | marquee, novidades, Instagram | WhatsApp/loja | editorial, claro |
| **tatuagem** | portfólio/estilo | H2 escuro | `portfolio` masonry | estilos, artistas, agenda | orçamento/WhatsApp | bruto, alto contraste |
| **automotivo** | transformação/confiança | H2 | `antes-depois` | serviços c/ preço, galeria, `cobertura` | orçamento/WhatsApp | performance |
| **psicologia** | acolhimento | H4 calmo | sobre + abordagem | FAQ, `agenda`, online | agendar | sereno, claro |
| **fotografia** (novo) | portfólio | H2 full-bleed | `portfolio` | pacotes/`planos`, depoimentos | orçamento | editorial, imagens |
| **buffet/eventos** (novo) | encantar | H2 imersivo | galeria + `portfolio` | tipos de evento, espaço, depoimentos | orçamento/visita | festivo, elegante |
| **moveis-planejados** (novo) | portfólio + confiança | H2 | `portfolio` (ambientes) | `processo`, materiais, depoimentos | orçamento/visita | sofisticado |

## 5. Variação DENTRO do mesmo nicho (dois restaurantes ≠)
Além de cor/estilo por semente do nome, variar **estruturalmente** via flags:
- `design.heroVariant`: full-bleed | split | centered | catálogo.
- `design.ordem`: alternar a posição de seções (ex.: depoimentos antes/depois do cardápio).
- `design.cardVariant`: bordas, sombra, formato dos cards.
- ativar/desativar módulos opcionais (`galeria`, `equipe`, `faq`, `planos`).
Com 2 heros × 2 ordens × N esquemas, a colisão entre empresas do mesmo nicho some.

## 6. Roadmap sugerido (incremental)
1. **Modularizar** o motor: seções viram blocos reutilizáveis (hero-variants + módulos da seção 3). Cada nicho declara seu blueprint (lista ordenada de blocos).
2. Construir os **módulos de maior impacto** que ainda não existem: `catalogo` (imobiliária/pet/moda), `planos` (academia), `agenda` (estética/saúde/odonto), `antes-depois` (estética/automotivo/odonto), `portfolio` (fotografia/tatuagem/móveis).
3. Migrar os estilos dedicados atuais (menu-gourmet, juris, solar, petshop, boutique) para o sistema de blocos, ganhando `heroVariant`/`ordem` para variação interna.
4. Documentar cada blueprint aqui e manter `npm run testar` como gate.

> **Resumo:** hoje temos diversidade de PELE. O salto é diversidade de ESQUELETO —
> hero archetypes + seção protagonista + módulos estruturais por nicho.
