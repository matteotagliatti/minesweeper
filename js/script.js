const buttons = document.querySelectorAll("button");

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

  for (let i = 0; i < cellsNumber; i++) {
    const cell = document.createElement("div");

    if (cellsNumber == 100) cell.classList.add("easy");
    if (cellsNumber == 81) cell.classList.add("medium");
    if (cellsNumber == 49) cell.classList.add("hard");

    cell.addEventListener("click", bgBlue);
    cell.innerHTML = `${[i + 1]}`;
    grid.appendChild(cell);
  }
}

/**
 * Add blue background
 * @param {*} event
 */
function bgBlue(event) {
  const cell = event.target;
  cell.classList.toggle("bg-blue");
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
