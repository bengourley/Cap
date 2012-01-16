
// Module dependencies
var node = require('./node');

// This function returns a `operator` constructor.
// It takes a shared `indentHandler` as an argument.
var operator = function (indentHandler) {
  
  // The actual `operator` constructor
  return function (spec) {

    spec.type = 'operator';

    // Extend the generic node object
    var operator = node(spec),
      left = spec.left,
      right = spec.right,
      op = spec.op,
      fix = spec.fix;

    switch (op) {
    case '&': op = '&&'; break;
    case '|': op = '||'; break;
    default: break;
    }

    operator.bracketed = false;

    // Returns a human readable representation of the node
    operator.print = function () {
      var output = 'Mathsy expr: ';
      output += 'Left: ' + left.print();
      output += ' Right: ' + right.print();
      output += ' Op: ' + op;
      output += ' Fix: ' + fix;
      output += ' Bracketed: ' + operator.bracketed;
      return output;
    };

    // Returns the node compiled to js
    operator.compile = function (options) {
      var code = options.shouldReturn ? 'return ' : '';
      switch (fix) {
      case 'in': return code + (operator.bracketed ? '(' : '')
          + left.compile() + ' ' + op + ' ' + right.compile()
          + (operator.bracketed ? ')' : '');
      case 'post': return code + left.compile() + op;
      case 'pre': return code + op + left.compile();
      }
    };

    return operator;

  };

};

module.exports = operator;

