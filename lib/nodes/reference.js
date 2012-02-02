// Module dependencies
var node = require('./node');

var reference = function (spec) {

  spec.type = 'reference';

  // Extend the generic node object
  var reference = node(spec),
    path = spec.path;

  // Returns a human readable representation of the node
  reference.print = function () {
    return spec.type + path;
  };

  // Returns the node compiled to js
  reference.compile = function (options) {
    var code = (options.shouldReturn ? 'return ' : '');
    path.forEach(function (p, i, arr) {
      code += p.compile({ namespace : i === 0 }) + (i < arr.length - 1 ? '.' : '');
    });
    return code;
  };

  return reference;

};

module.exports = reference;
