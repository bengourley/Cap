/*
 * Tests for lib/indent-handler.js
 * Run with `jake test`
 */

/*
 * Module dependencies
 */

var indentHandler = require('../lib/indent-handler'),
		assert = require('assert');

/*
 * Tests
 */

describe('indent handler', function (beforeExit) {

	var ih = indentHandler();

	it('should start with no indentation', function () {
		assert.equal('', ih.getIndent());
	});

	it('should have two spaces of indentation when nextIndent() ' +
			'has been called once', function () {
		ih.nextIndent();
		assert.equal('  ', ih.getIndent());
	});

	it('should have no indent when prevIndent() has been ' +
			'has been called after nextIndent()', function () {
		ih.prevIndent();
		assert.equal('', ih.getIndent());
	});

	it('should throw an IndentException when indent ' +
			'is decreased when already at zero', function () {

		try {
			ih.prevIndent();
		} catch (e) {
			assert.equal('IndentException', e.name);
		}

	});

});