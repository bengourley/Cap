// A module that connects each of
// the compiler's components. It exposes
// a `createCompiler` function to other modules
// which will instantiate a compiler. The compiler
// has a single function `compile`, which takes some
// input and options, and returns some output.
// 
// The compiler deals with some post processing, like
// formatting and compressing the generated code.

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

  // `compile()` takes two arguments: `input`, the
  // source code to compile, and `options`, an object
  // with some optional flags to direct the compilation:
  //
  //   * `tree` - if true, a human-readable
  //   print of the syntax tree is returned
  //   * `compress` - if true, the JS output is compressed
  //   using the `uglify-js` module, before being returned
  //   
  // If neither flag is set, the ouput js is formatted
  // with the `js-beautify-node` module.
  compiler.compile = function (input, options) {

    // Instantiate each on the compilers components:
    // 
    //   * `lexer`
    //   * `parser`
    //   * `generator`
    //    
    // And an `errorReporter` to gracefully handle
    // any errors that occur during the compilation
    // process.
    var errorReporter = createErrorReporter(input),
        lexer = createLexer(),
        parser = createParser(lexer, errorReporter),
        generator = createGenerator(errorReporter);
    
    // Parse the input. Any parse errors would
    // be thrown at this point.
    var ast = parser.parse(input);

    if (options.tree) {

      // `options.tree` was set so print the syntax tree.
      return generator.generate({
        ast : ast,
        tree : true
      });

    } else {

      if (options.compress) {
      
        // `options.compress` was set so initialise `uglify-js`.
        var uparser = uglify.parser,
            uglifier = uglify.uglify,
            tree;
        
        // Do the compression.
        tree = uparser.parse(generator.generate({
          ast : ast
        }));
        tree = uglifier.ast_mangle(tree);
        tree = uglifier.ast_squeeze(tree);
        
        // Output the compressed code.
        return uglifier.gen_code(tree);        

      } else {

        // No flags were set so format code with `beautify`
        // and return the output.
        return beautify.js_beautify(generator.generate({
            ast : ast
          }), {
            indent_size : 2,
            indent_char : ' ',
            space_after_anon_function : true
        });

      }
    }

  };

  return compiler;

};

module.exports = createCompiler;