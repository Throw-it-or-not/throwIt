// 인트로 화면/버튼 제어

import elements from '../../dom/dom.js';

const { $viewPort, $sea, $descriptionBtn, $gamDescriptionScreen, $homeButton } = elements;

export function showSeaStage() {
  $viewPort.style.display = 'none';
  $sea.style.display = 'block';
}

export function showDescriptionScreen(currentStep, updateDescriptionUI) {
  $viewPort.style.display = 'none';
  $gamDescriptionScreen.style.display = 'flex';
  currentStep.value = 1;
  updateDescriptionUI();
}

export function returnToIntro() {
  $gamDescriptionScreen.style.display = 'none';
  $viewPort.style.display = 'flex';
}