const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.querySelector('.winning-message');
const winningMessageTextElement = document.querySelector('.data-winning-message-text');
const restartButton = document.getElementById('restartButton');
const resetButton = document.getElementById('resetButton');
const playWithFriendsButton = document.getElementById('playWithFriendsButton');
const playWithAIButton = document.getElementById('playWithAIButton');

const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

let circleTurn;
let playAgainstAI = false;

startGame();

restartButton.addEventListener('click', startGame);
resetButton.addEventListener('click', startGame);
playWithFriendsButton.addEventListener('click', () => {
  playAgainstAI = false;
  startGame();
});
playWithAIButton.addEventListener('click', () => {
  playAgainstAI = true;
  startGame();
});

function startGame() {
  circleTurn = false;
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove('show');

document.getElementById('gameModeInfo').innerText = playAgainstAI ? 'Playing against AI' : 'Playing with a friend';

}

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
    if (playAgainstAI && circleTurn) {
      makeAIMove();
    }
  }
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Draw!';
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
  }
  winningMessageElement.classList.add('show');
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function makeAIMove() {
  const availableCells = [...cellElements].filter(cell => {
    return !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS);
  });
  const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
  placeMark(randomCell, CIRCLE_CLASS);
  if (checkWin(CIRCLE_CLASS)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}
