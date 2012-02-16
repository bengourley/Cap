var createLexer = require('../lib/lexer'),
    createParser = require('../lib/parser'),
    createGenerator = require('../lib/generator'),
    createErrorReporter = require('../lib/errorReporter'),
    beautify = require('js-beautify-node/beautify'),
    uglify = require('uglify-js');

var createCompiler = function () {

  var compiler = {};

  compiler.compile = function (data, options) {

    var errorReporter = createErrorReporter(data),
        lexer = createLexer(),
        parser = createParser(lexer, errorReporter),
        generator = createGenerator(parser, errorReporter);
    
    var ast = parser.parse(data);
    
    if (options.printtree) {
      return generator.generate({
        ast : ast,
        tree : true
      });
    } else {
      if (!options.compress) {
        return beautify.js_beautify(generator.generate({ ast : ast }), {
          indent_size : 2,
          indent_char : ' ',
          space_after_anon_function : true
        });
      } else {

        var uparser = uglify.parser,
            uglifier = uglify.uglify,
            tree;
        
        tree = uparser.parse(generator.generate({ ast : ast }));
        tree = uglifier.ast_mangle(tree);
        tree = uglifier.ast_squeeze(tree);
        
        return uglifier.gen_code(tree);

      }
    }

  };

  return compiler;

};

module.exports = createCompiler;