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
    $scoreDisplay,
    $modalGameContents,
    $modalWatch,
  } = elements;

  // ======== 상태관리 변수 및 상수 ======== //

  // 무슨 물고기인지에 따라 획득할 수 있는 점수 달라짐.
  let fishingScore = getFishScore(fishNumber);
  console.log(fishingScore);

  // 한 번의 클릭 당 증가하는 게이지 양
  const incGaugeMount = 5;

  // 한 번에 감소하는 게이지 양
  const decGaugeMount = 8;

  // 시작 낚시대 게이지
  const startPercent = 40;

  // 현재 낚시대 게이지
  let curPercent = 70;

  // 감소 타이머
  let decTimerId = null;

  // 클릭 확인 변수 0: 좌클릭, 2: 우클릭
  let expectedClick = 0;

  // 낚시 제한 시간
  const setFishingTime = 5000;

  // 결과 점수
  let resultScore = 0;

  // 낚시 게이지 표현
  $gaugeBar.style.height = `${curPercent}%`;

  // 게이지 색상 업데이트 함수
  updateGaugeColor($gaugeBar, curPercent);

  // 지정된 시간이 지난 후 게임 종료
  setTimeout(() => {
    timeOver(decTimerId);
    resultScore = handleFishingResult(curPercent, $scoreDisplay, $clickBtn, fishingScore);

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
  }, 1000);


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
      updateGaugeColor($gaugeBar, curPercent);

      // 다음에 눌러야 할 클릭 반전
      expectedClick = expectedClick === 0 ? 2 : 0;

      // 메시지 업데이트
      // $modalWatch.textContent = '';
      // if (curPercent === 100) {
      //   $modalWatch.textContent = '물고기가 도망갔어요!';
      // }
    }
  });

  // 우클릭 메뉴 막기
  document.addEventListener('contextmenu', (e) => e.preventDefault());
}


/**
 * @description 물고기 번호에 따라 점수를 반환하는 함수
 * @param {number} fishNumber - 1 ~ 5 사이의 물고기 종류 번호
 * @returns {number} 점수
 */
function getFishScore(fishNumber) {
  switch (fishNumber) {
    case 1:
      return 10; // 물고기1: 작고 쉬움
    case 2:
      return 20;
    case 3:
      return 30;
    case 4:
      return 40;
    case 5:
      return 50; // 물고기5: 크고 어려움
    default:
      return 0;  // 예외 처리
  }
}

/**
 * @description 게이지 색상 업데이트 함수
 * @param $gaugeBar - 색상을 변화시킬 게이지 바 요소 노드
 * @param currentPercent - 현재 낚시대 게이지 %
 */
function updateGaugeColor($gaugeBar, currentPercent) {
  if (currentPercent > 90) {
    $gaugeBar.style.backgroundColor = '#f44336'; // 빨강
  } else if (currentPercent < 70) {
    $gaugeBar.style.backgroundColor = '#ffeb3b'; // 노랑
  } else {
    $gaugeBar.style.backgroundColor = '#4caf50'; // 초록 (기본)
  }
}

/**
 * @description - 낚시 결과를 처리하는 함수
 * @param currentPercent - 현재 게이지 바 퍼센트
 * @param $display - 점수를 기록하는 요소 노드 (후에 삭제 예정)
 * @param $clickBtn - 게이지 변경 버튼 요소 노드
 * @param score - 반환할 점수
 * @returns {number} 점수
 */
function handleFishingResult(currentPercent, $display, $clickBtn, score) {

  $clickBtn.disabled = true;

  // 현재 게이지가 70 이상 90 이하 = 성공, 이외 실패
  if (currentPercent >= 70 && currentPercent <= 90) { // 성공
    $display.textContent = `점수: ${score}점`;
    alert('성공');
  } else {  // 실패
    score = 0;
    alert('실패');
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

