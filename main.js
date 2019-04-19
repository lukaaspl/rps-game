/**
 * 
 * Rock, Paper and Scissors JS Game
 * 2019
 * Made by Łukasz Roman (https://github.com/lukaaspl)
 * Feel free to use anything anywhere ;-)
 * 
 */

class Game {
    constructor() {
        this.active = false;
    }

    // set player name
    setUsername(username) {
        this.playerName = username;
    }

    // check if game was started
    isGameActive() {
        return this.gameActive;
    }

    start() {
        // set access to stats
        this.statistics = new Statistics();

        // fill player name
        const playerName = document.querySelector('.player-name');
        playerName.textContent = !this.playerName ? 'Player' : this.playerName;

        // game begin
        const intro = document.querySelector('.intro');
        const scores = document.querySelector('.scores');
        const gameContent = document.querySelector('.game-content');

        intro.classList.add('scaledOut');

        setTimeout(() => {
            gameContent.classList.remove('fadedOut');
            intro.style.display = "none";
        }, 500);

        setTimeout(() => scores.classList.remove('fadedOut'), 600);
    }

    // draw computer choice
    getComputerHand() {
        const options = ['rock', 'paper', 'scissors'];
        const randomIndex = Math.floor(Math.random() * options.length);

        return options[randomIndex];
    }

    // when user picks a hand
    pickHand(option) {
        // set game state to active
        this.active = true;

        // informations about picked hands and hands DOM nodes
        const hands = {
            user: {
                option,
                node: document.querySelector('.player-hand > img'),
            },
            computer: {
                option: this.getComputerHand(),
                node: document.querySelector('.computer-hand > img'),
            }
        };

        const gameResult = this.getResult(hands.user.option, hands.computer.option);
        const detailsNode = document.getElementById('details');
        const resultNode = document.getElementById('result');

        // swipe hands to rock before shaking
        hands.user.node.src = 'assets/rock.png';
        hands.computer.node.src = 'assets/rock.png';

        // generate message with result to display
        let resultToDisplay = `It's a draw!`;

        if (gameResult === 'win')
            resultToDisplay = `You win!`;
        else if (gameResult === 'lose')
            resultToDisplay = `You lose!`;

        // while game is processing
        this.processGame(hands.user, hands.computer);

        setTimeout(() => {
            detailsNode.innerHTML = `${hands.user.option} <span>vs.</span> ${hands.computer.option}`;
            resultNode.textContent = resultToDisplay;

            // add point for winner
            if (gameResult !== 'draw')
                this.statistics.
                    addPoint(gameResult === 'win' ? 'user' : 'computer');
        }, 2000);
    }

    // game is processing and waiting for result
    processGame(userHand, computerHand) {
        const hands = [userHand.node, computerHand.node];
        const buttons = document.querySelectorAll('.options > button');

        // lock buttons until previous round is finished
        buttons.forEach(button => button.setAttribute('disabled', ''));

        // shake hands animation
        hands.forEach((hand, index) => {
            hand.classList.add('shaked');

            // remove animation class after it ends
            hand.addEventListener('animationend', () => {
                hand.classList.remove('shaked');

                // set hands images to the choosen
                hands[0].src = `assets/${userHand.option}.png`;
                hands[1].src = `assets/${computerHand.option}.png`;

                // unlock buttons
                buttons.forEach(button => button.removeAttribute('disabled'));
            });
        });
    }

    // compare hands and get the game result
    getResult(userHand, computerHand) {
        const result = {
            draw: 'draw',
            win: 'win',
            lose: 'lose'
        };

        // check if hands are the same - draw
        if (userHand === computerHand)
            return result.draw;

        // check if rock
        if (userHand === 'rock' && computerHand === 'scissors')
            return result.win;

        // check if paper
        if (userHand === 'paper' && computerHand === 'rock')
            return result.win;

        // check if scissors
        if (userHand === 'scissors' && computerHand === 'paper')
            return result.win;

        // no condition met - user lost
        return result.lose;
    }
}

// operations on stats and game history
class Statistics {
    constructor() {
        this._userPoints = 0;
        this._computerPoints = 0;
    }

    // getters
    getUserPoints() {
        return this._userPoints;
    }

    getComputerPoints() {
        return this._computerPoints;
    }

    // add points and update view 
    addPoint(pointFor) {
        pointFor = pointFor.toString().toLowerCase();

        if (pointFor === 'user') {
            const userScoreNode = document.querySelector('.player-score');

            userScoreNode.textContent = ++this._userPoints;
            return this._userPoints;
        } else if (pointFor === 'computer') {
            const computerScoreNode = document.querySelector('.computer-score');

            computerScoreNode.textContent = ++this._computerPoints;
            return this._computerPoints;
        } else
            return false;
    }
}

// start game section
const introForm = document.querySelector('.intro form');
const game = new Game();

introForm.addEventListener('submit', e => {
    e.preventDefault();

    const playerName = document.getElementById('username').value;
    game.setUsername(playerName);
    game.start();
});

// select option section
const optionButtons = document.querySelectorAll('.options button');

optionButtons.forEach(button => {
    button.addEventListener('click', game.pickHand
        .bind(game, button.dataset.option));
});