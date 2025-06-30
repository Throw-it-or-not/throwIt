// 난이도 & 점수 설정

export const difficultySettings = {
  easy: {
    decGaugeAmount: 4,
    incGaugeAmount: 7,
    intervalMs: 1000,
    successRange: [60, 90],
    timeLimit: 5000,
    startPercent: 50,
  },
  normal: {
    decGaugeAmount: 5,
    incGaugeAmount: 6,
    intervalMs: 800,
    successRange: [70, 90],
    timeLimit: 5000,
    startPercent: 50,
  },
  hard: {
    decGaugeAmount: 8,
    incGaugeAmount: 5,
    intervalMs: 600,
    successRange: [70, 85],
    timeLimit: 5000,
    startPercent: 40,
  }
};

export function getFishScore(fishNumber) {
  switch (fishNumber) {
    case 0:
      return 10; // 물고기1: 작고 쉬움
    case 1:
      return 20;
    case 2:
      return 30;
    case 3:
      return 40;
    case 4:
      return 50; // 물고기5: 크고 어려움
    default:
      return 0;  // 예외 처리
  }
}

export function setLevel(fishNumber) {
  if (fishNumber < 2) return 'easy';
  if (fishNumber < 4) return 'normal';
  return 'hard';
}