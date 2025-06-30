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
        $hpBar,
        $overOverlay,
        $restartBtn,
        $goHomeBtn,
        $homeModal,
        $confirmYes,
        $confirmNo,
        $gameDescriptionPre,
        $gameDescriptionNext,
        $gameDescriptionTextBox,
        $catchIt,
        $modalGameContents,
        $gameLoadBtn,
    } = elements;

    let intervalId = null;
    let timerId = null;
    let stopped = false;
    let currentFishNumber = null;
    let totalScore = 0;

    // 낚시대 내구도 용 변수
    let hp = 100;
    let currentHp = getComputedStyle($hpBar).height.slice(0, -1);

    // 점수 텍스트 초기화
    $score.textContent = `${totalScore}`;

    showHp(hp);

    const seaWidth = $thowitWrap.offsetWidth;
    const seaHeight = $thowitWrap.offsetHeight - 140;

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
        $score.textContent = `${totalScore}`;
    }

    function decreaseHp(finalScore, fishingScore){
        if(finalScore === 0){
            // console.log(`실패 hp 감소 시작`)
            switch (fishingScore){
                case 10:
                    hp -= 10;
                    break;
                case 20:
                    hp -= 20;
                    break;
                case 30:
                    hp -= 30;
                    break;
                case 40:
                    hp -= 40;
                    break;
                case 50:
                    hp -= 50;
                    break;
            }
            return hp;
        }
        else{
            switch (finalScore){
                case 10:
                case 20:
                    hp -= 5;
                    break;
                case 30:
                case 40:
                    hp -= 10;
                    break;
                default:
                    hp -= 15;
                    break;
            }
            return hp;
        }
    }

    function showHp(hp) {
        // console.log(currentHp)
        if(currentHp <= 0) {
            hp = 0;
        }
        currentHp = hp;
        // console.log(currentHp)
        $hpBar.style.height = `${currentHp}%`;
    }

    function openGameOverModal(){

        showHp(hp);

        $overOverlay.style.display = 'flex';

        stopped = true;

        if(stopped){
            $fish.classList.remove('show');
            clearTimeout(timerId);
            clearInterval(intervalId);

            intervalId = null;
        }
    }

    function initializeGame() {
        stopped = false;

        hp = 100;
        currentHp = 100;
        showHp(hp);

        totalScore = 0;

        $score.textContent = `${totalScore}`;

        $catchIt.classList.remove('active');

    }

    function closeOverModal() {
        $viewPort.style.display = 'flex';
        $overOverlay.style.display = 'none';
        $sea.style.display = 'none';
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

    function startFishGame() {
        if (intervalId !== null) return; // 중복 방지

        if(hp <= 0){
            openGameOverModal();
            return;
        }

        intervalId = setInterval(() => {
            $seaBg.style.animationPlayState = 'running';
            showFish();
        }, 1000);
    }


    // ======== 이벤트 리스너 설정 ========== //
    $fish.addEventListener('click', e => {

        stopped = true;
        if(stopped){

            $catchIt.classList.add('active');
            $seaBg.style.animationPlayState = 'paused';

            clearTimeout(timerId);
            clearInterval(intervalId);
            intervalId = null;

            setTimeout(() => {
                $fish.classList.remove('show');
                $modalOverlay.style.display = 'flex';
            }, 600);
        }

        updateModalUI(currentFishNumber, (finalScore, fishingScore) => {
            // console.log(`🎯 최종 점수: ${finalScore}`);
            // 여기서 이후 UI 업데이트나 게임 진행 가능
            stopped = false;
            writeLog(finalScore);
            showHp(decreaseHp(finalScore, fishingScore));
            $catchIt.classList.remove('active');

        });

    })

    // event.js 내용
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
            totalScore = savedScore;
            hp = savedHp;
            currentHp = savedHp;
            // console.log('저장된 점수:', savedScore);
            // console.log('저장된 HP:', savedHp);
            // 점수 텍스트 로드된 데이터에 맞춰서 로딩
            $score.textContent = `${totalScore}`;
            // hp 바 로드된 데이터에 맞춰서 로딩
            showHp(hp);
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

    // 결과 창에서 닫기 버튼 누르면 결과 창과 모달 닫힘.
    $resultCloseBtn.addEventListener('click', e => {
        $modalOverlay.style.display = 'none';
        $resultBox.style.display = 'none';
        startFishGame();
    });

    // 게임 오버 모달에서 메인으로 돌아가기 버튼 클릭
    $restartBtn.addEventListener('click', e => {
        // 불러오기 기능 완성 시 로컬 스토리지에 저장

        // 메인으로 나가고 게임 초기화
        closeOverModal();
        initializeGame();
    })

    // 홈 버튼 클릭 → 모달 열기
    $goHomeBtn.addEventListener('click', () => {
        $homeModal.style.display = 'flex';
    });

    // "아니오" → 모달 닫기
    $confirmNo.addEventListener('click', () => {
        $homeModal.style.display = 'none';
    });

    // "예" → 인트로 화면으로 이동
    $confirmYes.addEventListener('click', () => {
        const gameState = {
            savedScore: totalScore,
            savedHp: hp
        };

        localStorage.setItem('throwItState', JSON.stringify(gameState));

        $viewPort.style.display = 'flex';
        $sea.style.display = 'none';
        $homeModal.style.display = 'none';
        
        // 게임 정지
        $seaBg.style.animationPlayState = 'paused';
        $fish.classList.remove('show');
        clearTimeout(timerId);
        clearInterval(intervalId);
        intervalId = null;
        
        // 게임 초기화
        initializeGame();
    });

    // 우클릭 메뉴 막기
    document.addEventListener('contextmenu', (e) => e.preventDefault());
}


