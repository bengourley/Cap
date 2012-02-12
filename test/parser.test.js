/*
 * Tests for lib/Parser.js
 * Run with `jake test`
 */

/*
 * Module dependencies
 */

var createParser = require('../lib/parser'),
    assert = require('assert');

/*
 * Tests
 */

describe('parser', function () {
  
  it('should parse an empty program', function () {
    var program = createParser().parse('');
    assert.equal(program.type, 'program');
    assert.equal(program.childNodes[0].type, 'statementList');
    assert.equal(program.childNodes[0].childNodes.length, 0);
  });

  it('should parse numbers', function () {
    var program = createParser().parse('10');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'leaf');
    assert.equal(program.childNodes[0].childNodes[0].value, '10');
  });

  it('should parse strings', function () {
    var program = createParser().parse('\'stringy\'');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'leaf');
    assert.equal(program.childNodes[0].childNodes[0].value, '\'stringy\'');
  });

  it('should parse boolean values', function () {
    
    var program = createParser().parse('true');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'leaf');
    assert.equal(program.childNodes[0].childNodes[0].value, 'true');

    program = createParser().parse('false');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'leaf');
    assert.equal(program.childNodes[0].childNodes[0].value, 'false');

  });

  it('should parse references and identifiers', function () {

    var program = createParser().parse('a');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'leaf');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].value, 'a');

    program = createParser().parse('a.b');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'leaf');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].value, 'a');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'leaf');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].value, 'b');

    program = createParser().parse('(((a.b)))');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'leaf');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].value, 'a');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'leaf');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].value, 'b');

    assert.throws(function () {
      program = createParser().parse('a.');
    });

  });

  it('should parse algebraic and boolean expressions', function () {
    
    var program = createParser().parse('a + b');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'operator');
    assert.equal(program.childNodes[0].childNodes[0].meta.op, '+');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'reference');

    program = createParser().parse('a & b');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'operator');
    assert.equal(program.childNodes[0].childNodes[0].meta.op, '&');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'reference');

  });

  it('should parse a function call', function () {
    
    var program = createParser().parse('a b');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'call');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'reference');

    program = createParser().parse('a ()');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'call');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'reference');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'leaf');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].value, '');

    program = createParser().parse('a b c');
    assert.equal(program.childNodes[0].childNodes.length, 1);
    assert.equal(program.childNodes[0].childNodes[0].type, 'call');
    assert.equal(program.childNodes[0].childNodes[0].childNodes.length, 2);
    assert.equal(program.childNodes[0].childNodes[0].childNodes[0].type, 'call');
    assert.equal(program.childNodes[0].childNodes[0].childNodes[1].type, 'reference');

  });

});