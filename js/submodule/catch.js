import elements from './dom.js';


// ======== 함수 정의 ========= //

/**
 * @description 낚시 미니게임을 실행하고, 종료되면 콜백으로 점수를 전달합니다.
 * @param {number} fishNumber - 물고기 번호 (1~5)
 * @param {(score: number) => void} [onFinished] - 게임 종료 후 호출될 콜백 함수. 점수를 인자로 받습니다.
 */
export function updateModalUI(fishNumber, onFinished) {

  // DOM 디스트럭쳐링
  const {
    $gaugeBar,
    $message,
    $clickBtn,
    $modalGameContents,
    $resultBox,
    $resultMessage,
    $resultScore,
    $resultCloseBtn,
    $modalOverlay,
    $guideLineMin,
    $guideLineMax,
    $clickLeftGuide,
    $clickRightGuide,
    $modalTimer,
    $countdown,
    $modalFishImg,
  } = elements;

  // ======== 상태관리 변수 및 상수 ======== //

  // 무슨 물고기인지에 따라 획득할 수 있는 점수 달라짐.
  let fishingScore = getFishScore(fishNumber);
  // 들어온 물고기에 따라 이미지 변경
  $modalFishImg.src = `image/modal_fish0${fishNumber + 1}.gif`;

  // 난이도별 세팅
  const difficultySettings = {
    easy: {
      decGaugeAmount: 4,
      incGaugeAmount: 7,
      // 감소하는 인터벌의 간격
      intervalMs: 1000,
      // 성공 범위
      successRange: [60, 90],
      // 낚시 제한 시간
      timeLimit: 5000,
      startPercent: 50,
    },
    normal: {
      decGaugeAmount: 5,
      incGaugeAmount: 6,
      intervalMs: 800,
      successRange: [70, 90],
      timeLimit: 5000,
      startPercent: 50,
    },
    hard: {
      decGaugeAmount: 8,
      incGaugeAmount: 5,
      intervalMs: 600,
      successRange: [70, 85],
      timeLimit: 5000,
      startPercent: 40,
    }
  };

  // 난이도 결정
  const level = setLevel(fishNumber);
  const config = difficultySettings[level];
  // 한 번의 클릭 당 증가하는 게이지 양
  const incGaugeMount = config.incGaugeAmount;
  // 한 번에 감소하는 게이지 양
  const decGaugeMount = config.decGaugeAmount;
  // 시작 게이지 양
  const startPercent = config.startPercent;
  // 현재 낚시대 게이지
  let curPercent = startPercent;
  // 성공 범위
  const [successMin, successMax] = config.successRange;
  // 감소 타이머
  let decTimerId = null;
  // 시간 UI 타이머
  let watchIntervalId = null;
  // 감소 타이머 인터벌 간격
  const decTimerInterval = config.intervalMs;

  // 클릭 확인 변수 0: 좌클릭, 2: 우클릭
  let expectedClick = 0;

  // 종료 시간
  const setFishingTime = config.timeLimit;
  
  // 타이머에 기록할 남은 시간 변수
  let remainTime = setFishingTime / 1000; // 5000ms -> 5초
  // 텍스트로 남은 시간 초기화 (소수점 한 자리까지)
  $modalTimer.textContent = `${remainTime.toFixed(1)}초`;
  // 텍스트 색상 초기화
  $modalTimer.style.color = 'white';
  // 텍스트 애니메이션 조절 변수
  let pulseTimer = 0;
  // 텍스트 애니메이션 동작 클래스 제거
  $modalTimer.classList.remove('timer-pulse');

  // 결과 점수
  let resultScore = 0;

  // 낚시 게이지 표현
  $gaugeBar.style.transition = 'none'; // 깜빡임 방지
  $gaugeBar.style.height = `${startPercent}%`;
  // 게이지 색상 업데이트 함수
  updateGaugeColor($gaugeBar, curPercent, successMin, successMax);
  void $gaugeBar.offsetHeight; // 강제 리플로우
  $gaugeBar.style.transition = ''; // transition 복원
  
  // 성공 범위에 따라 가이드 라인 변경
  $guideLineMin.style.bottom = `${successMin}%`;
  $guideLineMax.style.bottom = `${successMax}%`;

  // 게임 시작 시 초기 클릭 방향 가이드 표시
  updateClickGuide(expectedClick, $clickLeftGuide, $clickRightGuide);

  // 낚시 게임 버튼 초기화(비활성화)
  $clickBtn.disabled = true;

  showReadyStart($countdown, $clickBtn, () => {

    // 0.1초마다 타이머의 시간을 변경하는 인터벌
    watchIntervalId = setInterval(() => {
      remainTime -= 0.1;

      if (remainTime <= 0) {
        remainTime = 0;
        // 남은 시간이 0보다 작거나 같아지면 자동적으로 인터벌 중지
        clearInterval(watchIntervalId);
      }

      // 텍스트 표시
      $modalTimer.textContent = `${remainTime.toFixed(1)}초`;

      // 남은 시간에 따라 색상 변경
      if (remainTime <= 1.0) {
        $modalTimer.style.color = '#f44336'; // 빨강
      } else if (remainTime <= 2.0) {
        $modalTimer.style.color = '#ff9800'; // 주황
      } else {
        $modalTimer.style.color = 'white';   // 기본색
      }

      // 0.3초 간격으로만 애니메이션 재실행
      pulseTimer += 0.1;
      if (remainTime <= 2.0 && pulseTimer >= 0.3) {
        $modalTimer.classList.remove('timer-pulse');
        void $modalTimer.offsetWidth; // 강제 리플로우
        $modalTimer.classList.add('timer-pulse');
        pulseTimer = 0; // 초기화
      }

      // 2초 초과 시 애니메이션 제거
      if (remainTime > 2.0) {
        $modalTimer.classList.remove('timer-pulse');
        pulseTimer = 0;
      }

    }, 100);

    // 지정된 시간이 지난 후 게임 종료
    setTimeout(() => {

      // 게이지 감소 인터벌을 멈춤
      timeOver(decTimerId, watchIntervalId);

      // 게임이 종료되어, 점수 판별 전 게이지 업데이트
      updateGaugeColor($gaugeBar, curPercent, successMin, successMax);

      // 최종 점수 판결, 종료 박스 열기
      resultScore = handleFishingResult(curPercent, $clickBtn, fishingScore, $resultBox, $resultMessage, $resultScore, successMin, successMax);

      // 게임 끝났으니 콜백 호출
      if (typeof onFinished === 'function') {
        onFinished(resultScore, fishingScore);
      }
    }, setFishingTime);


    // 일정 시간마다 decGaugeMount%씩 감소 (1초마다)
    decTimerId = setInterval(() => {
      // 타이머가 멈춘 뒤에도 실행되지 않도록 방지
      if (decTimerId === null) return;

      // 게이지가 0에서 100 사이일 경우에만 감소
      if (curPercent >= 0 && curPercent <= 100) {
        curPercent -= decGaugeMount;

        // 0보다 작아지지 않도록 설정
        if (curPercent < 0) curPercent = 0;
        // 줄어든 게이지%를 기준으로 게이지 바 크기 설정
        $gaugeBar.style.height = `${curPercent}%`;
      }
      // 게이지 색상 업데이트 함수
      updateGaugeColor($gaugeBar, curPercent, successMin, successMax);
    }, decTimerInterval);

  });


  // ======== 이벤트 리스너 설정 ========== //

  // 좌/우 클릭 번갈아가며 게이지 증가
  $clickBtn.addEventListener('mousedown', (e) => {
    e.preventDefault(); // 기본 동작 방지 (특히 우클릭 메뉴)

    // catch.js 내부, $clickBtn 이벤트 리스너 안쪽에 추가
    $clickBtn.classList.remove('modal-click-animate');
    void $clickBtn.offsetWidth; // 강제 리플로우
    $clickBtn.classList.add('modal-click-animate');

    // 클릭 순서가 맞을 때만 진행
    if (e.button === expectedClick && curPercent < 100) {
      curPercent += incGaugeMount;
      if (curPercent > 100) curPercent = 100;
      $gaugeBar.style.height = `${curPercent}%`;

      // 게이지 색상 업데이트 함수
      updateGaugeColor($gaugeBar, curPercent, successMin, successMax);

      // 다음에 눌러야 할 클릭 반전
      expectedClick = expectedClick === 0 ? 2 : 0;

      // 클릭 반전 후 가이드 변경
      updateClickGuide(expectedClick, $clickLeftGuide, $clickRightGuide);
    }
  });

}


