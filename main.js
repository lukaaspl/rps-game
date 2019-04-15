class Game {
    gameActive = false;

    constructor(playerName) {
        this.playerName = playerName;
    }

    start = () => {
        // change game to active
        this.gameActive = true;

        // fill player name
        const playerName = document.querySelector('.player-name');
        playerName.textContent = this.playerName;

        // game begin
        const intro = document.querySelector('.intro');
        const scores = document.querySelector('.scores');
        const gameContent = document.querySelector('.game-content');

        intro.classList.add('fadeOut');

        setTimeout(() => {
            scores.classList.add('fadeIn');
            gameContent.classList.remove('fadeOut');
        }, 500);

    }
}

const introForm = document.querySelector('.intro form');

introForm.addEventListener('submit', e => {
    e.preventDefault();

    const playerName = document.getElementById('username').value;
    const game = new Game(playerName);
    game.start();
});