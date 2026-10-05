// заголовок страницы
const title = document.createElement('h1');
title.textContent = 'Memory Game';
document.body.append(title);

// кнопка Создать игру
const btn = document.createElement('button');
btn.textContent = "Новая игра";
document.body.append(btn);
btn.type = "button";

btn.addEventListener('click', () => {
    console.log('клик');
});

// карточки 16 штук
const symbols = ['🍎', '🍌', '🍇', '🍒', '🍓', '🍉', '🍑', '🥝'];
const cardsData = [...symbols,...symbols];

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

  console.log('ходы:', moves, 'пары:', matchedPairs);
}