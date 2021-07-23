// 9.1 Classes and Prototypes
// Example 9-1. A simple JavaScript class
function range(from, to) {
  let r = Object.create(range.methods);

  r.from = from;
  r.to = to;

  return r;
}

range.methods = {
  includes(x) { return this.from <= x && x <= this.to; },

  *[Symbol.iterator]() {
    for (let x = Math.ceil(this.from) ; x <= this.to ; x++) yield x;
  },

  toString() { return "(" + this.from + "..." + this.to + ")"; }
};

let r = range(1, 3);
r.includes(2);
r.toString();
console.log([...r]);
console.log(r.constructor);

// 9.2 Classes and Constructors
// Example 9-2. A Range class using a constructor
function Range(from, to) {
  this.from = from;
  this.to = to;
}

Range.prototype = {
  includes(x) { return this.from <= x && x <= this.to; },

  *[Symbol.iterator]() {
    for (let x = Math.ceil(this.from) ; x <= this.to ; x++) yield x;
  },

  toString() { return "(" + this.from + "..." + this.to + ")"; }
}


let r = range(1, 3);
r.includes(2);
r.toString();
console.log([...r]);
console.log(r.constructor);
console.log({}.constructor);

// 9.3 Classes with the class Keyword
class Range {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  includes(x) { return this.from <= x && x <= this.to; }

  *[Symbol.iterator]() {
    for(let x = Math.ceil(this.from); x <= this.to; x++) yield x;
  }

  toString() { return `(${this.from}...${this.to})`; }
}

let r = new Range(1,3);
r.includes(2);
r.toString();
console.log([...r]);
console.log(r.constructor);

class Span extends Range {
  constructor(start, length) {
    if (length >= 0) {
      super(start, start + length);
    } else {
      super(start + length, start);
    }
  }
}

// 9.3.4 Example: A Complex Number Class
// Example 9-4. Complex.js: a complex number class
class Complex {
  constructor(real, imaginary) {
    this.r = real;
    this.i = imaginary;
  }

  plus(that) {
    return new Complex(this.r + that.r, this.i + that.i);
  }

  times(that) {
    return new Complex(this.r * that.r - this.i * that.i, this.r * that.i - this.i * that.r);
  }

  static sum(c, d) { return c.plus(d); }
  static product(c, d) { return c.times(d); }

  get real() { return this.r; }
  get imaginary() { return this.i; }
  get magnitude() { return Math.hypot(this.r, this.i); }

  toString() { return `{${this.r}, ${this.i}}`; }

  equals(that) {
    return that instanceof Complex && this.r === that.r && this.i === that.i;
  }
}

Complex.ZERO = new Complex(0, 0);
Complex.ONE = new Complex(1, 0);
Complex.I = new Complex(0, 1);

// 9.5 Subclasses
// 9.5.2 Subclasses with extends and super
class EZArray extends Array {
  get first() { return this[0]; }
  get last() { return this[this.length - 1]; }
}

let a = new EZArray();
a instanceof EZArray;
a instanceof Array;
Array.isArray(a);
EZArray.isArray(a);

Array.prototype.isPrototypeOf(EZArray.prototype);
Array.isPrototypeOf(EZArray);

// Example 9-6. TypedMap.js: a subclass of Map that checks key and value types
class TypedMap extends Map {
  constructor(keyType, valueType, entries) {
    if (entries) {
      for (let [k, v] of entries) {
        if (typeof k !== keyType || typeof v !== valueType) {
          throw new TypeError(`Wrong type for entry [${k}, ${v}]`);
        }
      }
    }

    super(entries);

    this.keyType = keyType;
    this.valueType = valueType;
  }

  set(key, value) {
    if (this.keyType && typeof key !== this.keyType) {
      throw new TypeError(`${key} is not of type ${this.keyType}`);
    }

    if (this.valueType && typeof value !== this.valueType) {
      throw new TypeError(`${value} is not of type ${this.valueType}`);
    }

    return super.set(key, value);
  }
}

// 9.5.3 Delegation Instead of Inheritance
// Example 9-7. Histogram.js: a Set-like class implemented with delegation
class Histogram {
  constructor() { this.map = new Map(); }

  count(key) { return this.map.get(key) || 0; }

  has(key) { return this.count(key) > 0; }

  get size() { return this.map.size; }

