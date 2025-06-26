// ======= DOM 가져오기 ======== //
const $modalOverlay = document.getElementById('modal-overlay');
const $gaugeBar = document.getElementById('gauge-bar');
const $message = document.getElementById('message');
const $clickBtn = document.getElementById('modal-click-btn');
const $scoreDisplay = document.getElementById('score-display');
const $modalGameContents = document.getElementById('modal-content');
const $modalWatch = document.getElementById('modal-watch');
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
const $descriptionBtn = document.querySelector('.view-port .left-box .description-button');
const $gamDescriptionScreen = document.getElementById('game-description-screen');
const $homeButton = document.querySelector('#game-description-screen #home-button');

export default {
    $modalOverlay,
    $gaugeBar,
    $message,
    $clickBtn,
    $scoreDisplay,
    $modalGameContents,
    $modalWatch,
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
    $homeButton
};