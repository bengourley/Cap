
// Module dependencies
var node = require('./node');

// This function returns an `fn` constructor.
// It takes a shared `indentHandler` as an argument.
var fn = function (indentHandler) {
  
  // The actual `fn` constructor
  return function (spec) {

    spec.type = 'fn';

    // Extend the generic node object
    var fn = node(spec),
      body = spec.body,
      params = spec.params;

    // Returns a human readable representation of the node
    fn.print = function () {
      var output = 'function->\n';
      indentHandler.nextIndent();
      output += body.print();
      indentHandler.prevIndent();
      return output;
    };

    // Returns the node compiled to js
    fn.compile = function (options) {
      var code = options.shouldReturn ? 'return ' : '';
      params.forEach(function (p, i, arr) {
        code += i ? indentHandler.getIndent() : '';
        indentHandler.nextIndent();
        code += i ? 'return ' : '';
        code += 'function (' + p.compile({}) + ') {\n';
      });
      code += body.compile();
      params.forEach(function (p, i, arr) {
        indentHandler.prevIndent();
        code += indentHandler.getIndent() + '}' + (i < arr.length - 1 ? ';\n' : '');
      });
      return code;
    };

    return fn;

  };

};

module.exports = fn;
