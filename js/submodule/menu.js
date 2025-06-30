import elements from './dom.js';
import {startFishGame, getHp, showHp, setHp, setScore, setCurrentHp, getScore} from './fish.js';

export function start() {

  // DOM 디스트럭쳐링
  const {
    $sea,
    $startBtn,
    $viewPort,
    $descriptionBtn,
    $gamDescriptionScreen,
    $homeButton,
    $score,
    $gameDescriptionPre,
    $gameDescriptionNext,
    $gameDescriptionTextBox,
    $gameLoadBtn,
  } = elements;

  // 지금 현재 게임설명 몇 단계를 보고있는지를 전역적으로 기억할 수 있게 kdh
  let currentStep = 1;
  // 전체 단계의 개수 kdh
  const totalSteps = $gameDescriptionTextBox.length;

  // 게임 설명 화면에서의 다음, 이전 버튼 누를 때 화면 전환 함수 - kdh
  function updateDescriptionUI() {

    // 1. 설명 화면 업데이트
    $gameDescriptionTextBox.forEach(($stepText) => {
      // 현재 활성화해야하는 컨텍스박스의 id의 끝값과 currentStep의 값이 일치
      if ($stepText.getAttribute('id') === `step-${currentStep}` ) {
        $stepText.classList.add('active');

      } else {
        $stepText.classList.remove('active');
      }
    });

    // 2. 이전/ 다음 버튼 활성화 처리
    $gameDescriptionPre.disabled = currentStep === 1;
    $gameDescriptionNext.disabled = currentStep === totalSteps;

  }

  // 불러오기 버튼 이벤트
  $gameLoadBtn.addEventListener('click', e => {
    // 인트로 화면 사라지게 하기
    $viewPort.style.display = 'none';

    // 바다 스테이지 화면 불러오기
    $sea.style.display = 'block';

    // 로컬 스토리지에 저장된 값 변수에 저장
    const saved = localStorage.getItem('throwItState');
    if (saved) {
      const { savedScore, savedHp } = JSON.parse(saved);
      setScore(savedScore);
      setHp(savedHp);
      setCurrentHp(savedHp);
      // console.log('저장된 점수:', savedScore);
      // console.log('저장된 HP:', savedHp);
      // 점수 텍스트 로드된 데이터에 맞춰서 로딩
      $score.textContent = `${getScore()}`;
      // hp 바 로드된 데이터에 맞춰서 로딩
      showHp(getHp());
    }
    startFishGame();
  });

  //클릭 이벤트
  $startBtn.addEventListener('click', e => {
    // 인트로 화면 사라지게 하기
    $viewPort.style.display = 'none';

    // 바다 스테이지 화면 불러오기
    $sea.style.display = 'block';

    startFishGame();

  });

  // 게임 설명 버튼 이벤트
  $descriptionBtn.addEventListener('click', e => {
    // 인트로 화면 사라지게 하기
    $viewPort.style.display = 'none';

    // 게임 설명 화면 불러오기
    $gamDescriptionScreen.style.display = 'flex';

    // 게임 설명 화면 1번으로 초기화 하기
    currentStep = 1;
    updateDescriptionUI();

  });

  // 게임 설명 버튼의 다음 버튼 이벤트 kdh
  $gameDescriptionNext.addEventListener('click', e => {
    if (currentStep < totalSteps) {
      currentStep++;
      // 설명 UI 업데이트
      updateDescriptionUI();
    }
  });

  // 게임 설명 버튼의 이전 버튼 이벤트 kdh
  $gameDescriptionPre.addEventListener('click', e => {
    if(currentStep > 1) {
      currentStep--;
      // 설명 UI 업데이트
      updateDescriptionUI();
    }
  });


  // 게임 설명 화면의 메인화면으로 돌아가는 버튼 이벤트
  $homeButton.addEventListener('click', e => {
    // 게임 설명 화면 사라지게 하기
    $gamDescriptionScreen.style.display = 'none';

    //인트로 화면 나타나게 하기
    $viewPort.style.display = 'flex';
  });

  // 우클릭 메뉴 막기
  document.addEventListener('contextmenu', (e) => e.preventDefault());
}