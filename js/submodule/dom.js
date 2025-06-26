// ======= DOM 가져오기 ======== //
const $modalOverlay = document.getElementById('modal-overlay');
const $gaugeBar = document.getElementById('gauge-bar');
const $message = document.getElementById('message');
const $clickBtn = document.getElementById('modal-click-btn');
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
const $scoreArea = document.getElementById('score-area');
const $guideLineMin = document.querySelector('.guide-line.guide-70');
const $guideLineMax = document.querySelector('.guide-line.guide-90');

export default {
    $modalOverlay,
    $gaugeBar,
    $message,
    $clickBtn,
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
    $guideLineMin,
    $guideLineMax,
};