// UI 보조 기능들 (게이지 색상, 클릭 가이드)

export function updateGaugeColor($gaugeBar, percent, min, max) {
  if (percent > max) {
    $gaugeBar.style.backgroundColor = '#f44336'; // 빨강
  } else if (percent < min) {
    $gaugeBar.style.backgroundColor = '#ffeb3b'; // 노랑
  } else {
    $gaugeBar.style.backgroundColor = '#4caf50'; // 초록
  }
}

export function updateClickGuide(expectedClick, $left, $right) {
  $left.style.display = expectedClick === 0 ? 'block' : 'none';
  $right.style.display = expectedClick === 0 ? 'none' : 'block';
}