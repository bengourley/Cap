/*
 * Tests for lib/IndentHandler.js
 * Run with `expresso -I lib`
 */

/*
 * Module dependencies
 */

var IndentHandler = require('IndentHandler');

/*
 * Tests
 */

exports['indent handler'] = function (beforeExit, assert) {

	var indentHandler = new IndentHandler();

	assert.equal('', indentHandler.getIndent());

	indentHandler.nextIndent();
	assert.equal('  ', indentHandler.getIndent());

	indentHandler.prevIndent();
	assert.equal('', indentHandler.getIndent());

	try {
		indentHandler.prevIndent();
	} catch (e) {
		assert.equal('IndentException', e.name);
	}

};
