// FIELD AND FIGURES

const PLAYFILED_COLUMNS = 10;
const PLAYFILED_ROWS = 20;
let playfield;
const tetrominoSequence = [];

const TETROMINO_NAMES = ['O', 'L', 'J', 'S', 'Z', 'I', 'T'];

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
};

let tetromino = {
  name: '',
  matrix: [],
  column: 0,
  row: 0
};

// COMMON

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
  const rowTetro = 2;

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

// KEYBOARD

document.addEventListener('keydown', onKeyDown);

function onKeyDown(evt) {
  // console.log(evt.keyCode);
  if (evt.key == 'ArrowLeft' || evt.keyCode == 100) {
    moveTetrominoLeft();
  }
  if (evt.key == 'ArrowRight' || evt.keyCode == 102) {
    moveTetrominoRight();
  }
  if (evt.key == 'ArrowDown' || evt.keyCode == 98) {
    moveTetrominoDown();
  }
  if (evt.key == 'ArrowUp' || evt.keyCode == 104) {
    rotate();
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

function placeTetromino() {
  const tetrominoMatrixSize = tetromino.matrix.length;
  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      if (tetromino.matrix[row][column]) {
        playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
      }
    }
  };
  console.log(playfield);
  generateTetromino();
}

// START

generatePlayfield();
let cells = document.querySelectorAll('.tetris div')
generateTetromino();

draw();