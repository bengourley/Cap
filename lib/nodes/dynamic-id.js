
// Module dependencies
var node = require('./node');

// This function returns a `dynamicId` constructor.
// It takes a shared `indentHandler` as an argument.
var dynamicId = function (indentHandler) {
  
  // The actual `dynamicId` constructor
  return function (spec) {

    spec.type = 'dynamicId';

    // Extend the generic node object
    var dynamicId = node(spec),
      call = spec.call,
      prop = spec.prop;

    // Returns a human readable representation of the node
    dynamicId.print = function () {
      return '<< ' + call.print() + ' >>.' + this.prop;
    };

    // Returns the node compiled to js
    dynamicId.compile = function (options) {
      return (options.shouldReturn ? 'return ' : '')
        + call.compile({}) + '.' + prop.compile();
    };

    return dynamicId;

  };

};

module.exports = dynamicId;
