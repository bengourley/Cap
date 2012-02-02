
// Module dependencies
var node = require('./node');

var statementList = function (spec) {

  spec.type = 'statement-list';

  // Extend the generic node object
  var statementList = node(spec),
    statements = spec.statements;

  // Returns a human readable representation of the node
  statementList.print = function () {
    var output = '', s;
    statements.forEach(function (s, i, arr) {
      output += s.print() + (i < arr.length - 1 ? '\n' : '');
    });
    return output;
  };

  // Returns the node compiled to js
  statementList.compile = function (options) {
    var code = '',
        neverReturn = options.shouldReturn === false;
    statements.forEach(function (s, i, arr) {
      var shouldReturn = !neverReturn && i === arr.length - 1;

      // Deal with a tuple. Implemented as an array.
      if (Array.isArray(s)) {
        code += (shouldReturn ? 'return ' : '') + '[';
        s.forEach(function (item, i, arr) {
          code += item.compile({});
          code += i < arr.length - 1 ? ', ' : '';
        });
        code += ']';
      } else {
        code += s.compile({ shouldReturn : shouldReturn });
      }
      code += (/^(conditional|where)$/.test(s.type) ? '\n' : ';\n');
    });

    return code;

  };

  return statementList;

};

module.exports = statementList;
