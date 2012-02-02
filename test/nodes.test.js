/*
 * Tests for lib/nodes.js
 * Run with `jake test`
 */

/*
 * Module dependencies
 */

var nodes = require('../lib/nodes'),
    assert = require('assert');

/*
 * Tests
 */

describe('nodes', function () {
  
  it('should have a value of 20 when initialised with value : 20', function () {
    
    var p = nodes.node({
      type : 'Number',
      value : 20
    });

    assert.equal(p.value, 20);

  });

});