/**
 * ATTACH EVENT HANDLERS
 */

// Refresh button press
const refreshButton = document.querySelector("#refresh");
refreshButton.addEventListener("click", handleRefreshButton);

// Play Classic board button press
const classicButton = document.querySelector("#classic-mode");
classicButton.addEventListener("click", handlePlayClassicBoardButton);

// Save Question button press
const questionForm = document.querySelector("#question-form");
questionForm.addEventListener("submit", handleQuestionFormSubmit);

const gameModeInput = document.getElementsByName("game-mode");
gameModeInput[0].addEventListener("click", handleGameModeToggle);
gameModeInput[1].addEventListener("click", handleGameModeToggle);

/**
 * EVENT HANDLERS
 */

function handleRefreshButton() {
  clearBoard();
  clearSquareColors();
  populateEntireBoard(); // TODO: should I call this here or should I use a different function for this? 
}

function handlePlayClassicBoardButton() {
  clearBoard();

  localStorage.setItem("currentBoard", "[]");
  for (var i = 0; i < classicBoard.length; i++) {
    saveQuestion(classicBoard[i]);
  }

  initializeGameState();
  populateEntireBoard();
}

function handleQuestionFormSubmit(event) {
  event.preventDefault();

  let question = document.getElementById("form-question");

  if (localStorage.getItem("currentBoard") == null) {
    localStorage.setItem("currentBoard", "[]");
  }

  if (question.value == null || question.value == "") {
    alert("No input entered. Please try again.");
  } else {
    saveQuestion(question.value);
    populateEntireBoard();
  }
}

function handleClick(event) {
  let bingoSquare = event.target;

  if (bingoSquare == null) {
    return;
  }
  
  if (bingoSquare.classList.contains("clicked")) bingoSquare.classList.remove("clicked");
  else bingoSquare.classList.add("clicked");

  let bingoSquareId = bingoSquare.id.split("-")[1];
  addToGameState(bingoSquareId);

  let isGameOver = checkForWinningRow(bingoSquareId);

  if (!isGameOver) {
    isGameOver = checkForWinningColumn(bingoSquareId);
  }

  if (!isGameOver) {
    isGameOver = checkForWinningDiagonal(bingoSquareId);
  }

  checkForGameOver(isGameOver);
}

function handleGameModeToggle(event) {
  let gameMode = event.target.id;
  setGameMode(gameMode);
}


/** FUNCTIONS  */

function clearBoard() {
  localStorage.clear();
}

function clearSquareColors() {
  for (let i = 0; i < 25; i++) {
    let bingoSquare = document.getElementById("square-" + (i + 1));
    if (bingoSquare.classList.contains("clicked")) bingoSquare.classList.remove("clicked");
  }
}

function reloadWindow() {
  location.reload();
}

function populateEntireBoard() {
  if (localStorage.getItem("currentBoard") != null) {
    let currentBoard = JSON.parse(localStorage.getItem("currentBoard"));
    
    for (let i = 0; i < currentBoard.length; i++) {
      let squareId = "square-" + (i + 1);
      let bingoSquare = document.getElementById(squareId);

      bingoSquare.innerText = currentBoard[i];
      bingoSquare.addEventListener("click", handleClick);
    }
  } else {
    for (let i = 0; i < 25; i++) {
      let squareId = "square-" + (i + 1);
      let bingoSquare = document.getElementById(squareId);

      bingoSquare.innerText = "";
      bingoSquare.addEventListener("click", handleClick);
    }
  }
}

function initializeGameState() {
  if (localStorage.getItem("boardState") == null) {
    let initialBoardState = JSON.stringify([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]);
    localStorage.setItem("boardState", initialBoardState);
  }
}

function getGameState() {
  if (localStorage.getItem("boardState") != null) {
    return boardState = JSON.parse(localStorage.getItem("boardState"));
  } else {
    return null;
  }
}

function addToGameState(squareId) {
  if (localStorage.getItem("boardState") != null) {
    let boardState = JSON.parse(localStorage.getItem("boardState"));
    boardState[squareId - 1] = boardState[squareId - 1] == true ? false : true;
    localStorage.setItem("boardState", JSON.stringify(boardState));
  } else {
    console.log("boardState null");
  }
}

