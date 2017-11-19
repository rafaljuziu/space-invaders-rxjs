import {game, TOTAL_COLUMNS} from './game';
import * as Rx from 'rxjs-es';

Rx.Observable.interval(1000)
  .subscribe(() => {
    game.moveInvaders();
  });