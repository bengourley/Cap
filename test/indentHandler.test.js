exports['indent handler'] = function (beforeExit, assert) {

	var IndentHandler = require('IndentHandler'),
		indentHandler = new IndentHandler();

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
