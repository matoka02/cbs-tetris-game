const PLAYFILED_COLUMNS = 10;
const PLAYFILED_ROWS = 20;
let playfield;
const tetrominoSequence = [];

const TETROMINO_NAMES = ['O', 'L', 'I', 'J', 'P', 'Q', 'S', 'Z', 'T'];

const TETROMINOES = {
  'O': [[1]],
  'L': [[1]],
  'I': [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  'J': [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  'P': [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  'Q': [
    [1, 1],
    [1, 1],
  ],
  'S': [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  'Z': [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  'T': [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ]
};

let tetromino = {
  name: '',
  matrix: [],
  column: 0,
  row: 0
};

function generateSequence() {
  const sequence = ['O', 'L', 'I', 'J', 'P', 'Q', 'S', 'Z', 'T'];

  while (sequence.length) {
    const rand = Math.floor(Math.random() * sequence.length);
    const name = sequence.splice(rand, 1)[0];
    tetrominoSequence.push(name);
  }
}


function generateTetromino() {
  const nameTetro = TETROMINO_NAMES[0];
  const matrix = TETROMINOES[0];

  const columnTetro = 4;
  const rowTetro = 5;

  tetromino = {
    name: nameTetro,
    matrix: matrix,
    column: columnTetro,
    row: rowTetro,
  }
};

function drawPlayfield() {

  playfield[7][6] = 'O';

  for (let row = 0; row < PLAYFILED_ROWS; row++) {
    for (let column = 0; column < PLAYFILED_COLUMNS; column++) {

      if (!playfield[row][column]) {
        continue;
      };
      const nameFigure = 'M';
      const cellIndex = convertPositionToIndex(row, column);

      cells[cellIndex].classList.add(nameFigure);
    }

  }
}

function convertPositionToIndex(row, column) {
  return row * PLAYFILED_COLUMNS + column;
}

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

generatePlayfield();
let cells = document.querySelectorAll('.tetris div')
generateTetromino();

drawPlayfield();