// заголовок страницы
const title = document.createElement('h1');
title.textContent = 'Memory Game';
document.body.append(title);

// кнопка Создать игру
const btn = document.createElement('button');
btn.textContent = "Создать игру";
document.body.append(btn);
btn.type = "button";

//обработчик клика на кнопку
btn.addEventListener('click', () => {
    console.log('клик');
});
