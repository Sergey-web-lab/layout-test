'use strict';

const animateItem = document.querySelector('.block1__imgBlock_tableTop');

document.querySelector('.block1__imgBlock_btns_up').onclick = function () {
  animateItem.style.bottom = '330px';
}

document.querySelector('.block1__imgBlock_btns_down').onclick = function () {
  animateItem.style.bottom = '275px';
}