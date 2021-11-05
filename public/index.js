let dictionaryArray = [];
fetch("/csw.txt")
  .then((response) => response.text())
  .then((data) => {
    dictionaryArray = data.split("\r\n");
  });

class blankdiv {
  constructor(x, y) {
    this.myself = document.createElement("div");
    this.myself.style.left = x;
    this.myself.style.top = y;
    this.myself.style.position = "absolute";
  }
} //defines a class which is just a blank div with a position

class tile {
  constructor(GridX, GridY, classname) {
    this.myself = document.createElement("div");
    this.GridX = GridX;
    this.GridY = GridY;
    this.myself.style.left = 10 + this.GridX * 52 + "px";
    this.myself.style.top = 10 + this.GridY * 52 + "px";
    this.myself.className = classname;
    this.adjacentTiles = [];
  }
} //defines a class which can create a div easily
// allows me to easily keep track of which div is which within index.js

class letterTile extends blankdiv {
  constructor(x, y, letter) {
    super(x, y);
    this.myself.className = "letter";
    this.myself.innerText = letter;
    this.myself.id = "";
    this.previousParent;
    this.currentParent;
    this.letter = letter;
    this.myself.draggable = "true";
  }
  moveTo(parent, newX, newY) {
    if (this.textContent != "") {
      this.myself.style.top = newY;
      this.myself.style.left = newX;
      parent.appendChild(this.myself);
    }
  }
}

// added a class for all the letters with an included "moveTo" function to easily move it around in other scripts, as its moved a lot

class rack {
  constructor(x, y, rackid) {
    this.myself = document.createElement("div");
    this.myself.style.position = "absolute";
    this.myself.className = "rack";
    this.myself.id = rackid;
    this.myself.style.top = y + "px";
    this.myself.style.left = x + "px";
  }
}

//added a class for the player racks to clean up code

class turnButton {
  constructor(x, y, text) {
    this.myself = document.createElement("button");
    this.myself.style.position = "absolute";
    this.myself.style.left = x + "px";
    this.myself.style.top = y + "px";
    this.myself.textContent = text;
  }
}

const score1 = new blankdiv("900px", "100px").myself;
score1.textContent = +0;
const s1s = score1.style;
s1s.height = "20px";
s1s.width = "75px";
s1s.position = "absolute";
s1s.backgroundColor = "rgb(0,60,150)";
s1s.color = "white";
document.body.appendChild(score1);

const score2 = new blankdiv("1000px", "100px").myself;
score2.textContent = +0;
const s2s = score2.style;
s2s.height = "20px";
s2s.width = "75px";
s2s.position = "absolute";
s2s.backgroundColor = "rgb(200,50,50)";
s2s.color = "white";
document.body.appendChild(score2);

const validmove = new blankdiv("1100px", "100px").myself;
const v = validmove.style;
v.height = "20px";
v.width = "165px";
v.position = "absolute";
v.backgroundColor = "green";
v.color = "white";
document.body.appendChild(validmove);

const rootDiv = document.getElementById("root");
const tileSize = 50;
const offset = 10; //array to control and keep track of each of the divs
const objects = [];
const numberOfRows = 15;
const numberOfDivs = numberOfRows * numberOfRows;
const MaTA = [];
let MiTA = [];

let y = 0;
let x = 0;

// [[tile, x, y, child, colour],...]

function getAdjascentCoords(coords) {
  let elementsX = coords[0];
  let elementsY = coords[1];
  const listofnewcoords = [];
  let a = [];

  for (i = -1; i < 2; i = i + 2) {
    let a = [];
    if (elementsX + i > 0 && elementsX + i < 15) {
      a[0] = elementsX + i;
      a[1] = elementsY;
    }
    listofnewcoords.push([...a]);
  }
  for (i = -1; i < 2; i = i + 2) {
    let a = [];
    if (elementsY + i > 0 && elementsY + i < 15) {
      a[0] = elementsX;
      a[1] = elementsY + i;
    }
    listofnewcoords.push([...a]);
  }
  return listofnewcoords;
}

