/*
 * Tests for lib/generators.js
 * Run with `make test`
 */

/*
 * Module dependencies
 */

var generators = require('../').generators(),
    assert = require('assert');

/*
 * Tests
 */

describe('generators', function () {

  describe('#program()', function () {

    it('should wrap the program in an annonymous fn', function () {

      var output = generators['program']({
        childNodes : [{ type : 'leaf', value :''}]
      });

      assert.equal(output, '(function () {\n}());');

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