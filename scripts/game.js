import * as Rx from 'rxjs-es';
import {renderer} from './renderer';

export const TOTAL_ROWS = 6;
export const TOTAL_COLUMNS = 10;

export const game = (function () {

  const INVADERS_MOVE_STEP = 10;
  let DIRECTION = 1;

  function renderInitialGame() {
    renderer.renderInitialGame(state);
  }

  function createInvadersRow(rowIndex) {
    let row = [];
    for (let i = 0; i < TOTAL_COLUMNS; i++) {
      row.push(new Invader(i, rowIndex));
    }
    return row;
  }

  function createInvadersBoard() {
    let invaders = [];
    for (let i = 0; i < TOTAL_ROWS; i++) {
      let row = createInvadersRow(i);
      invaders.push(row);
    }
    return invaders;
  }

  function findInvader(searchedInvader) {
    for (let row = 0; row < state.invaders.length; row++) {
      let invadersRow = state.invaders[row];
      for (let i = 0; i < invadersRow.length; i++) {
        if (invadersRow[i] === searchedInvader) {
          return [row, i];
        }
      }
    }
  }

  function killInvader(searchedInvader) {
    let [row, i] = findInvader(searchedInvader);
    let killedInvader = state.invaders[row][i];
    let copiedInvader = killedInvader.copyInvader();
    copiedInvader.alive = false;
    state.invaders[row][i] = copiedInvader;
  }

  function Invader(x, y) {
    this.x = x;
    this.y = y;
    this.alive = true;
  }

  Invader.prototype.copyInvader = function () {
    let invader = new Invader(this.x, this.y);
    invader.alive = this.alive;
    invader.element = this.element;
    return invader;
  };

  function Player() {
    this.x = 50;
  }

  let state = {
    invaders: createInvadersBoard(),
    invadersPosition: 50,
    lives: 3,
    player: new Player(),
    lasers: [],
    invaderLasers: []
  };

  let invaders$ = Rx.Observable.from(state.invaders)
    .flatMap(invaders => Rx.Observable.from(invaders.flatMap(x => x)))
    .filter(invader => invader.alive);

  function hitPlayer() {
    state.lives--;
    state.player.x = 50;
  }

  return {
    state: state,
    invaders$: invaders$,
    renderInitialGame: renderInitialGame,
    move: function (direction) {
      if (this.state.player.x + direction <= 100 && this.state.player.x + direction >= 0) {
        this.state.player.x += direction;
        renderer.rerenderGame(state);
      }
    },
    fire: function () {
      let laser = renderer.createPlayerLaser(this.state.player.element);
      this.state.lasers.push(laser);
    },
    removeLaser: function removeLaser(laser) {
      let index = state.lasers.indexOf(laser);
      if (index < 0) {
        index = state.invaderLasers.indexOf(laser);
        state.invaderLasers = state.invaderLasers.slice();
        state.invaderLasers.splice(index, 1);
      } else {
        state.lasers = state.lasers.slice();
        state.lasers.splice(index, 1);
      }
      renderer.removeLaser(laser);
    },
    kill: function (hit) {
      killInvader(hit.target);
      this.removeLaser(hit.laser);
      renderer.rerenderGame(state);
    },
    moveInvaders: function () {
      let invadersPosition = this.state.invadersPosition;
      invadersPosition += DIRECTION * INVADERS_MOVE_STEP;
      if (invadersPosition >= 100 || invadersPosition <= 0) {
        DIRECTION = -DIRECTION;
      }
      this.state.invadersPosition = invadersPosition;
      renderer.rerenderGame(this.state);
    },
    fireFromInvader: function (invader) {
      const invaderLaser = renderer.createInvaderLaser(invader.element);
      this.state.invaderLasers.push(invaderLaser);
    },
    playerHit: function (hit) {
      hitPlayer();
      this.removeLaser(hit.laser);
      renderer.rerenderGame(state);
    }
  };
})();