
// Module dependencies
var node = require('./node');

// This function returns a `conditional` constructor.
// It takes a shared `indentHandler` as an argument.
var conditional = function (indentHandler) {
  
  // The actual `conditional` constructor
  return function (spec) {

    spec.type = 'conditional';

    // Extend the generic node object
    var conditional = node(spec),
      iff = spec.iff,
      elseIfs = spec.elseIfs || [],
      elsee = spec.elsee;

    // Returns a human readable representation of the node
    conditional.print = function () {
      var output = '';
      indentHandler.nextIndent();
      output += 'if (' + iff.condition.print() + ') do \n' +
        indentHandler.getIndent() + iff.body.print();


      elseIfs.forEach(function (elseIf) {
        output += '\nelse if (' + elseIf.condition.print() + ') do \n' +
          indentHandler.getIndent() + elseIf.body.print();
      });

      output += elsee
        ? '\nelse\n' + indentHandler.getIndent() + elsee.body.print()
        : '';
      indentHandler.prevIndent();
      return output;
    };

    // Returns the node compiled to js
    conditional.compile = function (options) {
      var code = 'if (' + iff.condition.compile({}) + ') {\n';
      indentHandler.nextIndent();
      code += iff.body.compile();
      indentHandler.prevIndent();
      code += indentHandler.getIndent() + '}';

      elseIfs.forEach(function (elseIf) {
        code += ' else if (' + elseIf.condition.compile() + ') {\n';
        code += indentHandler.getIndent() + elseIf.body.compile();
        code += indentHandler.getIndent() + '}';
      });


      if (elsee) {
        indentHandler.nextIndent();
        code += ' else {\n' + elsee.body.compile();
        indentHandler.prevIndent();
        code += indentHandler.getIndent() + '}';
      }
      return code;

    };

    return conditional;

  };

};

module.exports = conditional;
