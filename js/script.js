const buttons = document.querySelectorAll("button");
const BOMBS_NUMBER = 16;

for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", function () {
    createCells(buttons[i].value);

    /* EXTRA */
    changeDifficultyDisplay(buttons[i].innerText); // change diffuclty counter
  });
}

/**** FUNCTIONS ****/

/**
 * Create all the cells
 * @param {*} cellsNumber
 */
function createCells(cellsNumber) {
  const grid = document.getElementById("grid");
  grid.innerHTML = ""; // remove all elements before create new cells

  const bombs = createBombs(cellsNumber);
  console.log(bombs);

  for (let i = 0; i < cellsNumber; i++) {
    const cell = document.createElement("div");

    if (cellsNumber == 100) cell.classList.add("easy");
    if (cellsNumber == 81) cell.classList.add("medium");
    if (cellsNumber == 49) cell.classList.add("hard");

    cell.innerHTML = `${[i + 1]}`;

    cell.addEventListener("click", function () {
      if (bombs.includes(parseInt(cell.innerHTML))) {
        cell.classList.add("bg-red");
      } else {
        cell.classList.add("bg-blue");
      }
    });

    grid.appendChild(cell);
  }
}

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
