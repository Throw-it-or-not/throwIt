// ======= DOM 가져오기 ======== //
const $modalOverlay = document.getElementById('modal-overlay');
const $gaugeBar = document.getElementById('gauge-bar');
const $message = document.getElementById('message');
const $clickBtn = document.getElementById('modal-click-btn');
const $modalGameContents = document.getElementById('modal-content');
const $sea = document.getElementById('sea-wrapper');
const $fish = document.querySelector('.fish-btn');
const $seaBg = document.getElementById('sea-bg');
const $startBtn = document.querySelector('.view-port .left-box .start-button');
const $viewPort = document.querySelector('.view-port');
const $thowitWrap = document.getElementById('throwit-wrap');
const $resultBox = document.getElementById('result-box');
const $resultMessage = document.getElementById('result-message');
const $resultScore = document.getElementById('result-score');
const $resultCloseBtn = document.getElementById('result-close-btn');
const $scoreArea = document.getElementById('score-area');
const $score = document.querySelector('.score');
const $descriptionBtn = document.querySelector('.view-port .left-box .description-button');
const $gamDescriptionScreen = document.getElementById('game-description-screen');
const $homeButton = document.querySelector('#game-description-screen #home-button');
const $guideLineMin = document.querySelector('.guide-line.guide-70');
const $guideLineMax = document.querySelector('.guide-line.guide-90');
const $hpBar = document.getElementById('hp-bar');
const $overOverlay = document.getElementById('modal-overlay-over');
const $clickLeftGuide = document.getElementById('click-left-guide');
const $clickRightGuide = document.getElementById('click-right-guide');
const $restartBtn = document.getElementById('restart-btn');
const $modalTimer = document.getElementById('modal-timer');
const $goHomeBtn = document.getElementById('go-home-btn');
const $homeModal = document.getElementById('home-confirm-modal');
const $confirmYes = document.getElementById('confirm-yes');
const $confirmNo = document.getElementById('confirm-no');
const $gameDescriptionPre = document.getElementById('game-description-pre'); // kdh
const $gameDescriptionNext = document.getElementById('game-description-next'); // kdh
const $gameDescriptionTextBox = [...document.querySelectorAll('.game-description-text')]; // kdh
const $countdown = document.getElementById('countdown-text');
const $modalFishImg = document.querySelector('#modal-fish-container img');

export default {
    $modalOverlay,
    $gaugeBar,
    $message,
    $clickBtn,
    $modalGameContents,
    $sea,
    $fish,
    $seaBg,
    $startBtn,
    $viewPort,
    $thowitWrap,
    $resultBox,
    $resultMessage,
    $resultScore,
    $resultCloseBtn,
    $descriptionBtn,
    $gamDescriptionScreen,
    $homeButton,
    $guideLineMin,
    $guideLineMax,
    $scoreArea,
    $hpBar,
    $overOverlay,
    $score,
    $clickLeftGuide,
    $clickRightGuide,
    $restartBtn,
    $modalTimer,
    $goHomeBtn,
    $homeModal,
    $confirmYes,
    $confirmNo,
    $gameDescriptionPre,
    $gameDescriptionNext,
    $gameDescriptionTextBox,
    $countdown,
    $modalFishImg,
};