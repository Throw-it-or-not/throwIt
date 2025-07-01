import elements from '../../dom/dom.js';
import { makeFish, showFish } from './fishSpawner.js';
import {getHp, setHp, setScore, setCurrentHp, getCurrentHp, getScore} from './gameState.js';
import {
  getIntervalId,
  setIntervalId,
  setTimerId,
  setCurrentFishNumber,
  getStopped,
  setStopped,
  getTimerId
} from './fishEvents.js';

const { $fish, $sea, $seaBg, $score, $overOverlay, $viewPort, $restartBtn, $goHomeBtn, $homeModal, $confirmNo, $confirmYes, $hpBar, $catchIt } = elements;

export function showHp(hp) {

  if (getCurrentHp() <= 0) {
    setHp(0);
  }
  setCurrentHp(hp);
  $hpBar.style.height = `${getCurrentHp()}%`;
}

function openGameOverModal() {
  showHp(getHp());
  $overOverlay.style.display = 'flex';
  setStopped(true);
  $fish.classList.remove('show');
  clearTimeout(getTimerId());
  clearInterval(getIntervalId());
  setIntervalId(null);
}

function initializeGame() {
  setStopped(false);
  setHp(100);
  setCurrentHp(100);
  setScore(0);
  showHp(100);
  $score.textContent = `0`;
  $catchIt.classList.remove('active');
}

function closeOverModal() {
  $viewPort.style.display = 'flex';
  $overOverlay.style.display = 'none';
  $sea.style.display = 'none';
}

export function startFishGame() {
  if (getIntervalId() !== null) return;
  $score.textContent = `${getScore()}`;
  if (getHp() <= 0) {
    openGameOverModal();
    return;
  }

  const interval = setInterval(() => {
    $seaBg.style.animationPlayState = 'running';
    showFish();
  }, 1000);

  setIntervalId(interval);
}

// 이벤트 설정
$restartBtn.addEventListener('click', () => {
  closeOverModal();
  initializeGame();
});

$goHomeBtn.addEventListener('click', () => {
  $homeModal.style.display = 'flex';
});
$confirmNo.addEventListener('click', () => {
  $homeModal.style.display = 'none';
});
$confirmYes.addEventListener('click', () => {
  localStorage.setItem('throwItState', JSON.stringify({
    savedScore: getScore(),
    savedHp: getHp(),
  }));

  $viewPort.style.display = 'flex';
  $sea.style.display = 'none';
  $homeModal.style.display = 'none';
  $seaBg.style.animationPlayState = 'paused';
  $fish.classList.remove('show');
  clearTimeout(getTimerId());
  clearInterval(getIntervalId());
  setIntervalId(null);
  initializeGame();
});