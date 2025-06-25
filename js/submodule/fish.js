import elements from './dom.js';

// DOM 디스트럭쳐링
const {
    $sea,
    $fish,
    $seaBg
} = elements;

let intervalId = null;
let timerId = null;
let stopped = false;

const seaWidth = $sea.offsetWidth;
const seaHeight = $sea.offsetHeight;

const maxX = seaWidth - $fish.offsetWidth - 100;
const maxY = seaHeight - $fish.offsetHeight - 100;

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
}

function showFish(){
    const x = Math.floor(Math.random() * maxX) + 1;
    const y = Math.floor(Math.random() * maxY) +1;

    timerId = setTimeout(() => {

        if(!stopped){

            makeFish();

            $fish.style.left = `${x}px`;
            $fish.style.top = `${y}px`;

            $fish.classList.add('show');
        }

    }, 1000)

}

intervalId = setInterval(showFish, 1000);

$fish.addEventListener('click', e => {
    $seaBg.style.animationPlayState = 'paused';
    clearTimeout(timerId);
    clearInterval(intervalId);
    stopped = true;
})
