'use strict';

const root = document.documentElement;
const toastElement = document.getElementById('siteToast');
const toast = window.bootstrap ? new bootstrap.Toast(toastElement, { delay: 2600 }) : null;

function announce(message) {
  const target = document.getElementById('toastMessage');
  if (target) target.textContent = message;
  if (toast) toast.show();
}

function safeRead(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}
function safeWrite(key, value) {
  try { localStorage.setItem(key, value); } catch (error) { /* A página continua funcional sem armazenamento local. */ }
}

// Preferências visuais: tema, escala tipográfica, contraste e movimento.
const storedTheme = safeRead('coreless-theme', 'dark');
root.dataset.theme = storedTheme === 'light' ? 'light' : 'dark';
let fontScale = Number(safeRead('coreless-font-scale', '1'));
if (!Number.isFinite(fontScale)) fontScale = 1;
fontScale = Math.min(1.2, Math.max(.9, fontScale));
root.style.setProperty('--font-scale', fontScale);
root.dataset.contrast = safeRead('coreless-contrast', 'normal');
root.dataset.motion = safeRead('coreless-motion', 'normal');

const themeToggle = document.getElementById('themeToggle');
function updateThemeButton() {
  const light = root.dataset.theme === 'light';
  themeToggle.textContent = light ? '☾' : '☼';
  themeToggle.setAttribute('aria-label', light ? 'Ativar modo escuro' : 'Ativar modo claro');
}
updateThemeButton();
themeToggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  safeWrite('coreless-theme', root.dataset.theme);
  updateThemeButton();
  announce(`Modo ${root.dataset.theme === 'light' ? 'claro' : 'escuro'} ativado.`);
});

const accessibilityModal = new bootstrap.Modal(document.getElementById('accessibilityModal'));
document.getElementById('accessibilityOpen').addEventListener('click', () => accessibilityModal.show());
document.getElementById('fontDecrease').addEventListener('click', () => changeFontScale(-.05));
document.getElementById('fontIncrease').addEventListener('click', () => changeFontScale(.05));
document.getElementById('fontReset').addEventListener('click', () => setFontScale(1));
function changeFontScale(delta) { setFontScale(fontScale + delta); }
function setFontScale(value) {
  fontScale = Math.min(1.2, Math.max(.9, Number(value.toFixed(2))));
  root.style.setProperty('--font-scale', fontScale);
  safeWrite('coreless-font-scale', String(fontScale));
  announce(`Tamanho do texto: ${Math.round(fontScale * 100)}%.`);
}
const contrastToggle = document.getElementById('contrastToggle');
contrastToggle.addEventListener('click', () => {
  const enabled = root.dataset.contrast !== 'high';
  root.dataset.contrast = enabled ? 'high' : 'normal';
  contrastToggle.setAttribute('aria-pressed', String(enabled));
  contrastToggle.textContent = enabled ? 'Ativado' : 'Desativado';
  safeWrite('coreless-contrast', root.dataset.contrast);
});
contrastToggle.setAttribute('aria-pressed', String(root.dataset.contrast === 'high'));
contrastToggle.textContent = root.dataset.contrast === 'high' ? 'Ativado' : 'Desativado';
const motionToggle = document.getElementById('motionToggle');
motionToggle.addEventListener('click', () => {
  const enabled = root.dataset.motion !== 'reduced';
  root.dataset.motion = enabled ? 'reduced' : 'normal';
  motionToggle.setAttribute('aria-pressed', String(enabled));
  motionToggle.textContent = enabled ? 'Ativado' : 'Desativado';
  safeWrite('coreless-motion', root.dataset.motion);
});
motionToggle.setAttribute('aria-pressed', String(root.dataset.motion === 'reduced'));
motionToggle.textContent = root.dataset.motion === 'reduced' ? 'Ativado' : 'Desativado';

// Pesquisa e filtros do catálogo.
const searchInput = document.getElementById('globalSearch');
const gameColumns = [...document.querySelectorAll('.game-column')];
const filterButtons = [...document.querySelectorAll('.filter-chip')];
let activeFilter = 'all';
function filterGames() {
  const query = searchInput.value.trim().toLocaleLowerCase('pt-BR');
  let visible = 0;
  gameColumns.forEach((column) => {
    const categories = column.dataset.category.split(' ');
    const searchable = `${column.dataset.search} ${column.textContent}`.toLocaleLowerCase('pt-BR');
    const matchesFilter = activeFilter === 'all' || categories.includes(activeFilter);
    const matchesQuery = !query || searchable.includes(query);
    const show = matchesFilter && matchesQuery;
    column.hidden = !show;
    if (show) visible += 1;
  });
  document.getElementById('resultsCount').textContent = `${visible} ${visible === 1 ? 'jogo disponível' : 'jogos disponíveis'}`;
  document.getElementById('emptyState').hidden = visible !== 0;
}
searchInput.addEventListener('input', filterGames);
filterButtons.forEach((button) => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  filterButtons.forEach((item) => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  filterGames();
}));

