// Module dependencies
var createIndentHandler = require('./indentHandler'),
    createGenerators = require('./generators'),
    uglify = require("uglify-js");

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

      output += '\nRaw compiled source:\n';
      output += compiledSource;

      var uparser = uglify.parser,
          uglifier = uglify.uglify;
      
      output += '\n\nBeatified output:\n';
      output += uglifier.gen_code(uglifier.ast_squeeze(
                  uparser.parse(compiledSource)
                ), {
                  beautify : true
                });
    }

    return output;

  };

  return generator;

};

module.exports = createGenerator;