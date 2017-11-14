import * as Rx from 'rxjs-es';
import {game} from './game';
import {fireHandler} from './fire-handler';

const LASER_STEP = 10;

let singleLasers$ = Rx.Observable.interval(100)
  .map(() => game.state.lasers)
  .flatMap(lasers => Rx.Observable.from(lasers));

singleLasers$
  .subscribe(laser => {
    laser.style.top = (parseInt(laser.style.top) - LASER_STEP) + 'px';
    fireHandler.next(laser);
  });

singleLasers$
  .filter(laser => parseInt(laser.style.top) < 0)
  .subscribe(laser => {
    game.removeLaser(laser);
  });