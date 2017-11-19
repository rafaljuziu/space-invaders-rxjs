export const renderer = (function () {

  const LASER_STEP = 10;

  function renderInitialGame(gameState) {
    renderBoard(gameState);
    gameState.player.element = renderPlayer();
  }

  function renderPlayer() {
    let player = document.createElement('i');
    player.classList = 'fa fa-rocket fa-4x player';
    document.querySelector('.container').appendChild(player);
    return player;
  }

  function renderGame(gameState) {
    renderBoard(gameState);
    rerenderPlayer(gameState);
  }

  function renderBoard(gameState) {
    rerenderContainer(gameState.invadersPosition);

    let allRows = document.querySelectorAll('div.invaders-row');
    if (allRows.length === 0) {
      allRows = createRowElements(gameState.invaders);
    }

    for (let i = 0; i < gameState.invaders.length; i++) {
      renderRow(gameState.invaders[i], allRows[i]);
    }
  }

  function rerenderContainer(invadersPosition) {
    let relativePositionOnPage = ((invadersPosition - 50) * 3 - 30);
    document.querySelector('.invaders-container').style.left = relativePositionOnPage + 'px';
  }

  function createRowElements(invaders) {
    let allRows = [];
    for (let i = 0; i < invaders.length; i++) {
      let row = document.createElement('div');
      row.className = 'invaders-row';
      document.querySelector('.invaders-container').appendChild(row);
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

  function createLaser(element) {
    let laser = document.createElement('i');
    laser.style.top = (element.getBoundingClientRect().top) + 'px';
    laser.style.left = (element.getBoundingClientRect().left + 42) + 'px';
    laser.classList = 'fa fa-arrows-v laser';
    laser.id = 'laser' + Math.random();
    document.body.appendChild(laser);
    return laser;
  }

  return {
    renderInitialGame: renderInitialGame,
    rerenderGame: renderGame,
    createInvaderLaser: function (invaderElement) {
      return createLaser(invaderElement);
    },
    createPlayerLaser: function (player) {
      return createLaser(player);
    },
    removeLaser: function (laser) {
      let element = document.getElementById(laser.id);
      document.body.removeChild(element);
    },
    moveLaserUp: function (laser) {
      laser.style.top = (parseInt(laser.style.top) - LASER_STEP) + 'px';
    },
    moveLaserDown: function (laser) {
      laser.style.top = (parseInt(laser.style.top) + LASER_STEP) + 'px';
    }
  };
})();