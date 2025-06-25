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
    $sea
  } = elements;


  //클릭 이벤트
  $startBtn.addEventListener('click', e => {
    // 인트로 화면 사라지게 하기
    $viewPort.style.display = 'none';

    // 바다 스테이지 화면 불러오기
    $sea.style.display = 'block';

  });

}