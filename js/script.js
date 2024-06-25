const PLAYFILED_COLUMNS = 10;
const PLAYFILED_ROWS = 20;
let playfield;

const TETROMINO_NAMES = [
  'O',
  'L',
];

const TETROMINOES = {
  'O': [[1]],
  'L': [[1]],
};

let tetromino = {
  name: '',
  matrix: [],
  column: 0,
  row: 0
};


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