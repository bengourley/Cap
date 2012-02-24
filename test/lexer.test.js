/*
 * Tests for lib/lexer.js
 * Run with `jake test`
 */

/*
 * Module dependencies
 */

var lexer = require('../').lexer,
		assert = require('assert');

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

describe('lexer', function () {

	it('should return a whitespace token followed by an ' +
			'eof token when given empty input', function () {

		var lexer = newLexerWithInput('');
		assert.equal(lexer.lex().type, 'vwhitespace');
		assert.equal(lexer.lex().type, 'eof');

	});

	it('should distinguish between a keyword ' +
			'and an identifier when an identifier starts with ' +
				'or ends with a keyword', function () {

		var lexer = newLexerWithInput('if ift gif ');

		assert.equal(lexer.lex().type, 'if');
		assert.equal(lexer.lex().type, 'identifier');
		assert.equal(lexer.lex().type, 'identifier');

	});

	it('should handle simple indentation', function () {
		
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
		
	});

	it('should consolidate consecutive newlines', function () {
		
		var lexer = newLexerWithInput('x\n\nx\n');

		assert.equal(lexer.lex().type, 'identifier');
		assert.equal(lexer.lex().type, 'vwhitespace');
		assert.equal(lexer.lex().type, 'identifier');

	});

	it('should return an error token if input ' +
			'starts with an indent', function () {

		var lexer = newLexerWithInput('  x\n');
		assert.equal(lexer.lex().type, 'error');

	});

	it('should identify a string', function () {

		var lexer = newLexerWithInput('\'Hello, World!\'\n');
		assert.equal(lexer.lex().type, 'string');

	});

	it('should identify a number', function () {

		var lexer = newLexerWithInput('12345 0.99\n');

		assert.equal(lexer.lex().type, 'number');
		assert.equal(lexer.lex().type, 'number');

	});

	it('should identify a string with escaped single quotes', function () {

		var lexer = newLexerWithInput('\'That\\\'s nice\'');
		assert.equal(lexer.lex().type, 'string');
		assert.equal(lexer.lex().type, 'vwhitespace');
		assert.equal(lexer.lex().type, 'eof');

		lexer = newLexerWithInput('\'That\\\'s n\\\'ice\'');
		assert.equal(lexer.lex().type, 'string');
		assert.equal(lexer.lex().type, 'vwhitespace');
		assert.equal(lexer.lex().type, 'eof');

	});

	it('should discard comments');

	it('should consolidate newlines at the start of the file', function () {
		
		var lexer = newLexerWithInput('\n\n\nx = 10\n');

		assert.equal(lexer.lex().type, 'vwhitespace');
		assert.notEqual(lexer.lex().type, 'vwhitespace');

	});

	it('should error on inconsistent indentation', function () {

		var lexer = newLexerWithInput('hello\n  hi\n	hello');

		for (var i = 0; i < 5; i++) {
			lexer.lex();
		}

		assert.equal(lexer.lex().type, 'error');

	});

});

