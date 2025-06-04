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
bgMusic.volume = 0.2;

// Incrementa pontos a cada 100ms enquanto o jogo não acabou
const scoreInterval = setInterval(() => {
    if (!gameOver) {
        score++;
        scoreElement.textContent = score;
    }
}, 100);

const jump = () => {
    if (gameOver || isDucking) return;
    mario.classList.add('jump');
    mario.style.bottom = '70px'; // Garante que o pulo sempre começa da grama
    setTimeout(() => {
        mario.classList.remove('jump');
        mario.style.bottom = '70px'; // Volta para a grama após o pulo
    }, 500);
}

// Função genérica para lançar objetos na tela
function launchObject(element, animationName = '', duration = 2000) {
    element.style.display = 'block';
    if (animationName) {
        element.style.animation = `${animationName} ${duration / 1000}s linear forwards`;
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
    const billRect = bill.getBoundingClientRect();

    // Colisão com o pipe
    if (
        pipePosition <= 120 && pipePosition > 0 && marioPosition < 80
    ) {
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
        return;
    }

    // Colisão com o Bill: só ocorre se NÃO estiver agachado
    if (
        !isDucking &&
        billPosition <= 120 && billPosition > 0 && marioPosition < 130
    ) {
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
        if (score > highscore) {
            highscore = score;
            localStorage.setItem('marioHighscore', highscore);
            highscoreElement.textContent = highscore;
        }
        restartBtn.style.display = 'block';
        return;
    }
}, 10);

// Reinicia o jogo ao clicar no botão
restartBtn.addEventListener('click', () => {
    window.location.reload();
});

// Controle de teclas para evitar conflito entre pulo e agachar
function duck() {
    if (gameOver || isDucking) return;
    isDucking = true;
    mario.src = 'mario-jump-images/mario-duck.png'; // ajuste o nome se necessário
    mario.classList.remove('jump');
    mario.style.bottom = '70px'; // Mantém sobre a grama ao agachar
    mario.style.width = '60px'; // Proporcional ao agachar
}

function standUp() {
    if (!isDucking) return;
    isDucking = false;
    mario.src = 'mario-jump-images/mario.gif'; // volta para o Mario normal
    mario.style.width = '150px'; // Volta ao tamanho normal
    mario.style.bottom = '70px'; // Garante que volta para a grama
}

document.addEventListener('keydown', (e) => {
    if ((e.key === 'ArrowDown' || e.key.toLowerCase() === 's') && !isDucking) {
        duck();
    } else if ((e.key === ' ' || e.key === 'ArrowUp') && !isDucking) {
        jump();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        standUp();
    }
});

// Garante que a música toca ao pressionar qualquer tecla
document.addEventListener('keydown', () => {
    if (bgMusic.paused) {
        bgMusic.play();
    }
});