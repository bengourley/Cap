// Module dependencies
var createIndentHandler = require('./indentHandler'),
    createGenerators = require('./generators');

var createGenerator = function (parser, errorReporter) {
  
  var generator = {},
      ast;

  var tree = function () {

    var indentHandler = createIndentHandler();
    
    var output = '\n';

    (function walkNode(node) {
      output += indentHandler.getIndent() + node.print() + '\n';
      indentHandler.nextIndent();
      node.childNodes.forEach(function (childNode) {
        walkNode(childNode);
      });
      indentHandler.prevIndent();
    }(ast));

    return output;

  };

  generator.generate = function (options) {

    ast = options.ast;

    var generators = createGenerators(parser, errorReporter);
    var compiledSource = generators['program'](ast);

    var output = '';

    if (options.tree) {
      output += tree();
    } else {
      output += compiledSource;
    }

    return output;

  };

  return generator;

};

module.exports = createGenerator;