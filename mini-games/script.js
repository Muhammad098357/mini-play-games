// Навигация между играми
function showGame(gameId) {
    document.querySelectorAll('.game-container').forEach(container => {
        container.classList.remove('active');
    });
    document.getElementById(gameId).classList.add('active');
}

// Игра Змейка
const snakeCanvas = document.getElementById('snakeCanvas');
const ctx = snakeCanvas.getContext('2d');
const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let dx = 0;
let dy = 0;
let score = 0;
let gameInterval;

function drawSnake() {
    ctx.fillStyle = '#4CAF50';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = '#ff5252';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').textContent = score;
        generateFood();
    } else {
        snake.pop();
    }
}

function generateFood() {
    food.x = Math.floor(Math.random() * (snakeCanvas.width / gridSize));
    food.y = Math.floor(Math.random() * (snakeCanvas.height / gridSize));
}

function checkCollision() {
    const head = snake[0];
    
    // Стены
    if (head.x < 0 || head.x >= snakeCanvas.width / gridSize || 
        head.y < 0 || head.y >= snakeCanvas.height / gridSize) {
        return true;
    }
    
    // Сама себя
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    
    return false;
}

function gameLoop() {
    ctx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    
    moveSnake();
    
    if (checkCollision()) {
        clearInterval(gameInterval);
        alert('Игра окончена! Счет: ' + score);
        return;
    }
    
    drawFood();
    drawSnake();
}

function resetSnake() {
    snake = [{x: 10, y: 10}];
    dx = 0;
    dy = 0;
    score = 0;
    document.getElementById('score').textContent = score;
    generateFood();
    
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
}

// Управление змейкой
document.addEventListener('keydown', (e) => {
    if (!gameInterval) return;
    
    switch(e.key) {
        case 'ArrowUp':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
});

// Крестики-нолики
let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

function makeMove(index) {
    if (board[index] !== '' || !gameActive) return;
    
    board[index] = currentPlayer;
    document.getElementsByClassName('cell')[index].textContent = currentPlayer;
    
    if (checkWinner()) {
        document.getElementById('status').textContent = `Победил: ${currentPlayer}`;
        gameActive = false;
        return;
    }
    
    if (board.every(cell => cell !== '')) {
        document.getElementById('status').textContent = 'Ничья!';
        gameActive = false;
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('status').textContent = `Ход: ${currentPlayer}`;
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return board[a] !== '' && board[a] === board[b] && board[a] === board[c];
    });
}

function resetTicTacToe() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    document.getElementById('status').textContent = 'Ход: X';
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
    });
}

// Игра на память
const memoryCards = ['🍎', '🍌', '🍒', '🍕', '🏀', '⚽', '🍎', '🍌', '🍒', '🍕', '🏀', '⚽'];
let flippedCards = [];
let matchedCards = [];
let attempts = 0;

function createMemoryBoard() {
    const board = document.getElementById('memoryBoard');
    board.innerHTML = '';
    
    const shuffledCards = [...memoryCards].sort(() => Math.random() - 0.5);
    
    shuffledCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.textContent = card;
        cardElement.dataset.index = index;
        cardElement.addEventListener('click', flipCard);
        board.appendChild(cardElement);
    });
}

function flipCard() {
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);
        
        if (flippedCards.length === 2) {
            attempts++;
            document.getElementById('attempts').textContent = attempts;
            checkMatch();
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.textContent === card2.textContent) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCards.push(card1, card2);
        
        if (matchedCards.length === memoryCards.length) {
            setTimeout(() => alert(`Поздравляем! Вы выиграли за ${attempts} попыток!`), 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 1000);
    }
    
    flippedCards = [];
}

function resetMemory() {
    flippedCards = [];
    matchedCards = [];
    attempts = 0;
    document.getElementById('attempts').textContent = attempts;
    createMemoryBoard();
}

// Инициализация
createMemoryBoard();