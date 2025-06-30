// 낚시 성공/실패 처리

export function handleFishingResult(curPercent, score, min, max, $resultBox, $resultMessage, $resultScore, $clickBtn) {
  $clickBtn.disabled = true;

  const isSuccess = curPercent >= min && curPercent <= max;
  const finalScore = isSuccess ? score : 0;

  $resultBox.style.display = 'block';
  $resultMessage.textContent = isSuccess ? '🎉 성공!' : '😢 실패!';
  $resultScore.textContent = `획득 점수: ${finalScore}점`;

  return finalScore;
}