import * as Rx from 'rxjs-es';
import {game} from './game';
import {renderer} from './renderer';

let singlePlayerLasers$ = Rx.Observable.interval(100)
  .map(() => game.state.lasers)
  .flatMap(lasers => Rx.Observable.from(lasers));

singlePlayerLasers$
  .subscribe(laser => {
    renderer.moveLaserUp(laser);
  });

let laserOfTheScreen = laser => parseInt(laser.style.top) < 0 || parseInt(laser.style.top) > window.screen.availHeight;

singlePlayerLasers$
  .filter(laserOfTheScreen)
  .subscribe(laser => {
    game.removeLaser(laser);
  });
