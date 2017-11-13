import {game} from './game';
import './keys';
import * as Rx from 'rxjs-es';

game.renderInitialGame();

const LASER_STEP = 10;

Rx.Observable.interval(100)
  .map(() => game.lasers)
  .subscribe(lasers => {
    lasers.forEach(laser => laser.style.top = (parseInt(laser.style.top) - LASER_STEP) + 'px');
    let toDelete = lasers.filter(laser => parseInt(laser.style.top) < 0)
      .map(laser => lasers.indexOf(laser));
    toDelete.forEach(laser => {
      let element = document.querySelector('#laser' + laser);
      document.body.removeChild(element);
      lasers.splice(laser, 1);
    });
  });
