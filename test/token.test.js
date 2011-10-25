/*
 * Tests for lib/Token.js
 * Run with `expresso -I lib`
 */

/*
 * Module dependencies
 */

var token = require('token');

/*
 * Tests
 */

exports['token type'] = function (beforeExit, assert) {

	var t = token.create('foo');

	assert.equal('foo', t.type);

};

exports['token value'] = function (beforeExit, assert) {

	var t = token.create('foo', 'bar');

	assert.equal(t.value, 'bar');

};

