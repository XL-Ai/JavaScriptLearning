// Chapter 12. Iterators and Generators
// 12.1 How Iterators Work
let iterable = [1, 2, 3];
let iterator = iterable[Symbol.iterator]();
for (let result = iterator.next(); !result.done; result = iterator.next()) {
  console.log(result.value, result.done);
}

let list = [1,2,3,4,5];
let iter = list[Symbol.iterator]();
let head = iter.next().value;
let tail = [...iter];

// 12.2 Implementing Iterable Objects
// Example 12-1. An iterable numeric Range class
class Range {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  has(x) { return typeof x === 'number' && this.from <= x && x <= this.to; }

  toString() { return `{ x | ${this.from} ≤ x ≤ ${this.to} }`; }

  [Symbol.iterator]() {
    let next = Math.ceil(this.from);
    let last = this.to;

    return {
      next() {
        return (next <= last) ? { value: next++ } : { done: true }
      },

      [Symbol.iterator]() { return this; }
    }
  }
}

for (let x of new Range(3.7, 16.2)) console.log(x);
[...new Range(3.7, 16.2)];

function map(iterable, f) {
  let iterator = iterable[Symbol.iterator]();

  return {
    [Symbol.iterator]() { return this; },
    next() {
      let v = iterator.next();
      if (v.done) {
        return v;
      } else {
        return { value: f(v.value) };
      }
    }
  };
}

[...map(new Range(1, 4), x => x * x)];

function filter(iterable, predicate) {
  let iterator = iterable[Symbol.iterator]();

  return {
    [Symbol.iterator]() { return this; },
    next() {
      for(;;) {
        let v = iterator.next();
        if (v.done || predicate(v.value)) {
          return v;
        }
      }
    }
  }
}

[...filter(new Range(1, 10), x => x % 2 === 0)];

function words(s) {
  var r = /\s+|$/g;
  r.lastIndex = s.match(/[^ ]/).index;

  return {
    [Symbol.iterator]() { return this; },
    next() {
      let start = r.lastIndex;
      if (start < s.length) {
        let match = r.exec(s);
        if (match) {
          return { value: s.substring(start, match.index) };
        }
      }
      return { done: true };
    }
  }
}

[...words(" abc def  ghi! ")];

// 12.3 Generators
function* oneDigitPrimes() {
  yield 2;
  yield 3;
  yield 5;
  yield 7; 
}

let primes = oneDigitPrimes();

primes.next().value;
primes.next().value;
primes.next().value;
primes.next().value;
primes.next().done;

primes[Symbol.iterator]()

[...oneDigitPrimes()];

let sum = 0;
for (let prime of oneDigitPrimes()) sum += prime;
sum;

const seq = function*(from, to) {
  for (let i = from; i <= to; i++) yield i;
};
[...seq(1, 3)];

let o = {
  x: 1, y: 2, z: 3,
  *g() {
    for (let key of Object.keys(this)) {
      yield key;
    }
  }
};

[...o.g()]

// 12.3.1 Generator Examples
function* fibonacciSequence() {
  let x = 0, y = 1;
  for (;;) {
    yield y;
    [x, y] = [y, x + y];
  }
}

function fibonacci(n) {
  for (let f of fibonacciSequence()) {
    if (n-- <= 0) return f;
  }
}
fibonacci(20);

function* take(n, iterable) {
  let it = iterable[Symbol.iterator]();
  while (n-- > 0) {
    let next = it.next();
    if (next.done) return;
    else yield next.value;
  }
}

[...take(5, fibonacciSequence())]

// Given an array of iterables, yield their elements in interleaved order.
function* zip(...iterables) {
  let iterators = iterables.map((iterable) => iterable[Symbol.iterator]());
  let index = 0;
  while (iterators.length > 0) {
    if (index >= iterators.length) {
      index = 0;
    }
    let item = iterators[index].next();
    if (item.done) {
      iterators.splice(index, 1);
    } else {
      yield item.value;
      index++;
    }
  }
}

[...zip(oneDigitPrimes(), "ab", [0])];

[...zip([0], "ab", oneDigitPrimes())];

// 12.3.2 yield* and Recursive Generators
function* sequence(...iterables) {
  for (let iterable of iterables) {
    for (let item of iterable) {
      yield item;
    }
  }
}

[...sequence("abc", oneDigitPrimes())];

function* sequence(...iterables) {
  iterables.forEach(iterable => yield* iterable); // Error
}

function* sequence(...iterables) {
  for (let iterable of iterables) {
    yield* iterable;
  }
}

[...sequence("abc",oneDigitPrimes())];

// 12.4 Advanced Generator Features
// 12.4.2 The Value of a yield Expression
function* smallNumbers() {
  console.log("next() invoked the first time; argument discarded");
  let y1 = yield 1;
  console.log("next() invoked a second time with argument", y1);
  let y2 = yield 2;
  console.log("next() invoked a third time with argument", y2);
  let y3 = yield 3;
  console.log("next() invoked a fourth time with argument", y3);
  return 4;
}

let g = smallNumbers();
console.log("generator created; no code runs yet");
let n1 = g.next("a");
console.log("generator yielded", n1.value);
let n2 = g.next("b");
console.log("generator yielded", n2.value);
let n3 = g.next("c");
console.log("generator yielded", n3.value);
let n4 = g.next("d");
console.log("generator returned", n4.value);