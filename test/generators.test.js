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

  it('should wrap the program in an annonymous fn', function () {

    var output = generators['program']({
      childNodes : [{ type : 'leaf', value :''}]
    });

    assert.equal(output, '(function () {\n}());');

  });

  it('should output a leaf node\'s value', function () {

    var output = generators['leaf']({
      type : 'leaf',
      value : '10'
    });

    assert.equal(output, '10');

  });

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

});