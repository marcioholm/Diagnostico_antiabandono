export const BLOCKS = {
  autocontrole: { label: "Autocontrole", color: "#ff5757" },
  autoeficacia: { label: "Autoeficácia", color: "#ff25aa" },
  constancia: { label: "Estágio de mudança", color: "#8c52ff" },
  conscienciosidade: { label: "Conscienciosidade", color: "#fbfaf9" },
};

export const QUESTIONS = [
  { id: 1, block: "autocontrole", type: "likert5", reverse: false, text: "Quando decido fazer algo, eu sigo o plano mesmo sem vontade naquele momento." },
  { id: 2, block: "autocontrole", type: "likert5", reverse: false, text: "Eu costumo terminar o que começo, mesmo quando fica chato ou cansativo no meio do caminho." },
  { id: 3, block: "autocontrole", type: "likert5", reverse: true, text: "Coisas novas (convite, vontade repentina, tentação) me tiram fácil de um compromisso que já tinha assumido." },
  { id: 4, block: "autocontrole", type: "likert5", reverse: false, text: "Eu penso nas consequências antes de agir, mesmo quando estou com pressa ou ansiosa." },
  { id: 5, block: "autocontrole", type: "likert5", reverse: true, text: "Eu já desisti de algo importante por impulso, sem planejar a decisão." },

  { id: 6, block: "autoeficacia", type: "scale10", text: "O quão confiante você está que consegue manter uma alimentação equilibrada mesmo num dia emocionalmente difícil?" },
  { id: 7, block: "autoeficacia", type: "scale10", text: "O quão confiante você está que consegue se manter no plano numa festa, jantar ou happy hour?" },
  { id: 8, block: "autoeficacia", type: "scale10", text: "O quão confiante você está que consegue continuar mesmo sem ver resultado na primeira semana?" },
  { id: 9, block: "autoeficacia", type: "scale10", text: "O quão confiante você está que consegue pedir ajuda em vez de desistir sozinha quando trava?" },
  { id: 10, block: "autoeficacia", type: "scale10", text: "O quão confiante você está de que o seu corpo responde ao método, mesmo que já tenha tentado antes e não deu certo?" },

  { id: 11, block: "constancia", type: "textarea", text: "Quantas vezes você já tentou emagrecer antes? O que geralmente aconteceu?", placeholder: "Escreva livremente..." },
  { id: 12, block: "constancia", type: "mcq", text: "Hoje você está:", options: [
      { v: "a", label: "Nem pensando em mudar", score: 0 },
      { v: "b", label: "Pensando em mudar, mas não fiz nada ainda", score: 25 },
      { v: "c", label: "Já tentando algo há pouco tempo", score: 60 },
      { v: "d", label: "Já mudei e estou mantendo há mais de 1 mês", score: 100 },
    ] },
  { id: 13, block: "constancia", type: "shorttext", text: "Há quanto tempo você mantém qualquer hábito novo (de qualquer área da vida) por mais de 30 dias seguidos?", placeholder: "Ex: nunca, 2 meses, 1 ano..." },
  { id: 14, block: "constancia", type: "textarea", text: "O que mais te fez desistir nas outras vezes que tentou?", placeholder: "Escreva livremente..." },
  { id: 15, block: "constancia", type: "textarea", text: "O que é diferente em você hoje, comparado a quando desistiu da última vez?", placeholder: "Escreva livremente..." },

  { id: 16, block: "conscienciosidade", type: "likert5", reverse: false, text: "Eu gosto de ter rotina e me organizar com antecedência." },
  { id: 17, block: "conscienciosidade", type: "likert5", reverse: false, text: "Eu costumo cumprir prazos e compromissos que assumo comigo mesma." },
  { id: 18, block: "conscienciosidade", type: "likert5", reverse: false, text: "Eu me considero uma pessoa cuidadosa e detalhista nas coisas que decido fazer." },
  { id: 19, block: "conscienciosidade", type: "likert5", reverse: true, text: "Eu tendo a agir por impulso mais do que por planejamento." },
  { id: 20, block: "conscienciosidade", type: "likert5", reverse: false, text: "Quando falho uma vez, eu volto rápido à rotina, sem deixar a semana toda se perder." },
];

export const LIKERT5_CAPS = ["Nada a ver comigo", "Muito a ver comigo"];
export const SCALE10_CAPS = ["Nada confiante", "Totalmente confiante"];

