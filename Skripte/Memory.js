
const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stopbtn");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const kostenlos = document.getElementById("kostenlos");

let cards;
let interval;
let firstCard = false;
let secondCard = false;
//trigger refresh
//Items array
const items = [
    { name: "pic1", image: "../Bilder/pic1-klein.jpeg"},
    { name: "pic2", image: "../Bilder/pic2-klein.jpeg"},
    { name: "pic3", image: "../Bilder/pic3-klein.jpeg"},
    { name: "pic4", image: "../Bilder/pic4-klein.jpeg"},
    { name: "pic5", image: "../Bilder/pic5-klein.jpeg"},
    { name: "pic6", image: "../Bilder/pic6-klein.jpeg"},
    { name: "pic7", image: "../Bilder/pic7-klein.jpeg"},
    { name: "pic8", image: "../Bilder/pic8-klein.jpeg"},
    { name: "pic9", image: "../Bilder/pic9-klein.jpeg"},
    { name: "pic10", image: "../Bilder/pic10-klein.jpeg"},
    { name: "pic11", image: "../Bilder/pic11-klein.jpeg"},
    { name: "pic12", image: "../Bilder/pic12-klein.jpeg"},
    { name: "pic13", image: "../Bilder/pic13-klein.jpg"},
    { name: "pic14", image: "../Bilder/pic14-klein.jpg"},
    { name: "pic15", image: "../Bilder/pic15-klein.jpg"},
    { name: "pic16", image: "../Bilder/pic16-klein.jpg"},
    { name: "pic17", image: "../Bilder/pic17-klein.jpg"},
    { name: "pic18", image: "../Bilder/pic18-klein.jpg"},
    { name: "pic19", image: "../Bilder/pic19-klein.jpg"},
    { name: "pic20", image: "../Bilder/pic20-klein.jpg"},
    { name: "pic21", image: "../Bilder/pic21-klein.jpg"},
    { name: "pic22", image: "../Bilder/pic22-klein.jpg"},
    { name: "pic23", image: "../Bilder/pic23-klein.jpg"},
    { name: "pic24", image: "../Bilder/pic24-klein.jpg"},
    { name: "pic25", image: "../Bilder/pic25-klein.jpg"},
    { name: "pic26", image: "../Bilder/pic26-klein.jpg"},
    { name: "pic27", image: "../Bilder/pic27-klein.jpg"},
    { name: "pic28", image: "../Bilder/pic28-klein.jpg"},
    { name: "pic29", image: "../Bilder/pic29-klein.jpg"},
    { name: "pic30", image: "../Bilder/pic30-klein.jpg"},
];

//Initial Time
let seconds = 0,
  minutes = 0;
//Initial moves and win count
let movesCount = 0,
  winCount = 0;

//For timer
const timeGenerator = () => {
  seconds += 1;
  //minutes logic
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //format time before displaying
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Zeit:</span><span id="time-content">${minutesValue}:${secondsValue}</span>`;
};


//For calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Züge:</span><span id="moves-content">${movesCount}</span>`;
};



//Pick random objects from the items array
const generateRandom = (size = 4) => {
  //temporary array
  let tempArray = [...items];
  //initializes cardValues array
  let cardValues = [];
  //size should be double (4*4 matrix)/2 since pairs of objects would exist
  size = (size * size) / 2;
  //Random object selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    //once selected remove the object from temp array
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};
const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //simple shuffle
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    /*
        Create Cards
        before => front side (contains question mark)
        after => back side (contains actual image);
        data-card-values is a custom attribute which stores the names of the cards to match later
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  //Grid
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;
  //Cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
      if (!card.classList.contains("matched")) {
        //flip the cliked card
        card.classList.add("flipped");
        //if it is the firstcard (!firstCard since firstCard is initially false)
        if (!firstCard) {
          //so current card will become firstCard
          firstCard = card;
          //current cards value becomes firstCardValue
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          //increment moves since user selected second card
          movesCounter();
          //secondCard and value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //if both cards match add matched class so these cards would beignored next time
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //set firstCard to false since next card would be first now
            firstCard = false;
            //winCount increment as user found a correct match
            winCount += 1;
            //check if winCount ==half of cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
              let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
              result.innerHTML = `<h2 id="won">Glückwunsch</h2>
            <h4>Züge: <span id="moves-won">${movesCount}</span></h4>
            <h4>Zeit: <span id="time-won">${minutesValue}:${secondsValue}</span></h4>`;
              stopGame();
              const myEvent = new Event("myCustomEvent");
              document.dispatchEvent(myEvent);
            }
          } else {
            //if the cards dont match
            //flip the cards back to normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};
//Start game
startButton.addEventListener("click", () => {
  //delete old session
  clearInterval(interval);
  timeValue.innerHTML = `<span>Zeit:</span><span id="time-content">00:00 </span>`;
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //controls amd buttons visibility
  kostenlos.classList.add("hide");
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  gameContainer.classList.remove("hide");
  startButton.classList.add("hide");
  //Start timer
  interval = setInterval(timeGenerator, 1000);
  //initial moves
  moves.innerHTML = `<span>Züge:</span> <span id="moves-content">${movesCount}</span>`;
  initializer();
});
//Stop game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    kostenlos.classList.remove("hide");
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    gameContainer.classList.add("hide");
    startButton.classList.remove("hide");
  })
);

//Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};