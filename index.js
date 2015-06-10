
var math = require('mathjs');
var _math = require('./math.js');

var task = {
  a: [[2, 0], [1, 2]],
  c: function(alpha) {
    return function(t) {
      return math.add([1, 2], math.multiply(math.square(t), [1, alpha]));
    }
  },
  timeStart: 0,
  timeEnd: 1,
  timeN: 20,
  x0: [1, 1],
  alphaStart: 10
};

var find_x = function(alpha) {
  var c = task.c(alpha);

  var f = function(x, y) {
    return math.add(math.multiply(task.a, y), c(x));
  }
  return _math.runge_kutta(f, task.timeStart, task.timeEnd, task.x0, task.timeN);
}

var quality = function(alpha) {
  return _math.simpson(find_x(alpha).map(function(x) {
    return math.multiply(x, x);
  }), (task.timeEnd - task.timeStart) / task.timeN);
}

var main = function() {
  var g = function(alpha) {
    var step = 0.15;
    return (quality(alpha) - quality(alpha - step)) / step;
  }
  return _math.gradient_descent(g, 10, 500);
}

console.log(main());
