import * as Rx from 'rxjs-es';
import {game} from './game';

export const fireHandler$ = new Rx.Subject();

fireHandler$
  .concatMap(laser => game.invaders$.map(invader => {
    return {laser: laser, invader: invader};
  }))
  .filter(isHit)
  .subscribe(hit => {
    game.kill(hit);
  });

function isHit(possibleHit) {
  const laser = possibleHit.laser.getBoundingClientRect();
  const invader = possibleHit.invader.element.getBoundingClientRect();

  let inXAxis = laser.x > invader.x - 35 && laser.x < invader.x + 35;
  let inYAxis = laser.y > invader.y - 25 && laser.y < invader.y + 25;

  return inXAxis && inYAxis;
}