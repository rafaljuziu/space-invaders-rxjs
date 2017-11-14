import {game} from './game';
import './keys';
import './lasers';
import * as Rx from 'rxjs-es';

game.renderInitialGame();

Rx.Observable.interval(1000)
  .subscribe(() => {
    game.moveInvaders();
  });
