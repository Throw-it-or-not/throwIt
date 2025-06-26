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
    $modalWatch,
    $resultBox,
    $resultMessage,
    $resultScore,
    $resultCloseBtn,
    $modalOverlay,
  } = elements;

  // ======== 상태관리 변수 및 상수 ======== //

  // 무슨 물고기인지에 따라 획득할 수 있는 점수 달라짐.
  let fishingScore = getFishScore(fishNumber);
  console.log(fishingScore);

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
      successRange: [78, 85],
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
  // 감소 타이머 인터벌 간격
  const decTimerInterval = config.intervalMs;

  // 클릭 확인 변수 0: 좌클릭, 2: 우클릭
  let expectedClick = 0;

  // 종료 시간
  const setFishingTime = config.timeLimit;

  // 결과 점수
  let resultScore = 0;

  // 낚시 게이지 표현
  $gaugeBar.style.height = `${startPercent}%`;

  // 게이지 색상 업데이트 함수
  updateGaugeColor($gaugeBar, curPercent, successMin, successMax);
  
  // 낚시 게임 버튼 초기화(활성화)
  $clickBtn.disabled = false;

  // 지정된 시간이 지난 후 게임 종료
  setTimeout(() => {
    timeOver(decTimerId);
    resultScore = handleFishingResult(curPercent, $clickBtn, fishingScore, $resultBox, $resultMessage, $resultScore, successMin, successMax);
    console.log(`decGaugeMount: ${decGaugeMount}`);

    // 게임 끝났으니 콜백 호출
    if (typeof onFinished === 'function') {
      onFinished(resultScore);
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
    updateGaugeColor($gaugeBar, curPercent);
  }, decTimerInterval);


  // ======== 이벤트 리스너 설정 ========== //

  // 좌/우 클릭 번갈아가며 게이지 증가
  $clickBtn.addEventListener('mousedown', (e) => {
    e.preventDefault(); // 기본 동작 방지 (특히 우클릭 메뉴)

    // 클릭 순서가 맞을 때만 진행
    if (e.button === expectedClick && curPercent < 100) {
      curPercent += incGaugeMount;
      if (curPercent > 100) curPercent = 100;
      $gaugeBar.style.height = `${curPercent}%`;

      // 게이지 색상 업데이트 함수
      updateGaugeColor($gaugeBar, curPercent, successMin, successMax);

      // 다음에 눌러야 할 클릭 반전
      expectedClick = expectedClick === 0 ? 2 : 0;
    }
  });

  // 우클릭 메뉴 막기
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // 결과 창에서 닫기 버튼 누르면 결과 창과 모달 닫힘.
  $resultCloseBtn.addEventListener('click', e => {
    $modalOverlay.style.display = 'none';
    $resultBox.style.display = 'none';
  });
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
 * @description - 낚시 결과를 처리하는 함수
 * @param currentPercent - 현재 게이지 바 퍼센트
 * @param $clickBtn - 게이지 변경 버튼 요소 노드
 * @param score - 반환할 점수
 * @param $resultBox - 결과 정보를 나타낼 창의 요소 노드
 * @param $resultMessage - 결과 메시지 요소 노드
 * @param $resultScore - 게임 결과를 통해 변경되는 최종 점수
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
 * @description ${setTime}초가 지나면 낚시를 종료시키는 함수
 * @param timerId - 게이지를 감소시키는 인터벌 타이머의 아이디
 */
function timeOver(timerId) {
  // 게이지 감소 타이머 멈춤
  clearInterval(timerId);
  timerId = null;
}