function prettyColours(event) {
  if (event.type == "mouseover") {
    event.target.style.backgroundColor = "#70AA70";
  }
  if (event.type == "mouseleave") {
    if (event.target.id == "middle") {
      event.target.style.backgroundColor = "red";
    } else if (event.target.id == "tripleWord") {
      event.target.style.backgroundColor = "magenta";
    } else if (event.target.id == "tripleLetter") {
      event.target.style.backgroundColor = "blue";
    } else if (event.target.id == "doubleWord") {
      event.target.style.backgroundColor = "pink";
    } else if (event.target.id == "doubleLetter") {
      event.target.style.backgroundColor = "lightblue";
    } else {
      event.target.style.backgroundColor = "beige";
    }
  }
}

for (i = 0; i < numberOfDivs; i++) {
  if (y < 15) {
    MiTA[1] = x;
    MiTA[2] = y;
  } else {
    y = 0;
    x++;
    MiTA[1] = x;
    MiTA[2] = y;
  }
  y++;
  MaTA[i] = [...MiTA];
  MiTA[0] = new tile(MaTA[i][1], MaTA[i][2], "tile").myself; //done this way round to ensure that when the arrays x,y changes it changes the tiles (i think)
  MaTA[i] = [...MiTA];

  //pretty colours
  MaTA[i][0].addEventListener("mouseover", (event) => {
    prettyColours(event);
  });
  MaTA[i][0].addEventListener("mouseleave", (event) => {
    prettyColours(event);
  });

  //onclick
  MaTA[i][0].addEventListener("mousedown", (event) => {
    if (isSomethingSelected() == true) {
      // coords [[x,y],[x,y]...]
      let self = event.target;
      let index;
      for (c = 0; c < MaTA.length; c++) {
        if (MaTA[c][0] === self) {
          index = c;
        }
      }
      let neighbour = [];
      let placeable = false;

      let coords = getAdjascentCoords([MaTA[index][1], MaTA[index][2]]);

      for (a = 0; a < coords.length; a++) {
        for (b = 0; b < MaTA.length; b++) {
          if (MaTA[b][1] == coords[a][0] && MaTA[b][2] == coords[a][1]) {
            neighbour = MaTA[b];
          }
        }
        if (neighbour[3] != undefined) {
          placeable = true;
          if (![...neighbour[3].classList].includes("thisturn")) {
            neighbour[3].classList.add("thisturn");
          }
        }
      }

      if (MaTA[index][1] == 7 && MaTA[index][2] == 7) {
        placeable = true;
      }

      const lettersRN = document.getElementsByClassName("letter");

      if (placeable == true) {
        let selected = findSelected();
        for (let f = 1; f < 8; f++) {
          if (MaRA[0][f][2] != undefined) {
            if (selected == MaRA[0][f][2][0]) {
              MaRA[0][f][2][0] = undefined;
            }
          }
        }
        for (let f = 1; f < 8; f++) {
          if (MaRA[1][f][2] != undefined) {
            if (selected == MaRA[1][f][2][0]) {
              MaRA[1][f][2][0] = undefined;
            }
          }
        }

        selected.classList.add("thisturn");
        selected.style.top = "5px";
        selected.style.left = "5px";
        event.target.appendChild(selected);
        selected.id = "";
        MaTA[index][3] = selected;
      }
    }
  });
  //might aswel draw them in the same for loop
  //coords from top left starting at 0

  let tripleWordCoords = [
    [0, 0],
    [0, 7],
    [0, 14],
    [7, 0],
    [14, 0],
    [7, 14],
    [14, 14],
    [14, 7],
  ];
  let tripleLetterCoords = [
    [5, 1],
    [5, 5],
    [5, 9],
    [5, 13],
    [9, 1],
    [9, 5],
    [9, 9],
    [9, 13],
    [13, 5],
    [13, 9],
    [1, 5],
    [1, 9],
  ];
  let doubleWordCoords = [
    [1, 1],
    [2, 2],
    [3, 3],
    [4, 4],
    [10, 4],
    [11, 3],
    [12, 2],
    [13, 1],
    [1, 13],
    [2, 12],
    [3, 11],
    [4, 10],
    [10, 10],
    [11, 11],
    [12, 12],
    [13, 13],
  ];
  let doubleLetterCoords = [
    [3, 0],
    [11, 0],
    [0, 3],
    [0, 11],
    [2, 6],
    [2, 8],
    [3, 7],
    [3, 14],
    [6, 2],
    [6, 6],
    [6, 8],
    [6, 12],
    [7, 3],
    [7, 11],
    [8, 2],
    [8, 6],
    [8, 8],
    [8, 12],
    [11, 7],
    [11, 14],
    [12, 6],
    [12, 8],
    [14, 3],
    [14, 11],
  ];

  for (let tw = 0; tw < tripleWordCoords.length; tw++) {
    if (x == tripleWordCoords[tw][0] && y - 1 == tripleWordCoords[tw][1]) {
      MaTA[i][0].id = "tripleWord";
      MaTA[i][0].textContent = "TW";
    }
  }
  for (let tl = 0; tl < tripleLetterCoords.length; tl++) {
    if (x == tripleLetterCoords[tl][0] && y - 1 == tripleLetterCoords[tl][1]) {
      MaTA[i][0].id = "tripleLetter";
      MaTA[i][0].textContent = "TL";
    }
  }
  for (let dw = 0; dw < doubleWordCoords.length; dw++) {
    if (x == doubleWordCoords[dw][0] && y - 1 == doubleWordCoords[dw][1]) {
      MaTA[i][0].id = "doubleWord";
      MaTA[i][0].textContent = "DW";
    }
  }
  for (let dl = 0; dl < doubleLetterCoords.length; dl++) {
    if (x == doubleLetterCoords[dl][0] && y - 1 == doubleLetterCoords[dl][1]) {
      MaTA[i][0].id = "doubleLetter";
      MaTA[i][0].textContent = "DL";
    }
  }
  if (x == 7 && y - 1 == 7) {
    MaTA[i][0].id = "middle";
    MaTA[i][0].textContent = "*";
  }
  rootDiv.appendChild(MaTA[i][0]);
}

