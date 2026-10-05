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