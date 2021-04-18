// Example 8-3. The extend() function, patched if necessary
var extend = (function() {
  for (var p in { toString: null }) {
    return function extend(o) {
      for (var i = 1, j = arguments.length ; i < j ; i++) {
        var source = arguments[i];
        for (var prop in source) o[prop] = source[prop];
      }
      return o;
    }
  }

  var protoProps = ["toString", "valueOf", "constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable","toLocaleString"];
  return function patched_extend(o) {
    for (var i = 1, j = arguments.length ; i < j ; i++) {
      var source = arguments[i];
      for (var prop in source) o[prop] = source[prop];
      for (var m = 1, n = protoProps.length ; m < n ; m++) {
        prop = protoProps[m];
        if (source.hasOwnProperty(prop)) o[prop] = source[prop];
      }
    }
    return o;
  }
})();