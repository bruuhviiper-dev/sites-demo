# Prompt exclusivo — RESTAURANTE

> O `gerar.js` aplica o DNA: fonts Playfair Display/Jost, hero CENTRALIZADO,
> formato arredondado, títulos elegantes. Use este brief para os textos.

## Personalidade da marca
Acolhedor, saboroso, sofisticado-sem-ser-caro. Desperta apetite e desejo de
visitar. Palavras-chave: sabor, ingredientes, experiência, casa, memória, aroma.

## Identidade visual (já no DNA)
- **Tipografia:** títulos serifados elegantes (Playfair Display), corpo Jost.
- **Hero:** CENTRALIZADO, text-forward (a comida é a estrela — use fotos reais).
- **Cores:** laranja apetite, vinho/bordô ou verde-oliva (varia por empresa).
- **Vibe:** madeira, luz quente, mesa posta.

## Seções recomendadas
1. Hero — convite curto ("Uma experiência para todos os sentidos").
2. Sobre — a história da casa, o chef, o ambiente.
3. Cardápio (services com navLabel "Cardápio") — destaques, não o menu inteiro.
4. Produtos (opcional) — pratos/combos em destaque com foto e preço.
5. Depoimentos — avaliações do Google sobre comida e atendimento.
6. Instagram — pratos sempre rendem; incluir.
7. Contato — WhatsApp/telefone para reserva, iFood/delivery, horário, mapa.

## Tom dos textos
Sensorial e convidativo. Falar de aroma, textura, frescor. Ex.: "Massa fresca
feita na hora, do nosso jeito."

## Campos do data.json que mais importam
- Fotos reais em `hero.image` e `products[].image` (comida vende no visual).
- `services` = especialidades/seções do cardápio com `navLabel: "Cardápio"`.
- `contact` com telefone de reserva, link de delivery e horário de funcionamento.

## Variação entre restaurantes
Esquema de cor automático + variar tom (cantina italiana ≠ hamburgueria ≠ açaí).
Ajuste hero.title, especialidades e tagline conforme o tipo de cozinha.
