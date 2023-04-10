let blackjackGame = {
    "you": { 'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0 },
    "dealer": { 'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0 },
    "card": ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    "cardsMap": { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11] },
    "wins": 0,
    "loses": 0,
    "draws": 0,
    "isStand": false,
    "turnOver": false,
}

const YOU = blackjackGame['you'];
const DEALER = blackjackGame['dealer'];

const hitSound = new Audio('./sounds/swish.m4a');
const winSound = new Audio('./sounds/cash.mp3');
const lostSound = new Audio('./sounds/aww.mp3');

document.querySelector("#hit-button").addEventListener('click', blackjackHit);

document.querySelector("#stand-button").addEventListener('click', dealerLogic);

function blackjackHit() {
    if (blackjackGame['isStand'] === false) {
        let card = randomCard();
        showCard(YOU, card);
        updateScore(card, YOU);
        showScore(YOU);
    }

}

document.querySelector('#deal-button').addEventListener('click', blackJackDeal);


function showCard(activePlayer, card) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `./images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    }

}

function blackJackDeal() {

    if (blackjackGame['turnOver'] === true) {
        blackjackGame['isStand'] = false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        yourImages.forEach(element => {
            element.remove();
        });
        dealerImages.forEach(element => {
            element.remove();
        });

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector("#your-blackjack-result").textContent = 0;
        document.querySelector("#your-blackjack-result").style.color = 'white';

        document.querySelector("#dealer-blackjack-result").textContent = 0;
        document.querySelector("#dealer-blackjack-result").style.color = 'white';

        document.querySelector("#play").textContent = "Let's play!";
        document.querySelector("#play").style.color = "black";

        blackjackGame['turnOver'] = false;
    }


}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['card'][randomIndex];
}

function updateScore(card, activePlayer) {
    //if adding 11 keeps me below 21,add,otherwise add 1.
    if (card === 'A') {
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) {
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        } else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    } else {
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }

    console.log(activePlayer['score']);
}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }

}


function sleep(ms) {
    return new Promise(resolve=> setTimeout(resolve,ms));
}

async function dealerLogic() {
    blackjackGame['isStand'] = true;

    while (DEALER['score'] < 15 && blackjackGame['isStand'] === true) {
        let card = randomCard();
        showCard(DEALER, card);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(1000);
    }
    blackjackGame['turnOver'] = true;
    let winner = computeWinner();
    showResult(winner);
}

//update the wins draws and loses.
//compute winner and return who just wons.
function computeWinner() {
    let winner;

    if (YOU['score'] <= 21) {
        //condition : when dealer bust but you are 21 or less than 21.
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            blackjackGame['wins']++;
            winner = YOU;
        } else if (YOU['score'] < DEALER['score']) {
            blackjackGame['loses']++;
            winner = DEALER;
        } else if (YOU['score'] == DEALER['score']) {
            blackjackGame['draws']++;

        }

        //condition:where user bust but dealer doesnt burst.
    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackjackGame['loses']++;
        winner = DEALER;
        //condition: when dealer and you both bust.
    } else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackGame['draws']++;
    }
    console.log(blackjackGame);
    return winner;
}


function showResult(winner) {
    if (blackjackGame['turnOver'] === true) {
        let message, messageColor;

        if (winner === YOU) {
            document.querySelector('#wins').textContent = blackjackGame['wins'];
            message = 'You Won!';
            messageColor = 'green';
            winSound.play();
        } else if (winner === DEALER) {
            document.querySelector('#loses').textContent = blackjackGame['loses'];
            message = 'You Lost!';
            messageColor = 'red';
            lostSound.play();
        } else {
            document.querySelector('#draws').textContent = blackjackGame['draws'];
            message = 'You Drew!';
            messageColor = 'black';
        }

        document.querySelector('#play').textContent = message;
        document.querySelector('#play').style.color = messageColor;
    }

}