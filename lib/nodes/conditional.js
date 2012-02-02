
// Module dependencies
var node = require('./node');

var conditional = function (spec) {

  spec.type = 'conditional';

  // Extend the generic node object
  var conditional = node(spec),
    iff = spec.iff,
    elseIfs = spec.elseIfs || [],
    elsee = spec.elsee;

  // Returns a human readable representation of the node
  conditional.print = function () {
    return spec.type;
  };

  // Returns the node compiled to js
  conditional.compile = function (options) {
    var code = 'if (' + iff.condition.compile({}) + ') {\n';
    code += iff.body.compile({});
    code += '}';

    elseIfs.forEach(function (elseIf) {
      code += ' else if (' + elseIf.condition.compile({}) + ') {\n';
      code += elseIf.body.compile({});
      code += '}';
    });


    if (elsee) {
      code += ' else {\n' + elsee.body.compile();
      code += '}';
    }
    return code;

  };

  return conditional;

};

module.exports = conditional;
