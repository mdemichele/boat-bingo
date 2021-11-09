// Clear Board Function 
const refreshButton = document.querySelector("#refresh");
refreshButton.addEventListener("click", (event) => {
  localStorage.clear();
  location.reload();
});

// Save Question to localStorage and Reload Page 
const questionForm = document.querySelector("#question-form");
questionForm.addEventListener("submit", (event) => {
  // event.preventDefault();
  // Create currentBoard if first question submission
  if (localStorage.getItem("currentBoard") == null) {
    localStorage.setItem("currentBoard", "[]");
  }
  
  // Save question to currentBoard in localStorage
  let newQuestion = event.target.question.value; 
  let newBoard = JSON.parse(localStorage.getItem("currentBoard"));
  newBoard.push(newQuestion);
  localStorage.setItem("currentBoard", JSON.stringify(newBoard));
});

// Handles Bingo Square change when a user clicks 
function handleClick(event) {
  let bingoSquare = event.target;
  bingoSquare.classList.add("clicked");
}

// Check if game is over 

// Handles Bingos and Blackout 

// 01. Load in bingo square questions every time page reloads and attach necessary event listeners  
window.addEventListener("load", (event) => {
  
  // Populate bingo squares with questions in localStorage 
  if (localStorage.getItem("currentBoard") != null) {
    let currentBoard = JSON.parse(localStorage.getItem("currentBoard"));
    
    for (let question of currentBoard) {
      // Correct id 
      let squareId = "square-" + (currentBoard.indexOf(question) + 1);
      console.log(squareId);
      // Get square in dom 
      let bingoSquare = document.getElementById(squareId);
      bingoSquare.innerText = question;
      
      // Attach event listener to the bingoSquare 
      bingoSquare.addEventListener("click", handleClick);
    }
  }

});

