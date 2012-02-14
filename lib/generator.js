// Module dependencies
var createIndentHandler = require('./indentHandler'),
    createGenerators = require('./generators'),
    uglify = require("uglify-js");

var createGenerator = function (parser, errorReporter) {
  
  var generator = {};

  generator.generate = function (ast) {

    var generators = createGenerators(parser, errorReporter);

    var compiledSource = generators['program'](ast);

    console.log('\nRaw compiled source:\n');
    console.log(compiledSource);

    var uparser = uglify.parser,
        uglifier = uglify.uglify;
    
    console.log('\n\nBeatified output:\n');
    console.log(
      uglifier.gen_code(uglifier.ast_squeeze(
        uparser.parse(compiledSource)
      ), {
        beautify : true
      })
    );

  };

  generator.printTree = function (ast) {

    var indentHandler = createIndentHandler();
    
    (function walkNode(node) {
      console.log(indentHandler.getIndent() + node.print());
      indentHandler.nextIndent();
      node.childNodes.forEach(function (childNode) {
        walkNode(childNode);
      });
      indentHandler.prevIndent();
    }(ast));

  };

  return generator;

};

module.exports = createGenerator;