/**
 * 준비와 시작 카운트다운 애니메이션을 보여준 후, 버튼을 활성화하고 콜백을 호출합니다.
 *
 * @param {HTMLElement} $countdown 카운트다운 애니메이션을 표시할 DOM 요소
 * @param {HTMLButtonElement} $clickBtn 활성화할 버튼 요소
 * @param {Function} onDone 카운트다운이 완료된 후 실행할 콜백 함수
 * @return {void} 반환값 없음
 */
function showReadyStart($countdown, $clickBtn, onDone) {

  $countdown.textContent = 'Ready';
  $countdown.style.display = 'block';
  $countdown.style.animation = 'none'; // 초기화
  void $countdown.offsetWidth; // 강제 리플로우
  $countdown.style.animation = 'fadeInOut 1.2s ease-in-out';

  setTimeout(() => {
    $countdown.textContent = 'Start!';
    $countdown.style.animation = 'none'; // 초기화
    void $countdown.offsetWidth; // 강제 리플로우
    $countdown.style.animation = 'fadeInOut 1s ease-in-out';

    setTimeout(() => {
      $countdown.style.display = 'none';
      // 클릭 버튼 활성화
      $clickBtn.disabled = false;
      onDone(); // 게임 시작 콜백
    }, 1000);
  }, 1200);
}

