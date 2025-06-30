// 로컬 스토리지에서 게임 정보 불러오기

import elements from '../../dom/dom.js';
import { setHp, setScore, setCurrentHp, getScore, getHp } from '../fish/gameState.js';
import { showHp } from '../fish/index.js';

const { $score } = elements;

export function loadGameFromStorage() {
  const saved = localStorage.getItem('throwItState');
  if (saved) {
    const { savedScore, savedHp } = JSON.parse(saved);
    setScore(savedScore);
    setHp(savedHp);
    setCurrentHp(savedHp);

    $score.textContent = `${getScore()}`;
    showHp(getHp());
  }
}