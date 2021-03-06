"use strict";

//Useable game colors
let colors = [];

//Board Size in [ROW, CARD] format

const DIFFICULTY = [
  [2, 4],  //NOVICE  -  8 CARDS
  [3, 4],  //EASY    -  12 CARDS
  [4, 4],  //MEDIUM  -  16 CARDS
  [6, 4],  //HARD    -  24 CARDS
  [8, 4]  //MADNESS -   32 CARDS
];


//Add listeners to difficulty buttons
function addRadioClickListeners() {
  console.log("addRadioClickListeners");

  for (let button of document.querySelectorAll(".btn-check")) {
    button.addEventListener("click", handleDiffClick);
  }
};

let checkedDifficulty = "2"

//Handle the event when a button is clicked/toggle the background color for
//better visual experince for user
function handleDiffClick(evt){
  console.log("handleDiffClick")

  let difficulty = evt.target.value

  if (checkedDifficulty){
    document.getElementById(`label-${checkedDifficulty}`).style.background = "#dc3545";
    document.getElementById(`label-${checkedDifficulty}`).style.color= "white";
  }

  document.getElementById(`label-${difficulty}`).style.background = "white";
  document.getElementById(`label-${difficulty}`).style.color= "#dc3545";
  checkedDifficulty = difficulty
}

let matchestoWin = 0;

//handle the submit of the button tostart the game
function handleSubmit(evt) {
  console.log("handleSubmit");
  evt.preventDefault();

  setColors(checkedDifficulty);
  setDifficulty(checkedDifficulty);
};

//take the value from the event and feed it to DIFFICULTY to get board size
function setDifficulty(num) {
  console.log("setDifficulty");

  //set up the number of matches required to win game to compare later
  matchestoWin = (DIFFICULTY[num][0] * DIFFICULTY[num][1]) / 2;
  showGameBoard(
    DIFFICULTY[num][0],
    DIFFICULTY[num][1]

  );
};

//Take the same difficulty number and add the number of colors needed for the game to the pallet
function setColors(num) {
  let digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
  let numberOfColors = (DIFFICULTY[num][0] * DIFFICULTY[num][1]) / 2;

  let color = "#";
  for (let i = 0; i < numberOfColors; i++) {
    for (let j = 0; j < 6; j++) {
      color += digits[Math.floor(Math.random() * digits.length)];
    }
    colors.push(color);
    colors.push(color);
    color = "#";
  }
  shuffle(colors);
};

//Shuffle the array of colors
function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

//Create the gameboard by injecting the array into the browser
function showGameBoard(row, card) {
  console.log("showGameBoard");

  let gameBoard = document.getElementById("game-board");
  let html = "";
  let colorCounter = 0;

  for (let i = 0; i < row; i++) {
    html += `
    <div id="game-row-${i}" class="row justify-content-center align-items-center">
    `;
    for (let j = 0; j < card; j++) {
      html += `
      <div id="card-${i}-${j}" class="game-card ${colors[colorCounter]} col-md-6 m-2"></div>
      `;
      colorCounter++;
    }
    html += "</div>";
  }
  document.getElementById("form-section").innerHTML = "";
  gameBoard.innerHTML = html;
  addCardClickListeners();
};
//Add click listeners to all the cards created
function addCardClickListeners() {
  console.log("addCardClickListeners");

  for (let card of document.querySelectorAll(".game-card")) {
    card.addEventListener("click", handleCardClick);
  }
}

let currentMatch = []; //keep track of card flipped before match
let flippedColors = []; //store all the flipped colors

