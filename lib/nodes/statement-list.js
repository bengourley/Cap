
// Module dependencies
var node = require('./node');

// This function returns a `statementList` constructor.
// It takes a shared `indentHandler` as an argument.
var statementList = function (indentHandler) {
  
  // The actual `statementList` constructor
  return function (spec) {

    spec.type = 'statement-list';

    // Extend the generic node object
    var statementList = node(spec),
      statements = spec.statements;

    // Returns a human readable representation of the node
    statementList.print = function () {
      var output = '', s;
      statements.forEach(function (s, i, arr) {
        output += indentHandler.getIndent() + s.print() + (i < arr.length - 1 ? '\n' : '');
      });
      return output;
    };

    // Returns the node compiled to js
    statementList.compile = function () {
      var code = '';
      statements.forEach(function (s, i, arr) {
        var shouldReturn = i === arr.length - 1 ? true : false;

        // Deal with a tuple. Implemented as an array.
        if (Array.isArray(s)) {
          code += indentHandler.getIndent() + '[';
          s.forEach(function (item, i, arr) {
            code += item.compile({});
            code += i < arr.length - 1 ? ', ' : '';
          });
          code += ']';
        } else {
          code += indentHandler.getIndent() +
            s.compile({ shouldReturn : shouldReturn });
        }
        code += (/^(conditional|where)$/.test(s.type) ? '\n' : ';\n');
      });

      return code;

    };

    return statementList;

  };

};

module.exports = statementList;
