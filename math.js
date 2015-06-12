
var math = require('mathjs');
var _math = {};
var eps = 0.001;

_math.golden_section = function(f, a, b, n) {
  var phi = 1.618;
  var x1, x2, y1, y2;
  for (var i = 0; i < n; ++i)
  {
    x1 = b - (b - a) / phi;
    x2 = a + (b - a) / phi;
    y1 = f(x1);
    y2 = f(x2);
    if (y1 >= y2) {
      a = x1;
    } else {
      b = x2;
    }
  }
  result = (a + b) / 2
  return result;
};

_math.gradient_descent = function(func, gradient, x0, n) {
  for (var i = 0; i < n; ++i) {
    var g = gradient(x0);
    var f = function(lambda) {
      return func(math.subtract(x0, math.multiply(lambda, g)));
    };
    var lambda = _math.golden_section(f, 0, 1, n / 2);
    x1 = math.subtract(x0, math.multiply(lambda, g));
    x0 = x1;
  }
  return x0;
};

_math.vector_square = function(vector) {
  return math.multiply(vector.map(function(v) { return [v]; }), [vector]);
}

_math.dfp = function(func, gradient, x0, n) {
  var g_x0 = gradient(x0);
  for (var i = 0; i < n; ++i) {
    var d_matrix = math.eye(x0.length || 1);
    for (var j = 0; j < x0.length || 1; ++j) {
      var d = math.multiply(-1, math.multiply(d_matrix, g_x0));
      var f = function(lambda) {
        return func(math.add(x0, math.multiply(lambda, d)))
      };
      var lambda = _math.golden_section(f, 0, 1, n / 2);
      x1 = math.add(x0, math.multiply(lambda, d));
      var g_x1 = gradient(x1);

      var p = math.multiply(lambda, d);
      var q = math.subtract(g_x1, g_x0);
      var d_next = d_matrix;
      d_next = math.add(d_next, math.multiply(_math.vector_square(p), 1 / math.multiply(p, p)));
      d_next = math.subtract(d_next, math.multiply(math.multiply(math.multiply(d_matrix, _math.vector_square(q)), d_matrix), 1 / math.multiply(q, math.multiply(d_next, q))));

      x0 = x1;
      g_x0 = g_x1;
      d_matrix = d_next;
    }
  }
  return x0;
}

_math.runge_kutta = function(f, x0, xn, y0, n) {
  var  h = (xn - x0) / n;
  var result = [y0];
  for (var i = 0; i < n; ++i) {
    var x = x0 + h * i;
    var y = result[result.length - 1];
    var k1 = f(x, y);
    var k2 = f(x + h / 2, math.add(y, math.multiply(h / 2, k1)));
    var k3 = f(x + h / 2, math.add(y, math.multiply(h / 2, k2)));
    var k4 = f(x + h, math.add(y, math.multiply(h, k3)));
    var next = k4;
    next = math.add(next, math.multiply(2, k3));
    next = math.add(next, math.multiply(2, k2));
    next = math.add(next, k1);
    next = math.multiply(next, h / 6);
    next = math.add(next, y);
    result.push(next);
  }
  return result;
};

_math.simpson = function(f, h) {
  var sum = 0;
  for (var i = 0; i < f.length - 2; i += 2) {
    sum += f[i] + 4 * f[i + 1] + f[i + 2];
  }
  return h * sum / 3;
};

module.exports = _math;

var test = function() {
  var f = function(x) {
    return x[0] * x[0] + x[1] * x[1];
  }

  var g = function(x) {
    return [2 * x[0], 2 * x[1]];
  }

  console.log(_math.gradient_descent(g, [30, 30], 20));
  console.log(_math.golden_section(math.square, -30, 30, 20));
  console.log(_math.simpson([1, 1, 1, 1, 1], 1));
}