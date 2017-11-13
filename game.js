function Invader() {
  this.alive = true;
}

function Player() {
  this.x = 50;
  this.y = 50;
}

export const game = (function () {

  function renderInitialGame() {
    const board = this.state.invaders;
    for (let invadersRow of board) {
      renderRow(invadersRow);
    }
    renderPlayer();
  }

  function renderRow(invadersRow) {
    const row = document.createElement('div');
    row.className = 'invaders-row';
    for (let invader of invadersRow) {
      renderInvader(invader, row);
    }
    document.querySelector('.container').appendChild(row);
  }

  function renderInvader(invader, row) {
    let invaderElement = document.createElement('div');
    invaderElement.className = 'space-invader';
    if (!invader.alive) {
      invaderElement.className += ' dead';
    }
    row.appendChild(invaderElement);
  }

  function renderPlayer() {
    let player = document.createElement('i');
    player.classList = 'fa fa-rocket fa-4x';
    document.querySelector('.container').appendChild(player);
  }

  function createInvadersRow() {
    let row = [];
    for (let i = 0; i < 10; i++) {
      row.push(new Invader());
    }
    return row;
  }

  function createInvadersBoard() {
    let invaders = [];
    for (let i = 0; i < 6; i++) {
      let row = createInvadersRow();
      invaders.push(row);
    }
    return invaders;
  }

  return {
    state: {
      invaders: createInvadersBoard(),
      lives: 3,
      player: new Player()
    },
    renderInitialGame: renderInitialGame,
    move: function(direction) {
      this.state.player.x += direction;
      rerenderGame();
    },
    fire: () => {
      console.log('Pew pew');
    }
  };
})();

function rerenderGame() {
  let player = document.querySelector('i.fa-rocket');
  player.style.left = getPlayerXOnPage(game.state.player.x);
}

function getPlayerXOnPage(playerX) {
  let position = (playerX - 50) * 5;
  return position + 'px';
}