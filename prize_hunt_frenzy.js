// Random time a cell will become a prize or a trap after 'generatePrizeOrATrapCell' function called
const getRandomTimeInterval = () => {
    let min = Math.ceil(500);
    let max = Math.floor(2500);
    return Math.floor(Math.random()*(max-min+1) + min);
}

// Selecting a random table cell (table is 20x20 = 400)
const getRandomCellIndex = () => {
    let min = Math.ceil(0);
    let max = Math.floor(399);
    return Math.floor(Math.random()*(max-min+1) + min);
}

// Random time a cell will stay as a prize or a trap
const getRandomDuration = (minTime, maxTime) => {
    let min = Math.ceil(minTime);
    let max = Math.floor(maxTime);
    return Math.floor(Math.random()*(max-min+1) + min);
}

// Get difficulty level times based on user choice
const getDifficultylevelTimes = difficultyLevel => {
    let difficultyTimes;
    switch (difficultyLevel) {
        case 'Easy':
            difficultyTimes = [2100, 2900];
            return difficultyTimes;
        case 'Medium':
            difficultyTimes = [1000, 1800];
            return difficultyTimes;
        case 'Hard':
            difficultyTimes = [500, 900];
            return difficultyTimes;
        case 'Extreme':
            difficultyTimes = [300, 700];
            return difficultyTimes;
    }
}

/////////////////////////
const scoreParaElement = document.querySelector('.score');
const timeParaElement = document.querySelector('.time');
const main = document.getElementById("main");
// The higher the number, the more prizes and traps will be on the board
const frequencyOfPrizesAndTraps = 200;
const numOfSecondsGameLasts = 30;
const initialScore = 0;
const increaseScoreNum = 3;
const decreaseScoreNum = -100;
const endGameNum = 0;
const scoreText = "Score:";
const timeRemainingText = "Time remaining:";

let gameFinished = false;
let counter;  // Declare the timer
let score = initialScore;
let timer = numOfSecondsGameLasts;

/////////////////////////
const myDiv = document.getElementById("game-board-div");  // Create table
const table = document.createElement('table');
table.className = "mx-auto";
myDiv.appendChild(table);

const tbody = document.createElement('tbody');  // Create table body
table.appendChild(tbody);

// Create 20 table rows and inside each table row, create 20 table cells
for (i = 0; i < 20; i++) {
    let tableRow = document.createElement('tr'); 
    tbody.appendChild(tableRow);
    for (let x = 0; x < 20; x++) {
            let tableCell = document.createElement('td');
            tableRow.appendChild(tableCell);
            tableCell.className = "cell";
        }
    };

/////////////////////////
const increaseOrDecreaseScore = tableCell => {
    if (gameFinished === false && tableCell.className === "prize") {
        score+=increaseScoreNum;
        scoreParaElement.innerHTML = `${scoreText} ${score}`;
        tableCell.className = "cell";
    } else if (gameFinished === false && tableCell.className === "trap") {
        score = decreaseScoreNum;
        scoreParaElement.innerHTML = `${scoreText} ${score}`;
        clearInterval(counter);
        endGame();
    }
}

/////////////////////////
const endGame = () => {
    gameFinished = true;

    // Create 'game over' row and text
    let buttonContainer = document.createElement("div");
    buttonContainer.className = "pt-3";
    let button = document.createElement("button");
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-toggle", "modal");
    button.setAttribute("data-bs-target", "#myModal");
    button.className = "btn btn-primary modalPlayAgainButton py-2 px-3 fs-5";
    button.innerHTML = "Play Again?";
    let row = document.createElement("div");
    row.className = "row game-over-row";
    let column = document.createElement("div");
    column.className = "col-md-5 mx-auto";
    let gameOverContainer = document.createElement("div");
    gameOverContainer.className = "p-3";
    gameOverContainer.innerHTML = `Game over. Your score is ${score}`;
    gameOverContainer.style.fontWeight = "700";
    gameOverContainer.style.fontSize = "2rem";
    gameOverContainer.style.textAlign = "center";

    // Add newly created elements to the document
    buttonContainer.appendChild(button);
    gameOverContainer.appendChild(buttonContainer);
    column.appendChild(gameOverContainer);
    row.appendChild(column);
    main.appendChild(row);
}

/////////////////////////
const countdown = () => {  // Timer
    counter = setInterval(() => {
        if (timer === endGameNum || score === decreaseScoreNum) {
            clearInterval(counter);
            endGame();
        }
        timeParaElement.innerHTML = `${timeRemainingText} ${timer}s`;
        timer--;
    }, 1000);
}
    
/////////////////////////
const generatePrizeOrATrapCell = () => {
  let difficultyLevel = document.forms[0].elements.difficulty.value;
  let difficultyLevelTimes = getDifficultylevelTimes(difficultyLevel);

  if (Math.random() <= 0.6) {
    // 60% chance to become a prize
    // Select a random table cell on the board
    let prizeCell = document.getElementsByTagName("td")[getRandomCellIndex()];
    prizeCell.className = "prize"; // Make it a prize
    prizeCell.setAttribute("onclick", "increaseOrDecreaseScore(this)");
    setTimeout(() => {
      // After x num of seconds let it become empty again
      prizeCell.removeAttribute("onclick", "increaseOrDecreaseScore(this)");
      prizeCell.classList.remove("prize");
      prizeCell.classList.add("cell");
    }, getRandomDuration(difficultyLevelTimes[0], difficultyLevelTimes[1]));
  } else {
    let trapCell = document.getElementsByTagName("td")[getRandomCellIndex()];
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
    generatePrizeTrapCells();  // Start creating prize and trap cells
    countdown();  // Start timer
}

const restartGame = () => {
    let gameOverRow = document.querySelector(".game-over-row");
    main.removeChild(gameOverRow);  // Remove game over row, including its text
    gameFinished = false;
    score = initialScore;
    timer = numOfSecondsGameLasts;
}

/////////////////////////
const modalForm = document.querySelector(".modal-form");

modalForm.addEventListener("submit", e => {
    let difficultyLevel = document.forms[0].elements.difficulty.value;

    if (!difficultyLevel) {  // Check if a difficult level was chosen by the user
        return alert("Please enter a difficulty level");
    }
    if (gameFinished) {  // Only call restart game function when a game has been played
        restartGame();
    }

    let modalDivButton = document.querySelector(".modal-div-button");
    // Remove start button after user submits form the first time
    if (modalDivButton.style.display !== "none") {
        modalDivButton.style.display = "none";
        main.style.display = "block";
    }
    e.preventDefault();
    startGame();
});