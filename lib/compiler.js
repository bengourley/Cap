/*
 * Module dependencies
 */
var createLexer = require('../lib/lexer'),
    createParser = require('../lib/parser'),
    createGenerator = require('../lib/generator'),
    createErrorReporter = require('../lib/errorReporter'),
    beautify = require('js-beautify-node/beautify'),
    uglify = require('uglify-js');

var createCompiler = function () {

  var compiler = {};

  /*
   * Single compile function
   */
  compiler.compile = function (input, options) {

    // Create the components of the compiler
    // plus the error reporter
    var errorReporter = createErrorReporter(input),
        lexer = createLexer(),
        parser = createParser(lexer, errorReporter),
        generator = createGenerator(parser, errorReporter);
    
    // Parse the input
    var ast = parser.parse(input);

    if (options.tree) {

      // Print the syntax tree
      return generator.generate({
        ast : ast,
        tree : true
      });

    } else {

      if (!options.compress) {

        // Format the output JS
        return beautify.js_beautify(generator.generate({ ast : ast }), {
          indent_size : 2,
          indent_char : ' ',
          space_after_anon_function : true
        });

      } else {

        // Initialise uglify
        var uparser = uglify.parser,
            uglifier = uglify.uglify,
            tree;
        
        // Do the compression
        tree = uparser.parse(generator.generate({ ast : ast }));
        tree = uglifier.ast_mangle(tree);
        tree = uglifier.ast_squeeze(tree);
        
        // Output the code
        return uglifier.gen_code(tree);

      }
    }

  };

  return compiler;

};

module.exports = createCompiler;