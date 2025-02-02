/**
 * ATTACH EVENT HANDLERS
 */

// Handles Refresh button click
const refreshButton = document.querySelector("#refresh");
refreshButton.addEventListener("click", handleRefreshButton);

// Fill Board with classic questions
const classicButton = document.querySelector("#classic-mode");
classicButton.addEventListener("click", handlePlayClassicBoardButton);

// Save Question to localStorage and Reload Page 
const questionForm = document.querySelector("#question-form");
questionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  // Create currentBoard if first question submission
  if (localStorage.getItem("currentBoard") == null) {
    localStorage.setItem("currentBoard", "[]");
  }
  
  // Save question to currentBoard in localStorage
  saveQuestion(event.target.value);

  location.reload();
});

/**
 * EVENT HANDLERS
 */

function handleRefreshButton() {
  clearBoard();
}

function handlePlayClassicBoardButton() {
  clearBoard();
  
  localStorage.setItem("currentBoard", "[]");
  
  for (var i = 0; i < classicBoard.length; i++) {
    saveQuestion(classicBoard[i]);
  }
}


/** FUNCTIONS  */

function clearBoard() {
  localStorage.clear();
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
  }

}

// Handles Bingo Square change when a user clicks 
function handleClick(event) {
  // Add or remove a square selection
  let bingoSquare = event.target;
  if (bingoSquare.classList.contains("clicked")) {
    bingoSquare.classList.remove("clicked");
  } else {
    bingoSquare.classList.add("clicked");
  }

  checkForWinningRow(bingoSquare);
  checkForWinningColumn(bingoSquare);
  checkForWinningDiagonal(bingoSquare);
}


function saveQuestion(question) {
  let currentBoard = JSON.parse(localStorage.getItem("currentBoard"));
  currentBoard.push(question);
  localStorage.setItem("currentBoard", JSON.stringify(currentBoard));
}

// Checks if user has won through a row
function checkForWinningRow(buttonSquare) {
  let bingoSquareId = buttonSquare.id;
  console.log(bingoSquareId);

  let currentBoard = JSON.parse(localStorage.getItem("currentBoard"));

  // Check row 1

}


// Checks if user has won through a column 
function checkForWinningColumn(buttonSquare) {
  console.log("check column");
}

// Checks if user has won through a diagonal
function checkForWinningDiagonal(buttonSquare) {
  console.log("check diagonal");
}

// Check if game is over 

// Handles Bingos and Blackout 

/**
 * 01. Load in bingo square questions every time page reloads and attach necessary event listeners  
 * Beginning of Game play
*/
window.addEventListener("load", (event) => {
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

