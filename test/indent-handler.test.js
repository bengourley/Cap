/*
 * Tests for lib/indent-handler.js
 * Run with `expresso -I lib`
 */

/*
 * Module dependencies
 */

var indentHandler = require('indent-handler');

/*
 * Tests
 */

exports['indent handler'] = function (beforeExit, assert) {

	var ih = indentHandler();

	assert.equal('', ih.getIndent());

	ih.nextIndent();
	assert.equal('  ', ih.getIndent());

	ih.prevIndent();
	assert.equal('', ih.getIndent());

	try {
		ih.prevIndent();
	} catch (e) {
		assert.equal('IndentException', e.name);
	}

};