export const DIMENSION_BANDS = {
  autocontrole: {
    baixo: "Seu autocontrole ainda depende muito do momento — tentações e imprevistos costumam vencer o plano. A prioridade não é força de vontade, é reduzir as decisões que você precisa tomar no calor da hora.",
    medio: "Você segue o plano na maior parte do tempo, mas ainda cede quando surge uma tentação ou imprevisto. Criar regras simples para esses momentos específicos é o próximo passo.",
    alto: "Você já sustenta um plano mesmo sob pressão ou tentação. Esse é o pilar que vai segurar os outros quando a motivação cair.",
  },
  autoeficacia: {
    baixo: "Sua confiança em se manter firme, principalmente sob emoção ou pressão social, ainda é baixa — normalmente reflexo de tentativas anteriores que não deram certo. O trabalho começa pequeno, com vitórias que provem que dessa vez é diferente.",
    medio: "Você confia em si na maior parte das situações, mas ainda hesita em cenários específicos — festa, semana sem resultado, pedir ajuda. Vale mapear qual desses cenários mais derruba.",
    alto: "Você acredita no processo mesmo quando ele é difícil ou lento. Essa confiança é o que evita que um tropeço vire desistência.",
  },
  constancia: {
    baixo: "Ainda está decidindo se esse é o momento certo — e tudo bem. Isso muda o tipo de apoio que faz sentido agora: menos cobrança de resultado, mais construção de decisão.",
    medio: "Já deu o primeiro passo, mas ainda está no território mais frágil da mudança — onde a maioria desiste. O foco agora é sustentar as próximas semanas, não acelerar.",
    alto: "Já passou da fase mais frágil da mudança. Agora o jogo é sustentar o que já está funcionando e refinar os detalhes.",
  },
  conscienciosidade: {
    baixo: "Organização e planejamento antecipado ainda não são naturais — o que torna qualquer plano mais vulnerável ao imprevisto do dia a dia. Estruturas prontas (cardápio, treino, lembretes) pesam mais aqui do que força de vontade.",
    medio: "Você se organiza na maior parte do tempo, mas falhas pontuais ainda derrubam a semana inteira. Recuperar rápido depois de um deslize é mais importante do que nunca falhar.",
    alto: "Rotina e cuidado com detalhes já são parte de quem você é. Isso facilita muito a sustentação de qualquer plano no longo prazo.",
  },
};

function adjLikert(v, reverse) {
  if (typeof v !== "number") return 3;
  return reverse ? 6 - v : v;
}
function pct5(sum) {
  return Math.max(0, Math.min(100, Math.round(((sum - 5) / 20) * 100)));
}

export function bandFor(score) {
  if (score < 40) return "baixo";
  if (score < 70) return "medio";
  return "alto";
}

export function overallPhase(score) {
  if (score < 40) return { tag: "Fase 1", label: "Prontidão", emphasis: "Inicial", desc: "Antes de qualquer plano de treino ou alimentação, o trabalho é construir a base comportamental — decisão, rotina e confiança. Pular essa etapa é a razão mais comum de recaída." };
  if (score < 65) return { tag: "Fase 2", label: "Prontidão em", emphasis: "Construção", desc: "Parte da base já está pronta, mas ainda existem pontos frágeis que historicamente causaram desistência. Vale atacar exatamente esses pontos antes de acelerar o ritmo." };
  if (score < 85) return { tag: "Fase 3", label: "", emphasis: "Alta Prontidão", desc: "A maior parte do que sustenta um resultado de longo prazo já está presente. A partir daqui, ajuste fino importa mais do que força de vontade." };
  return { tag: "Fase 4", label: "Prontidão", emphasis: "Consolidada", desc: "O comportamental já está resolvido — autocontrole, confiança e rotina trabalhando a favor. O papel do método agora é técnico, não motivacional." };
}

// answers: array of 20 values aligned with QUESTIONS (numbers, strings, or {v,label,score} for mcq)
export function computeScores(answers) {
  const b1 = QUESTIONS.slice(0, 5);
  const sum1 = b1.reduce((acc, q, i) => acc + adjLikert(answers[i], q.reverse), 0);
  const autocontrole = pct5(sum1);

  const sum2 = answers.slice(5, 10).reduce((a, v) => a + (typeof v === "number" ? v : 0), 0);
  const autoeficacia = Math.round((sum2 / 50) * 100);

  const mcqAns = answers[11];
  const constancia = mcqAns && typeof mcqAns === "object" ? mcqAns.score : 0;

  const b4 = QUESTIONS.slice(15, 20);
  const sum4 = b4.reduce((acc, q, i) => acc + adjLikert(answers[15 + i], q.reverse), 0);
  const conscienciosidade = pct5(sum4);

  const dims = [
    { key: "autocontrole", label: "Autocontrole", color: "#ff5757", score: autocontrole },
    { key: "autoeficacia", label: "Autoeficácia", color: "#ff25aa", score: autoeficacia },
    { key: "constancia", label: "Estágio de mudança", color: "#8c52ff", score: constancia },
    { key: "conscienciosidade", label: "Conscienciosidade", color: "#fbfaf9", score: conscienciosidade },
  ];

  const overall = Math.round(dims.reduce((a, d) => a + d.score, 0) / dims.length);
  const weakest = dims.reduce((min, d) => (d.score < min.score ? d : min), dims[0]);
  const phase = overallPhase(overall);

  return { dims, overall, weakest, phase };
}
