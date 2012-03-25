/*
 * Tests for lib/parser.js
 * Run with `make test`
 */

/*
 * Module dependencies
 */

var createParser = require('../').parser,
    createLexer = require('../').lexer,
    assert = require('assert');

/*
 * Tests
 */

describe('parser', function () {

  it('should parse an empty program', function () {
    var program = createParser(createLexer()).parse('');
    assert.equal(program.type, 'program');
    assert.equal(program.childNodes[0].type, 'statementList');
    assert.equal(program.childNodes[0].childNodes.length, 0);
  });

  it('should parse numbers', function () {
    var program = createParser(createLexer()).parse('10');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'leaf');
    assert.equal(program.childNodes[0].childNodes[0].value, '10');
  });

  it('should parse strings', function () {
    var program = createParser(createLexer()).parse('\'stringy\'');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'leaf');
    assert.equal(program.childNodes[0].childNodes[0].value, '\'stringy\'');
  });

  it('should parse boolean values', function () {

    var program = createParser(createLexer()).parse('true');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'leaf');
    assert.equal(program.childNodes[0].childNodes[0].value, 'true');

    program = createParser(createLexer()).parse('false');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'leaf');
    assert.equal(program.childNodes[0].childNodes[0].value, 'false');

  });

  it('should parse references and identifiers', function () {

    var program = createParser(createLexer()).parse('a');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'identifier');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].value, 'a');

    program = createParser(createLexer()).parse('a.b');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'identifier');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].value, 'a');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'identifier');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].value, 'b');

    program = createParser(createLexer()).parse('(((a.b)))');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'tuple');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].value, 'a');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].value, 'b');

    program = createParser(createLexer()).parse('(a b).c');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'tuple');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'identifier');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].value, 'c');

    assert.throws(function () {
      program = createParser(createLexer()).parse('a.');
    });

  });

  it('should parse algebraic expressions', function () {

    var program = createParser(createLexer()).parse('a + b');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'operator');
    assert.equal(program.childNodes[0].childNodes[0].meta.op, '+');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'reference');

    program = createParser(createLexer()).parse('a - b');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'operator');
    assert.equal(program.childNodes[0].childNodes[0].meta.op, '-');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'reference');

    program = createParser(createLexer()).parse('a * b');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'operator');
    assert.equal(program.childNodes[0].childNodes[0].meta.op, '*');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'reference');

    program = createParser(createLexer()).parse('a / b');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'operator');
    assert.equal(program.childNodes[0].childNodes[0].meta.op, '/');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'reference');

  });

  it('should parse boolean expressions', function () {

    var program = createParser(createLexer()).parse('a & b');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'operator');
    assert.equal(program.childNodes[0].childNodes[0].meta.op, '&');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'reference');

    program = createParser(createLexer()).parse('a | b');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'operator');
    assert.equal(program.childNodes[0].childNodes[0].meta.op, '|');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'reference');

    program = createParser(createLexer()).parse('a == b');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'operator');
    assert.equal(program.childNodes[0].childNodes[0].meta.op, '===');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'reference');

  });

  it('should parse concatenations', function () {

    var program = createParser(createLexer()).parse('a : b');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'concatenation');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'reference');

    program = createParser(createLexer()).parse('a : b : c');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'concatenation');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'concatenation');

  });

  it('should parse a function call', function () {

    var program = createParser(createLexer()).parse('a b');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'call');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'reference');

    program = createParser(createLexer()).parse('a ()');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'call');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'tuple');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].childNodes[0].value, '');

    program = createParser(createLexer()).parse('a b c');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'call');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'call');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'reference');

    program = createParser(createLexer()).parse('(a b) c');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'call');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'tuple');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'reference');

    program = createParser(createLexer()).parse('a (b c)');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'call');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'tuple');

  });

  it('should parse assignments', function () {

    var program = createParser(createLexer()).parse('a = b');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'assignment');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'reference');

    program = createParser(createLexer()).parse('a = b c');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'assignment');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'call');

    program = createParser(createLexer()).parse('a = []\n  foo\n  bar\n10');
    assert.equal(program.childNodes[0].childNodes.length, 2);

  });

  it('should parse vector literals', function () {

    var program = createParser(createLexer()).parse('[]');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'vectorLiteral');

    program = createParser(createLexer()).parse('[]\n  1\n  2\n  3');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'vectorLiteral');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'expressionList');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].childNodes.length, 3);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].childNodes[0].type, 'leaf');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].childNodes[0].value, 1);

  });

  it('should parse object literals', function () {

    var program = createParser(createLexer()).parse('{}');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'objectLiteral');

    program = createParser(createLexer()).parse('{}\n  a = 1\n  a = 2\n  a = 3');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'objectLiteral');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'assignmentList');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].childNodes.length, 3);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].childNodes[0].type, 'assignment');

  });

  it('should parse function literals', function () {

    var program = createParser(createLexer()).parse('||');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'functionLiteral');

    program = createParser(createLexer()).parse('||\n  1 * 1');

    program = createParser(createLexer()).parse('|x|\n  x * x');

    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'functionLiteral');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'params');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'statementList');

    assert.throws(function () {
        program = createParser(createLexer()).parse('|x, y|\n  y * x');
    });

  });

  it('should not collect expressions after literals', function () {

      var program = createParser(createLexer()).parse('|x|\n  x + 10\n10+10');
      assert.equal(program.childNodes[0].childNodes.length, 2);
      assert.equal(program.childNodes[0].childNodes[0].type, 'functionLiteral');
      assert.equal(program.childNodes[0].childNodes[1].type, 'operator');

  });

  it('should be ok with leading newlines', function () {

      var program = createParser(createLexer()).parse('\n\nx = 10');
      assert.equal(program.childNodes[0].childNodes.length, 1);
      assert.equal(program.childNodes[0].childNodes[0].type, 'assignment');

  });

  it('should parse a where clause', function () {

    var program = createParser(createLexer()).parse('foo bar where\n  bar = 10');

    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'where');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'assignmentList');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'call');

  });

  it('should parse a conditional', function () {

    var program = createParser(createLexer()).parse('if foo\n  foo bar\nelse\n  baz bar');

    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'conditional');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'ifFragment');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'elseFragment');

    program = createParser(createLexer()).parse('if foo\n  foo bar\nelse if bar\n  baz');

    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'conditional');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'ifFragment');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'ifFragment');

    program = createParser(createLexer()).parse('if foo\n  foo bar\nelse if bar\n  baz\nelse\n  foo');

    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'conditional');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 3);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'ifFragment');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'ifFragment');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[2].type, 'elseFragment');

  });

  it('should parse a shorthand conditional', function () {

    var program = createParser(createLexer()).parse('foo ?\n  foo bar\n  baz bar');

    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'conditional');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'ifFragment');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'elseFragment');

    program = createParser(createLexer()).parse('foo ?\n  foo bar');

    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'conditional');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'ifFragment');

  });

  it('should parse a tuple', function () {
    var program = createParser(createLexer()).parse('(1, 2)');

    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'tuple');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'leaf');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'leaf');

  });

});