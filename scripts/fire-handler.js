import * as Rx from 'rxjs-es';
import {game} from './game';

export const playerFireHandler$ = new Rx.Subject();
export const invaderFireHandler$ = new Rx.Subject();

const INVADER_BOUNDING_BOX = {
  left: -35,
  right: 35,
  top: -25,
  bottom: 25
};

const PLAYER_BOUNDING_BOX = {
  left: 20,
  right: 70,
  top: -10,
  bottom: 95
};


playerFireHandler$
  .concatMap(laser => game.invaders$.map(invader => {
    return {laser: laser, target: invader, boundingBox: INVADER_BOUNDING_BOX};
  }))
  .filter(isHit)
  .subscribe(hit => {
    game.kill(hit);
  });

invaderFireHandler$
  .map(laser => {
    return {laser: laser, target: game.state.player, boundingBox: PLAYER_BOUNDING_BOX};
  })
  .filter(isHit)
  .subscribe(hit => {
    game.playerHit(hit);
  });

function isHit(possibleHit) {
  const laser = possibleHit.laser.getBoundingClientRect();
  const target = possibleHit.target.element.getBoundingClientRect();
  const boundingBox = possibleHit.boundingBox;

  let inXAxis = laser.x > target.x + boundingBox.left && laser.x < target.x + boundingBox.right;
  let inYAxis = laser.y > target.y + boundingBox.top && laser.y < target.y + boundingBox.bottom;

  return inXAxis && inYAxis;
}