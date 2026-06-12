# Prompt exclusivo — BARBEARIA

> Brief criativo que guia a geração de sites de barbearia. O `gerar.js` já aplica
> o DNA visual automaticamente (fonts Oswald/Inter, hero à esquerda, formato reto,
> títulos em caixa alta). Use este documento para escrever os TEXTOS e ajustar o
> data.json de cada barbearia com personalidade.

## Personalidade da marca
Masculino, confiante, urbano. Tradição de barbearia com toque moderno. Nada
infantil, nada delicado. Palavras-chave: estilo, atitude, navalha, precisão,
ritual, confiança.

## Identidade visual (já no DNA)
- **Tipografia:** títulos condensados em CAIXA ALTA (Oswald), corpo limpo (Inter).
- **Hero:** imagem à ESQUERDA, texto à direita. Formato RETO (cantos vivos).
- **Cores:** dourado/brass, vermelho barbearia ou verde militar (varia por empresa).
- **Vibe:** couro, madeira, metal escovado, néon discreto.

## Seções recomendadas
1. Hero — frase de impacto curta ("ESTILO E ATITUDE NO DETALHE").
2. Sobre — o ambiente (cadeira de massagem, café, música), a equipe.
3. Serviços — Corte, Barba, Combo, Tratamentos, Pezinho, Sobrancelha.
4. Depoimentos — reaproveitar avaliações reais do Google (poderosas aqui).
5. Instagram — barbearia vive de foto de corte; sempre incluir.
6. Contato — WhatsApp + agendamento online (Trinks/Booksy) + mapa.

## Tom dos textos
Direto e seguro. Frases curtas. Ex.: "Aqui o seu visual é levado a sério."
Destacar diferenciais reais do Google Maps (ambiente, equipe nominal, nota).

## Campos do data.json que mais importam
- `hero.titleHtml` curto e forte; `hero.badge` com a nota ("5,0 · +800 avaliações").
- `services.items` com preços reais quando houver.
- `about.certs` para os diferenciais (ambiente, equipe, LGBTQ+ friendly, etc.).
- `contact.whatsapp` (obrigatório) + link de agendamento se existir.

## Variação entre barbearias
O gerador troca o esquema de cor por nome. Para reforçar, varie também:
hero.title, tagline do footer, e a ordem/seleção de serviços.
