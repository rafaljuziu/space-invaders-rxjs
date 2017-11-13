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
    player.classList = 'fa fa-rocket fa-4x player';
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
    move: function (direction) {
      if (this.state.player.x + direction <= 100 && this.state.player.x + direction >= 0) {
        this.state.player.x += direction;
        rerenderGame();
      }
    },
    fire: () => {
      createLaser()
    },
    lasers: []
  };
})();

function createLaser() {
  let laser = document.createElement('i');
  laser.classList = 'fa fa-arrows-v laser';
  let player = document.querySelector('.player');
  laser.style.top = (player.getBoundingClientRect().top) + 'px';
  laser.style.left = (player.getBoundingClientRect().left + 42) + 'px';
  document.body.appendChild(laser);
  let id = game.lasers.push(laser) - 1;
  laser.id = 'laser' + id;
}

function rerenderGame() {
  let player = document.querySelector('i.fa-rocket');
  player.style.left = getPlayerXOnPage(game.state.player.x);
}

function getPlayerXOnPage(playerX) {
  let position = (playerX - 50) * 5;
  return position + 'px';
}