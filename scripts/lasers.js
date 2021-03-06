import * as Rx from 'rxjs-es';
import {game} from './game';
import {playerFireHandler$, invaderFireHandler$} from './fire-handler';
import {renderer} from './renderer';

let singlePlayerLasers$ = Rx.Observable.gameInterval(100)
  .map(() => game.state.lasers)
  .flatMap(lasers => Rx.Observable.from(lasers));

singlePlayerLasers$
  .subscribe(laser => {
    renderer.moveLaserUp(laser);
    playerFireHandler$.next(laser);
  });

let laserOfTheScreen = laser => parseInt(laser.style.top) < 0 || parseInt(laser.style.top) > window.screen.availHeight;

singlePlayerLasers$
  .filter(laserOfTheScreen)
  .subscribe(laser => {
    game.removeLaser(laser);
  });

let singleInvaderLasers$ = Rx.Observable.gameInterval(100)
  .map(() => game.state.invaderLasers)
  .flatMap(lasers => Rx.Observable.from(lasers));

singleInvaderLasers$
  .subscribe(laser => {
    renderer.moveLaserDown(laser);
    invaderFireHandler$.next(laser);
  });

singleInvaderLasers$
  .filter(laserOfTheScreen)
  .subscribe(laser => {
    game.removeLaser(laser);
  });