// updateModalUI()가 있는 메인 엔트리

import elements from '../../dom/dom.js';
import { getFishScore, setLevel, difficultySettings } from './config.js';
import { updateGaugeColor, updateClickGuide } from './utils.js';
import { handleFishingResult } from './resultHandler.js';
import { startFishGame } from '../fish/index.js';

const {
  $gaugeBar, $clickBtn, $modalGameContents, $resultBox, $resultMessage, $resultScore,
  $resultCloseBtn, $modalOverlay, $guideLineMin, $guideLineMax, $clickLeftGuide,
  $clickRightGuide, $modalTimer, $countdown, $modalFishImg
} = elements;

export function updateModalUI(fishNumber, onFinished) {
  const fishingScore = getFishScore(fishNumber);
  $modalFishImg.src = `image/modal_fish0${fishNumber + 1}.gif`;

  const level = setLevel(fishNumber);
  const config = difficultySettings[level];
  const [successMin, successMax] = config.successRange;

  Object.keys(difficultySettings).forEach(lvl => {
    $modalGameContents.classList.remove(lvl);
  });
  $modalGameContents.classList.add(level);

  let curPercent = config.startPercent;
  let decTimerId = null;
  let remainTime = config.timeLimit / 1000;
  let pulseTimer = 0;
  let expectedClick = 0;
  let resultScore = 0;

  $gaugeBar.style.transition = 'none';
  $gaugeBar.style.height = `${curPercent}%`;
  updateGaugeColor($gaugeBar, curPercent, successMin, successMax);
  void $gaugeBar.offsetHeight;
  $gaugeBar.style.transition = '';

  $guideLineMin.style.bottom = `${successMin}%`;
  $guideLineMax.style.bottom = `${successMax}%`;
  $clickBtn.disabled = true;
  $modalTimer.textContent = `${remainTime.toFixed(1)}초`;
  $modalTimer.style.color = 'white';
  $modalTimer.classList.remove('timer-pulse');

  updateClickGuide(expectedClick, $clickLeftGuide, $clickRightGuide);

  const changeTimerUI = () => {
    const watchIntervalId = setInterval(() => {
      remainTime -= 0.1;
      if (remainTime <= 0) {
        remainTime = 0;
        clearInterval(watchIntervalId);
      }
      $modalTimer.textContent = `${remainTime.toFixed(1)}초`;
      $modalTimer.style.color =
        remainTime <= 1 ? '#f44336' : remainTime <= 2 ? '#ff9800' : 'white';

      pulseTimer += 0.1;
      if (remainTime <= 2.0 && pulseTimer >= 0.3) {
        $modalTimer.classList.remove('timer-pulse');
        void $modalTimer.offsetWidth;
        $modalTimer.classList.add('timer-pulse');
        pulseTimer = 0;
      }

      if (remainTime > 2.0) {
        $modalTimer.classList.remove('timer-pulse');
        pulseTimer = 0;
      }
    }, 100);
  };

  const decGauge = () => {
    decTimerId = setInterval(() => {
      if (decTimerId === null) return;
      curPercent = Math.max(0, curPercent - config.decGaugeAmount);
      $gaugeBar.style.height = `${curPercent}%`;
      updateGaugeColor($gaugeBar, curPercent, successMin, successMax);
    }, config.intervalMs);
  };

  const showReadyStart = (cb) => {
    $countdown.textContent = 'Ready';
    $countdown.style.display = 'block';
    $countdown.style.animation = 'none';
    void $countdown.offsetWidth;
    $countdown.style.animation = 'fadeInOut 1.2s ease-in-out';

    setTimeout(() => {
      $countdown.textContent = 'Start!';
      $countdown.style.animation = 'none';
      void $countdown.offsetWidth;
      $countdown.style.animation = 'fadeInOut 1s ease-in-out';

      setTimeout(() => {
        $countdown.style.display = 'none';
        $clickBtn.disabled = false;
        cb();
      }, 1000);
    }, 1200);
  };

  const endGame = () => {
    setTimeout(() => {
      clearInterval(decTimerId);
      decTimerId = null;
      updateGaugeColor($gaugeBar, curPercent, successMin, successMax);
      resultScore = handleFishingResult(curPercent, fishingScore, successMin, successMax, $resultBox, $resultMessage, $resultScore, $clickBtn);

      if (typeof onFinished === 'function') {
        onFinished(resultScore, fishingScore);
      }
    }, config.timeLimit);
  };

  // 이벤트
  $clickBtn.addEventListener('mousedown', (e) => {
    e.preventDefault();
    $clickBtn.classList.remove('modal-click-animate');
    void $clickBtn.offsetWidth;
    $clickBtn.classList.add('modal-click-animate');

    if (e.button === expectedClick && curPercent < 100) {
      curPercent = Math.min(100, curPercent + config.incGaugeAmount);
      $gaugeBar.style.height = `${curPercent}%`;
      updateGaugeColor($gaugeBar, curPercent, successMin, successMax);
      expectedClick = expectedClick === 0 ? 2 : 0;
      updateClickGuide(expectedClick, $clickLeftGuide, $clickRightGuide);
    }
  });

  $resultCloseBtn.addEventListener('click', () => {
    $modalOverlay.style.display = 'none';
    $resultBox.style.display = 'none';
    startFishGame();
  });

  showReadyStart(() => {
    changeTimerUI();
    endGame();
    decGauge();
  });
}