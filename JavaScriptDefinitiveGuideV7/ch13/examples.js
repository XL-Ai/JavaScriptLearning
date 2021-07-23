// Chapter 13. Asynchronous JavaScript
// 13.1 Asynchronous Programming with Callbacks
// 13.2 Promises
// 13.2.7 Promises in Sequence
function fetchSequentially(urls) {
  const bodies = [];

  function fetchOne(url) {
    return fetch(url).then(resp => resp.text()).then(body => {
      bodies.push(body);
    })
  }

  let p = Promise.resolve(undefined);

  for (url of urls) {
    p = p.then(() => fetchOne(url));
  }

  return p.then(() => bodies);
}

function promiseSequence(inputs, promiseMaker) {
  inputs = [...inputs];

  function handleNextInput(outputs) {
    if (inputs.length === 0) {
      return outputs;
    } else {
      let nextInput = inputs.shift();
      return promiseMaker(nextInput).then(output => outputs.concat(output)).then(handleNextInput);
    }
  }

  return Promise.resolve([]).then(handleNextInput);
}

function fetchBody(url) { return fetch(url).then(r => r.text()); }
promiseSequence(urls, fetchBody).then(bodies => { }).catch(console.error);

// 13.4 Asynchronous Iteration
// 13.4.1 The for/await Loop
const fs = require('fs');
const { resolve } = require('node:path');

async function parseFile(fileName) {
  let stream = fs.createReadStream(fileName, { encoding: "utf-8"});
  for await (let chunk of stream) {
    console.log(`chunk: ${chunk}`);
  }
}

// 13.4.3 Asynchronous Generators
function elapsedTime(ms) {
  console.log('elapsedTime called');
  return new Promise(resolve => setTimeout(() => {
    console.log('elapsedTime resolved');
    resolve();
  }, ms));
}

async function* clock(interval, max = Infinity) {
  for (let count = 1; count <= max; count++) {
    await elapsedTime(interval);
    yield count;
  }
}

async function test() {
  for await (let tick of clock(1000, 10)) {
    console.log(tick);
  }
  console.log('test end');
}

test();

// 13.4.4 Implementing Asynchronous Iterators
function clock(interval, max = Infinity) {
  function until(time) {
    console.log(`until start => time: ${time}, now: ${Date.now()}`);
    return new Promise(resolve => {
      console.log(`until Promise handler start => now: ${Date.now()}`);
      setTimeout(() => {
        console.log(`until Promise resolved: now: ${Date.now()}`);
        resolve();
      }, time - Date.now());
      console.log(`until Promise handler end => now: ${Date.now()}`);
    });
  }

  return {
    startTime: Date.now(),
    count: 1,
    async next() {
      console.log(`clock next start => now : ${Date.now()}`);
      if (this.count > max) {
        return { done: true };
      }
      console.log(`clock next => startTime: ${this.startTime}, count: ${this.count}, now: ${Date.now()}`);
      let targetTime = this.startTime + this.count * interval;
      console.log(`clock next => targetTime: ${targetTime}`);
      await until(targetTime);
      console.log(`clock next end => now : ${Date.now()}`);
      return { value: this.count++ };
    },
    [Symbol.iterator]() { return this; }
  }
}

class AsyncQueue {
  constructor() {
    this.values = [];
    this.resolvers = [];
    this.closed = false;
  }

  enqueue(value) {
    if (this.closed) {
      throw new Error("AsyncQueue closed");
    }
    if (this.resolvers.length > 0) {
      const resolve = this.resolvers.shift();
      resolve(value);
    } else {
      this.values.push(value);
    }
  }

  dequeue() {
    if (this.values.length > 0) {
      const value = this.values.shift();
      return Promise.resolve(value);
    } else if (this.closed) {
      return Promise.resolve(AsyncQueue.EOS);
    } else {
      return new Promise((resolve) => { this.resolvers.push(resolve); });
    }
  }

  close() {
    while(this.resolvers.length > 0) {
      this.resolvers.shift()(AsyncQueue.EOS);
    }
    this.closed = true;
  }

  [Symbol.asyncIterator]() { return this; }

  next() {
    return this.dequeue().then(value => (value === AsyncQueue.EOS) ? { value: undefined, done: true } : { value, done: false })
  }
}

AsyncQueue.EOS = Symbol('end-of-stream');

function eventStream(elt, type) {
  const q = new AsyncQueue();
  elt.addEventListener(type, e => q.enqueue(e));
  return q;
}

async function handleKeys() {
  for await (const event of eventStream(document, 'keypress')) {
    console.log(event.key);
  }
}