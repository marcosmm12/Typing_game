const quotes = [
    'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
    'There is nothing more deceptive than an obvious fact.',
    'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
    'I never make exceptions. An exception disproves the rule.',
    'What one man can invent another can discover.',
    'Nothing clears up a case so much as stating it to another person.',
    'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
];

//store the list of words and the index of the word the player is currently typing
let words = [];
let wordIndex = 0;

//the starting time
let startTime = Date.now();

//page elements
const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const historicalScoresTable = document.getElementById('historical_scores_table').getElementsByTagName('tbody')[0];
const typedPlayerNameElement = document.getElementById('player_name');

//Player name;
let player_name = '';

//Booleans for the control of the game
let typedName = false;
let startedGame = false;

//Start button
document.getElementById('start').addEventListener('click', () => {
    if (typedName === true) {
        messageElement.innerText = '';
        startedGame = true;
        //get a random quote
        const quoteIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[quoteIndex];
        //obtain every word from the quote
        words = quote.split(' ');
        //reset the word index
        wordIndex = 0;

        //UI update
        //create an array of span from the words (this will allow us to have a word with one style and the others with another one)
        quoteElement.innerHTML = '';
        const spanWords = words.forEach(word => {
            const span = document.createElement('span');
            span.innerText = word + ' ';
            quoteElement.appendChild(span);
        })
        //highlight the first word
        quoteElement.childNodes[0].className = 'highlight';
        //clear any message
        messageElement.innerText = '';

        //Setup the textbox
        //clear the textbox
        typedValueElement.value = '';
        //set focus (put the mouse in the textbox to start writing automatically)
        typedValueElement.focus();
        
        //Start the timer
        startTime = new Date().getTime();
    }
    else {
        messageElement.innerText = `ERROR! You have to introduce a player name and click "Submit".`;
    }
});

//Input of thw words
typedValueElement.addEventListener('input', () => {
    //current word
    const currentWord = words[wordIndex];
    //current value
    const typedValue = typedValueElement.value;

    //we are at the end of the quote
    if (typedValue === currentWord && wordIndex === words.length-1) {
        const totalTime = new Date().getTime() - startTime;
        const message = `CONGRATULATIONS! You finished in ${totalTime / 1000} seconds.`;
        messageElement.innerText = message;
        //actualize local storage
        const scorePlayer = {
            time: (totalTime/1000).toFixed(2),
            playerID: player_name
        };
        updateHighScores(scorePlayer);
        startedGame = false;
    }
    //we are at the end of a word but we still have words remaining
    else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
        //clear typedValueElement for a new word
        typedValueElement.value = '';
        //update UI interface
        quoteElement.childNodes[wordIndex].className = '';
        ++wordIndex;
        quoteElement.childNodes[wordIndex].className = 'highlight';
    }
    //currently correct
    else if (currentWord.startsWith(typedValue)) {
        typedValueElement.className = '';
    }
    //currently incorrect
    else {
        typedValueElement.className = 'error';
    }
});

//Update of the table
function updateHighScores(scorePlayer) {
    let correct_pos = -1;

    //Find the correct position
    const rows = historicalScoresTable.rows;
    for (let i = 0; i < rows.length && correct_pos === -1; i++) {
        const currentScore = parseFloat(rows[i].cells[1].innerHTML);
        if (currentScore > parseFloat(scorePlayer.time)) correct_pos = i;
    }

    //Insert the row
    const newRow = historicalScoresTable.insertRow(correct_pos);
    const indexCell = newRow.insertCell(0);
    const timeCell = newRow.insertCell(1);
    const playerCell = newRow.insertCell(2);

    indexCell.innerText = correct_pos+1;
    timeCell.innerText = scorePlayer.time;
    playerCell.innerText = scorePlayer.playerID;

    //Update the index of the rows
    for (let i = correct_pos+1; i < rows.length; i++) {
        rows[i].cells[0].innerText = parseInt(rows[i].cells[0].innerText)+1;
    }

    //Update the table interface
    for (let i = 0; i < rows.length; i++) {
        if (parseInt(rows[i].cells[0].innerText) === 1) rows[i].className = 'firstPlace';
        else if (parseInt(rows[i].cells[0].innerText) === 2) rows[i].className = 'secondPlace';
        else if (parseInt(rows[i].cells[0].innerText) === 3) rows[i].className = 'thirdPlace';
        else rows[i].className = 'otherRows';
    } 
}

//Input of the player name
document.getElementById('submit').addEventListener('click', () => {
    if (typedPlayerNameElement.value !== '') {
        messageElement.innerText = '';
        typedName = true;
        player_name = typedPlayerNameElement.value;
        typedPlayerNameElement.className = '';
    }
    else {
        messageElement.innerText = `ERROR! You have to introduce a player name and then click "Submit".`;
        typedPlayerNameElement.className = 'error';
        typedName = false;
    }
});

//Control of the player name textbox
typedPlayerNameElement.addEventListener('click', () => {
    if (startedGame) {
        messageElement.innerText = `ERROR! You have to continue typing your quote`;
        typedValueElement.focus();
    }
    else {
        messageElement.innerText = '';
    }
});