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
    $seaBg
};