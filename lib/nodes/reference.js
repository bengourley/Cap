
// Module dependencies
var node = require('./node');

// This function returns a `reference` constructor.
// It takes a shared `indentHandler` as an argument.
var reference = function (indentHandler) {
  
  // The actual `reference` constructor
  return function (spec) {

    spec.type = 'reference';

    // Extend the generic node object
    var reference = node(spec),
      path = spec.path;

    // Returns a human readable representation of the node
    reference.print = function () {
      return '<< ' + call.print() + ' >>.' + this.prop;
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

};

module.exports = reference;