// Carrossel manual, com botões, indicadores e estado anunciado.
const slides = [...document.querySelectorAll('.learning-slide')];
const dots = [...document.querySelectorAll('.carousel-dot')];
let currentSlide = 0;
function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, position) => {
    const active = position === currentSlide;
    slide.hidden = !active;
    slide.setAttribute('aria-hidden', String(!active));
    dots[position].classList.toggle('active', active);
    dots[position].setAttribute('aria-pressed', String(active));
  });
}
document.getElementById('previousSlide').addEventListener('click', () => showSlide(currentSlide - 1));
document.getElementById('nextSlide').addEventListener('click', () => showSlide(currentSlide + 1));
dots.forEach((dot) => dot.addEventListener('click', () => showSlide(Number(dot.dataset.goSlide))));

// Biblioteca dos quatro naipes.
const suitDescriptions = {
  Copas: 'Copas é representado pelo coração (♥). Em baralhos tradicionais, é um dos dois naipes vermelhos.',
  Espadas: 'Espadas é representado pelo símbolo ♠ e integra o conjunto dos quatro naipes tradicionais.',
  Ouros: 'Ouros é representado pelo losango (♦). Em baralhos tradicionais, aparece na cor vermelha.',
  Paus: 'Paus é representado pelo símbolo ♣ e completa o conjunto dos quatro naipes tradicionais.'
};
document.querySelectorAll('.suit-card').forEach((button) => button.addEventListener('click', () => {
  const suit = button.dataset.suit;
  document.getElementById('suitFeedback').textContent = suitDescriptions[suit];
}));