const Letters = [];
const MiLA = []; //minor letter array
const MaLA = []; //self explanitory

function addLetter(Letter, Amount) {
  for (i = 0; i < Amount; i++) {
    Letters.push(Letter);
  }
}

//creating a list of all the letters available in scrabble
addLetter("a", 9);
addLetter("b", 2);
addLetter("c", 2);
addLetter("d", 4);
addLetter("e", 12);
addLetter("f", 2);
addLetter("g", 3);
addLetter("h", 2);
addLetter("i", 9);
addLetter("j", 1);
addLetter("k", 1);
addLetter("l", 4);
addLetter("m", 2);
addLetter("n", 6);
addLetter("o", 8);
addLetter("p", 2);
addLetter("q", 1);
addLetter("r", 6);
addLetter("s", 4);
addLetter("t", 6);
addLetter("u", 4);
addLetter("v", 2);
addLetter("w", 2);
addLetter("x", 1);
addLetter("y", 2);
addLetter("z", 1);
const val1 = ["a", "e", "i", "o", "u", "l", "n", "s", "t", "r"];
const val2 = ["d", "g"];
const val3 = ["b", "c", "m", "p"];
const val4 = ["f", "h", "v", "w", "y"];
const val5 = ["k"];
const val8 = ["j", "x"];
const val10 = ["q", "z"];

