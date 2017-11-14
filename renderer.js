export const renderer = (function () {

  function renderInitialGame(invaders) {
    renderBoard(invaders);
    renderPlayer();
  }

  function renderPlayer() {
    let player = document.createElement('i');
    player.classList = 'fa fa-rocket fa-4x player';
    document.querySelector('.container').appendChild(player);
  }

  function renderGame(gameState) {
    renderBoard(gameState.invaders);
    rerenderPlayer(gameState);
  }

  function renderBoard(invaders) {
    let allRows = document.querySelectorAll('div.invaders-row');
    if (allRows.length === 0) {
      allRows = createRowElements(invaders);
    }

    for (let i = 0; i < invaders.length; i++) {
      renderRow(invaders[i], allRows[i]);
    }
  }

  function createRowElements(invaders) {
    let allRows = [];
    for (let i = 0; i < invaders.length; i++) {
      let row = document.createElement('div');
      row.className = 'invaders-row';
      document.querySelector('.container').appendChild(row);
      allRows.push(row);
    }
    return allRows;
  }

  function renderRow(invadersRow, rowElement) {
    let invadersElements = rowElement.querySelectorAll('div.space-invader');
    if (invadersElements.length === 0) {
      invadersElements = createInvadersElements(invadersRow, rowElement);
    }

    for (let i = 0; i < invadersRow.length; i++) {
      renderInvader(invadersRow[i], invadersElements[i]);
    }
  }

  function createInvadersElements(invadersRow, rowElement) {
    let invadersElements = [];
    for (let i = 0; i < invadersRow.length; i++) {
      let invaderElement = document.createElement('div');
      invaderElement.classList = 'space-invader';
      if (!invadersRow[i].alive) {
        invaderElement.classList += ' dead';
      }
      rowElement.appendChild(invaderElement);
      invadersRow[i].element = invaderElement;
      invadersElements.push(invaderElement);
    }
    return invadersElements;
  }

  function renderInvader(invader, invaderElement) {
    invaderElement.classList = 'space-invader' + (invader.alive ? '' : ' dead');
  }

  function rerenderPlayer(gameState) {
    let player = document.querySelector('i.fa-rocket');
    player.style.left = getPlayerXOnPage(gameState.player.x);
  }

  function getPlayerXOnPage(playerX) {
    let position = (playerX - 50) * 5;
    return position + 'px';
  }

  return {
    renderInitialGame: renderInitialGame,
    rerenderGame: renderGame,
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