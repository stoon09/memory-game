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

cards.forEach((card) =>{
    card.element.addEventListener('click', () =>{
        openCard(card);
    })
})