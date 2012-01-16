/*
 * Tests for lib/Parser.js
 * Run with `expresso -I lib`
 */

/*
 * Module dependencies
 */

var parser = require('parser')();

/*
 * Tests
 */

exports['empty program'] = function (beforeExit, assert) {

  assert.eql(parser.parse('').compile(), '(function () {\n}());');

};
