// SCORE, FIELD AND FIGURES

const PLAYFILED_COLUMNS = 10;
const PLAYFILED_ROWS = 20;
let playfield;
let cells;

let isPaused = false;
let timedId;
let isGameOver = false;
let overlay = document.querySelector('.overlay');
let scoreElement = document.querySelector('.score');
let btnRestartOver = document.querySelector('.btn-restart');
let btnRestart = document.getElementById('restart');
let btnPause = document.getElementById('pause');
let score = 0;

const TETROMINO_NAMES = ['O', 'L', 'J', 'S', 'Z', 'I', 'T', 'P', 'R'];

const TETROMINOES = {
  'O': [
    [1, 1],
    [1, 1]
  ],
  'L': [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ],
  'J': [
    [0, 1, 1],
    [0, 1, 0],
    [0, 1, 0]
  ],
  'S': [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],
  'Z': [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ],
  'I': [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  'T': [
    [1, 1, 1],
    [0, 1, 0],
    [0, 0, 0]
  ],
  'P': [
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0]
  ],
  'R': [
    [1]
  ],
};

let tetromino = {
  name: '',
  matrix: [],
  column: 0,
  row: 0,
  touchdown: false,
};

let secs, now, timer, mins = 0;
let timerId = document.getElementById('timerid');

// COMMON

function init() {
  score = 0;
  scoreElement.innerHTML = 0;
  isGameOver = false;

  generatePlayfield();
  cells = document.querySelectorAll('.tetris div');
  generateTetromino();
  startTimer();

  moveDown();
}

function convertPositionToIndex(row, column) {
  return row * PLAYFILED_COLUMNS + column;
}

function randomFigure(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// GENERATION 

function generateTetromino() {
  const nameTetro = randomFigure(TETROMINO_NAMES);
  const matrix = TETROMINOES[nameTetro];

  const columnTetro = Math.floor(PLAYFILED_COLUMNS / 2 - matrix.length / 2);
  const rowTetro = -2;

  tetromino = {
    name: nameTetro,
    matrix: matrix,
    column: columnTetro,
    row: rowTetro,
  }
};

function generatePlayfield() {
  for (let i = 0; i < PLAYFILED_COLUMNS * PLAYFILED_ROWS; i++) {
    const div = document.createElement('div');
    document.querySelector('.tetris').append(div);
  };

  playfield = new Array(PLAYFILED_ROWS).fill().map(() =>
    new Array(PLAYFILED_COLUMNS).fill(0)
  );

  // console.table(playfield);
};

// KEYBOARD & CLICKS

btnRestart.addEventListener('click', onRestart);
btnRestartOver.addEventListener('click', onRestart);

function onRestart(evt) {
  document.querySelector('.tetris').innerHTML = '';
  overlay.style.display = 'none';

  init();
};

btnPause.addEventListener('click', togglePaused)
document.addEventListener('keydown', onKeyDown);

function onKeyDown(evt) {
  // console.log(evt.keyCode);
  if (evt.key === 'Escape') {
    togglePaused();
  }

  if (!isPaused) {
    if (evt.key === ' ' || evt.keyCode === 32) {
      dropTetrominoDown();
    }
    if (evt.key === 'ArrowLeft' || evt.keyCode === 100) {
      moveTetrominoLeft();
    }
    if (evt.key === 'ArrowRight' || evt.keyCode === 102) {
      moveTetrominoRight();
    }
    if (evt.key === 'ArrowDown' || evt.keyCode === 98) {
      moveTetrominoDown();
    }
    if (evt.key === 'ArrowUp' || evt.keyCode === 104) {
      rotate();
    }
  }

  draw();
}

function moveTetrominoLeft() {
  tetromino.column -= 1;
  if (!isValid()) {
    tetromino.column += 1;
  }
}

function moveTetrominoRight() {
  tetromino.column += 1;
  if (!isValid()) {
    tetromino.column -= 1;
  }
}

function moveTetrominoDown() {
  tetromino.row += 1;
  if (!isValid()) {
    tetromino.row -= 1;
    placeTetromino()
  }
}

function draw() {
  cells.forEach(elem => elem.removeAttribute('class'));
  drawPlayfield();
  drawTetromino();
}

function dropTetrominoDown() {
  while (isValid()) {
    tetromino.row++;
  }

  tetromino.row--;
}

function togglePaused() {
  if (isPaused) {
    startTimer();
    startLoop();
  } else {
    stopTimer();
    stopLoop();
  }

  isPaused = !isPaused;
}

// ROTATE

function rotate() {
  rotateTetromino();
  draw();
}

function rotateTetromino() {
  const oldMatrix = tetromino.matrix;
  const rotatedMatrix = rotateMatrix(tetromino.matrix);
  tetromino.matrix = rotatedMatrix;
  if (!isValid()) {
    tetromino.matrix = oldMatrix;
  }
}

function rotateMatrix(matrixTetromino) {
  const N = matrixTetromino.length;
  const rotateMatrix = [];

  for (let i = 0; i < N; i++) {
    rotateMatrix[i] = [];
    for (let j = 0; j < N; j++) {
      rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
    }
  };

  return rotateMatrix;
}

// COLLISIONS

function isValid() {
  const tetrominoMatrixSize = tetromino.matrix.length;
  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (isOutsideOfGameboard(row, column)) {
        return false;
      }
      if (hasCollisions(row, column)) {
        return false;
      }
    }

  };

  return true;
}

