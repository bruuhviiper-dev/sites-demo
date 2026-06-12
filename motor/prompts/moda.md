# Brief Criativo — Nicho: Moda Feminina (Boutique)

## Estilo visual: `boutique`
O único template de **fundo claro** da fábrica — creme quente, Playfair Display itálico, lookbook de coleções.
Linguagem visual: editorial de moda, Vogue Brasil, Zara, boutique local premium.

## DNA do nicho
- **Tipografia**: Playfair Display itálico (display) + DM Sans (corpo)
- **Paleta**: creme/off-white de base, rosa/terracota/verde-sage de destaque
- **Grid de coleções**: cards portrait 2:3 com overlay de acento no hover
- **Marquee**: nomes das categorias desfilando no rodapé do hero
- **Tom de voz**: acolhedor, empoderador, feminino sem ser piegas

## Regras criativas por seção

### Hero
- Título em Playfair itálico, grande — poético e direto
- `<em>` marca a palavra-chave central (ex: "quem você é", "seu estilo")
- Sub: máx. 2 linhas, foco na mulher real (conforto + personalidade)
- Badge: avaliação do Google se disponível
- CTA primário: WhatsApp; CTA secundário: âncora para coleções

### Coleções (services)
- Nomear como categorias reais: Casual, Festa, Trabalho, Plus Size, etc.
- Descrição: benefício emocional + funcional (não só o produto)
- Preço: sempre "A partir de R$ X" — nunca fixo
- 6 itens é o ideal para preencher o grid 3×2

### Sobre
- Destacar "empresa de empreendedoras" quando o Maps informar
- Foco na curadoria: a PZ não vende roupas, vende escolhas certas
- Stats: avaliações Google, anos de loja ou peças por semana (nunca inventar — usar o que o Maps traz)

### Contato
- WhatsApp é o canal principal de vendas
- Incluir endereço e horário com exatidão
- Embed do Maps pelo link do Maps (query por lat/long se disponível)

## Variação de cor (schemes)
| scheme | acento | mood |
|--------|--------|------|
| 0 | #C97070 Rose | clássico feminino |
| 1 | #C47D5C Terracota | quente, outono |
| 2 | #7A9A6B Sage | natural, casual |

A escolha é automática por hash do nome — estável por empresa.

## Abordagem WhatsApp (modelo)
> Olá! Tudo bem? 😊  
> Vi a [Nome da Loja] no Google e adorei o perfil de vocês!  
> Percebi que ainda não têm um site — então **montei uma demonstração gratuita**, sem compromisso, de como ficaria:  
>  
> 👉 [link]  
>  
> Dá uma olhada e me diz o que achou? Fica de presente se não quiser. 🙏

## Checklist ao gerar
- [ ] `titleHtml` com `<em>` na palavra certa
- [ ] 6 categorias em `services.items`
- [ ] WhatsApp real extraído do Maps
- [ ] Stats reais (Google rating + count)
- [ ] Destacar "empreendedoras" em `about.certs` se aplicável
- [ ] `mapsEmbed` com lat/long ou query limpa
