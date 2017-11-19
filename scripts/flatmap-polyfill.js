Array.prototype.flatMap = function (fn) {
  return [].concat.apply([], this.map(fn));
};