// 10.1 Modules with Classes, Objects, and Closures
// This is how we could define a stats module
const stats = (function() {
  const sum = (x, y) => x + y;
  const square = x => x * x;

  function mean(data) {
    return data.reduce(sum)/data.length;
  }

  function stddev(data) {
    let m = mean(data);
    return Math.sqrt(
      data.map(x => x - m).map(square).reduce(sum)/(data.length - 1)
    );
  }

  return { mean, stddev };
}());

stats.mean([1, 3, 5, 7, 9]);
stats.stddev([1, 3, 5, 7, 9]);

// 10.1.1 Automating Closure-Based Modularity
const modules = {};
function require(moduleName) { return modules[moduleName]; }

modules['sets.js'] = (function() {
  const exports = {};

  exports.BitSet = class BitSet {
    constructor(value) {
      this.value = value;
    }
  };

  return exports;
}());

modules['stats.js'] = (function() {
  const exports = {};

  const sum = (x, y) => x + y;
  const square = x => x * x;

  exports.mean = function(data) { return 'mean data' };
  exports.stddev = function(data) { return 'stddev data' };

  return exports;
}());

const stats = require('stats.js');
const BitSet = require('sets.js').BitSet;

let s = new BitSet(100);
s.value;
stats.mean(1);
stats.stddev(1);

// 10.2 Modules in Node

// 10.3 Modules in ES6
