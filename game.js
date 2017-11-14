import * as Rx from 'rxjs-es';
import {renderer} from './renderer';

export const game = (function () {

  function renderInitialGame() {
    renderer.renderInitialGame(state.invaders);
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

  function findAndModifyInvader(searchedInvader, fn) {
    for (let invadersRow of state.invaders) {
      for (let i = 0; i < invadersRow.length; i++) {
        if (invadersRow[i] === searchedInvader) {
          invadersRow[i] = new Invader(invadersRow[i]);
          fn(invadersRow[i]);
        }
      }
    }
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
    lives: 3,
    player: new Player(),
    lasers: [],
  };

  let invaders$ = Rx.Observable.from(state.invaders.flatMap(x => x))
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
      findAndModifyInvader(hit.invader, invader => invader.alive = false);
      this.removeLaser(hit.laser);
      renderer.rerenderGame(state);
    }
  };
})();