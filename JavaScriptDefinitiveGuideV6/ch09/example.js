// Example 9-6. Set.js: An arbitrary set of values
function Set() {
  this.values = {};
  this.n = 0;
  this.add.apply(this, arguments);
}

Set.prototype.add = function() {
  for (var i = 0, j = arguments.length ; i < j ; i++ ) {
    var val = arguments[i];
    var str = Set._v2s(val);
    if (!this.values.hasOwnProperty(str)) {
      this.value[str] = val;
      this.n++;
    }
  }
  return this;
};

Set.prototype.remove = function() {
  for (var i = 0, j = arguments.length ; i < j ; i++ ) {
    var str = Set._v2s(arguments[i]);
    if (this.values.hasOwnProperty(str)) {
      delete this.values[str];
      this.n--;
    }
  }
  return this;
};

Set.prototype.contains = function(value) {
  return this.values.hasOwnProperty(Set._v2s(value));
};

Set.prototype.size = function() { return this.n; };

Set.prototype.forEach = function(f, context) {
  for (var s in this.values) {
    if (this.values.hasOwnProperty(s)) f.call(context, this.values[s]);
  }
};

Set._v2s = function(val) {
  switch (val) {
    case undefined: return 'u';
    case null: return 'n';
    case true: return 't';
    case false: return 'f';  
    default: switch(typeof val) {
      case 'number': return '#' + val;
      case 'string': return '"' + val;
      default: return '@' + objectId(val);
    }
  }

  function objectId(o) {
    var prop = "|**objectId**|";
    if (!o.hasOwnProperty(prop)) o[prop] = Set._v2s.next++;
    return o[prop];
  }
};
Set._v2s.next = 100;

// Example 9-11. Subclass definition utilities
function defineSubClass(superClass, constructor, methods, statics) {
  constructor.prototype = inherit(superClass.prototype);
  constructor.prototype.constructor = constructor;
  if (methods) extend(constructor.prototype, methods);
  if (statics) extend(constructor, statics);
  return constructor;
}