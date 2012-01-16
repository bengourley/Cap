
// Module dependencies
var node = require('./node');

// This function returns an `object` constructor.
// It takes a shared `indentHandler` as an argument.
var object = function (indentHandler) {
  
  // The actual `object` constructor
  return function (spec) {

    spec.type = 'object';

    // Extend the generic node object
    var object = node(spec),
      propList = spec.propList;

    // Returns a human readable representation of the node
    object.print = function () {
      var output = 'object->';
      indentHandler.nextIndent();
      propList.forEach(function (prop) {
        output += '\n' + indentHandler.getIndent() +
          prop[0].print() + ': ' + prop[1].print({ assign : true });
      });
      indentHandler.prevIndent();
      return output;
    };

    // Returns the node compiled to js
    object.compile = function (options) {
      var code = options.shouldReturn ? 'return {' : '{';
      indentHandler.nextIndent();
      propList.forEach(function (prop, i, arr) {
        code += '\n' + indentHandler.getIndent()
          + '"' + prop.id.compile({}) + '" : '
          + prop.expr.compile({})
          + (i < arr.length - 1 ? ',' : '');
      });
      indentHandler.prevIndent();
      code += '\n' + indentHandler.getIndent() + '}';
      return code;
    };

    return object;

  };

};

module.exports = object;
