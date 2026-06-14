/* ============================================================
   DETECTOR DE NICHO
   Recebe a categoria/descrição do Google Maps e devolve a chave
   do nicho. Usado pelo gerador quando o data.json não traz "nicho".
   ============================================================ */

// Ordem importa: o primeiro padrão que casar vence.
const REGRAS = [
  ["tatuagem",    /tatua|tattoo|tatoo|body ?piercing|ink studio/i],
  ["moda",        /loja de roupa|loja de roupas|boutique|moda feminina|moda masculina|moda infantil|vestuário|clothing|roupa/i],
  ["psicologia",  /psic[oó]log|psicoterap|psican[aá]lis|terapia cognitiv/i],
  ["contabilidade", /contabil|cont[aá]beis|contador|escrit[oó]rio cont|fiscal e trib/i],
  ["imobiliaria",  /imobili[aá]ri|corretor|corret(?:or)?a de im[oó]veis|im[oó]veis|loca[çc][ãa]o de im[oó]veis|aluguel de im[oó]veis|avalia[çc][ãa]o imobili/i],
  ["advocacia",    /advog|advocac|escrit[oó]rio jur[ií]dic|assessoria jur[ií]dic|direito de fam|direito (?:civil|penal|trabalhist|tribut|de fam)/i],
  ["energia-solar",/energia solar|solar fotovolt|fotovolt|painel solar|painéis solar|placa solar|energia limpa|gera[çc][ãa]o (?:de )?energia/i],
  ["saude",        /fisioterap|nutricionist|nutri[çc][ãa]o cl[ií]nic|fonoaudi|podolog|reabilita[çc][ãa]o|cl[ií]nica de sa[uú]de|terapia ocupacional|quiropraxia|pilates cl[ií]nic/i],
  ["fotografia",   /fot[oó]graf|fotografia|est[uú]dio fotogr|ensaio fotogr|photo ?studio|fotografo de casamento/i],
  ["barbearia",   /barbear|barber|navalha/i],
  ["automotivo",  /lava.?r[aá]pid|est[eé]tica automotiv|funilaria|polimento|martelinho|car ?wash|detailing|oficina|borracharia|auto ?center/i],
  ["estetica",    /est[eé]tic|sobrancelh|depila|spa|skincar|cl[ií]nica de beleza|sal[ãa]o de beleza|cabelo|manicure|nail|maquiag|micropigment|massag/i],
  ["odontologia", /odonto|dentist|dental|sorriso|ortodont/i],
  ["veterinaria", /veterin[aá]ri|cl[ií]nica animal/i],
  ["petshop",     /pet ?shop|pet ?store|ra[çc][ãa]o|banho e tosa|agropet|casa de ra/i],
  ["restaurante", /restaurant|pizzar|lanchonet|hamburgu|burger|churrasc|cafeteria|bistr[oô]|comida|gastronom|a[çc]a[íi]|sorveter|padaria|confeitar|doceria|food/i],
  ["academia",    /academ|crossfit|fitness|musculaç|pilates|treinament|studio de treino/i],
];

function detectarNicho(texto){
  const t = String(texto || "").toLowerCase();
  for(const [nicho, re] of REGRAS){
    if(re.test(t)) return nicho;
  }
  return "generico";
}

module.exports = { detectarNicho, REGRAS };

if(require.main === module){
  const arg = process.argv.slice(2).join(" ");
  console.log(detectarNicho(arg) + (arg ? '   <- "' + arg + '"' : '  (passe uma categoria)'));
}
