'use strict';

const animateItem = document.querySelector('.imgBlock__tableTop');

document.querySelector('.imgBlock__btns_up').onclick = function () {
  animateItem.style.bottom = '80%';
}

document.querySelector('.imgBlock__btns_down').onclick = function () {
  animateItem.style.bottom = '24.1%';
}