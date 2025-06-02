const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreElement = document.getElementById('score');
const highscoreElement = document.getElementById('highscore');

let score = 0;
let highscore = localStorage.getItem('marioHighscore') || 0;
highscoreElement.textContent = highscore;

let gameOver = false;

// Incrementa pontos a cada 100ms enquanto o jogo não acabou
const scoreInterval = setInterval(() => {
    if (!gameOver) {
        score++;
        scoreElement.textContent = score;
    }
}, 100);

const jump = () => {
    mario.classList.add('jump');
    setTimeout(() => {
        mario.classList.remove('jump');
    }, 500);
}
const loop = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80) {
        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;
        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;        
        mario.src = './mario-jump-images/game-over.png';
        mario.style.width = '75px';
        mario.style.marginLeft = '50px';
        clearInterval(loop);
        gameOver = true;
        clearInterval(scoreInterval);

        // Atualiza recorde se necessário
        if (score > highscore) {
            highscore = score;
            localStorage.setItem('marioHighscore', highscore);
            highscoreElement.textContent = highscore;
        }
    }
}, 10);



document.addEventListener('keydown', jump);
