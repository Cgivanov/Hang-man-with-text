/* 
author: ChristianIvanov
Date: 09/17/2025
Descrption:  knock off wheel of fourtune game for 1-3 players.
*/


const prompt = require("prompt-sync")({ sigint: true });
const fs  = require("fs");

// spin the wheel function
function spinTheWheel() {
    const wheelValues= [
        0, 650,900 ,700 ,500, 800, 500, 
        650, 500,900, 0,1000,
        500,900,700,600,8000,500,
        700,600,550,500,900
    ];
    const randomIndex = Math.floor(Math.random() *  wheelValues.length);
    return wheelValues[randomIndex]
}

// load dictonary from file
function loadDictionary() {
const data = fs.readFileSync("dictionary.txt", "utf8");
return fs.readFileSync("dictionary.txt","utf8");
}

// set up Player
function setupPlayers() {
    console.log("Welcome to Cpi310 fortunate wheel");
    let numPlayers;
    do {
        numPlayers = parseInt(prompt("How many players (1-3)?"));
    } while (isNaN(numPlayers) || numPlayers < 1 || numPlayers >3);

    const players = [];
        for (let i = 0; i < numPlayers; i ++) {
            const name = prompt(`enter name for Player ${i +1}:` );
            players.push({
                name: name,
                roundScore: 0,
                totalScore: 0
            });
        }
    return players;
    }

// play one round

function playRound(players, dictionary) {
const puzzleWord = dictionary [Math.floor(Math.random() * dictionary.length)];
const revealed = Array(puzzleWord.length).fill(false);
let roundOver = false;
let currentPlayerIndex = 0;

while (!roundOver) {
    let player = players [currentPlayerIndex];
    console.log(`\nPlayer ${currentPlayerIndex +1} - ${player.name} its your turn!`);
    console.log(`Your round score is ${player.roundScore}`);

    // show the puzzle
    let display = puzzleWord.split("").map((ch, i) => revealed[i] ? ch: "-").join("");
    console.log("Puzzle: " + display);
    prompt("Press ENTER to spin the wheel");;
    let spin = spinTheWheel();
console.log(`You spun [${spin}]`)


if  (spin === 0) {
    console.log("bankrupt! you score is 0")
    player.roundScore = 0;
    currentPlayerIndex = (currentPlayerIndex +1) % players.length;
    continue;
}
let guess = prompt( "what letter would like to guess "). toUpperCase();
let matches = 0;
for (let i=0;  i < puzzleWord.length; i++) {
if (puzzleWord[i] === guess &&  !revealed[i]) {
  revealed[i] = true;
matches++;
}
}
if (matches > 0) {
    console.log (`There are ${matches} matches`);
    player.roundScore += spin * matches;
} else {
console.log(" there are no matches");
let penalty = Math.floor(spin /2);
player.roundScore = Math.max(0, player.roundScore - penalty);
currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
}
 /// show upfdated puzzle
 display = puzzleWord.split ("").map((ch, i) => revealed[i] ? ch: "-"). join("");
 console.log(`Puzzle:  ${display}`);

 // win
if (display === puzzleWord)  {
        console.log (`${player.name} solved it  good job`);
        player.totalScore += player.roundScore;
        player.roundScore = 0;
        roundOver = true;
}
// after coorect guess has to option spin again or solbe
if (matches > 0) {
let choice = prompt(" Enter 1 to spin & guess again or 2 to solve: ");
if (choice === "2") { 
    let attempt = prompt(" Enter the word: "). toUpperCase();
    if (attempt === puzzleWord) {
        console.log("Correct you solve the puzzle");
        player.totalScore += player.roundScore;
        player.roundScore = 0;
        roundOver = true;
    } else {
    console.log(" That is not the word :(");
    player.roundScore = 0; // lose round points
    }
    }
}
}
}
// play full game
function playgame() {
    const players = setupPlayers();
    const dictionary  = loadDictionary();

    for(let round = 1; round <= 3; round ++) {
        console.log(`\n=== round ${round} ===`);
        playRound(players, dictionary);
    }

    console.log("\n=== Final Scores ===");
    players.forEach(p => {
    console.log(`${p.name}: ${p.totalScore}`);
    });
    let winner = players.reduce((a, b) => a.totalScore > b.totalScore ? a : b);
    console.log(`\n Winner: ${winner.name} with ${winner.totalScore} points! `);
}

// start game
playgame();