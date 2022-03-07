const buttons = document.querySelectorAll("button");
const BOMBS_NUMBER = 16;

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    play(buttons[i].value);

    /* EXTRA */
    changeDifficultyDisplay(buttons[i].innerText); // change diffuclty counter
  });
}

/**** FUNCTIONS ****/

/**
 * Play
 * @param {*} cellsNumber
 */
function play(cellsNumber) {
  resetGrid();

  let points = 0;
  const displayPoints = document.getElementById("point");
  displayPoints.innerText = writePoints(points); // reset points

  const bombs = createBombs(cellsNumber);

  for (let i = 0; i < cellsNumber; i++) {
    const cell = createCell(cellsNumber, i);

    cell.addEventListener("click", function () {
      if (bombs.includes(parseInt(cell.innerHTML))) {
        this.classList.add("bg-red");
        this.innerText = "";
        endGame(bombs);
      } else {
        this.classList.add("bg-blue");
        this.style.pointerEvents = "none"; // remove possibility of multiple click on a single cell
        this.innerText = "";
        points++;
        displayPoints.innerText = writePoints(points);
      }
    });

    grid.appendChild(cell);
  }
}

/**
 * End game
 * @param {*} bombs // bombs array
 */
function endGame(bombs) {
  const cells = document.querySelectorAll("#grid > div");
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    if (bombs.includes(i)) {
      cell.innerText = "";
      cell.classList.add("bg-red");
    }
  }

  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  messageDiv.innerHTML = "<p>Game Over</p>";
  document.querySelector("#grid").append(messageDiv);
}

/**
 * Create a cell
 * @param {*} cellsNumber
 * @returns
 */
function createCell(cellsNumber, i) {
  const cell = document.createElement("div");
  if (cellsNumber == 100) cell.classList.add("easy");
  if (cellsNumber == 81) cell.classList.add("medium");
  if (cellsNumber == 49) cell.classList.add("hard");
  cell.innerHTML = `${[i + 1]}`;
  return cell;
}

/**
 * Reset grid
 */
function resetGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = ""; // remove all elements before create new cells
}

/**
 *
 * @param {*} cellsNumber
 * @returns // bombs
 */
function createBombs(cellsNumber) {
  const bombs = [];
  while (bombs.length < BOMBS_NUMBER) {
    const bomb = getRandomInt(1, cellsNumber); // generate random integer between 1 and the number of cells

    if (!bombs.includes(bomb)) bombs.push(bomb); // push only unique numbers
  }

  return bombs;
}

/**
 * Generate a number between 2 numbers
 * @param {*} min
 * @param {*} max
 * @returns
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  let result = Math.floor(Math.random() * (max - min + 1)) + min;
  return result;
}

/**
 * Write points in the DOM
 * @param {*} point
 * @returns
 */
function writePoints(point) {
  if (point < 10) return `00${point}`;
  if (point < 100) return `0${point}`;
  if (point >= 100) return `${point}`;
}

/**** EXTRA ****/
/*** DIFFICULTY ***/

/**
 * Change diffuclity display counter
 * @param {*} button // button value
 */
function changeDifficultyDisplay(button) {
  const difficultyDisplay = document.getElementById("difficulty-counter");
  if (button == "Easy") difficultyDisplay.innerText = "001";
  if (button == "Medium") difficultyDisplay.innerText = "002";
  if (button == "Hard") difficultyDisplay.innerText = "003";
}

/*** RELOAD ***/

const reset = document.getElementById("reset");

// Reload the page
reset.addEventListener("click", () => {
  window.location.reload();
});
