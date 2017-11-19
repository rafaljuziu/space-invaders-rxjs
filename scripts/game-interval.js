import * as Rx from 'rxjs-es';

let baseTimeMultiplier = 1;

function createInterval(observer, interval) {
  return setInterval(function () {
    observer.next();
  }, interval * baseTimeMultiplier);
}

Rx.Observable.gameInterval = function (interval) {
  return Rx.Observable.create((observer) => {

    let notifyObserverIntervalId = createInterval(observer, interval);

    function speedUpGame() {
      clearInterval(notifyObserverIntervalId);
      baseTimeMultiplier -= 0.02;
      notifyObserverIntervalId = createInterval(observer, interval);
      if (baseTimeMultiplier === 0.86) {
        clearInterval(speedUpGameIntervalId);
      }
    }

    let speedUpGameIntervalId = setInterval(speedUpGame, 10000);
  });
};