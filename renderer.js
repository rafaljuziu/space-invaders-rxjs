export const renderer = (function () {

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

  return {
    renderInitialGame: renderInitialGame,
    createLaser: function createLaser() {
      let laser = document.createElement('i');
      let player = document.querySelector('.player');
      laser.style.top = (player.getBoundingClientRect().top) + 'px';
      laser.style.left = (player.getBoundingClientRect().left + 42) + 'px';
      laser.classList = 'fa fa-arrows-v laser';
      laser.id = 'laser' + Math.random();
      document.body.appendChild(laser);
      return laser;
    },
    removeLaser: function (laser) {
      let element = document.getElementById(laser.id);
      document.body.removeChild(element);
    }
  };
})();