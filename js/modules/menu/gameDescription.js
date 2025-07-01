// 게임 설명 슬라이드 관리

import elements from '../../dom/dom.js';

const { $gameDescriptionPre, $gameDescriptionNext, $gameDescriptionTextBox } = elements;

export function createDescriptionController() {
  const currentStep = { value: 1 };
  const totalSteps = $gameDescriptionTextBox.length;

  function updateDescriptionUI() {
    $gameDescriptionTextBox.forEach($stepText => {
      $stepText.classList.toggle(
        'active',
        $stepText.getAttribute('id') === `step-${currentStep.value}`
      );
    });

    $gameDescriptionPre.disabled = currentStep.value === 1;
    $gameDescriptionNext.disabled = currentStep.value === totalSteps;
  }

  function next() {
    if (currentStep.value < totalSteps) {
      currentStep.value++;
      updateDescriptionUI();
    }
  }

  function prev() {
    if (currentStep.value > 1) {
      currentStep.value--;
      updateDescriptionUI();
    }
  }

  return { currentStep, updateDescriptionUI, next, prev };
}