// Guias informativos: regras em nível introdutório. Não há apostas nem orientação para jogos de azar.
const gameGuides = {
  pife: {
    category: 'COMBINAÇÕES E VOCABULÁRIO', title: 'Pife / Pif-Paf',
    intro: 'Pife é um jogo de combinações em que os participantes organizam cartas em conjuntos válidos. As regras podem variar por região e grupo, por isso é importante combinar a variante antes de começar.',
    goal: 'Organizar as cartas da mão em combinações aceitas pela variante, geralmente trincas ou sequências do mesmo naipe.',
    setup: 'A preparação utiliza um baralho e uma distribuição de cartas definida pela variante. Em cada turno, o participante segue a sequência de compra e descarte prevista nas regras combinadas.',
    terms: 'Trinca, sequência, compra, descarte, mão e batida. A quantidade de cartas e os critérios de encerramento podem variar.'
  },
  truco: {
    category: 'TRADIÇÃO BRASILEIRA', title: 'Truco',
    intro: 'Truco possui variantes regionais, por isso é importante identificar qual conjunto de regras está sendo estudado. Este resumo apresenta os conceitos gerais e destaca a necessidade de consultar a variante local.',
    goal: 'Vencer rodadas ou mãos conforme a pontuação e a hierarquia estabelecidas pela variante escolhida.',
    setup: 'A quantidade de cartas, a formação das equipes e a ordem de força podem variar entre versões, como Truco Paulista e Truco Mineiro.',
    terms: 'Manilha, vira, rodada, mão, tentos e pedido de aumento de pontos. A definição exata depende da variante.'
  },
  copas: {
    category: 'VAZAS E PONTUAÇÃO', title: 'Copas (Hearts)',
    intro: 'Copas é um jogo de vazas em que os participantes acompanham o naipe iniciado quando possível. O estudo desta modalidade ajuda a compreender vazas, descarte e pontuação.',
    goal: 'Compreender a pontuação das cartas e o objetivo de cada rodada de acordo com a variante estudada.',
    setup: 'A versão tradicional é jogada com quatro participantes e um baralho padrão distribuído entre eles. A ordem de jogo e a pontuação devem ser apresentadas conforme a variante escolhida.',
    terms: 'Vaza, seguir o naipe, descarte, carta de penalidade e pontuação. Existem variações regionais e digitais.'
  },
  buraco: {
    category: 'PARCERIA E SEQUÊNCIAS', title: 'Buraco',
    intro: 'Buraco é um jogo de cartas que pode ser praticado em duplas ou individualmente, conforme a variante. A organização das combinações e a contagem dos pontos são partes importantes do aprendizado.',
    goal: 'Formar combinações válidas, organizar canastras e cumprir os objetivos definidos pela variante.',
    setup: 'A preparação utiliza baralhos e, em muitas variantes, um monte adicional chamado morto. A distribuição e a pontuação devem seguir as regras adotadas.',
    terms: 'Sequência, jogo, canastra limpa, canastra suja, morto, descarte e batida.'
  },
  paciencia: {
    category: 'JOGO INDIVIDUAL', title: 'Paciência',
    intro: 'Paciência reúne diferentes jogos individuais. No Klondike, por exemplo, a pessoa organiza cartas em colunas e tenta completar as fundações por naipe.',
    goal: 'Organizar todas as cartas nas fundações, seguindo a ordem e os naipes previstos pela versão.',
    setup: 'As cartas são distribuídas em colunas e o restante forma o monte de compra. A disposição inicial muda conforme a variante.',
    terms: 'Coluna, fundação, monte de compra, descarte, sequência decrescente e alternância de cores.'
  },
  bridge: {
    category: 'DUPLAS E RACIOCÍNIO', title: 'Bridge',
    intro: 'Bridge é um jogo de parceria com regras estruturadas em etapas. O estudo introdutório ajuda a reconhecer o papel das duplas, da declaração e das vazas.',
    goal: 'Cumprir o contrato estabelecido no início da mão, conquistando o número de vazas previsto.',
    setup: 'Quatro participantes formam duas duplas. Um baralho padrão é distribuído por completo, com treze cartas para cada participante.',
    terms: 'Contrato, trunfo, declarante, morto, defensor e vaza.'
  }
};
const gameModal = new bootstrap.Modal(document.getElementById('gameModal'));
document.querySelectorAll('.learn-game').forEach((button) => button.addEventListener('click', () => {
  const guide = gameGuides[button.dataset.game];
  if (!guide) return;
  document.getElementById('gameModalCategory').textContent = guide.category;
  document.getElementById('gameModalTitle').textContent = guide.title;
  document.getElementById('gameModalIntro').textContent = guide.intro;
  document.getElementById('gameModalGoal').textContent = guide.goal;
  document.getElementById('gameModalSetup').textContent = guide.setup;
  document.getElementById('gameModalTerms').textContent = guide.terms;
  gameModal.show();
}));