/**
 * @description 물고기 번호에 따라 점수를 반환하는 함수
 * @param {number} fishNumber - 1 ~ 5 사이의 물고기 종류 번호
 * @returns {number} 점수
 */
function getFishScore(fishNumber) {
  switch (fishNumber) {
    case 0:
      return 10; // 물고기1: 작고 쉬움
    case 1:
      return 20;
    case 2:
      return 30;
    case 3:
      return 40;
    case 4:
      return 50; // 물고기5: 크고 어려움
    default:
      return 0;  // 예외 처리
  }
}

function setLevel(fishNumber) {
  switch (fishNumber) {
    case 0:
      return 'easy';
    case 1:
      return 'easy';
    case 2:
      return 'normal';
    case 3:
      return 'normal';
    case 4:
      return 'hard';
    default:
      return 'easy';
  }
}

/**
 * @description 게이지 색상 업데이트 함수
 * @param $gaugeBar - 색상을 변화시킬 게이지 바 요소 노드
 * @param currentPercent - 현재 낚시대 게이지 %
 * @param successMin - 게임 성공 범위 최소값
 * @param successMax - 게임 성공 범위 최대값
 */
function updateGaugeColor($gaugeBar, currentPercent, successMin, successMax) {
  if (currentPercent > successMax) {
    $gaugeBar.style.backgroundColor = '#f44336'; // 빨강
  } else if (currentPercent < successMin) {
    $gaugeBar.style.backgroundColor = '#ffeb3b'; // 노랑
  } else {
    $gaugeBar.style.backgroundColor = '#4caf50'; // 초록 (기본)
  }
}


/**
 * 클릭 안내 가이드를 업데이트하는 함수
 *
 * @param {number} expectedClick 예상 클릭 값. 0이면 왼쪽 가이드가 표시되고, 다른 값이면 오른쪽 가이드가 표시됩니다.
 * @param {HTMLElement} $clickLeftGuide 왼쪽 클릭 가이드를 나타내는 DOM 요소
 * @param {HTMLElement} $clickRightGuide 오른쪽 클릭 가이드를 나타내는 DOM 요소
 * @return {void} 반환값이 없습니다.
 */
function updateClickGuide(expectedClick, $clickLeftGuide, $clickRightGuide) {
  if (expectedClick === 0) {
    $clickLeftGuide.style.display = 'block';
    $clickRightGuide.style.display = 'none';
  } else {
    $clickLeftGuide.style.display = 'none';
    $clickRightGuide.style.display = 'block';
  }
}

/**
 * @description - 낚시 결과를 처리하는 함수
 * @param currentPercent - 현재 게이지 바 퍼센트
 * @param $clickBtn - 게이지 변경 버튼 요소 노드
 * @param score - 반환할 점수
 * @param $resultBox - 결과 정보를 나타낼 창의 요소 노드
 * @param $resultMessage - 결과 메시지 요소 노드
 * @param $resultScore - 게임 결과를 통해 변경되는 최종 점수
 * @param successMin - 게임 성공 범위 최소값
 * @param successMax - 게임 성공 범위 최대값
 * @returns {number} 점수
 */
function handleFishingResult(currentPercent, $clickBtn, score, $resultBox, $resultMessage, $resultScore, successMin, successMax) {

  $clickBtn.disabled = true;

  // 현재 게이지가 70 이상 90 이하 = 성공, 이외 실패
  if (currentPercent >= successMin && currentPercent <= successMax) { // 성공
    $resultBox.style.display = 'block';
    $resultMessage.textContent = '🎉 성공!';
    $resultScore.textContent = `획득 점수: ${score}점`
  } else {  // 실패
    score = 0;
    $resultBox.style.display = 'block';
    $resultMessage.textContent = '😢 실패!';
    $resultScore.textContent = `획득 점수: ${score}점`
  }

  return score;
}

/**
 * `timeOver` 메서드는 주어진 타이머 ID를 사용하여 게이지 감소를 멈춥니다.
 *
 * @param gaugeIntervalId 게이지 감소를 제어하는 타이머의 ID
 */
function timeOver(gaugeIntervalId) {
  // 게이지 감소 타이머 멈춤
  clearInterval(gaugeIntervalId);
  gaugeIntervalId = null;
}

