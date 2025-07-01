// 물고기 클릭 관련 이벤트

import elements from '../../dom/dom.js';
import { updateModalUI } from '../catch/index.js';
import { setScore, getScore, getHp, setHp, setCurrentHp } from './gameState.js';
import { decreaseHp } from './hpManager.js';
import { showHp } from './index.js';

const { $fish, $modalOverlay, $seaBg, $catchIt, $score } = elements;

let stopped = false;
let intervalId = null;
let timerId = null;
let currentFishNumber = null;

export function setIntervalId(id) {
  intervalId = id;
}
export function getIntervalId() {
  return intervalId;
}
export function setTimerId(id) {
  timerId = id;
}
export function getTimerId() {
  return timerId;
}
export function setCurrentFishNumber(num) {
  currentFishNumber = num;
}
export function getCurrentFishNumber() {
  return currentFishNumber;
}
export function getStopped() {
  return stopped;
}
export function setStopped(state) {
  stopped = state;
}

$fish.addEventListener('click', () => {
  stopped = true;
  $catchIt.classList.add('active');
  $seaBg.style.animationPlayState = 'paused';

  clearTimeout(timerId);
  clearInterval(intervalId);
  intervalId = null;

  setTimeout(() => {
    $fish.classList.remove('show');
    $modalOverlay.style.display = 'flex';
  }, 600);

  updateModalUI(currentFishNumber, (finalScore, fishingScore) => {
    stopped = false;
    setScore(getScore() + finalScore);
    $score.textContent = `${getScore()}`;
    showHp(decreaseHp(finalScore, fishingScore, getHp()));
    $catchIt.classList.remove('active');
  });
});