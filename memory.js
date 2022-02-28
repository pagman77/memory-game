"use strict";

//Usable color pallet
let colors = [

];

//Board Size in [ROW, CARD] format
const DIFFICULTY = [
  [2, 4],  //NOVICE  -  8 CARDS
  [3, 4],  //EASY    - 12 CARDS
  [4, 5],  //MEDIUM  - 20 CARDS
  [6, 5],  //HARD    - 30 CARDS
  [10, 5]  //MADNESS - 50 CARDS
];

let matchestoWin = 0;

function handleSubmit(evt) {
  console.log("handleSubmit");
  evt.preventDefault();

  let ele = document.getElementsByTagName('input');
  let difficulty = "";
  for (let i = 0; i < ele.length; i++) {

    if (ele[i].type = "radio") {
      if (ele[i].checked) {
        difficulty = ele[i].value;
      }
    }
  }
  setColors(difficulty);
  setDifficulty(difficulty);
};

function setDifficulty(num) {
  console.log("setDifficulty");

  matchestoWin = (DIFFICULTY[num][0] * DIFFICULTY[num][1]) / 2;
  showGameBoard(
    DIFFICULTY[num][0],
    DIFFICULTY[num][1]

  );
};

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

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

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
      <div id="card-${i}-${j}" class="game-card ${colors[colorCounter]} col-sm-8 m-2"></div>
      `;
      colorCounter++;
    }
    html += "</div>";
  }
  document.getElementById("memory-form").innerHTML = "";
  gameBoard.innerHTML = html;
  addClickListeners();
};

function addClickListeners() {
  console.log("addClickListeners");

  for (let card of document.querySelectorAll(".game-card")) {
    card.addEventListener("click", handleCardClick);
  }
}
//STORE PREVIOUS TARGET IN [COLOR,CELL]
let currentMatch = [];

let currentScore = 0;
let matchCounter = 0;

function handleCardClick(evt) {
  console.log("handleCardClick");

  let color = evt.target.classList[1];

  if (!currentMatch[0]) {
    currentMatch.push(color);
    currentMatch.push(evt.target.id);
    flipCard(color, evt.target.id);

  } else if (currentMatch[0].includes(color)) {
    flipCard(color, evt.target.id);
    currentMatch = [];
    matchCounter++;

  } else {
    flipCard(color, evt.target.id);
    setTimeout(unFlipCard, 1000, color, evt.target.id);
    setTimeout(unFlipCard, 1000, currentMatch[0], currentMatch[1]);
    currentMatch = [];
  }
  //Check for win!
  if (matchCounter === matchestoWin) {
    handleWin();
  }
};

function flipCard(color, cell) {
  console.log("flipCard");

  document.getElementById(`${cell}`).style.background = `${color}`;
};


function unFlipCard(color, cell) {
  console.log("unflipCard");
  document.getElementById(`${cell}`).style.background = "white";
};


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
};

document.getElementById("memory-form").addEventListener("submit", handleSubmit);