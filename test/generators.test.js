/*
 * Tests for lib/generators.js
 * Run with `make test`
 */

/*
 * Module dependencies
 */

var createGenerators = require('../').generators,
    assert = require('assert');

var createLexer = require('./../lib/lexer'),
    createParser = require('./../lib/parser'),
    fs = require('fs');

var parseSample = function (file) {
  var parser = createParser(createLexer(), {
      getReport : function (msg) { return msg; }
    });
  return parser.parse(
    fs.readFileSync(__dirname + '/sample-programs/' + file)
  );
};

/*
 * Tests
 */

describe('lib/generators', function () {

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

      var ast = parseSample('scope.cap');
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

  describe('#functionLiteral()', function () {

    var ast;
    beforeEach(function () {
      ast = parseSample('functions.cap');
    });

    it('should create a function which takes no arguments', function () {
      var output = generators['functionLiteral'](ast.childNodes[0].childNodes[0], {
        scope : []
      });
      assert.equal(output, 'function __anon1() {\nreturn 0;\n}');
    });

    it('should create a function which takes arguments', function () {
      var output = generators['functionLiteral'](ast.childNodes[0].childNodes[1], {
        scope : []
      });
      assert.equal(output, 'function __anon1(x) {\nreturn x;\n}');
      output = generators['functionLiteral'](ast.childNodes[0].childNodes[2], {
        scope : []
      });
      assert.equal(output, 'function __anon2(x, y) {\nreturn x+y;\n}');
      output = generators['functionLiteral'](ast.childNodes[0].childNodes[3], {
        scope : []
      });
      assert.equal(output, 'function __anon3(x, y, z) {\nreturn x+y+z;\n}');
    });

    it('should name a function if it is being assigned', function () {
      var output = generators['assignment'](ast.childNodes[0].childNodes[4], {
        scope : [],
        omitReturn : true
      });
      assert.equal(output, 'var foo=function foo(x, y, z) {\nreturn x+y+z;\n}');
    });

  });

  describe('#assignment()', function () {

    it('should prefix variable assignments with var', function () {
      var ast = parseSample('assignment01.cap');
      var output = generators['assignment'](ast.childNodes[0].childNodes[0], {
        scope : [],
        omitReturn : true
      });
      assert.equal(output, 'var foo=10');

      ast = parseSample('assignment03.cap');
      output = generators['assignment'](ast.childNodes[0].childNodes[0], {
        scope : ['require'],
        omitReturn : true
      });
      assert.equal(output, 'var http=require(\'http\')');
    });

    it('should not prefix property assignments with var', function () {
      var ast = parseSample('assignment02.cap');
      var output = generators['statementList'](ast.childNodes[0], {
        scope : []
      });
      assert.equal(output.split('\n')[1], 'foo.bar=20;');
      assert.equal(output.split('\n')[2], 'return foo.bar;');
    });

  });

  describe('#call()', function () {

    it('should generate function calls correctly', function () {
      var ast = parseSample('call.cap');
      var output = generators['statementList'](ast.childNodes[0], {
        scope : ['foo', 'bar', 'baz']
      });
      assert.equal(output.split('\n')[0], 'foo();');
      assert.equal(output.split('\n')[1], 'foo(bar);');
      assert.equal(output.split('\n')[2], 'return foo(bar)(baz);');
    });

  });

  describe('#where()', function () {

    it('should generate where clauses correctly', function () {
      var ast = parseSample('where01.cap');
      var output = generators['statementList'](ast.childNodes[0], {
        scope : ['http']
      });
      assert.equal(output.split('\n')[0], 'var __s=function __s(req, res) {');
      assert.equal(output.split('\n')[1], 'res.writeHead(200);');
      assert.equal(output.split('\n')[2], 'return res.end(\'Hello World\');');

      ast = parseSample('where02.cap');
      output = generators['statementList'](ast.childNodes[0], {
        scope : ['foo']
      });
      assert.equal(output.split('\n')[0], 'var __bar=10;');
      assert.equal(output.split('\n')[1], 'return foo(__bar);');

    });

  });

  describe('#statementList()', function () {

    it('should always return as the last statement', function () {

      var ast = parseSample('statements01.cap');
      var output = generators['statementList'](ast.childNodes[0], {
        scope : ['foo', 'print', 'arg']
      });
      output = output.split('\n');
      assert.notEqual(output[output.length - 2].indexOf('return'), -1);

      ast = parseSample('statements02.cap');
      output = generators['statementList'](ast.childNodes[0], {
        scope : ['foo', 'print', 'arg']
      });
      output = output.split('\n');
      assert.notEqual(output[output.length - 3].indexOf('return'), -1);

      ast = parseSample('statements03.cap');
      output = generators['statementList'](ast.childNodes[0], {
        scope : ['foo', 'print', 'arg']
      });
      output = output.split('\n');
      console.log(output);
      assert.notEqual(output[output.length - 3].indexOf('return'), -1);

    });

  });

  describe('#trycatch()', function () {

    it('should generate a try catch block', function () {

      var ast = parseSample('trycatch.cap');
      var output = generators['trycatch'](ast.childNodes[0].childNodes[0], {
        scope : ['foo', 'print', 'bar']
      });

    });

  });

});