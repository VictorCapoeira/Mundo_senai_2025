const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const bill = document.querySelector('.bill');
const scoreElement = document.getElementById('score');
const highscoreElement = document.getElementById('highscore');
const restartBtn = document.getElementById('restart-btn');
const bgMusic = document.getElementById('bg-music');

let score = 0;
let highscore = localStorage.getItem('marioHighscore') || 0;
highscoreElement.textContent = highscore;

let gameOver = false;
let isDucking = false;

// Ajusta o volume da música de fundo
bgMusic.volume = 0.2; // Volume mais baixo

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

// Função genérica para lançar objetos na tela
function launchObject(element, animationName = '', duration = 2000) {
    element.style.display = 'block';
    if (animationName) {
        element.style.animation = `${animationName} ${duration / 1000}s linear forwards`;
        // Esconde o objeto após a animação, se desejar
        setTimeout(() => {
            element.style.display = 'none';
            element.style.animation = '';
        }, duration);
    }
}

const loop = setInterval(() => {
    pipe.style.display = 'block';

    const pipePosition = pipe.offsetLeft;
    const billPosition = bill.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
    const marioRect = mario.getBoundingClientRect();
    

    
    if (pipePosition > 400) {
        pipePassed = false;
    }
    if (pipePosition <= 120 && pipePosition > 0 && marioPosition < 80 || billPosition <= 120 && billPosition > 0 && marioPosition < 80) {
        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;
        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;      
        bill.style.animation = 'none';
        bill.style.bottom = `${billPosition}px`;      
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

        // Mostra o botão de reiniciar
        restartBtn.style.display = 'block';
    }
    

    
    
}, 10);

// Reinicia o jogo ao clicar no botão
restartBtn.addEventListener('click', () => {
    window.location.reload();
});

document.addEventListener('keydown', () => {
    if (bgMusic.paused) {
        bgMusic.play();
    }
});

document.addEventListener('keydown', jump);

// Função para agachar
function duck() {
    if (gameOver || isDucking) return;
    isDucking = true;
    mario.src = 'mario-jump-images/mario-duck.png'; // ajuste o nome se necessário
    mario.classList.remove('jump');
    mario.style.bottom = '0'; // Vai rapidamente para o chão
}

// Função para levantar
function standUp() {
    if (!isDucking) return;
    isDucking = false;
    mario.src = 'mario-jump-images/mario.gif'; // volta para o Mario normal
}

// Evento para agachar
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        duck();
    }
});

// Evento para levantar
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        standUp();
    }
});
