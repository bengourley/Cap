// Module dependencies
var node = require('./node'),
    runtime = require('./../runtime');

// This function returns a `program` constructor.
// It takes a shared `indentHandler` as an argument.
var program = function (indentHandler) {

  // The actual `program` constructor
  return function (spec) {

    spec.type = 'program';

    // Extend the generic node object
    var program = node(spec),
      statementList = spec.statementList;
    
    // Returns a human readable representation of the node
    program.print = function () {
      return 'Program:\n' + statementList.print();
    };

    // Returns the node compiled to js
    program.compile = function () {
      indentHandler.nextIndent();
      return '(function () {\n\n' +
        '/* Cap runtime */\n' +
        runtime.compile({}) + '\n\n' +
        statementList.compile({}) +
        '\n}());';
    };

    return program;

  };

};

module.exports = program;
