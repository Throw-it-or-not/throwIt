// 점수와 HP 전역 상태 관리

let hp = 100;
let currentHp = 100;
let totalScore = 0;

export function getHp() {
  return hp;
}
export function setHp(newHp) {
  hp = newHp;
}
export function getCurrentHp() {
  return currentHp;
}
export function setCurrentHp(val) {
  currentHp = val;
}
export function getScore() {
  return totalScore;
}
export function setScore(val) {
  totalScore = val;
}