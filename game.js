import * as Rx from 'rxjs-es';
import {renderer} from './renderer';

export const game = (function () {

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

  function rerenderGame() {
    let player = document.querySelector('i.fa-rocket');
    player.style.left = getPlayerXOnPage(game.state.player.x);
  }

  function getPlayerXOnPage(playerX) {
    let position = (playerX - 50) * 5;
    return position + 'px';
  }

  function Invader() {
    this.alive = true;
  }

  function Player() {
    this.x = 50;
  }

  return {
    state: {
      invaders: createInvadersBoard(),
      lives: 3,
      player: new Player(),
      lasers: [],
    },
    renderInitialGame: renderer.renderInitialGame,
    move: function (direction) {
      if (this.state.player.x + direction <= 100 && this.state.player.x + direction >= 0) {
        this.state.player.x += direction;
        rerenderGame();
      }
    },
    fire: () => {
      let laser = renderer.createLaser();
      this.state.lasers.push(laser);
    },
    removeLaser: function removeLaser(laser) {
      let index = this.state.lasers.indexOf(laser);
      this.state.lasers = this.state.lasers.slice();
      this.state.lasers.splice(index, 1);
      renderer.removeLaser(laser);
    }
  };
})();