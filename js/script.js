const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const bill1 = document.querySelector('.bill1');
const bill2 = document.querySelector('.bill2');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');
const bgMusic = document.getElementById('bg-music');

let score = 0;
let gameOver = false;
let isDucking = false;
let lastBillTime = 0;
let bill2Started = false;

// Ajusta o volume da música de fundo
bgMusic.volume = 0.2;

// Incrementa pontos a cada 100ms enquanto o jogo não acabou
const scoreInterval = setInterval(() => {
    if (!gameOver) {
        score++;
        scoreElement.textContent = score;

        // Inicia o segundo Bill quando atingir 150 pontos
        if (score >= 150 && !bill2Started) {
            bill2Started = true;
            randomBillSpawn(bill2);
        }
    }
}, 100);

let jumpTimeout = null;
let isJumping = false;

const jump = (long = false) => {
    if (gameOver || isDucking || isJumping) return;
    isJumping = true;
    mario.classList.remove('jump', 'jump-long');
    void mario.offsetWidth; // força reflow
    if (long) {
        mario.classList.add('jump-long');
        jumpTimeout = setTimeout(() => {
            mario.classList.remove('jump-long');
            mario.style.bottom = '70px';
            isJumping = false;
        }, 900);
    } else {
        mario.classList.add('jump');
        jumpTimeout = setTimeout(() => {
            mario.classList.remove('jump');
            mario.style.bottom = '70px';
            isJumping = false;
        }, 500);
    }
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
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
    const bill1Position = bill1.offsetLeft;
    const bill2Position = bill2.offsetLeft;

    // Colisão com o pipe
    if (
        pipePosition <= 120 && pipePosition > 0 && marioPosition < 80
    ) {
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

        // Mostra o botão de reiniciar
        restartBtn.style.display = 'block';
        return;
    }

    // Colisão com Bill 1
    if (
        bill1.style.display === 'block' &&
        bill1Position <= 120 && bill1Position > 0 && marioPosition < 130 && !isDucking
    ) {
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

        // Mostra o botão de reiniciar
        restartBtn.style.display = 'block';
        return;
    }

    // Colisão com Bill 2
    if (
        bill2.style.display === 'block' &&
        bill2Position <= 120 && bill2Position > 0 && marioPosition < 130 && !isDucking
    ) {
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

        // Mostra o botão de reiniciar
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

// Controle de teclas para pulo planado
let jumpKeyDown = false;
let jumpLongTimeout = null;

document.addEventListener('keydown', (e) => {
    if ((e.key === 'ArrowDown' || e.key.toLowerCase() === 's') && !isDucking) {
        duck();
    } else if ((e.key === ' ' || e.key === 'ArrowUp')) {
        if (!jumpKeyDown && !isJumping) {
            jumpKeyDown = true;
            jump(false); // pulo normal ao pressionar
            // Se segurar a tecla por mais de 120ms, vira pulo longo
            jumpLongTimeout = setTimeout(() => {
                if (isJumping && mario.classList.contains('jump')) {
                    mario.classList.remove('jump');
                    mario.classList.add('jump-long');
                    clearTimeout(jumpTimeout);
                    jumpTimeout = setTimeout(() => {
                        mario.classList.remove('jump-long');
                        mario.style.bottom = '70px';
                        isJumping = false;
                    }, 900);
                }
            }, 120);
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        standUp();
    } else if ((e.key === ' ' || e.key === 'ArrowUp')) {
        jumpKeyDown = false;
        clearTimeout(jumpLongTimeout);
        // Se o Mario ainda estiver pulando longo, termina o pulo ao soltar a tecla
        if (isJumping && mario.classList.contains('jump-long')) {
            mario.classList.remove('jump-long');
            mario.style.bottom = '70px';
            isJumping = false;
            if (jumpTimeout) clearTimeout(jumpTimeout);
        }
    }
});

// Garante que a música toca ao pressionar qualquer tecla
document.addEventListener('keydown', () => {
    if (bgMusic.paused) {
        bgMusic.play();
    }
});

function randomBillSpawn(bill) {
    if (gameOver) return;

    // Intervalo aleatório entre 2s e 5s
    const nextSpawn = Math.random() * 3000 + 2000;
    const now = Date.now();

    // Garante um intervalo mínimo de 500ms entre os Bills
    if (now - lastBillTime < 500) {
        setTimeout(() => randomBillSpawn(bill), 600);
        return;
    }
    lastBillTime = now;

    bill.style.display = 'block';
    bill.style.animation = 'none';
    // Força reflow para reiniciar a animação
    void bill.offsetWidth;
    bill.style.animation = 'bill-animation 2s linear forwards';

    // Esconde o Bill após a animação
    setTimeout(() => {
        bill.style.display = 'none';
        bill.style.animation = 'none';
        if (!gameOver) setTimeout(() => randomBillSpawn(bill), nextSpawn);
    }, 2000);
}

// Inicia o spam aleatório do primeiro Bill imediatamente
randomBillSpawn(bill1);