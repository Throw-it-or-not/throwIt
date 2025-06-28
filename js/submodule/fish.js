import elements from './dom.js';
import {updateModalUI} from "./catch.js";

// import {bindEvents} from "./event.js";


// 앱을 시작하는 함수
export function start() {

    // bindEvents(); // 이벤트 실행

    // DOM 디스트럭쳐링
    const {
        $sea,
        $fish,
        $seaBg,
        $modalOverlay,
        $thowitWrap,
        $scoreArea,
        $startBtn,
        $viewPort,
        $descriptionBtn,
        $gamDescriptionScreen,
        $homeButton,
        $resultCloseBtn,
        $resultBox,
        $score,
        $gameDescriptionPre,
        $gameDescriptionNext,
        $gameDescriptionTextBox,
    } = elements;

    let intervalId = null;
    let timerId = null;
    let stopped = false;
    let currentFishNumber = null;
    let totalScore = 0;

    // 낚시대 내구도 용 변수
    let durability = 100;

    const seaWidth = $thowitWrap.offsetWidth;
    const seaHeight = $thowitWrap.offsetHeight;

    const maxX = seaWidth - $fish.offsetWidth - 100;
    const maxY = seaHeight - $fish.offsetHeight - 100;

    const species = [
        'url(/image/fish-01.png)',
        'url(/image/fish-02.png)',
        'url(/image/fish-03.png)',
        'url(/image/fish-04.png)',
        'url(/image/fish-05.png)'
    ];

    // 지금 현재 게임설명 몇 단계를 보고있는지를 전역적으로 기억할 수 있게 kdh
    let currentStep = 1;
    // 전체 단계의 개수 kdh
    const totalSteps = $gameDescriptionTextBox.length;

// Math.floor(Math.random() * (y - x + 1)) + x;


    function makeFish(){
        const random = Math.floor(Math.floor(Math.random() * 5));

        switch (random) {
            case 0:
                $fish.style.backgroundImage = species[0];
                break;
            case 1:
                $fish.style.backgroundImage = species[1];
                break;
            case 2:
                $fish.style.backgroundImage = species[2];
                break;
            case 3:
                $fish.style.backgroundImage = species[3];
                break;
            case 4:
                $fish.style.backgroundImage = species[4];
                break;
        }

        return random;
    }

    function showFish(){
        const x = Math.floor(Math.random() * maxX) + 1;
        const y = Math.floor(Math.random() * maxY) +1;

        timerId = setTimeout(() => {

            if(!stopped){

                currentFishNumber = makeFish();

                $fish.style.left = `${x}px`;
                $fish.style.top = `${y}px`;

                $fish.classList.add('show');
            }

        }, 1000)

    }

    function writeLog(score) {
        totalScore += score
        $score.textContent = totalScore;
    }

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

    // ======== 이벤트 리스너 설정 ========== //
    function startFishGame() {
        if (intervalId !== null) return; // 중복 방지

        intervalId = setInterval(() => {
            $seaBg.style.animationPlayState = 'running';
            showFish();
        }, 1000);
    }

    $fish.addEventListener('click', e => {

        stopped = true;
        if(stopped){

            $seaBg.style.animationPlayState = 'paused';
            $fish.classList.remove('show');
            clearTimeout(timerId);
            clearInterval(intervalId);
            intervalId = null;

            $modalOverlay.style.display = 'flex';
        }

        updateModalUI(currentFishNumber, (finalScore) => {
            console.log(`🎯 최종 점수: ${finalScore}`);
            // 여기서 이후 UI 업데이트나 게임 진행 가능
            stopped = false;
            writeLog(finalScore);
        });


    })

    // event.js 내용
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

    // 결과 창에서 닫기 버튼 누르면 결과 창과 모달 닫힘.
    $resultCloseBtn.addEventListener('click', e => {
        $modalOverlay.style.display = 'none';
        $resultBox.style.display = 'none';

        startFishGame();
    });

    // 우클릭 메뉴 막기
    document.addEventListener('contextmenu', (e) => e.preventDefault());
}


