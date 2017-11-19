import {game} from './game';
import * as Rx from 'rxjs-es';

function keyLeft(key) {
  return key === 'ArrowLeft';
}

function keyRight(key) {
  return key === 'ArrowRight';
}

function keyFire(key) {
  return key === 'Space';
}

Rx.Observable.fromEvent(document, 'keydown')
  .map(keyEvent => keyEvent.code)
  .filter(keyLeft)
  .subscribe(() => {
    game.move(-1);
  });

Rx.Observable.fromEvent(document, 'keydown')
  .map(keyEvent => keyEvent.code)
  .filter(keyRight)
  .subscribe(() => {
    game.move(1);
  });