//handle the event for when a user clicks a card
function handleCardClick(evt) {
  console.log("handleCardClick");

  let color = evt.target.classList[1];


  if (!currentMatch[0] && !flippedColors.includes(color)) {
    currentMatch.push(color);
    currentMatch.push(evt.target.id);
    flipCard(color, evt.target.id);

  } else if (currentMatch[0].includes(color) && evt.target.id !== currentMatch[1]
   && !flippedColors.includes(color)) {
    flipCard(color, evt.target.id);
    currentMatch = [];
    flippedColors.push(color);
    console.log(flippedColors.length)

  } else if (!flippedColors.includes(color)){
    flipCard(color, evt.target.id);
    setTimeout(unFlipCard, 1000, color, evt.target.id);
    setTimeout(unFlipCard, 1000, currentMatch[0], currentMatch[1]);
    currentMatch = [];
  }
  //Check for win!
  if (flippedColors.length === matchestoWin) {
    handleWin();
  }

};

//show the background color stored in the card
function flipCard(color, cell) {
  console.log("flipCard");

  document.getElementById(`${cell}`).style.background = `${color}`;
};

//flip the card back over if there is no match found
function unFlipCard(color, cell) {
  console.log("unflipCard");
  document.getElementById(`${cell}`).style.background = "white";
};

//we won the game, tell the user about it!
function handleWin() {
  console.log("handleWin");

  let winBanner = document.getElementById("game-board");
  let html = "";

  html += `
  <div id ="win-banner" class="container-lg bg-light border border-dark mt-4 mb-5 pb-5">
      <div class="row justify-content-center align-items-center text-danger">
        <div class="col-lg justify-content-center align-items-center text-center mt-5">
          <h1 class="flex-nowrap fw-bold">CONGRATULATIONS, YOU WIN!</h1>
        </div>
      </div>
    <div class="row justify-content-center align-items-center text-danger">

  `;

  winBanner.innerHTML = html;

  setTimeout(playAgain, 2000);
};

//prompt the user if they would like to play the game again
function playAgain(){
  console.log("playAgain")

let newGamePrompt = document.getElementById("win-banner");
let html = "";

html += `
  <div class="row justify-content-center align-items-center text-danger">
    <div class="col-lg justify-content-center align-items-center text-center mt-5">
    <label for="play-again" class="form-label lead d-block mb-4 text-danger fw-bold">Would you like to play again?</label>
    <div class="btn-group" role="group" aria-label="Basic radio toggle button group">

    <input type="radio" class="btn-check" value ="0" name="no" id="no" autocomplete="off">
    <label id="label-0" class="btn btn-lg border border-dark mx-2" for="no">No thanks</label>

    <input type="radio" class="btn-check" value ="1" name="yes" id="yes" autocomplete="off">
    <label id="label-1"class="btn btn-lg border border-dark mx-2" for="yes" >Heck yes!</label></div>
    </div>
  </div>
</div>
`

newGamePrompt.innerHTML = html

addWinClickListeners()
};

//add listeners to the buttons we added for the playAgain()
function addWinClickListeners() {
  console.log("addWinClickListeners");

  for (let button of document.querySelectorAll(".btn-check")) {
    button.addEventListener("click", newGameSubmit);
  }
};

//handle the event when a user clicks one of the buttons
function newGameSubmit(evt) {
  console.log("newGameSubmit");
  evt.preventDefault();

  let id = evt.target.value

  if (id === "1"){
      location.reload();
  }else{
    thanksForPlaying();
  }
};

//show a thanks for playing banner if the user doesn't want to play again
function thanksForPlaying(){
  console.log("thanksForPlaying")

  let thanks = document.getElementById("game-board");
  let html = "";

  html += html += `
  <div id ="thanks" class="container-lg bg-light border border-dark mt-4 mb-5 pb-5">
      <div class="row justify-content-center align-items-center text-danger">
        <div class="col-lg justify-content-center align-items-center text-center mt-5">
          <h1 class="flex-nowrap fw-bold">Thanks for playing!</h1>
        </div>
      </div>
    <div class="row justify-content-center align-items-center text-danger">
    `
  thanks.innerHTML = html
};


document.getElementById("memory-form").addEventListener("submit", handleSubmit);
addRadioClickListeners();