function saveQuestion(question) {
  let currentBoard = JSON.parse(localStorage.getItem("currentBoard"));
  currentBoard.push(question);
  localStorage.setItem("currentBoard", JSON.stringify(currentBoard));
}

function checkForWinningRow() {
  let boardState = JSON.parse(localStorage.getItem("boardState"));

  if (boardState) {
    let row1 = boardState.slice(0, 5);
    let row2 = boardState.slice(5, 10);
    let row3 = boardState.slice(10, 15);
    let row4 = boardState.slice(15, 20);
    let row5 = boardState.slice(20, 25);

    if (row1.filter(i => i == false).length == 0) return true;
    if (row2.filter(i => i == false).length == 0) return true;
    if (row3.filter(i => i == false).length == 0) return true;
    if (row4.filter(i => i == false).length == 0) return true;
    if (row5.filter(i => i == false).length == 0) return true;
  } else {
    return false;
  }

  return false;
}

function checkForWinningColumn() {
  let board = JSON.parse(localStorage.getItem("boardState"));

  if (board) {
    let column1 = [board[0], board[5], board[10], board[15], board[20]];
    let column2 = [board[1], board[6], board[11], board[16], board[21]];
    let column3 = [board[2], board[7], board[12], board[17], board[22]];
    let column4 = [board[3], board[8], board[13], board[18], board[23]];
    let column5 = [board[4], board[9], board[14], board[19], board[24]];

    if (column1.filter(i => i == false).length == 0) return true;
    if (column2.filter(i => i == false).length == 0) return true;
    if (column3.filter(i => i == false).length == 0) return true;
    if (column4.filter(i => i == false).length == 0) return true;
    if (column5.filter(i => i == false).length == 0) return true;
  } else {
    return false;
  }

  return false;
}

function checkForWinningDiagonal() {
  let board = JSON.parse(localStorage.getItem("boardState"));

  if (board) {
    let diagonal1 = [board[0], board[6], board[12], board[18], board[24]];
    let diagonal2 = [board[4], board[8], board[12], board[16], board[20]];

    if (diagonal1.filter(i => i == false).length == 0) return true;
    if (diagonal2.filter(i => i == false).length == 0) return true;
  } else {
    return false;
  }

  return false;
}

function checkForBlackout() {
  let board = JSON.parse(localStorage.getItem("boardState"));

  let isBoardBlackedOut = board.every(square => square === true);
  return isBoardBlackedOut;
}

function checkForGameOver(isGameOver) {
  if (isGameOver) alert("Bingo!");
}

function getGameMode() {
  return localStorage.getItem("gameMode");
}

function setGameMode(mode) {
  localStorage.setItem("gameMode", mode);
}

function clearGameMode() {
  localStorage.removeItem("gameMode");
}


/**
 * 01. Load in bingo square questions every time page reloads and attach necessary event listeners  
 * Beginning of Game play
*/
window.addEventListener("load", (event) => {
  initializeGameState();
  populateEntireBoard();
});


/**
 * Classic mode Board Selections
 */
let classicBoard = [
  "Will we see turtles?",
  "What island is that?",
  "Are there sharks?",
  "What kind of whales are these?",
  "You must love your job.",
  "Can we trade jobs?/Are you hiring?",
  "What temperature is the water?",
  "What do those flags mean?",
  "What kind of engines/horses you got in there?",
  "How tall's the mast?",
  "Is this pretty windy today?",
  "*Someone pukes*",
  "What kind of fish is that?",
  "Where are you from?",
  "*Sleepy Asian*",
  "Is the bar open? (Must ask before 10am)",
  "Are we gonna sail?",
  "How long you been doing this?",
  "How long is this boat?",
  "What do you recommend we do on Maui?",
  "Do I need to be able to swim to snorkel?",
  "*Bratty kid says something snarky*",
  "Where are we snorkeling today?",
  "*Someone mispronounces Hawaiian word*",
  "*Old person eats shit*"
]

