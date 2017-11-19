import {game, TOTAL_COLUMNS} from './game';
import * as Rx from 'rxjs-es';

Rx.Observable.gameInterval(1000)
  .subscribe(() => {
    game.moveInvaders();
  });

const lowestInvaders$ = game.invaders$
  .reduce((acc, invader) => replaceInArrayIfIsTheLowest(acc, invader), new Array(TOTAL_COLUMNS))
  .map(removeEmptyIndexes);

Rx.Observable.gameInterval(3000)
  .flatMap(() => lowestInvaders$)
  .map(lowestInvaders => getRandomInvader(lowestInvaders))
  .subscribe(firingInvader => {
    game.fireFromInvader(firingInvader);
  });

function removeEmptyIndexes(array) {
  const resultArray = [];
  for (let el of array) {
    if (el != null) {
      resultArray.push(el);
    }
  }
  return resultArray;
}

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
  let randomIndex = parseInt(Math.random() * invaders.length);
  if (randomIndex === invaders.length) {
    randomIndex--;
  }
  return invaders[randomIndex];
}
