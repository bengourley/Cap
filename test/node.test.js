/*
 * Tests for lib/node.js
 * Run with `make test`
 */

/*
 * Module dependencies
 */

var node = require('../index').node,
    assert = require('assert');

describe('lib/node', function () {

  describe('#toString()', function () {

    it('should say that it is a node with its type', function () {
      assert.equal(node({
        type : 'foo'
      }).toString(), '[Node foo]');
    });

  });

  describe('#print()', function () {

    it('should print all of its relevant properties', function () {
      assert.equal(node({
        type : 'foo',
        childNodes : [],
        meta : {
          some : 'a',
          props : 'b',
        }
      }).print(), '- foo: [some: a][props: b]');
    });

  });

});