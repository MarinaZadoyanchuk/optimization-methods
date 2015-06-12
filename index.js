
var task1 = {
  a: function(alpha) {
    return [[2, 0], [alpha, 2]];
  },
  c: function(alpha) {
    return function(t) {
      return math.add([1, 2], math.multiply(math.square(t), [1, -40]));
    }
  },
  timeStart: 0,
  timeEnd: 1,
  timeN: 20,
  x0: [1, 1],
  alphaStart: 10
};

var task2 = {
  a: function(alpha) {
    var result = math.eye(4).toArray();
    result[2][3] = alpha;
    return result;
  },
  c: function(alpha) {
    return function(t) {
      return math.add(math.ones(4).toArray(), math.multiply(math.square(t), math.ones(4).toArray()));
    }
  },
  timeStart: 0,
  timeEnd: 1,
  timeN: 20,
  x0: math.ones(4).toArray(),
  alphaStart: 10
};

var task3 = {
  a: function(alpha) {
    var result = math.eye(4).toArray();
    result[1][2] = alpha[0];
    return result;
  },
  c: function(alpha) {
    return function(t) {
      return math.add(math.ones(4).toArray(), math.multiply(math.square(t), math.ones(4).toArray()));
    }
  },
  timeStart: 0,
  timeEnd: 1,
  timeN: 20,
  x0: math.ones(4).toArray(),
  alphaStart: [10, 10]
};

var task = task3;

var find_x = function(alpha) {
  var a = task.a(alpha);
  var c = task.c(alpha);

  var f = function(x, y) {
    return math.add(math.multiply(a, y), c(x));
  }
  return _math.runge_kutta(f, task.timeStart, task.timeEnd, task.x0, task.timeN);
}

var quality = function(alpha) {
  return _math.simpson(find_x(alpha).map(function(x) {
    return math.multiply(x, x);
  }), (task.timeEnd - task.timeStart) / task.timeN);
}

var quality_diff = function(alpha) {
  var x_t = find_x(alpha);

  var df_dx = task.a(alpha);
  var find_index = function(time) {
    return Math.floor((time - task.timeStart) / (task.timeEnd - task.timeStart) * task.timeN);
  }
  
  var f = function(x, y) {
    return math.add(math.multiply(df_dx, y), [0, 0, x_t[find_index(x)][2], 0])
  }
  var u = _math.runge_kutta(f, task.timeStart, task.timeEnd, math.zeros(task.x0.length), task.timeN)
  var result = 2 * _math.simpson(u.map(function(u_t, i) {
    return math.multiply(u_t, x_t[i]);
  }), (task.timeEnd - task.timeStart) / task.timeN);
  // console.log(alpha, result);
  return [result, 0];
}

// var quality_diff = function(alpha)
// {
//   var x_t = find_x(alpha);

// }
var _quality_diff = function(alpha) {
  var step = 0.15;
  return (quality(alpha) - quality(alpha - step)) / step;
}

var main = function() {
  return _math.dfp(quality, quality_diff, task.alphaStart, 50);
}
