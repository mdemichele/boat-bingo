"use strict";

const BOARD_SIZE = 25;

/**
 * Every way to win in bingo mode, as lists of square indexes (0-24)
 */
const WINNING_LINES = [
  // Rows
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  // Columns
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  // Diagonals
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20]
];

/**
 * Classic mode Board Selections
 */
const classicBoard = [
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
];


/**
 * ELEMENTS
 */
const boardElement = document.getElementById("bingo-board");
const questionForm = document.getElementById("question-form");
const questionInput = document.getElementById("form-question");
const questionSubmit = questionForm.querySelector("button[type=submit]");
const formMessage = document.getElementById("form-message");
const questionCountText = document.getElementById("question-count");
const progressBar = document.getElementById("progress-bar");
const undoButton = document.getElementById("undo-question");
const playGameButton = document.getElementById("play-game");
const modeBadge = document.getElementById("mode-badge");
const winDialog = document.getElementById("win-dialog");


/**
 * ATTACH EVENT HANDLERS
 */
questionForm.addEventListener("submit", handleQuestionFormSubmit);
undoButton.addEventListener("click", handleUndoButton);
document.getElementById("classic-mode").addEventListener("click", handlePlayClassicBoardButton);
document.getElementById("refresh").addEventListener("click", handleRefreshButton);
document.getElementById("clear-marks").addEventListener("click", handleClearMarksButton);
playGameButton.addEventListener("click", handlePlayGameButtonClick);
winDialog.addEventListener("close", handleWinDialogClose);

for (const input of document.getElementsByName("game-mode")) {
  input.addEventListener("change", handleGameModeToggle);
}

// One button per square; a single listener on the board handles all of them
for (let i = 0; i < BOARD_SIZE; i++) {
  const square = document.createElement("button");
  square.type = "button";
  square.className = "bingo-square";
  square.dataset.index = i;
  boardElement.appendChild(square);
}
boardElement.addEventListener("click", handleSquareClick);


/**
 * EVENT HANDLERS
 */

function handleQuestionFormSubmit(event) {
  event.preventDefault();

  const question = questionInput.value.trim();
  const questions = getQuestions();

  if (question === "") {
    showFormMessage("Type a question first.");
    return;
  }

  if (questions.length >= BOARD_SIZE) {
    showFormMessage("The board is full. Clear it to start over.");
    return;
  }

  questions.push(question);
  setQuestions(questions);
  questionInput.value = "";

  if (questions.length === BOARD_SIZE) {
    showFormMessage("Board's full. Let's play! 🎉");
    questionInput.blur();
  } else {
    showFormMessage("");
  }

  render();
}

function handleUndoButton() {
  const questions = getQuestions();
  if (questions.length === 0) return;

  questions.pop();
  setQuestions(questions);

  // Unmark the square that just lost its question
  const boardState = getBoardState();
  boardState[questions.length] = false;
  setBoardState(boardState);

  showFormMessage("");
  render();
}

function handlePlayClassicBoardButton() {
  if (getQuestions().length > 0 && !confirm("Replace your current board with the classic board?")) {
    return;
  }

  setQuestions(classicBoard.slice());
  clearMarks();
  showFormMessage("");
  render();
}

function handleRefreshButton() {
  if (getQuestions().length > 0 && !confirm("Clear all questions and marks?")) {
    return;
  }

  setQuestions([]);
  clearMarks();
  showFormMessage("");
  render();
}

function handleClearMarksButton() {
  clearMarks();
  render();
}

function handleGameModeToggle(event) {
  setGameMode(event.target.value);
  render();
}

function handlePlayGameButtonClick() {
  document.getElementById("board-section").scrollIntoView({ behavior: "smooth", block: "start" });
}

