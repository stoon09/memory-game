// заголовок страницы
const title = document.createElement('h1');
title.textContent = 'Memory Game';
document.body.append(title);

// кнопка Создать игру
const btn = document.createElement('button');
btn.textContent = "Новая игра";
document.body.append(btn);
btn.type = "button";

btn.addEventListener('click', startNewGame);
const leaderboardBtn = document.createElement('button');
leaderboardBtn.type = 'button';
leaderboardBtn.textContent = 'Таблица лидеров';
document.body.append(leaderboardBtn);
leaderboardBtn.addEventListener('click', showLeaderboardModal);
// карточки 16 штук
const symbols = ['🍎', '🍌', '🍇', '🍒', '🍓', '🍉', '🍑', '🥝'];

function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
const cardsData = shuffle([...symbols, ...symbols]);

const board = document.createElement('div');
board.classList.add("board");
document.body.append(board);


const cards = cardsData.map((symbol) => {
    const element = document.createElement('div');
    element.classList.add('card');
    board.append(element);
    return {symbol, element, isOpen: false, isMatched: false};
})

function openCard(card){
    card.isOpen = true;
    card.element.classList.add('open');
    card.element.textContent = card.symbol;
}

cards.forEach((card) => {
  card.element.addEventListener('click', () => handleCardClick(card));
});

//логика пары
let firstCard = null;
let isLocked = false;
let closeTimer = null;
let moves = 0;
let matchedPairs = 0;

const movesText = document.createElement('p');
const pairsText = document.createElement('p');
document.body.append(movesText, pairsText);

function updateCounters() {
  movesText.textContent = `Ходы: ${moves}`;
  pairsText.textContent = `Пары: ${matchedPairs} из 8`;
}

updateCounters();
function closeCard(card) {
  card.isOpen = false;
  card.element.classList.remove('open');
  card.element.textContent = '';
}

function handleCardClick(card) {
  if (isLocked || card.isOpen) return;

  openCard(card);

  if (firstCard === null) {
    firstCard = card;
    return;
  }

  moves += 1;

  if (firstCard.symbol === card.symbol) {
    firstCard.isMatched = true;
    card.isMatched = true;
    matchedPairs += 1;
    firstCard = null;
  } else {
    isLocked = true;
    const previousCard = firstCard;
    closeTimer = setTimeout(() => {
      closeCard(previousCard);
      closeCard(card);
      firstCard = null;
      isLocked = false;
    }, 1000);
  }

  updateCounters();
  if (matchedPairs === 1) {
  saveResult(moves);
  showWinModal();

}
}

//новая игра
function startNewGame() {
  clearTimeout(closeTimer);
  closeTimer = null;
  isLocked = false;
  firstCard = null;
  moves = 0;
  matchedPairs = 0;

  const newSymbols = shuffle([...symbols, ...symbols]);
  cards.forEach((card, index) => {
    card.symbol = newSymbols[index];
    card.isMatched = false;
    closeCard(card);
  });

  updateCounters();
}

//окно победы и таблица лидеров
let activeModal = null;

function openModal(content) {
  closeModal();

  const overlay = document.createElement('div');
  overlay.classList.add('modal-overlay');

  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.append(content);
  overlay.append(modal);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeModal();
  });

  document.body.append(overlay);
  document.body.classList.add('no-scroll');
  activeModal = overlay;
}

function closeModal() {
  if (!activeModal) return;
  activeModal.remove();
  activeModal = null;
  document.body.classList.remove('no-scroll');
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeModal();
});

function showWinModal() {
  const content = document.createElement('div');

  const heading = document.createElement('h2');
  heading.textContent = 'Победа!';

  const text = document.createElement('p');
  text.textContent = `Вы нашли все пары за ${moves} ходов.`;

  const newGameBtn = document.createElement('button');
  newGameBtn.type = 'button';
  newGameBtn.textContent = 'Новая игра';
  newGameBtn.addEventListener('click', () => {
    closeModal();
    startNewGame();
  });

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.textContent = 'Закрыть';
  closeBtn.addEventListener('click', closeModal);

  content.append(heading, text, newGameBtn, closeBtn);
  openModal(content);
}
const STORAGE_KEY = 'memory-game-results';

function loadResults() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveResult(movesCount) {
  const results = loadResults();
  results.push({ moves: movesCount, date: Date.now() });
  results.sort((a, b) => a.moves - b.moves || a.date - b.date);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results.slice(0, 10)));
}

function formatDate(timestamp) {
  const d = new Date(timestamp);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${d.getFullYear()}`;
}
function showLeaderboardModal() {
  const content = document.createElement('div');

  const heading = document.createElement('h2');
  heading.textContent = 'Таблица лидеров';
  content.append(heading);

  const results = loadResults();

  if (results.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'Пока нет результатов';
    content.append(empty);
  } else {
    const table = document.createElement('table');

    const headRow = document.createElement('tr');
    ['Место', 'Ходы', 'Дата'].forEach((label) => {
      const th = document.createElement('th');
      th.textContent = label;
      headRow.append(th);
    });
    table.append(headRow);

    results.forEach((result, index) => {
      const row = document.createElement('tr');
      [index + 1, result.moves, formatDate(result.date)].forEach((value) => {
        const td = document.createElement('td');
        td.textContent = value;
        row.append(td);
      });
      table.append(row);
    });

    content.append(table);
  }

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.textContent = 'Закрыть';
  closeBtn.addEventListener('click', closeModal);
  content.append(closeBtn);

  openModal(content);
}