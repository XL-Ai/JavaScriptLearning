// 8.6 闭包
function counter() {
  let n = 0;
  return {
    count: function () { return n++; },
    reset: function () { n = 0; }
  };
}

let c = counter(), d = counter();
c.count();
d.count();
c.reset();
c.count();
d.count();


function counter(n) {
  return {
    get count() { return n++; },
    set count(m) {
      if (m > n) {
        n = m;
      } else {
        throw Error('can only be a larger value');
      }
    }
  }
}

let c = counter(1000);
c.count;
c.count;
c.count = 2000;
c.count;
c.count = 2000;


function addPrivateProperty(o, name, predicate) {
  let value;

  o[`get${name}`] = function() { return value; };

  o[`set${name}`] = function(v) {
    if (predicate && !predicate(v)) {
      throw new TypeError('invalid value');
    } else {
      value = v;
    }
  }
}

let o = {};

addPrivateProperty(o, 'Name', x => typeof x === 'string');

o.setName('Frank');
o.getName();
o.setName(0);


function constfunc(v) { return () => v; }

let funcs = [];

for (var i = 0; i < 10; i++) funcs[i] = constfunc(i);

funcs[5]();


function constfuncs() {
  let funcs = [];

  for (var i = 0; i < 10; i++) {
    funcs[i] = () => i;
  }

  return funcs;
}

let funcs = constfuncs();
funcs[5]();

// 8.7 函数属性、方法与构造函数
// 8.7.5 bind()方法
let sum = (x, y) => x + y;
let succ = sum.bind(null, 1);
succ(2);

function f(y, z) { return this.x + y + z; }
let g = f.bind({ x: 1 }, 2);
g(3);

// 8.8　函数式编程
// 8.8.1　使用函数处理数组
const sum = (x, y) => x + y;
const square = x => x*x;

let data = [1, 1, 3, 5, 5];
let mean = data.reduce(sum)/data.length;
let dev = data.map(x => x - mean);
let stddev = Math.sqrt(dev.map(square).reduce(sum)/(data.length - 1));
stddev;

const map = function(a, ...args) { return a.map(...args); };
const reduce = function(a, ...args) { return a.reduce(...args); };

data = [1, 1, 3, 5, 5];
mean = reduce(data, sum)/data.length;
dev = map(data, x => x - mean);
stddev = Math.sqrt(reduce(map(dev, square), sum)/(data.length - 1))

// 8.8.2 Higher-Order Functions
function not(f) {
  return function (...args) {
    let result = f.apply(this, args);
    return !result;
  }
}

const even = x => x % 2 === 0;
const odd = not(even);
[1,1,3,5,5].every(odd);


function mapper(f) {
  return a => map(a, f);
}

const increment = x => x + 1;
const incrementAll = mapper(increment);
incrementAll([1,2,3]);


function compose(f, g) {
  return function(...args) {
    return f.call(this, g.apply(this, args));
  }
}

const sum = (x, y) => x + y;
const square = x => x*x;
compose(square, sum)(2, 3);

// 8.8.3 Partial Application of Functions
function partialLeft(f, ...outerArgs) {
  return function(...innerArgs) {
    return f.apply(this, [...outerArgs, ...innerArgs]);
  }
}

function partialRight(f, ...outerArgs) {
  return function(...innerArgs) {
    return f.apply(this, [...innerArgs, ...outerArgs]);
  }
}

function partial(f, ...outerArgs) {
  return function(...innerArgs) {
    const args = [...outerArgs];
    let innerIndex = 0;
    args.forEach((arg, index) => {
      if(arg === undefined) args[index] = innerArgs[innerIndex++];
    })
    args.push(...innerArgs.slice(innerIndex));
    return f.apply(this, args);
  }
}

const f = function (x, y, z) { return x * (y - z); };
partialLeft(f, 2)(3, 4);
partialRight(f, 2)(3, 4);
partial(f, undefined, 2)(3, 4);

const increment = partialLeft(sum, 1);
const cuberoot = partialRight(Math.pow, 1/3);
cuberoot(increment(26));

const not = partialLeft(compose, x => !x);
const even = x => x%2 === 0;
const odd = not(even);
const isNumber = not(isNaN);
odd(3) && isNumber(2)

// 8.8.4 Memoization
function memoize(f) {
  const cache = new Map();

  return function(...args) {
    let key = args.length + args.join('+');
    if (cache.has(key)) {
      return cache.get(key);
    } else {
      let result = f.apply(this, args);
      cache.set(key, result);
      return result;
    }
  };
}

const factorial = memoize(function(n) {
  console.log(n);
  return (n <= 1) ? 1 : n * factorial(n-1);
});

factorial(5);