// Quiz educativo de três perguntas.
const quizQuestions = [
  { question: 'Quantos naipes existem em um baralho tradicional de 52 cartas?', answers: ['Dois', 'Quatro', 'Seis'], correct: 1, explanation: 'Os quatro naipes tradicionais são Copas, Espadas, Ouros e Paus.' },
  { question: 'Qual símbolo representa o naipe de Copas?', answers: ['♥', '♣', '♦'], correct: 0, explanation: 'Copas é representado pelo coração (♥).' },
  { question: 'Quantas cartas há em cada naipe de um baralho padrão de 52 cartas?', answers: ['10', '12', '13'], correct: 2, explanation: 'O baralho padrão tem quatro naipes com treze cartas em cada um.' }
];
let questionIndex = 0;
let quizScore = 0;
let answerLocked = false;
const answerLetters = ['A','B','C'];
function renderQuestion() {
  const item = quizQuestions[questionIndex];
  answerLocked = false;
  document.getElementById('questionNumber').textContent = `PERGUNTA 0${questionIndex + 1} / 03`;
  document.getElementById('quizProgressLabel').textContent = `${Math.round((questionIndex / quizQuestions.length) * 100)}% concluído`;
  document.getElementById('quizProgress').style.width = `${(questionIndex / quizQuestions.length) * 100}%`;
  document.querySelector('.quiz-progress').setAttribute('aria-valuenow', String(Math.round((questionIndex / quizQuestions.length) * 100)));
  document.getElementById('quizQuestion').textContent = item.question;
  document.getElementById('quizFeedback').textContent = 'Escolha uma alternativa para continuar.';
  document.getElementById('quizScore').textContent = `Pontuação: ${quizScore}`;
  document.getElementById('nextQuestion').disabled = true;
  document.getElementById('nextQuestion').textContent = questionIndex === quizQuestions.length - 1 ? 'Ver resultado' : 'Próxima →';
  const options = document.getElementById('quizOptions');
  options.replaceChildren();
  item.answers.forEach((answer, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'quiz-option';
    button.dataset.answer = String(index);
    const letter = document.createElement('span');
    letter.textContent = answerLetters[index];
    button.append(letter, document.createTextNode(answer));
    button.addEventListener('click', () => selectAnswer(index, button));
    options.append(button);
  });
}
function selectAnswer(selected, selectedButton) {
  if (answerLocked) return;
  answerLocked = true;
  const item = quizQuestions[questionIndex];
  const buttons = [...document.querySelectorAll('.quiz-option')];
  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === item.correct) button.classList.add('correct');
  });
  if (selected === item.correct) {
    quizScore += 1;
    document.getElementById('quizFeedback').textContent = `Correto! ${item.explanation}`;
  } else {
    selectedButton.classList.add('incorrect');
    document.getElementById('quizFeedback').textContent = `Não foi dessa vez. ${item.explanation}`;
  }
  document.getElementById('quizScore').textContent = `Pontuação: ${quizScore}`;
  document.getElementById('nextQuestion').disabled = false;
}
let quizComplete = false;
document.getElementById('nextQuestion').addEventListener('click', () => {
  if (quizComplete) {
    questionIndex = 0;
    quizScore = 0;
    quizComplete = false;
    renderQuestion();
    return;
  }
  if (!answerLocked) return;
  if (questionIndex < quizQuestions.length - 1) {
    questionIndex += 1;
    renderQuestion();
    return;
  }
  quizComplete = true;
  document.getElementById('questionNumber').textContent = 'DESAFIO CONCLUÍDO';
  document.getElementById('quizProgressLabel').textContent = '100% concluído';
  document.getElementById('quizProgress').style.width = '100%';
  document.querySelector('.quiz-progress').setAttribute('aria-valuenow', '100');
  document.getElementById('quizQuestion').textContent = `Você acertou ${quizScore} de ${quizQuestions.length} perguntas.`;
  document.getElementById('quizOptions').replaceChildren();
  document.getElementById('quizFeedback').textContent = quizScore === 3 ? 'Excelente! Você reconhece os fundamentos do baralho.' : 'Continue explorando a biblioteca e tente novamente.';
  const button = document.getElementById('nextQuestion');
  button.disabled = false;
  button.textContent = 'Refazer desafio';
});
renderQuestion();

// Formulário de contato: validação local, sem envio externo.
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.checkValidity()) {
    contactForm.classList.add('was-validated');
    document.getElementById('contactStatus').textContent = 'Revise os campos destacados antes de continuar.';
    return;
  }
  document.getElementById('contactStatus').textContent = 'Validação concluída. Esta demonstração não envia a mensagem; um servidor seria necessário para receber o contato.';
  contactForm.reset();
  contactForm.classList.remove('was-validated');
});

// Login de demonstração: valida campos e mantém somente um nome de sessão fictício.
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const loginOpen = document.getElementById('loginOpen');
function updateProfileButton() {
  const sessionName = safeRead('coreless-demo-user', '');
  loginOpen.textContent = sessionName ? '●' : '♙';
  loginOpen.setAttribute('aria-label', sessionName ? `Sessão demonstrativa ativa para ${sessionName}. Clique para sair.` : 'Entrar ou acessar perfil');
  loginOpen.title = sessionName ? 'Sair da demonstração' : 'Entrar';
}
updateProfileButton();
loginOpen.addEventListener('click', () => {
  const sessionName = safeRead('coreless-demo-user', '');
  if (sessionName) {
    safeWrite('coreless-demo-user', '');
    updateProfileButton();
    announce('Sessão demonstrativa encerrada.');
  } else {
    loginModal.show();
  }
});
document.getElementById('loginForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }
  const email = document.getElementById('loginEmail').value.trim();
  const displayName = email.split('@')[0] || 'visitante';
  safeWrite('coreless-demo-user', displayName);
  document.getElementById('loginStatus').textContent = `Sessão demonstrativa iniciada para ${displayName}. Nenhuma senha foi armazenada.`;
  form.reset();
  form.classList.remove('was-validated');
  updateProfileButton();
  window.setTimeout(() => loginModal.hide(), 900);
});

document.getElementById('currentYear').textContent = new Date().getFullYear();
