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

cardsData.forEach((symbol) => {
    const card = document.createElement("div");
    card.classList.add('card');
    card.textContent = symbol;
    board.append(card);
})

