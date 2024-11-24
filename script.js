const boardContainer = document.getElementById('game-board');
const statusText = document.getElementById('status');
const restartButton = document.getElementById('restart');
const toggleAIButton = document.getElementById('toggle-ai');
const advancedModeButton = document.getElementById('advanced-mode');
const advancedSettings = document.getElementById('advanced-settings');
const boardSizeInput = document.getElementById('board-size');
const setBoardButton = document.getElementById('set-board');
const scoreXText = document.getElementById('score-x');
const scoreOText = document.getElementById('score-o');

let boardSize = 3; // Default board size
let currentPlayer = 'X';
let board = [];
let gameActive = true;
let scoreX = 0;
let scoreO = 0;
let isAIEnabled = true; // AI mode enabled by default

function createBoard() {
    boardContainer.innerHTML = '';
    boardContainer.style.gridTemplateColumns = `repeat(${boardSize}, 100px)`;
    boardContainer.style.gridTemplateRows = `repeat(${boardSize}, 100px)`;
    board = Array(boardSize * boardSize).fill('');
    gameActive = true;
    currentPlayer = 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;

    for (let i = 0; i < board.length; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        boardContainer.appendChild(cell);
        cell.addEventListener('click', handleCellClick);
    }
}

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (board[index] !== '' || !gameActive || (isAIEnabled && currentPlayer === 'O')) {
        return;
    }

    makeMove(index);
    if (gameActive && isAIEnabled && currentPlayer === 'O') {
        setTimeout(aiMove, 500); // AI takes its turn after 500ms
    }
}

function makeMove(index) {
    board[index] = currentPlayer;
    const cell = document.querySelector(`.cell[data-index='${index}']`);
    cell.textContent = currentPlayer;
    cell.classList.add('taken');

    const winner = checkWinner();
    if (winner) {
        highlightWinner(winner);
        statusText.textContent = `Player ${currentPlayer} wins!`;
        updateScore();
        gameActive = false;
    } else if (board.every(cell => cell !== '')) {
        shakeBoard(); // Shake animation on draw
        statusText.textContent = "It's a draw!";
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function checkWinner() {
    const winningCombinations = generateWinningCombinations();
    for (let combination of winningCombinations) {
        if (combination.every(index => board[index] === currentPlayer)) {
            return combination;
        }
    }
    return null;
}

function generateWinningCombinations() {
    const combinations = [];
    // Rows
    for (let i = 0; i < boardSize; i++) {
        combinations.push(Array.from({ length: boardSize }, (_, j) => i * boardSize + j));
    }
    // Columns
    for (let i = 0; i < boardSize; i++) {
        combinations.push(Array.from({ length: boardSize }, (_, j) => j * boardSize + i));
    }
    // Diagonal (top-left to bottom-right)
    combinations.push(Array.from({ length: boardSize }, (_, i) => i * (boardSize + 1)));
    // Diagonal (top-right to bottom-left)
    combinations.push(Array.from({ length: boardSize }, (_, i) => (i + 1) * (boardSize - 1)));
    return combinations;
}

function highlightWinner(combination) {
    combination.forEach(index => {
        const cell = document.querySelector(`.cell[data-index='${index}']`);
        cell.classList.add('highlight');
    });
}

function shakeBoard() {
    boardContainer.classList.add('shake');
    setTimeout(() => {
        boardContainer.classList.remove('shake');
    }, 400);
}

function updateScore() {
    if (currentPlayer === 'X') {
        scoreX++;
        scoreXText.textContent = scoreX;
    } else {
        scoreO++;
        scoreOText.textContent = scoreO;
    }
}

function aiMove() {
    if (!gameActive) return;

    // 1. Check if AI can win
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            if (checkWinner()) {
                makeMove(i);
                return;
            }
            board[i] = '';
        }
    }

    // 2. Check if AI needs to block X
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'X';
            if (checkWinner()) {
                board[i] = '';
                makeMove(i);
                return;
            }
            board[i] = '';
        }
    }

    // 3. Otherwise, pick the first available spot
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            makeMove(i);
            return;
        }
    }
}

function toggleAI() {
    isAIEnabled = !isAIEnabled;
    toggleAIButton.textContent = `AI: ${isAIEnabled ? 'On' : 'Off'}`;
    restartGame(); // Restart to apply changes
}

function restartGame() {
    createBoard();
}

function toggleAdvancedSettings() {
    advancedSettings.style.display = advancedSettings.style.display === 'none' ? 'block' : 'none';
}

function setBoardSize() {
    const newSize = parseInt(boardSizeInput.value);
    if (newSize >= 3 && newSize <= 10) {
        boardSize = newSize; // Update board size
        createBoard(); // Recreate the board
    } else {
        alert('Please enter a board size between 3 and 10.');
    }
}

// Event Listeners
restartButton.addEventListener('click', restartGame);
toggleAIButton.addEventListener('click', toggleAI);
advancedModeButton.addEventListener('click', toggleAdvancedSettings);
setBoardButton.addEventListener('click', setBoardSize);

// Initialize Board
createBoard();
