/*
 * Tests for lib/generators.js
 * Run with `make test`
 */

/*
 * Module dependencies
 */

var createGenerators = require('../').generators,
    assert = require('assert');

/*
 * Tests
 */

describe('generators', function () {

  var generators;
  beforeEach(function () {
    generators = createGenerators('test', {
      getReport : function (msg) { return msg; }
    });
  });

  describe('#program()', function () {

    it('should wrap the program in an annonymous fn', function () {

      var output = generators['program']({
        childNodes : [{ type : 'leaf', value :''}]
      });

      assert.equal(output, '(function (module, exports, require) {\n' +
        '}(typeof module !== \'undefined\' ? module : _module(\'test\'), ' +
        'typeof exports !== \'undefined\' ? exports : _exports(\'test\'), ' +
        'function (module) { return require(module.indexOf(\'./\') === 0 ? module + \'.cap.js\' : module); }\n'+ '));');

    });

    it('should accurately maintain scoped variables', function () {
      var createLexer = require('./../lib/lexer'),
          createParser = require('./../lib/parser'),
          fs = require('fs');

      var parser = createParser(createLexer());
      var ast = parser.parse(fs.readFileSync(__dirname + '/sample-programs/scope.cap'));
      var meta = {
        scope : []
      };
      var output = generators['statementList'](ast.childNodes[0], meta);

      assert(meta.scope.indexOf('foo') !== -1);
      assert(meta.scope.indexOf('bar') !== -1);
      assert(meta.scope.indexOf('fun') !== -1);
      assert(meta.scope.indexOf('a') === -1);
      assert(meta.scope.indexOf('x') === -1);
      assert(meta.scope.indexOf('key') === -1);

    });

  });

  describe('#leaf()', function () {
    it('should output a leaf node\'s value', function () {

      var output = generators['leaf']({
        type : 'leaf',
        value : '10'
      });

      assert.equal(output, '10');

    });
  });

  describe('#identifier()', function () {

    it('should determine whether an identifier is in scope', function () {

      var output = generators['identifier']({
        type : 'identifier',
        value : 'foo'
      }, { scope : ['foo'] });

      assert.equal(output, 'foo');

      assert.throws(function () {
        generators['identifier']({
          type : 'identifier',
          value : 'foo'
        }, { scope : [] });
      });

    });

    it('should add an identifier to the scope if specified', function () {

      var meta = {
        scope : [],
        addToScope : true,
        ignoreScope : true
      };

      assert.equal(meta.scope.length, 0);

      var output = generators['identifier']({
        type : 'identifier',
        value : 'foo'
      }, meta);

      assert.equal(meta.scope[0], 'foo');

    });

  });

  describe('#concatenation()', function () {

    it('should prepend an empty string to a concatenation');

  });

});