//array of [ [ letterobject, letter, user, selected, value], [], ....]
for (let i = 0; i < Letters.length; i++) {
  MiLA[1] = Letters[i];
  MiLA[2] = undefined;
  MiLA[3] = false; //onrack
  MiLA[4] = false; //redundant
  MiLA[5] = false;

  let L = Letters[i];

  if (val1.includes(L)) {
    //.find returns undefined if it cant find the value
    MiLA[6] = 1;
  }
  if (val2.includes(L)) {
    MiLA[6] = 2;
  }
  if (val3.includes(L)) {
    MiLA[6] = 3;
  }
  if (val4.includes(L)) {
    MiLA[6] = 4;
  }
  if (val5.includes(L)) {
    MiLA[6] = 5;
  }
  if (val8.includes(L)) {
    MiLA[6] = 8;
  }
  if (val10.includes(L)) {
    MiLA[6] = 10;
  }
  MiLA[0] = new letterTile(0, 0, Letters[i] + "\n" + MiLA[6]).myself; //the \n gets converted automatically
  MiLA[0].addEventListener("mousedown", (event) => {
    thisLetter = event.target;
    if ([...thisLetter.parentNode.classList].includes("tile") == false) {
      if (thisLetter.innerText != "") {
        if (isSomethingSelected() == false) {
          thisLetter.id = "selected";
        } else if (
          isSomethingSelected() == true &&
          thisLetter.id != "selected"
        ) {
          findSelected().id = "";
          thisLetter.id = "selected";
        } else if (isSomethingSelected() == true) {
          thisLetter.id = "";
        }
      }
    }
  });
  MaLA[i] = [...MiLA]; //makes a copy of the data not a reference to the og value
}

//change the value of user to either 1/2 for 14 of the tiles to asign them to a user
i = 0;
while (i < 7) {
  let x = Math.floor(Math.random() * MaLA.length);

  if (MaLA[x][2] != undefined) {
    i = i - 1;
  }
  if (MaLA[x][2] == undefined) {
    MaLA[x][2] = 1;
  }
  i++;
}
i = 0;
while (i < 7) {
  let x = Math.floor(Math.random() * MaLA.length);

  if (MaLA[x][2] != undefined) {
    i = i - 1;
  }
  if (MaLA[x][2] == undefined) {
    MaLA[x][2] = 2;
  }
  i++;
}

//create the game start button
const stButton = document.createElement("button"); //called it this so i can press tab without it coming up with "require blah blah blah"
stButton.textContent = "start";
stButton.className = "startButton";

document.body.appendChild(stButton);

//create a function to make the racks
const MaRA = [];
const MiRA = [];

//create array of racks, linked to their letters arrays (4?d array)
/*layers
1) racks (1 or 2)
2) rackDiv, containers(7), amountOfLetters
3(containers) xpos,ypos, lettercontainter
4(lettercontainer) line 38 

i know its confusing but its the best way for me (personally) to keep track of it idk
its basically immitating the nestling system in html but im also adding some of my own "metadata" about stuff. DEFINITELY a better way to do it than this
*/
function instantiateRacks() {
  for (i = 0; i < 2; i++) {
    MiRA[0] = new rack(900, (i + 1) * 250, i + 1);
    MiRA[8] = 0;

    for (a = 1; a <= 7; a++) {
      MiRA[a] = [10 + 50 * (a - 1), 10];
    }

    MaRA[i] = [...MiRA];
    document.body.appendChild(MaRA[i][0].myself);
  }
  console.log(MaRA);
}

//add letters to their racks
function addLettersToRacks() {
  for (i = 0; i < MaLA.length; i++) {
    if (MaLA[i][2] != undefined) {
      //if its asigned to a rack

      if (MaLA[i][2] == 1) {
        //if its p1's
        let current = MaRA[0][8]; //get amount of current letters contained
        MaRA[0][current + 1].push(MaLA[i]); //push to rack 1 list
        MaLA[i][4] = true; //say its on the rack <= allowed to do it like this because of shallow referencing concept
        MaRA[0][8] = current + 1; //iterate keeping track of letters
      }
      if (MaLA[i][2] == 2) {
        //if its p2's
        let current = MaRA[1][8];
        MaRA[1][current + 1].push(MaLA[i]);
        MaLA[i][4] = true;
        MaRA[1][8] = current + 1;
      }
    }
  }
}

