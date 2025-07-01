// start 함수 진입점

import elements from '../../dom/dom.js';
import { showSeaStage, showDescriptionScreen, returnToIntro } from './introView.js';
import { createDescriptionController } from './gameDescription.js';
import { loadGameFromStorage } from './loader.js';
import { startFishGame } from '../fish/index.js';

export function start() {
  const {
    $startBtn,
    $descriptionBtn,
    $gameLoadBtn,
    $gameDescriptionPre,
    $gameDescriptionNext,
    $homeButton,
  } = elements;

  const { currentStep, updateDescriptionUI, next, prev } = createDescriptionController();

  $startBtn.addEventListener('click', () => {
    showSeaStage();
    startFishGame();
  });

  $gameLoadBtn.addEventListener('click', () => {
    showSeaStage();
    loadGameFromStorage();
    startFishGame();
  });

  $descriptionBtn.addEventListener('click', () => {
    showDescriptionScreen(currentStep, updateDescriptionUI);
  });

  $gameDescriptionNext.addEventListener('click', next);
  $gameDescriptionPre.addEventListener('click', prev);

  $homeButton.addEventListener('click', returnToIntro);

  // 우클릭 막기
  document.addEventListener('contextmenu', (e) => e.preventDefault());
}