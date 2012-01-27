
// Module dependencies
var node = require('./node');

// This function returns a `loop` constructor.
// It takes a shared `indentHandler` as an argument.
var loop = function (indentHandler) {
  
  // The actual `loop` constructor
  return function (spec) {

    spec.type = 'loop';

    // Extend the generic node object
    var loop = node(spec),
        form = spec.form,
        signature = spec.signature,
        statements = spec.statements;

    // Returns a human readable representation of the node
    loop.print = function () {
      var output = 'LOOP';
      return output;
    };

    // Returns the node compiled to js
    loop.compile = function (options) {

      var code = '';

      // TODO 'loop'

      code += form + ' (';
      signature.forEach(function (sig) {
        code += sig.compile({});
      });

      code += ') {\n';
      indentHandler.nextIndent();
      code += statements.compile({
        shouldReturn : false
      });

      indentHandler.prevIndent();
      code += indentHandler.getIndent() + '}';
      return code;

    };

    return loop;

  };

};

module.exports = loop;
