const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreElement = document.getElementById('score');
const highscoreElement = document.getElementById('highscore');
const restartBtn = document.getElementById('restart-btn');
const bill = document.querySelector('.bill');

let score = 0;
let highscore = localStorage.getItem('marioHighscore') || 0;
highscoreElement.textContent = highscore;

let gameOver = false;
let billActive = false;

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

// Função para lançar o Bill Bala após o pipe passar
function launchBill() {
    if (gameOver) return;
    bill.style.display = 'block';
    bill.style.animation = 'bill-animation 2s linear forwards';
    billActive = true;

    // Esconde o Bill após a animação
    setTimeout(() => {
        bill.style.display = 'none';
        bill.style.animation = '';
        billActive = false;
    }, 2000);
}

// Modifique o loop para lançar o Bill após o pipe sair da tela
let pipePassed = false;
const loop = setInterval(() => {
    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
    const marioRect = mario.getBoundingClientRect();
    const billRect = bill.getBoundingClientRect();

    // Detecta se o pipe passou e lança o Bill
    if (!pipePassed && pipePosition < -80) {
        pipePassed = true;
        setTimeout(launchBill, 600); // Bill aparece 0.6s depois do pipe
    }

    // Reinicia pipePassed para o próximo ciclo
    if (pipePosition > 400) {
        pipePassed = false;
    }

    // Colisão com o pipe
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

        // Mostra o botão de reiniciar
        restartBtn.style.display = 'block';
    }

    // Colisão com o Bill Bala (apenas se ativo)
    if (billActive && !gameOver) {
        // Pega as posições relativas ao game-board
        const boardRect = document.querySelector('.game-board').getBoundingClientRect();
        const marioTop = marioRect.top - boardRect.top;
        const marioLeft = marioRect.left - boardRect.left;
        const marioBottom = marioTop + marioRect.height;
        const marioRight = marioLeft + marioRect.width;

        const billTop = billRect.top - boardRect.top;
        const billLeft = billRect.left - boardRect.left;
        const billBottom = billTop + billRect.height;
        const billRight = billLeft + billRect.width;

        // Checa colisão (ajuste se necessário)
        if (
            marioRight > billLeft &&
            marioLeft < billRight &&
            marioBottom > billTop &&
            marioTop < billBottom
        ) {
            // Game over por Bill Bala
            bill.style.animation = 'none';
            bill.style.display = 'block';
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
        }
    }
}, 10);

// Reinicia o jogo ao clicar no botão
restartBtn.addEventListener('click', () => {
    window.location.reload();
});

document.addEventListener('keydown', jump);
