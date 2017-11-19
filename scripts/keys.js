import {game} from './game';
import * as Rx from 'rxjs-es';

const keysPressed = {
  right: false,
  left: false
};

function keyLeft(key) {
  return key === 'ArrowLeft';
}

function keyRight(key) {
  return key === 'ArrowRight';
}

function keyFire(key) {
  return key === 'Space';
}

let keyDown$ = Rx.Observable.fromEvent(document, 'keydown')
  .map(keyEvent => keyEvent.code);

keyDown$.filter(keyLeft)
  .subscribe(() => {
    keysPressed.left = true;
  });

keyDown$.filter(keyRight)
  .subscribe(() => {
    keysPressed.right = true;
  });

let keyUp$ = Rx.Observable.fromEvent(document, 'keyup')
  .map(keyEvent => keyEvent.code);

keyUp$.filter(keyLeft)
  .subscribe(() => {
    keysPressed.left = false;
  });

keyUp$.filter(keyRight)
  .subscribe(() => {
    keysPressed.right = false;
  });

let playerMove = Rx.Observable.gameInterval(50).map(() => keysPressed);

playerMove.filter(keys => keys.right && !keys.left)
  .subscribe(() => {
    game.move(1);
  });

playerMove.filter(keys => !keys.right && keys.left)
  .subscribe(() => {
    game.move(-1);
  });

Rx.Observable.fromEvent(document, 'keydown')
  .map(keyEvent => keyEvent.code)
  .filter(keyFire)
  .throttleTime(1000)
  .subscribe(() => {
    game.fire();
  });
