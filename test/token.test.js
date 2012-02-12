/*
 * Tests for lib/Token.js
 * Run with `jake test`
 */

/*
 * Module dependencies
 */

var token = require('../lib/token'),
    assert = require('assert');

/*
 * Tests
 */

describe('token', function () {
  
  it('should have the type it is initialised with', function () {
    var t = token({ type : 'foo'});
    assert.equal('foo', t.type);
  });

  it('should have the value it is initialised with', function () {
    var t = token({ type : 'foo', value : 'bar' });
    assert.equal(t.value, 'bar');
  });

  it('should have no value for tokens that don\'t require a value', function () {
    var t = token({ type : 'eof' });
    assert.equal(t.value, '');
  });

});
