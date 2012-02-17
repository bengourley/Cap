// A modules that represents individual
// nodes in the syntax tree.

// `node()` instantiates a node object
// with the given properties, `spec`.
var node = function (spec) {
  
  var node = {};
  
  // If a `type` was given, use it. Otherwise
  // default to the leaf type.
  // 
  // If `childNodes` were given, use them. Otherwise
  // default to an empty array.
  // 
  // If a `value` was given, use it. Otherwise
  // default to the empty string.
  node.type = spec.type || 'leaf';
  node.meta = spec.meta;
  node.childNodes = spec.childNodes || [];
  node.value = spec.value || '';
  node.sourceLocation = spec.sourceLocation;

  // `print()` returns a human readable string
  // representing the node.
  node.print = function () {
    var meta = '';
    if (node.meta) {
      Object.keys(node.meta).forEach(function (key) {
        meta += '[';
        if (node.meta.hasOwnProperty(key)) {
          meta += key + ': ' + node.meta[key];
        }
        meta += ']';
      });
    }
    return '- ' + node.type + ': ' + node.value + meta;
  };

  // `toString()` is used by the JS runtime when
  // `console.log()` is passed an object. This function
  // overrides the default output which is `[object object]`
  // for more meaninful debugging output.
  node.toString = function () {
    return '[Node ' + node.type + ']';
  };

  return node;

};

module.exports = node;
