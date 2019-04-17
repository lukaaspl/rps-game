class Game {
    active = false;

    // set player name
    setUsername = username => this.playerName = username;

    isGameActive = () => this.gameActive;

    start = () => {
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
    getComputerHand = () => {
        const options = ['rock', 'paper', 'scissors'];
        const randomIndex = Math.floor(Math.random() * options.length);

        return options[randomIndex];
    }

    // when user picks a hand
    pickHand = option => {
        // set game state to active
        this.active = true;

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

        // hands shaking animation
        this.shakeHands(hands.user, hands.computer);

        setTimeout(() => {
            detailsNode.innerHTML = `${hands.user.option} <span>vs.</span> ${hands.computer.option}`;
            resultNode.textContent = resultToDisplay;

            // add point for winner
            if (gameResult !== 'draw')
                this.statistics.
                    addPoint(gameResult === 'win' ? 'user' : 'computer');
        }, 2000);
    }

    // shake hands animation and set propal hand image
    shakeHands = (userHand, computerHand) => {
        const hands = [userHand.node, computerHand.node];

        hands.forEach((hand, index) => {
            hand.classList.add('shaked');

            hand.addEventListener('animationend', () => {
                hand.classList.remove('shaked');

                hands[0].src = `assets/${userHand.option}.png`;
                hands[1].src = `assets/${computerHand.option}.png`;
            });
        });
    }

    // compare hands and get the game result
    getResult = (userHand, computerHand) => {
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
    _userPoints = 0;
    _computerPoints = 0;

    // getters
    getUserPoints = () => this._userPoints;
    getComputerPoints = () => this._computerPoints;

    // add points and update view 
    addPoint = pointFor => {
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

// start game as dev
// const devGame = new Game();
// devGame.setUsername('Dev')
// devGame.start();

introForm.addEventListener('submit', e => {
    e.preventDefault();

    const playerName = document.getElementById('username').value;
    game.setUsername(playerName);
    game.start();
});

// select option section
const optionButtons = document.querySelectorAll('.options button');

optionButtons.forEach(button => {
    // console.log(button.dataset.option);
    button.addEventListener('click', game.pickHand
        .bind(this, button.dataset.option));
});