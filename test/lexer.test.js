/*
 * Tests for lib/Lexer.js
 * Run with `expresso -I lib`
 */

/*
 * Module dependencies
 */

var Lexer = require('Lexer');

/*
 * Convenience function for creating lexers
 */
var newLexerWithInput = function (input) {
	var lexer = new Lexer();
	lexer.setInput(input);
	return lexer;
};

/*
 * Tests
 */

exports['empty input'] = function (beforeExit, assert) {

	var lexer = newLexerWithInput('');

	assert.equal(lexer.lex(), '$end');

};

exports['keyword vs. identifier'] = function (beforeExit, assert) {

	var lexer = newLexerWithInput('if ift gif\n');

	assert.equal(lexer.lex(), 'if');
	assert.equal(lexer.lex(), 'identifier');
	assert.equal(lexer.lex(), 'identifier');

};

exports['simple indentation'] = function (beforeExit, assert) {
	var lexer = newLexerWithInput('x\n  x\nx\n');

	assert.equal(lexer.lex(), 'identifier');
	assert.equal(lexer.lex(), 'vwhitespace');
	assert.equal(lexer.lex(), 'indent');
	assert.equal(lexer.lex(), 'vwhitespace');
	assert.equal(lexer.lex(), 'identifier');
	assert.equal(lexer.lex(), 'vwhitespace');
	assert.equal(lexer.lex(), 'dedent');
	assert.equal(lexer.lex(), 'vwhitespace');
	assert.equal(lexer.lex(), 'identifier');
	assert.equal(lexer.lex(), 'vwhitespace');
	assert.equal(lexer.lex(), '$end');

};

exports['consecutive newlines'] = function (beforeExit, assert) {

	var lexer = newLexerWithInput('x\n\nx\n');

	assert.equal(lexer.lex(), 'identifier');
	assert.equal(lexer.lex(), 'vwhitespace');
	assert.equal(lexer.lex(), 'identifier');

};

exports['inconsistent indentation'] = function (beforeExit, assert) {
	
	var lexer = newLexerWithInput('x\n  x\n\tx');

	assert.equal(lexer.lex(), 'identifier');
	assert.equal(lexer.lex(), 'vwhitespace');
	assert.equal(lexer.lex(), 'indent');
	assert.equal(lexer.lex(), 'vwhitespace');
	assert.equal(lexer.lex(), 'identifier');
	assert.equal(lexer.lex(), 'error');

};

exports['starts with indent'] = function (beforeExit, assert) {

	var lexer = newLexerWithInput('  x\n');

	assert.equal(lexer.lex(), 'error');

};

exports['strings'] = function (beforeExit, assert) {

	var lexer = newLexerWithInput('\'Hello, World!\'\n');

	assert.equal(lexer.lex(), 'string');

};

exports['numbers'] = function (beforeExit, assert) {

	var lexer = newLexerWithInput('12345 0.99\n');

	assert.equal(lexer.lex(), 'number');
	assert.equal(lexer.lex(), 'number');

};

exports['literals'] = function (beforeExit, assert) {

	var lexer = newLexerWithInput('object: function: array:\n');

	assert.equal(lexer.lex(), 'objectliteral');
	assert.equal(lexer.lex(), 'functionliteral');
	assert.equal(lexer.lex(), 'arrayliteral');

};

exports['show position'] = function (beforeExit, assert) {
	
	var lexer = newLexerWithInput('some program here... \n\n\n'),
		position = lexer.showPosition();

	assert.type(position, 'string');
	assert.length(position, 20);

};

exports['single characters'] = function (beforeExit, assert) {

	var lexer = newLexerWithInput('[]{}=."~+()¶\n');

	assert.equal(lexer.lex(), 'leftsquarebracket');
	assert.equal(lexer.lex(), 'rightsquarebracket');
	assert.equal(lexer.lex(), 'leftbrace');
	assert.equal(lexer.lex(), 'rightbrace');
	assert.equal(lexer.lex(), 'equals');
	assert.equal(lexer.lex(), 'dot');
	assert.equal(lexer.lex(), 'speechmark');
	assert.equal(lexer.lex(), 'tilde');
	assert.equal(lexer.lex(), 'plus');
	assert.equal(lexer.lex(), 'leftbracket');
	assert.equal(lexer.lex(), 'rightbracket');
	assert.equal(lexer.lex(), 'error');

};


