import {game} from './game';
import * as Rx from 'rxjs-es';

game.renderInitialGame();

const keysPressed = {
  right: false,
  left: false,
  space: false
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

function isGameKey(key) {
  return keyRight(key) || keyLeft(key) || keyFire(key);
}

let keyDown$ = Rx.Observable.fromEvent(document, 'keydown')
  .map(keyEvent => keyEvent.code)
  .filter(isGameKey);

keyDown$.filter(keyLeft)
  .subscribe(() => {
    keysPressed.left = true;
  });

keyDown$.filter(keyRight)
  .subscribe(() => {
    keysPressed.right = true;
  });

keyDown$.filter(keyFire)
  .subscribe(() => {
    keysPressed.space = true;
  });

let keyUp$ = Rx.Observable.fromEvent(document, 'keyup')
  .map(keyEvent => keyEvent.code)
  .filter(isGameKey);

keyUp$.filter(keyLeft)
  .subscribe(() => {
    keysPressed.left = false;
  });

keyUp$.filter(keyRight)
  .subscribe(() => {
    keysPressed.right = false;
  });

keyUp$.filter(keyFire)
  .subscribe(() => {
    keysPressed.space = false;
  });

let keyPress$ = Rx.Observable.interval(50).map(() => keysPressed);

keyPress$.filter(keys => keys.right && !keys.left)
  .subscribe(() => {
    game.move(1);
  });

keyPress$.filter(keys => !keys.right && keys.left)
  .subscribe(() => {
    game.move(-1);
  });