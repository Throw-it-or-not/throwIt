import elements from './dom.js';


// ======== 함수 정의 ========= //

/**
 * @description 낚시 미니게임을 실행
 * @param {number} fishNumber - 물고기 번호 (1~5)
 */
function updateModalUI(fishNumber) {

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

  // 한 번에 감소하는 게이지 양
  const decGaugeMount = 8;

  // 시작 낚시대 게이지
  const startPercent = 40;

  // 현재 낚시대 게이지
  let curPercent = 70;

  // 감소 타이머
  let decTimerId = null;

  // 낚시 게이지 표현
  $gaugeBar.style.height = `${curPercent}%`;

  // 게이지 색상 업데이트 함수
  updateGaugeColor($gaugeBar, curPercent);

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


// 앱을 시작하는 함수
export function start() {
  const randomNumber = Math.floor(Math.random() * 5) + 1;
  updateModalUI(randomNumber);
}