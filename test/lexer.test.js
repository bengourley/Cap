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
