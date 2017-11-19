import {game, TOTAL_COLUMNS} from './game';
import * as Rx from 'rxjs-es';

Rx.Observable.interval(1000)
  .subscribe(() => {
    game.moveInvaders();
  });

const lowestInvaders$ = game.invaders$
  .reduce((acc, invader) => replaceInArrayIfIsTheLowest(acc, invader), new Array(TOTAL_COLUMNS));

Rx.Observable.interval(3000)
  .flatMap(() => lowestInvaders$)
  .map(lowestInvaders => getRandomInvader(lowestInvaders))
  .subscribe(firingInvader => {
    game.fireFromInvader(firingInvader);
  });

function replaceInArrayIfIsTheLowest(acc, invader) {
  for (let lowestInvader of acc) {
    if (shouldBeReplacedInArray(lowestInvader, invader)) {
      return replaceInArray(acc, invader);
    }
  }
}

function shouldBeReplacedInArray(lowestInvader, invader) {
  return lowestInvader == null || (isInTheSameColumn(lowestInvader, invader) && isLower(lowestInvader, invader));
}

function isInTheSameColumn(lowestInvader, invader) {
  return lowestInvader.x === invader.x;
}

function isLower(lowestInvader, invader) {
  return lowestInvader.y < invader.y;
}

function replaceInArray(acc, invader) {
  const newAcc = acc.slice();
  newAcc[invader.x] = invader;
  return newAcc;
}

function getRandomInvader(invaders) {
  const notEmptyColumnsCount = getNotEmptyColumnsCount(invaders);
  let randomIndex = parseInt(Math.random() * notEmptyColumnsCount);
  if (randomIndex === notEmptyColumnsCount) {
    randomIndex--;
  }
  let invader = invaders[randomIndex];
  return invader;
}

function getNotEmptyColumnsCount(invaders) {
  let count = 0;
  for (let i = 0; i < invaders.length; i++) {
    if (invaders[i] != null) {
      count++;
    }
  }
  return count;
}