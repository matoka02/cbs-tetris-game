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
  const rowTetro = 5;

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
  if (evt.key == 'ArrowLeft') {
    tetromino.column -= 1;
    if (isOutsideOfGameboard(tetromino.row, tetromino.column)) {
      tetromino.column += 1;
    }
  }
  if (evt.key == 'ArrowRight') {
    tetromino.column += 1;
    if (isOutsideOfGameboard(tetromino.row, tetromino.column)) {
      tetromino.column -= 1;
    }
  }
  if (evt.key == 'ArrowDown') {
    tetromino.row += 1;
    if (isOutsideOfGameboard(tetromino.row, tetromino.column)) {
      tetromino.row  -= 1;
    }
  }
  if (evt.key == 'ArrowUp') {
    tetromino.row -= 1;
    if (isOutsideOfGameboard(tetromino.row, tetromino.column)) {
      tetromino.row += 1;
    }
  }

  draw();
}

function draw() {
  drawPlayfield();
  cells.forEach(elem => elem.removeAttribute('class'));
  drawTetromino();
}

// COLLISIONS

function isOutsideOfGameboard(row, column) {
  // console.log(row);
  const tetrominoMatrixSize = tetromino.matrix.length;
  // console.log(PLAYFILED_ROWS - tetrominoMatrixSize);

  return 
    column < 0 || 
    column > PLAYFILED_COLUMNS - tetrominoMatrixSize || 
    row + tetrominoMatrixSize > PLAYFILED_ROWS - 1;
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

      const nameFigure = tetromino.name;
      const cellIndex = convertPositionToIndex(row, column);

      cells[cellIndex].classList.add(nameFigure);
    }

  }
}


generatePlayfield();
let cells = document.querySelectorAll('.tetris div')
generateTetromino();

draw();