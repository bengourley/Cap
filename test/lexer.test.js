/*
 * Tests for lib/Lexer.js
 * Run with `expresso -I lib`
 */

/*
 * Module dependencies
 */

var lexer = require('lexer');

/*
 * Convenience function for creating lexers
 */
var newLexerWithInput = function (input) {
	var l = lexer();
	l.setInput(input);
	return l;
};

/*
 * Tests
 */

exports['empty input'] = function (beforeExit, assert) {

	var lexer = newLexerWithInput('');

	assert.equal(lexer.lex().type, 'eof');

};

exports['keyword vs. identifier'] = function (beforeExit, assert) {

	var lexer = newLexerWithInput('if ift gif ');

	assert.equal(lexer.lex().type, 'if');
	assert.equal(lexer.lex().type, 'identifier');
	assert.equal(lexer.lex().type, 'identifier');

};

exports['simple indentation'] = function (beforeExit, assert) {
	var lexer = newLexerWithInput('x\n  x\nx\n');

	assert.equal(lexer.lex().type, 'identifier');
	assert.equal(lexer.lex().type, 'vwhitespace');
	assert.equal(lexer.lex().type, 'indent');
	assert.equal(lexer.lex().type, 'vwhitespace');
	assert.equal(lexer.lex().type, 'identifier');
	assert.equal(lexer.lex().type, 'vwhitespace');
	assert.equal(lexer.lex().type, 'dedent');
	assert.equal(lexer.lex().type, 'vwhitespace');
	assert.equal(lexer.lex().type, 'identifier');
	assert.equal(lexer.lex().type, 'vwhitespace');
	assert.equal(lexer.lex().type, 'eof');

};

exports['consecutive newlines'] = function (beforeExit, assert) {

	var lexer = newLexerWithInput('x\n\nx\n');

	assert.equal(lexer.lex().type, 'identifier');
	assert.equal(lexer.lex().type, 'vwhitespace');
	assert.equal(lexer.lex().type, 'identifier');

};

exports['inconsistent indentation'] = function (beforeExit, assert) {
	
	var lexer = newLexerWithInput('x\n  x\n\tx');

	assert.equal(lexer.lex().type, 'identifier');
	assert.equal(lexer.lex().type, 'vwhitespace');
	assert.equal(lexer.lex().type, 'indent');
	assert.equal(lexer.lex().type, 'vwhitespace');
	assert.equal(lexer.lex().type, 'identifier');
	assert.equal(lexer.lex().type, 'error');

};

exports['starts with indent'] = function (beforeExit, assert) {

	var lexer = newLexerWithInput('  x\n');

	assert.equal(lexer.lex().type, 'error');

};

exports['strings'] = function (beforeExit, assert) {

	var lexer = newLexerWithInput('\'Hello, World!\'\n');

	assert.equal(lexer.lex().type, 'string');

};

exports['numbers'] = function (beforeExit, assert) {

	var lexer = newLexerWithInput('12345 0.99\n');

	assert.equal(lexer.lex().type, 'number');
	assert.equal(lexer.lex().type, 'number');

};

exports['literals'] = function (beforeExit, assert) {

	var lexer = newLexerWithInput('obj: fun: arr:\n');

	assert.equal(lexer.lex().type, 'objliteral');
	assert.equal(lexer.lex().type, 'funliteral');
	assert.equal(lexer.lex().type, 'arrliteral');

};

/*exports['show position'] = function (beforeExit, assert) {
	
	var lexer = newLexerWithInput('some program here... \n\n\n'),
		position = lexer.showPosition();

	assert.type(position, 'string');
	assert.length(position, 20);

};*/

/*exports['single characters'] = function (beforeExit, assert) {

	var lexer = newLexerWithInput('[]{}=."~+()¶\n');

	assert.equal(lexer.lex().type, 'leftsquarebracket');
	assert.equal(lexer.lex().type, 'rightsquarebracket');
	assert.equal(lexer.lex().type, 'leftbrace');
	assert.equal(lexer.lex().type, 'rightbrace');
	assert.equal(lexer.lex().type, 'equals');
	assert.equal(lexer.lex().type, 'dot');
	assert.equal(lexer.lex().type, 'speechmark');
	assert.equal(lexer.lex().type, 'tilde');
	assert.equal(lexer.lex().type, 'plus');
	assert.equal(lexer.lex().type, 'leftbracket');
	assert.equal(lexer.lex().type, 'rightbracket');
	assert.equal(lexer.lex().type, 'error');

};*/