function isOutsideOfGameboard(row, column) {
  return tetromino.matrix[row][column] && (
    tetromino.row + row >= PLAYFILED_ROWS ||
    tetromino.column + column < 0 ||
    tetromino.column + column >= PLAYFILED_COLUMNS
  )
}

function isOutsideOfTopGameboard(row) {
  return tetromino.row + row < 0;
}

function hasCollisions(row, column) {
  return tetromino.matrix[row][column] && (
    playfield[tetromino.row + row]?.[tetromino.column + column]
  )
}

// DRAW

function drawTetromino() {
  const name = tetromino.name;
  const tetrominoMatrixSize = tetromino.matrix.length;

  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {

      if (isOutsideOfTopGameboard(row)) {
        continue;
      }
      if (!tetromino.matrix[row][column]) {
        continue
      };

      const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column);
      cells[cellIndex].classList.add(name);
    }
  }
}

function drawPlayfield() {
  for (let row = 0; row < PLAYFILED_ROWS; row++) {
    for (let column = 0; column < PLAYFILED_COLUMNS; column++) {

      if (!playfield[row][column]) {
        continue;
      };

      const nameFigure = playfield[row][column];
      const cellIndex = convertPositionToIndex(row, column);

      cells[cellIndex].classList.add(nameFigure);
    }

  }
}

// SCORE

function countScore(destroyRows) {
  if (destroyRows == 1) {
    score += 10;
  }
  if (destroyRows == 2) {
    score += 20;
  }
  if (destroyRows == 3) {
    score += 50;
  }
  if (destroyRows == 4) {
    score += 100;
  }

  scoreElement.innerHTML = score;
}

function placeTetromino() {
  const tetrominoMatrixSize = tetromino.matrix.length;
  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (isOutsideOfTopGameboard(row)) {
        isGameOver = true;
        overlay.style.display = 'flex';
        return;
      }
      if (tetromino.matrix[row][column]) {
        playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
      }
    }
  };
  // console.log(playfield);
  let filledRows = findFilledRows();
  removeFillRow(filledRows);
  countScore(filledRows.length);
  generateTetromino();
}

function findFilledRows() {
  const fillRows = [];

  for (let row = 0; row < PLAYFILED_ROWS; row++) {
    let filledColumns = 0;
    for (let column = 0; column < PLAYFILED_COLUMNS; column++) {
      if (playfield[row][column] != 0) {
        filledColumns++;
      }
    }

    if (PLAYFILED_COLUMNS == filledColumns) {
      fillRows.push(row);
    }
  }

  return fillRows;
}

function removeFillRow(filledRows) {
  for (let i = 0; i < filledRows.length; i++) {
    const row = filledRows[i];
    dropRowsAbove(row);
  }
}

function dropRowsAbove(rowDelete) {
  for (let row = rowDelete; row > 0; row--) {
    playfield[row] = playfield[row - 1];
  }
  playfield[0] = new Array(PLAYFILED_COLUMNS).fill(0);
}

// TIMER

function time() {
  secs = Math.floor((Date.now() - now) / 1000);
  if (secs === 60) {
    now = Date.now();
    mins++;
  }
  if (secs < 10) {
    secs = '0' + secs;
  }
  timerId.innerHTML = mins + ':' + secs;
}

function startTimer() {
  now = Date.now();
  mins = 0;
  timer = setInterval(time);
}

function stopTimer() {
  timer = clearInterval(time);
}


// START

function moveDown() {
  moveTetrominoDown();
  draw();
  stopLoop();
  startLoop();
}

function startLoop() {
  timedId = setTimeout(() => requestAnimationFrame(moveDown), 700)
}

function stopLoop() {
  clearTimeout(timedId);

  timedId = null;
}

init();