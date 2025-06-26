import elements from './dom.js';


export function bindEvents() {

// DOM 디스트럭쳐링
  const {
    $filters,
    $clearCompletedBtn,
    $todoList,
    $todoInput,
    $todoForm,
    $startBtn,
    $viewPort,
    $sea,
    $descriptionBtn,
    $gamDescriptionScreen,
    $homeButton
  } = elements;


  //클릭 이벤트
  $startBtn.addEventListener('click', e => {
    // 인트로 화면 사라지게 하기
    $viewPort.style.display = 'none';

    // 바다 스테이지 화면 불러오기
    $sea.style.display = 'block';

  });

  // 게임 설명 버튼 이벤트
  $descriptionBtn.addEventListener('click', e => {
    // 인트로 화면 사라지게 하기
    $viewPort.style.display = 'none';

    // 게임 설명 화면 불러오기
    $gamDescriptionScreen.style.display = 'flex';

  });

  // 게임 설명 화면의 메인화면으로 돌아가는 버튼 이벤트
  $homeButton.addEventListener('click', e => {
    // 게임 설명 화면 사라지게 하기
    $gamDescriptionScreen.style.display = 'none';

    //인트로 화면 나타나게 하기
    $viewPort.style.display = 'flex';

  });

}