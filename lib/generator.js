// A module for managing the code generation
// phase. An instantiated generator exposes a
// simple one-method interface: `generate()`,
// which takes some options.

/*
 * Module dependencies
 */
var createIndentHandler = require('./indentHandler'),
    createGenerators = require('./generators'),
    fs = require('fs');

// `createGenerator()` instantiates a generator. It takes
// a single argument: a pre-instantiated `errorReporter`.
var createGenerator = function (filename, errorReporter) {

  var generator = {},
      ast;

  // `tree()` is a private utility that recursively
  // walks the nodes in the syntax tree and outputs
  // a human readable representation of it.
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

  // `generate()` takes a single options argument
  // which can contain the flags:
  //
  //  * `ast` *(required)* - the syntax tree to generate code from.
  //  * `tree` *(optional)* - if true returns a human readable
  //    representation of the syntax tree.
  generator.generate = function (options) {

    // Get the ast from the argument.
    ast = options.ast;

    // Create the generators object.
    var generators = createGenerators(filename, errorReporter);

    // Run the generator on the root node, which will
    // recursively generate all of the other nodes in the
    // tree.
    //
    // This stage happens regardless of whether the
    // code or tree is being returned because some
    // semantic checking happens on the generation pass.
    var compiledSource = generators['program'](ast);

    var output;

    // If the tree is required, get it and return
    // it, otherwise return the compiled source.
    if (options.tree) {
      output = tree();
    } else {
      output = compiledSource;
    }

    return output;

  };

  return generator;

};

module.exports = createGenerator;