// Variables Initialization
const mainBoard = document.querySelector(".mainBoard"); 
const resetButton = document.getElementById("Reset"); 
const winLoseAlert = document.querySelector(".winLoseAlert"); 
const initialCatType = "latte"; 
fetchData(initialCatType);

let cards = []; 
let firstCard, secondCard; 
let lockBoard = false; 
let moveCount = 0;

// Event Listener for Reset Button
resetButton.addEventListener("click", resetGame); 

// Event Listener for Cat Type Selector
const catTypesSelector = document.getElementById("catTypes"); 
catTypesSelector.addEventListener("change", function () {
  const selectedCatType = this.value; 
  fetchData(selectedCatType); 
});

// Setting the Move Count
document.getElementById("moveCount").textContent = moveCount; 

// resetBoard function 
function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

// generateCards function
function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div"); 
    cardElement.classList.add("card"); 
    cardElement.setAttribute("data-name", card.name); 
    cardElement.innerHTML = `
        <div class="front"> 
          <img class="front-image" src=${card.image} />
        </div>
        <div class="back"></div>
      `;
    mainBoard.appendChild(cardElement); 
    cardElement.addEventListener("click", flipCard); 
  }
}

// shuffleCards function using the 9Fisher-Yates algorithm 
function shuffleCards() {
  let currentIndex = cards.length, 
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex]; 
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

// resetGame function - RESTART GAME!!
function resetGame() {
  resetBoard();
  shuffleCards();
  moveCount = 0;
  document.getElementById("moveCount").textContent = moveCount;
  mainBoard.innerHTML = "";
  generateCards();
  winLoseAlert.style.display = "none";
}

//fetchData function
function fetchData(catTypes) {
  fetch(`./data/${catTypes}.json`) 
 .then((res) => res.json())
    .then((data) => {
      cards = [...data, ...data]; 
      resetGame();
    });
}

// unflipCards function - uses setTimeout function to wait for 1 second before removing the flipped class from the first and second cards. This causes the cards to flip back over, allowing player to try again.
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped"); 
    secondCard.classList.remove("flipped");
    if (moveCount < 30) {
      resetBoard();
    }
  }, 1000);
}

// disableCards function - to remove the click event listener from the first and second cards, effectively disabling them
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  if (moveCount < 30) {
    resetBoard();
  }
}

// checkForMatch function
function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name; 

  isMatch ? disableCards() : unflipCards();
}

// winGame function - to check if winning condition has been reached
function winGame() {
  const allCards = document.querySelectorAll(".card");
  const flippedCards = Array.from(allCards).filter((card) =>
    card.classList.contains("flipped")
  );

  if (flippedCards.length === allCards.length) {
    winLoseAlert.style.display = "block";
    winLoseAlert.textContent = "YOU WIN!";
    lockBoard = true;
  }
}

//winOrLose function - FINAL GAME RESULT
function winOrLose() {
  winGame();
  if (moveCount >= 30) {
    winLoseAlert.style.display = "block";
    winLoseAlert.textContent = "GAMEOVER";
    lockBoard = true;
  }
}

//flipCard function
function flipCard() {
  if (lockBoard) return; 
  if (this === firstCard) return;

  this.classList.add("flipped"); 

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moveCount++;
  document.getElementById("moveCount").textContent = moveCount;
  lockBoard = true;

  checkForMatch();
  winOrLose();
}
