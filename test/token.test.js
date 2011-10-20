/*
 * Tests for lib/Token.js
 * Run with `expresso -I lib`
 */

/*
 * Module dependencies
 */

var Token = require('Token');

/*
 * Tests
 */

exports['token type'] = function (beforeExit, assert) {

	var token = new Token('foo');

	assert.equal('foo', token.type);

};

exports['token value'] = function (beforeExit, assert) {

	var token = new Token('foo', 'bar');

	assert.equal(token.value, 'bar');

};

