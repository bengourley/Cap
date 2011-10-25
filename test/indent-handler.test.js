/*
 * Tests for lib/indent-handler.js
 * Run with `expresso -I lib`
 */

/*
 * Module dependencies
 */

var IndentHandler = require('indent-handler');

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
