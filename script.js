// Random time a cell will become a prize or a trap after 'generatePrizeOrATrapCell' function called
const getRandomTimeInterval = () => {
  let min = Math.ceil(500);
  let max = Math.floor(2500);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Selecting a random table cell (e.g., if 'sizeOfBoard' is 20 then 20x20 = 400 - 1 = 399)
// Must be 1 less to prevent indexError
const getRandomCellIndex = () => {
  let min = Math.ceil(0);
  let max = Math.floor(sizeOfBoard * sizeOfBoard - 1);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Random time a cell will stay as a prize or a trap
const getRandomDuration = (minTime, maxTime) => {
  let min = Math.ceil(minTime);
  let max = Math.floor(maxTime);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// * Update when difficulty levels change
const difficultyLevelArr = ["Easy", "Medium", "Hard", "Extreme"];

// Get difficulty level times based on user choice
const getDifficultylevelTimes = difficultyLevel => {
  let difficultyTimes;
  switch (difficultyLevel) {
    case difficultyLevelArr[0]:
      difficultyTimes = [2100, 2900];
      return difficultyTimes;
    case difficultyLevelArr[1]:
      difficultyTimes = [1000, 1800];
      return difficultyTimes;
    case difficultyLevelArr[2]:
      difficultyTimes = [500, 900];
      return difficultyTimes;
    case difficultyLevelArr[3]:
      difficultyTimes = [300, 700];
      return difficultyTimes;
  }
};

/////////////////////////
const scoreParaElement = document.querySelector(".score-js");
const timeParaElement = document.querySelector(".time-js");
const bestScoreElement = document.querySelector(".best-score-js");
const main = document.querySelector("main");
// The higher the number, the more prizes and traps will be on the board
const frequencyOfPrizesAndTraps = 200;
const numOfSecondsGameLasts = 30;
const initialScore = 0;
const increaseScoreNum = 3;
const decreaseScoreNum = -100;
const endGameNum = 0;
const scoreText = "Score:";
const timeRemainingText = "Time remaining:";
const bestScoreText = "Best score:";
const sizeOfBoard = 12;

let userDifficultyLevel;
let gameFinished = false;
let counter; // Declare the timer
let score = initialScore;
let timer = numOfSecondsGameLasts;

/////////////////////////
// Create table
const gameBoard = document.getElementById("game-board-wrapper-js");
const table = document.createElement("table");
table.className = "mx-auto";
gameBoard.appendChild(table);

const tbody = document.createElement("tbody");
table.appendChild(tbody);

// Create 'sizeOfBoard' table rows and inside each table row, create 'sizeOfBoard' table cells
for (i = 0; i < sizeOfBoard; i++) {
  const tableRow = document.createElement("tr");
  tbody.appendChild(tableRow);
  for (let x = 0; x < sizeOfBoard; x++) {
    const tableCell = document.createElement("td");
    tableRow.appendChild(tableCell);
    tableCell.className = "cell";
  }
}

/////////////////////////
const increaseOrDecreaseScore = tableCell => {
  if (gameFinished === false && tableCell.className === "prize") {
    score += increaseScoreNum;
    scoreParaElement.innerHTML = `${scoreText} ${score}`;
    tableCell.className = "cell";
  } else if (gameFinished === false && tableCell.className === "trap") {
    score = decreaseScoreNum;
    scoreParaElement.innerHTML = `${scoreText} ${score}`;
    clearInterval(counter);
    endGame();
  }
};

/////////////////////////
// Local Storage Key
const bestScoreKey = difficulty => `prizeHuntFrenzy_best_${difficulty}`;

// May throw in some private-browsing modes
const storageAvailable = () => {
  try {
    const testKey = "__storage_test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

const getBestScore = () => {
  if (!storageAvailable()) return;
  try {
    return localStorage.getItem(bestScoreKey(userDifficultyLevel)) ?? 0;
  } catch (e) {
    console.warn("Could not read best score from localstorage", e);
    return 0;
  }
};

const setBestScore = () => {
  if (!storageAvailable()) return false;
  const bestScore =
    localStorage.getItem(bestScoreKey(userDifficultyLevel)) ?? 0;
  if (score <= bestScore) return false;
  try {
    localStorage.setItem(bestScoreKey(userDifficultyLevel), score);
    // User has set a new best
    return true;
  } catch (e) {
    console.warn("Could not save best score to localstorage", e);
    return false;
  }
};
/////////////////////////
const updateTableOpacity = () => {
  // Update opacity when game ends
  const table = document.querySelector("table");
  table.style.filter = "opacity(50%)";
};

const createPlayAgainBtn = () => {
  const button = document.createElement("button");
  button.setAttribute("type", "button");
  button.setAttribute("data-bs-toggle", "modal");
  button.setAttribute("data-bs-target", "#myModal");
  button.className = "btn btn-primary py-2 px-3 fs-5";
  button.innerHTML = "Play Again?";
  return button;
};

const createGameOverContainer = userHasSetANewBest => {
  const gameOverContainer = document.createElement("div");
  const gameOverText = document.createElement("p");
  gameOverContainer.style.textAlign = "center";
  gameOverContainer.className = "p-3";
  gameOverText.innerHTML = `Game over. Your score is ${score}`;
  gameOverText.style.fontWeight = "700";
  gameOverText.style.fontSize = "2rem";

  if (userHasSetANewBest && score !== decreaseScoreNum) {
    gameOverText.innerHTML = `${gameOverText.innerHTML}. <span class="new-personal-best-text">New Personal Best!</span>`;
    gameOverContainer.appendChild(gameOverText);
  } else {
    gameOverContainer.appendChild(gameOverText);
  }
  return gameOverContainer;
};

/////////////////////////
const endGame = () => {
  gameFinished = true;
  const userHasSetANewBest = setBestScore();
  updateTableOpacity();
  // Create 'game over' row and text
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "pt-3";
  const button = createPlayAgainBtn();
  const row = document.createElement("div");
  row.className = "row game-over-row-js";
  const column = document.createElement("div");
  column.className = "col-md-5 mx-auto";
  const gameOverContainer = createGameOverContainer(userHasSetANewBest);
  // Add newly created elements to the document
  buttonContainer.appendChild(button);
  gameOverContainer.appendChild(buttonContainer);
  column.appendChild(gameOverContainer);
  row.appendChild(column);
  main.appendChild(row);
};

/////////////////////////
const countdown = () => {
  // Timer
  counter = setInterval(() => {
    if (timer === endGameNum || score === decreaseScoreNum) {
      clearInterval(counter);
      endGame();
    }
    timeParaElement.innerHTML = `${timeRemainingText} ${timer}s`;
    timer--;
  }, 1000);
};

/////////////////////////
const generatePrizeOrATrapCell = () => {
  let difficultyLevel = document.forms[0].elements.difficulty.value;
  let difficultyLevelTimes = getDifficultylevelTimes(difficultyLevel);
  const percentageToBecomeAPrize = 0.6;

  if (Math.random() <= percentageToBecomeAPrize) {
    // 60% chance to become a prize
    // Select a random table cell on the board
    const prizeCell = document.getElementsByTagName("td")[getRandomCellIndex()];
    prizeCell.className = "prize"; // Make it a prize
    prizeCell.setAttribute("onclick", "increaseOrDecreaseScore(this)");
    setTimeout(() => {
      // After x num of seconds let it become empty again
      prizeCell.removeAttribute("onclick", "increaseOrDecreaseScore(this)");
      prizeCell.classList.remove("prize");
      prizeCell.classList.add("cell");
    }, getRandomDuration(difficultyLevelTimes[0], difficultyLevelTimes[1]));
  } else {
    const trapCell = document.getElementsByTagName("td")[getRandomCellIndex()];
    trapCell.className = "trap";
    trapCell.setAttribute("onclick", "increaseOrDecreaseScore(this)");
    setTimeout(() => {
      trapCell.removeAttribute("onclick", "increaseOrDecreaseScore(this)");
      trapCell.classList.remove("trap");
      trapCell.classList.add("cell");
    }, getRandomDuration(difficultyLevelTimes[0], difficultyLevelTimes[1]));
  }
};

const generatePrizeTrapCells = () => {
  for (let i = 0; i < frequencyOfPrizesAndTraps; i++) {
    // Will loop 'frequencyOfPrizesAndTraps' times and call this function for every loop
    setTimeout(generatePrizeOrATrapCell, getRandomTimeInterval());
  }
  // After looping call 'generatePrizeTrapCells' again after 2secs
  let loopPrizeTrapCells = setTimeout(generatePrizeTrapCells, 2000);
  if (timer === endGameNum || score === decreaseScoreNum) {
    clearTimeout(loopPrizeTrapCells);
  }
};

/////////////////////////
const startGame = () => {
  scoreParaElement.innerHTML = `${scoreText} ${score}`;
  timeParaElement.innerHTML = `${timeRemainingText} ${timer}s`;
  bestScoreElement.innerHTML = `${bestScoreText} ${getBestScore(
    userDifficultyLevel
  )}`;
  generatePrizeTrapCells(); // Start creating prize and trap cells
  countdown(); // Start timer
};

const resetGame = () => {
  const gameOverRow = document.querySelector(".game-over-row-js");
  main.removeChild(gameOverRow); // Remove game over row, including its text
  gameFinished = false;
  score = initialScore;
  timer = numOfSecondsGameLasts;
  // Remove table blur if present
  const table = document.querySelector("table");
  if (table.style.filter) {
    table.style.filter = "";
  }
};

/////////////////////////
const modalForm = document.getElementById("modal-form");

modalForm.addEventListener("submit", e => {
  e.preventDefault();

  userDifficultyLevel = document.forms[0].elements.difficulty.value;
  if (!userDifficultyLevel) {
    // Check if a difficult level was chosen by the user
    return alert("Please enter a difficulty level");
  }
  if (gameFinished) {
    // Only call restart game function when a game has been played
    resetGame();
  }

  const modalWrapper = document.querySelector(".modal-wrapper");
  // Remove start button after user submits form for the first time
  if (modalWrapper.style.display !== "none") {
    modalWrapper.style.display = "none";
    main.style.display = "block";
  }
  startGame();
});

/////////////////////////
const resetBtn = document.getElementById("reset-btn");
// Represents whether the user has any scores in localstorage
let flag = 0;
if (!storageAvailable()) {
  resetBtn.setAttribute("disabled", true);
} else {
  for (let difficultyLevel of difficultyLevelArr) {
    if (localStorage.getItem(bestScoreKey(difficultyLevel)) !== null) {
      // User has scores saved in localstorage
      flag = 1;
    }
  }
  if (flag === 0) {
    resetBtn.setAttribute("disabled", true);
  }
}

resetBtn.addEventListener("click", () => {
  if (!storageAvailable()) {
    console.warn("localstorage not available; cannot reset scores");
    return;
  }
  difficultyLevelArr.forEach((difficultyLevel) => {
    localStorage.removeItem(bestScoreKey(difficultyLevel));
  });
  resetBtn.setAttribute("disabled", true);
});
