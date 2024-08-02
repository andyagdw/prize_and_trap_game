// Random time a cell will become a prize or trap after 'generatePrizeOrATrapCell' function called
function getRandomTimeInterval() {
    let min = Math.ceil(500);
    let max = Math.floor(2500);
    return Math.floor(Math.random()*(max-min+1) + min);
}

function getRandomCellIndex() {  // Selecting random cell (table is 20x20 = 400)
    let min = Math.ceil(0);
    let max = Math.floor(399);
    return Math.floor(Math.random()*(max-min+1) + min);
}

function getRandomDuration(minTime, maxTime) {  // Random time a cell will stay as prize or a trap
    let min = Math.ceil(minTime);
    let max = Math.floor(maxTime);
    return Math.floor(Math.random()*(max-min+1) + min);
}

function getDifficultylevelTimes(difficultyLevel) {  // Set difficult level times
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
const scoreText = document.querySelector('.score');
const timeText = document.querySelector('.time');
const main = document.getElementById("main");
// The higher the number, the more prizes and traps will be on the board
const frequencyOfPrizesAndTraps = 200;
let gameFinished = false;
let counter;  // Declare the timer
let score = 0;
let timer = 30;

/////////////////////////
let myDiv = document.getElementById("game-board-div");  // Create table
let table = document.createElement('table');
table.className = "mx-auto";
myDiv.appendChild(table);

let tbody = document.createElement('tbody');  // Create table body
let tableBody = table.appendChild(tbody);

for (i = 0; i < 20; i++) {  // Create 20 table rows and inside each table row, create 20 table cells
    let tr = document.createElement('tr'); 
    tableBody.appendChild(tr);
    for (let x = 0; x < 20; x++) {
            let td = document.createElement('td');
            tr.appendChild(td);
            td.className = "cell";
        }
    };

/////////////////////////
function increaseOrDecreaseScore(tableCell) {
    if (gameFinished === false && tableCell.className === "prize") {
        score+=3;
        scoreText.innerHTML = `Score: ${score}`;
        tableCell.className = "cell";
    } else if (gameFinished === false && tableCell.className === "trap") {
        score = -100;
        scoreText.innerHTML = `Score: ${score}`;
        clearInterval(counter);
        endGame();
    }
}

/////////////////////////
function endGame() {
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
function startGame() {
    scoreText.innerHTML = `Score: ${score}`;
    timeText.innerHTML = `Time remaining: ${timer}s`;
    generatePrizeTrapCells();  // Start creating prize and trap cells
    countdown();  // Start timer
}

function generatePrizeTrapCells() {
  for (let i = 0; i < frequencyOfPrizesAndTraps; i++) {
    // Will loop 'freq' times and call this function for every loop
    setTimeout(generatePrizeOrATrapCell, getRandomTimeInterval());
  }
  // After looping call 'generatePrizeTrapCells' again after 2secs
  let loopPrizeTrapCells = setTimeout(generatePrizeTrapCells, 2000);
  if (timer === 0 || score === -100) {
    clearTimeout(loopPrizeTrapCells);
  }
}

function generatePrizeOrATrapCell() {

    let difficultyLevel = document.forms[0].elements.difficulty.value;
    let difficultyLevelTimes = getDifficultylevelTimes(difficultyLevel);

    if (Math.random() <= 0.6) {  // 60% chance to become a prize
        // Select a random table cell on the board
        let prizeCell = document.getElementsByTagName('td')[getRandomCellIndex()];
        prizeCell.className = "prize";  // Make it a prize
        prizeCell.setAttribute('onclick', 'increaseOrDecreaseScore(this)')
        setTimeout(function () {  // After 1-1.8secs let it become empty again
            prizeCell.removeAttribute('onclick', 'increaseOrDecreaseScore(this)');
            prizeCell.classList.remove('prize');
            prizeCell.classList.add('cell');
        }, getRandomDuration(difficultyLevelTimes[0], difficultyLevelTimes[1]));
    } else {
        let trapCell = document.getElementsByTagName('td')[getRandomCellIndex()];
        trapCell.className = "trap";
        trapCell.setAttribute('onclick', 'increaseOrDecreaseScore(this)');
        setTimeout(function () {
          trapCell.removeAttribute("onclick", "increaseOrDecreaseScore(this)");
          trapCell.classList.remove("trap");
          trapCell.classList.add("cell");
        }, getRandomDuration(difficultyLevelTimes[0], difficultyLevelTimes[1]));
    }
}

/////////////////////////
function countdown() {  // Timer
    counter = setInterval(function () {
        if (timer === 0 || score === -100) {
            clearInterval(counter);
            endGame();
        }
        timeText.innerHTML = `Time remaining: ${timer}s`;
        timer--;
    }, 1000);
}

/////////////////////////
const modalForm = document.querySelector(".modal-form");
modalForm.addEventListener("submit", e => {
    let difficultyLevel = document.forms[0].elements.difficulty.value;
    if (!difficultyLevel) {  // Check if a difficult level was chosen
        return alert("Please enter a difficulty level");
    }
    if (gameFinished) {  // Only call restart game function when a game has been played
        restartGame();
    }
    let modalDivButton = document.querySelector(".modal-div-button");
    if (modalDivButton.style.display !== "none") {
        modalDivButton.style.display = "none";
        main.style.display = "block";
    }
    e.preventDefault();
    startGame();
});

/////////////////////////
function restartGame() {
    let gameOverRow = document.querySelector(".game-over-row");
    main.removeChild(gameOverRow);  // Remove game over row, including its text
    gameFinished = false;
    score = 0;
    timer = 30;
}