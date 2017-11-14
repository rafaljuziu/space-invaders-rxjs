import * as Rx from 'rxjs-es';
import {renderer} from './renderer';

export const game = (function () {

  const INVADERS_MOVE_STEP = 10;
  let DIRECTION = 1;

  function renderInitialGame() {
    renderer.renderInitialGame(state);
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
    let copiedInvader = new Invader(killedInvader);
    copiedInvader.alive = false;
    state.invaders[row][i] = copiedInvader;
  }

  function Invader(source) {
    if (source) {
      this.element = source.element;
      this.alive = source.alive;
    } else {
      this.alive = true;
    }
  }

  function Player() {
    this.x = 50;
  }

  let state = {
    invaders: createInvadersBoard(),
    invadersPosition: 50,
    lives: 3,
    player: new Player(),
    lasers: [],
  };

  let invaders$ = Rx.Observable.from(state.invaders)
    .flatMap(invaders => Rx.Observable.from(invaders.flatMap(x => x)))
    .filter(invader => invader.alive);

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
      let laser = renderer.createLaser();
      this.state.lasers.push(laser);
    },
    removeLaser: function removeLaser(laser) {
      let index = state.lasers.indexOf(laser);
      state.lasers = state.lasers.slice();
      state.lasers.splice(index, 1);
      renderer.removeLaser(laser);
    },
    kill: function (hit) {
      killInvader(hit.invader);
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
    }
  };
})();