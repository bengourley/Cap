exports['empty input'] = function (beforeExit, assert) {

	var Lexer = require('Lexer'),
		lexer = new Lexer();

	lexer.setInput('');

	assert.eql(lexer.next(), { type : '$end' });

};