function handleSquareClick(event) {
  const square = event.target.closest(".bingo-square");
  if (square == null || square.disabled) return;

  const index = Number(square.dataset.index);
  const hadWon = getWinningSquares().length > 0;

  const boardState = getBoardState();
  boardState[index] = !boardState[index];
  setBoardState(boardState);

  render();

  // Only celebrate the moment you win, not on every tap afterwards
  if (!hadWon && getWinningSquares().length > 0) {
    showWinDialog();
  }
}

function handleWinDialogClose() {
  if (winDialog.returnValue === "new") {
    clearMarks();
    render();
  }
}


/** GAME STATE FUNCTIONS  */

function getQuestions() {
  return JSON.parse(localStorage.getItem("currentBoard")) || [];
}

function setQuestions(questions) {
  localStorage.setItem("currentBoard", JSON.stringify(questions));
}

function getBoardState() {
  const boardState = JSON.parse(localStorage.getItem("boardState"));
  if (Array.isArray(boardState) && boardState.length === BOARD_SIZE) return boardState;
  return new Array(BOARD_SIZE).fill(false);
}

function setBoardState(boardState) {
  localStorage.setItem("boardState", JSON.stringify(boardState));
}

function clearMarks() {
  setBoardState(new Array(BOARD_SIZE).fill(false));
}

function getGameMode() {
  return localStorage.getItem("gameMode") === "blackout-mode" ? "blackout-mode" : "bingo-mode";
}

function setGameMode(mode) {
  localStorage.setItem("gameMode", mode);
}

function isReadyToPlay() {
  return getQuestions().length === BOARD_SIZE;
}

function showFormMessage(message) {
  formMessage.textContent = message;
}


/** CHECK WINNERS FUNCTIONS */

// Returns the indexes of every square that's part of a win (empty if no win yet)
function getWinningSquares() {
  if (!isReadyToPlay()) return [];

  const boardState = getBoardState();

  if (getGameMode() === "blackout-mode") {
    return boardState.every(marked => marked) ? WINNING_LINES.flat() : [];
  }

  const winningLines = WINNING_LINES.filter(line => line.every(i => boardState[i]));
  return winningLines.flat();
}

function showWinDialog() {
  const isBlackout = getGameMode() === "blackout-mode";

  document.getElementById("win-title").textContent = isBlackout ? "Blackout!" : "Bingo!";
  document.getElementById("win-message").textContent = isBlackout
    ? "Every single question got asked. Somebody get the captain a drink."
    : "Five dumb questions in a row. You've earned a drink.";

  winDialog.returnValue = "";
  winDialog.showModal();
}


/** RENDERING */

// Redraws everything on the page from what's saved in localStorage
function render() {
  const questions = getQuestions();
  const boardState = getBoardState();
  const gameMode = getGameMode();
  const winningSquares = new Set(getWinningSquares());
  const questionsLeft = BOARD_SIZE - questions.length;
  const isFull = questionsLeft === 0;

  // Question count & form
  questionCountText.textContent = isFull
    ? "All 25 questions ready ✅"
    : `${questionsLeft} more question${questionsLeft === 1 ? "" : "s"} to go...`;
  progressBar.style.width = `${(questions.length / BOARD_SIZE) * 100}%`;
  undoButton.hidden = questions.length === 0;
  questionInput.disabled = isFull;
  questionSubmit.disabled = isFull;
  playGameButton.hidden = !isFull;

  // Game mode
  document.getElementById(gameMode).checked = true;
  modeBadge.textContent = gameMode === "blackout-mode" ? "Blackout" : "Bingo";

  // Squares
  for (const square of boardElement.children) {
    const index = Number(square.dataset.index);
    const question = questions[index];

    square.textContent = question || "?";
    square.disabled = !question;
    square.classList.toggle("clicked", Boolean(question) && boardState[index]);
    square.classList.toggle("winning", winningSquares.has(index));
    square.setAttribute("aria-pressed", Boolean(question) && boardState[index]);
  }
}


/**
 * Beginning of Game play
 */
render();
