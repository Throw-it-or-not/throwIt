// 물고기 생성, 위치 설정

import elements from '../../dom/dom.js';
import {getCurrentFishNumber, getStopped, setCurrentFishNumber, setTimerId} from './fishEvents.js';

const { $fish, $thowitWrap } = elements;

const species = [
  'url(/image/fish-01.png)',
  'url(/image/fish-02.png)',
  'url(/image/fish-03.png)',
  'url(/image/fish-04.png)',
  'url(/image/fish-05.png)',
];

export function makeFish() {
  const random = Math.floor(Math.random() * 5);
  $fish.style.backgroundImage = species[random];
  return random;
}

export function showFish() {
  const maxX = $thowitWrap.offsetWidth - $fish.offsetWidth - 100;
  const maxY = $thowitWrap.offsetHeight - 140 - $fish.offsetHeight - 100;
  const x = Math.floor(Math.random() * maxX) + 1;
  const y = Math.floor(Math.random() * maxY) + 1;

  const timer = setTimeout(() => {
    if(!getStopped()) {
      setCurrentFishNumber(makeFish());

      $fish.style.left = `${x}px`;
      $fish.style.top = `${y}px`;

      $fish.classList.add('show');
    }

  }, 1000)

  setTimerId(timer);
}