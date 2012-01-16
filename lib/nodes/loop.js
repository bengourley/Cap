
// Module dependencies
var node = require('./node');

// This function returns a `loop` constructor.
// It takes a shared `indentHandler` as an argument.
var loop = function (indentHandler) {
  
  // The actual `conditional` constructor
  return function (spec) {

    spec.type = 'loop';

    // Extend the generic node object
    var loop = node(spec);

    // Returns a human readable representation of the node
    loop.print = function () {
      var output = 'LOOP';
      return output;
    };

    // Returns the node compiled to js
    loop.compile = function (options) {
      return 'LOOP';
    };

    return loop;

  };

};

module.exports = loop;
