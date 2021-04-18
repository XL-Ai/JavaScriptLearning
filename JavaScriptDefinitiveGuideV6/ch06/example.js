// Example 6-1. Creating a new object that inherits from a prototype
function inherit(p) {
  if (p == null) throw TypeError();
  if (Object.create) return Object.create(p);
  var t = typeof p;
  if (t != 'object' && t != 'function') throw TypeError();
  function f() {};
  f.prototype = p;
  return new f();
}

// Example 6-2. Object utility functions that enumerate properties
function extend(o, p) {
  for (prop in o) {
    o[prop] = p[prop];
  }
  return o;
}