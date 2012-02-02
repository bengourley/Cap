
// Module dependencies
var node = require('./node');

var loop = function (spec) {

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
    code += statements.compile({
      shouldReturn : false
    });

    code += '}';
    return code;

  };

  return loop;

};

module.exports = loop;