//add the letters to the document
//sidenote this cuntion took me around 200 lines in a previous iteration. This is better even if its scuffed :l
function instantiateLetters() {
  for (i = 0; i < 7; i++) {
    //p1
    let thisLetter = MaRA[0][i + 1][2][0]; //thisLetter = the first letter meant to be in the rack
    thisLetter.style.left = MaRA[0][i + 1][0] + "px"; //xpos = xpos px |simple
    thisLetter.style.top = MaRA[0][i + 1][1] + "px"; //ypos = ypos px |simple
    MaRA[0][0].myself.appendChild(thisLetter); //append to the correct rack
  }
  for (i = 0; i < 7; i++) {
    //p2
    let thisLetter = MaRA[1][i + 1][2][0];
    thisLetter.style.left = MaRA[1][i + 1][0] + "px";
    thisLetter.style.top = MaRA[1][i + 1][1] + "px";
    MaRA[1][0].myself.appendChild(thisLetter);
  }
}

function hide(rack) {
  const thisRack = document.getElementById(rack);
  const LL = [...thisRack.getElementsByClassName("letter")];
  for (let i = 0; i < LL.length; i++) {
    LL[i].classList.add("hidden");
    LL[i].classList.remove("letter");
  }
}
function unhide(rack) {
  const thisRack = document.getElementById(rack);
  const LL = [...thisRack.getElementsByClassName("hidden")];
  for (let i = 0; i < LL.length; i++) {
    LL[i].classList.add("letter");
    LL[i].classList.remove("hidden");
  }
}

//create the turn buttons (turns controlled by a different file)]
const turnButtons = [];
function createTurnButtons() {
  for (i = 0; i < 2; i++) {
    let thisTurn = new turnButton(
      900,
      (i + 1) * 250 + 70,
      "player" + (i + 1) + " end turn"
    );
    turnButtons.push(thisTurn.myself);
    document.body.appendChild(turnButtons[i]);
    turnButtons[i].addEventListener("mousedown", (event) => {
      turnControl(event);
    });
  }
}
function createRecallButton() {
  let RB = document.createElement("button");
  RB.style.position = "absolute";
  RB.style.left = "900px";
  RB.style.top = "400px";
  RB.style.height = "50px";
  RB.textContent = "reset turn";
  document.body.appendChild(RB);
  RB.addEventListener("mousedown", (event) => {
    returnLetters(event);
  });
}

function isSomethingSelected() {
  let listofcurrentletters = document.getElementsByClassName("letter");
  for (a = 0; a < listofcurrentletters.length; a++) {
    if (document.getElementsByClassName("letter")[a].id == "selected") {
      return true;
    }
  }
  return false;
}
function findSelected() {
  let listofcurrentletters = document.getElementsByClassName("letter");
  for (i = 0; i < listofcurrentletters.length; i++) {
    if (listofcurrentletters[i].id == "selected") {
      return listofcurrentletters[i];
    }
  }
}

//add all these ^^ functons to the start game button in that order
stButton.addEventListener("mousedown", (event) => {
  instantiateRacks();
  addLettersToRacks();
  instantiateLetters();
  createTurnButtons();
  createRecallButton();
  hide(2);
  document.body.removeChild(event.target); //remove the button after its pressed
});