  add(key) { this.map.set(key, this.count(key) + 1); }

  delete(key) {
    let count = this.count(key);
    if (count === 1) {
      this.map.delete(key);
    } else {
      this.map.set(key, count - 1);
    }
  }

  [Symbol.iterator]() { return this.map.keys(); }

  keys() { return this.map.keys(); }
  values() { return this.map.values(); }
  entries() { return this.map.entries(); }
}

// 9.5.4 Class Hierarchies and Abstract Classes
// Example 9-8. Sets.js: a hierarchy of abstract and concrete set classes
class AbstractSet {
  has(x) { throw new Error("Abstract method"); }
}

class NotSet extends AbstractSet {
  constructor(set) {
    super();
    this.set = set;
  }

  has(x) { return !this.set.has(x); }
  toString() { return `{ x| x ∉ ${this.set.toString()} }`; }
}

class RangeSet extends AbstractSet {
  constructor(from, to) {
    super();
    this.from = from;
    this.to = to;
  }

  has(x) { return x >= this.from && x <= this.to; }
  toString() { return `{ x| ${this.from} ≤ x ≤ ${this.to} }`; }
}

class AbstractEnumerableSet extends AbstractSet {
  get size() { throw new Error("Abstract method"); }
  [Symbol.iterator]() { throw new Error("Abstract method"); }

  isEmpty() { return this.size === 0; }
  toString() { return `{${Array.from(this).join(", ")}}`; }
  equals(set) {
    if (!(set instanceof AbstractEnumerableSet)) return false;

    if (this.size !== set.size) return false;

    for (let element of this) {
      if (!set.has(element)) return false;
    }

    return true;
  }
}

class SingletonSet extends AbstractEnumerableSet {
  constructor(member) {
    super();
    this.member = member;
  }

  has(x) { return x === this.member; }
  get size() { return 1; }
  *[Symbol.iterator]() { yield this.member; }
}

class AbstractWritableSet extends AbstractEnumerableSet {
  insert(x) { throw new Error("Abstract method"); }
  remove(x) { throw new Error("Abstract method"); }

  add(set) {
    for (let element of set) {
      this.insert(element);
    }
  }

  subtract(set) {
    for (let element of set) {
      this.remove(element);
    }
  }

  intersect(set) {
    for (let element of this) {
      if (!(set.has(element))) {
        this.remove(element);
      }
    }
  }
}

class BitSet extends AbstractWritableSet {
  constructor(max) {
    super();
    this.max = max;
    this.n = 0;
    this.numBytes = Math.floor(max/8) + 1;
    this.data = new Uint8Array(this.numBytes);
  }

  _valid(x) { return Number.isInteger(x) && x >= 0 && x <= this.max; }

  _has(byte, bit) { return (this.data[byte] & BitSet.bits[bit]) !== 0; }

  has(x) {
    if (this._valid(x)) {
      let byte = Math.floor(x/8);
      let bit = x % 8;
      return this._has(byte, bit);
    } else {
      return false;
    }
  }

  insert(x) {
    if (this._valid(x)) {               // If the value is valid
        let byte = Math.floor(x / 8);   // convert to byte and bit
        let bit = x % 8;
        if (!this._has(byte, bit)) {    // If that bit is not set yet
            this.data[byte] |= BitSet.bits[bit]; // then set it
            this.n++;                            // and increment set size
        }
    } else {
        throw new TypeError("Invalid set element: " + x );
    }
  }

  remove(x) {
    if (this._valid(x)) {              // If the value is valid
        let byte = Math.floor(x / 8);  // compute the byte and bit
        let bit = x % 8;
        if (this._has(byte, bit)) {    // If that bit is already set
            this.data[byte] &= BitSet.masks[bit];  // then unset it
            this.n--;                              // and decrement size
        }
    } else {
        throw new TypeError("Invalid set element: " + x );
    }
  }

  get size() { return this.n; }

  *[Symbol.iterator]() {
    for(let i = 0; i <= this.max; i++) {
        if (this.has(i)) {
            yield i;
        }
    }
  }
}

BitSet.bits = new Uint8Array([1, 2, 4, 8, 16, 32, 64, 128]);
BitSet.masks = new Uint8Array([~1, ~2, ~4, ~8, ~16, ~32, ~64, ~128]);
