// 점수에 따라 HP 감소 계산

import {getHp, setHp} from './gameState.js';

export function decreaseHp(finalScore, fishingScore, hp) {
  if(finalScore === 0){
    // console.log(`실패 hp 감소 시작`)
    switch (fishingScore){
      case 10:
        setHp(hp - 10);
        break;
      case 20:
        setHp(hp - 20);
        break;
      case 30:
        setHp(hp - 30);
        break;
      case 40:
        setHp(hp - 40);
        break;
      case 50:
        setHp(hp - 50);
        break;
    }
    return getHp();
  } else{
    switch (finalScore){
      case 10:
      case 20:
        setHp(hp - 5);
        break;
      case 30:
      case 40:
        setHp(hp - 10);
        break;
      default:
        setHp(hp - 15);
        break;
    }
    return getHp();
  }
}