function replaceLetters(rack) {
  const thisRack = document.getElementById(rack);
  const numberonboard = [...document.getElementsByClassName("letter thisturn")]
    .length; //get the amount of letters placed down this turn (not the amount of active letters)
  const elementsMissing = [];

  for (let f = 1; f < 8; f++) {
    if (MaRA[rack - 1][f][2][0] == undefined) {
      elementsMissing.push(f);
    }
  } //array of missing elements in the array (their position on the rack basically)

  let i = 0;
  console.log(numberonboard);
  while (i < numberonboard) {
    let x = Math.floor(Math.random() * MaLA.length);

    if (MaLA[x][2] != undefined) {
      i = i - 1;
    }
    if (MaLA[x][2] == undefined) {
      MaLA[x][2] = +rack;
      MaLA[x][4] = true;

      const curElement = elementsMissing[elementsMissing.length - 1];

      MaLA[x][0].style.left = MaRA[rack - 1][curElement][0] + "px";
      MaLA[x][0].style.top = MaRA[rack - 1][curElement][1] + "px";

      MaRA[rack - 1][curElement][2] = MaLA[x];

      thisRack.appendChild(MaLA[x][0]);
      elementsMissing.pop();
    }
    i++;
  } //making the right number of elements in the Letter array belong to the right player

  //[3]
}

// [[word,[startCoords],direction (deg), length]]
const wordsOnBoard = [];

function turnControl(e) {
  //console.log(e.target);
  let placedthisturn = [];
  const listOfTiles = document.getElementsByClassName("tile");
  const len1 = listOfTiles.length;
  for (let i = 0; i < len1; i++) {
    if (listOfTiles[i].children[0] != undefined) {
      //if the searched tile has a letter in it

      const lettersClasses = [...listOfTiles[i].children[0].classList]; //create a list of the classes of that letter

      if (lettersClasses.includes("thisturn")) {
        //if it has the class "thisturn"

        const thisLetter = listOfTiles[i].children[0];
        placedthisturn.push(thisLetter); //add the letter to the placed this turn list
      }
    }
  }

  //to find out if its a valid word or not, im going to take the coorinates of the parent nodes. For every set of 2 tiles, if the gradients are the same,
  //we can conclude its a straight line

  const len2 = placedthisturn.length;
  let Grads = [],
    x,
    y,
    prev,
    prevparent,
    cur,
    curparent;
  const Ypoints = [];
  const Xpoints = [];
  let W1, W2;

  for (let i = 1; i < len2; i++) {
    prev = placedthisturn[i - 1];
    prevparent = prev.parentElement;
    cur = placedthisturn[i];
    curparent = cur.parentElement;

    // for later
    Ypoints.push(prevparent.style.top.replace("px", ""));
    Xpoints.push(prevparent.style.left.replace("px", ""));
    // dy/dx
    y =
      curparent.style.top.replace("px", "") -
      prevparent.style.top.replace("px", ""); //string manipulation so we can do 456-700 instead of "456px" yeah (ty for types like this js i love you)
    x =
      curparent.style.left.replace("px", "") -
      prevparent.style.left.replace("px", "");
    Grads.push(y / x);
  }

  //add the last coord its jank but idrc
  Ypoints.push(curparent.style.top.replace("px", ""));
  Xpoints.push(curparent.style.left.replace("px", ""));
  console.log(Ypoints, Xpoints);

  const len3 = Grads.length;
  let straightLine = true;

  for (let i = 1; i < len3; i++) {
    if (Grads[i] != Grads[i - 1]) {
      straightLine = false; //validating if the line is straight (actually works im so smart)
    }
  }
  let validWord = false;
  if (straightLine) {
    let len5 = Xpoints.length;
    const orderedWord1 = [];

    for (let i = 0; i < len2; i++) {
      //reusing vars ew dangerous

      cur = placedthisturn[i];
      curparent = cur.parentElement;
      x = curparent.style.left.replace("px", "");
      y = curparent.style.top.replace("px", "");

      for (let a = 0; a < len5; a++) {
        if (x == Xpoints[a] && y == Ypoints[a]) {
          //this only works because Xpoints and Ypoints are both ordered smallest to largest
          orderedWord1[a] = cur.textContent[0];
        }
      }
    }
    //now we have 1 ordered word array, just need to account for if its backwards#

    const orderedWord2 = [];

    for (let i = orderedWord1.length - 1; i > -1; i = i - 1) {
      orderedWord2.push(orderedWord1[i]);
    }
    console.log(orderedWord1, orderedWord2);

    //dictionary time!

    W1 = orderedWord1.join("").toUpperCase();
    W2 = orderedWord2.join("").toUpperCase();
    console.log(W1, W2);

    if (dictionaryArray.includes(W1)) {
      validWord = true;
      console.log(W1);
    }
    if (dictionaryArray.includes(W2)) {
      validWord = true;
      console.log(W2);
    }
  }
  if (validWord && straightLine) {
    //calculate score
    let doubleword = false;
    let tripleword = false;
    let totalScore = 0;
    for (let i = 0; i < len2; i++) {
      let letterScore = +placedthisturn[i].textContent[1];
      let thisTile = placedthisturn[i].parentNode;

      if (thisTile.id == "tripleLetter") {
        letterScore = letterScore * 3;
      }
      if (thisTile.id == "doubleLetter") {
        letterScore = letterScore * 2;
      }
      if (thisTile.id == "tripleWord") {
        tripleword = true;
      }
      if (thisTile.id == "doubleWord") {
        doubleword = true;
      }
      totalScore = totalScore + letterScore;
    }
    if (doubleword) {
      totalScore = totalScore * 2;
    }
    if (tripleword) {
      totalScore = totalScore * 3;
    }

    //commit changes

    const theturn = e.target.innerText[6];
    replaceLetters(theturn);
    for (let i = 0; i < len2; i++) {
      placedthisturn[i].classList.remove("thisturn", "letter");
      placedthisturn[i].classList.add("onboard");
    }

    wordsOnBoard.push([W1]);

    //change turns
    if (theturn == 1) {
      hide(1);
      unhide(2);
      score1.textContent = +score1.textContent + totalScore;
    }
    if (theturn == 2) {
      hide(2);
      unhide(1);
      score2.textContent = +score2.textContent + totalScore;
    }
  }
  if (!validWord) {
    v.backgroundColor = "red";
  }
  if (!straightLine) {
    v.backgroundColor = "red";
  }
}

