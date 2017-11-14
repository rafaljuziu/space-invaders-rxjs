import * as Rx from 'rxjs-es';
import {game} from './game';
import {fireHandler$} from './fire-handler';
import {renderer} from './renderer';

let singleLasers$ = Rx.Observable.interval(100)
  .map(() => game.state.lasers)
  .flatMap(lasers => Rx.Observable.from(lasers));

singleLasers$
  .subscribe(laser => {
    renderer.moveLaserUp(laser);
    fireHandler$.next(laser);
  });

let laserOfTheScreen = laser => parseInt(laser.style.top) < 0;

singleLasers$
  .filter(laserOfTheScreen)
  .subscribe(laser => {
    game.removeLaser(laser);
  });

