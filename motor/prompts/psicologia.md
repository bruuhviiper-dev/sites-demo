# Prompt exclusivo — PSICOLOGIA / PSICÓLOGO(A)

> Estilo padrão: `clean-editorial` (claro, calmo, arejado). Tom sóbrio e acolhedor.

## ⚠️ Regras éticas (CFP) — OBRIGATÓRIO
A divulgação de psicólogos é regulada pelo Conselho Federal de Psicologia. No site:
- **NÃO usar depoimentos de pacientes** → `testimonials.show = false` (sempre).
- **NÃO prometer resultados/cura**, não sensacionalizar ("acabe com a ansiedade").
- **Exibir o CRP** (registro profissional) — coloque em `about.certs` e no rodapé.
- Não divulgar preços como chamariz/promoção → use "Sob consulta".
- Linguagem séria, respeitosa, sem garantias.

## Personalidade
Acolhedor, calmo, confiável, humano. Transmite segurança e sigilo. Palavras-chave:
escuta, acolhimento, cuidado, no seu tempo, espaço seguro, sem julgamentos.

## Visual (clean-editorial)
- Claro, muito espaço em branco, tipografia serifada suave.
- Cores calmas: verde-sálvia, terracota ou azul sereno (varia por profissional).

## Seções
1. Hero — frase acolhedora ("Um espaço seguro para cuidar de você").
2. Sobre — abordagem, formação, **CRP**, postura acolhedora (LGBTQ+ friendly etc.).
3. Atendimentos (services) — individual, casal, online, ansiedade, autoconhecimento.
4. Contato — WhatsApp (principal), endereço, horário, atendimento online, mapa.
   • SEM galeria/Instagram obrigatório; SEM depoimentos.

## Tom dos textos
Gentil e profissional. Ex.: "Você não precisa passar por isso sozinho(a)."

## data.json — campos-chave
- `about.certs`: incluir **"CRP 06/XXXXXX"** (preencher) e abordagem (ex.: TCC).
- `contact.whatsapp` é o canal principal de agendamento.
- `testimonials.show=false` e `instagram.show=false` (a menos que ela tenha perfil profissional).