function returnLetters(event) {
  const tilesInPlay = [...document.getElementsByClassName("thisturn letter")];
  const tilesActive = [...document.getElementsByClassName("thisturn")];
  let elementsMissing = [];
  let rackInUse;

  for (let i = 0; i < 2; i++) {
    for (let f = 1; f < 8; f++) {
      if (MaRA[i][f][2][0] == undefined) {
        elementsMissing.push(f);
        rackInUse = i + 1;
      }
    }
  } //find out where and which rack shi- stuff is missing from

  const thisRack = document.getElementById(rackInUse);
  for (let i = 0; i < elementsMissing.length; i++) {
    for (let a = 0; a < MaTA.length; a++) {
      if (tilesInPlay[i].parentNode == MaTA[a][0]) {
        MaTA[a][3] = undefined;
      }
    }

    MaRA[rackInUse - 1][elementsMissing[i]][2][0] = tilesInPlay[i];

    tilesInPlay[i].style.top =
      MaRA[rackInUse - 1][elementsMissing[i]][1] + "px";
    tilesInPlay[i].style.left =
      MaRA[rackInUse - 1][elementsMissing[i]][0] + "px";
    tilesInPlay[i].style.backgroundColor = "brown";
    thisRack.appendChild(tilesInPlay[i]);
    v.backgroundColor = "green";
  } //this took so much brainpower, had to rewrite a bunch of stuff elsewhere too

  for (let i = 0; i < tilesActive.length; i++) {
    tilesActive[i].classList.remove("thisturn");
  }
}