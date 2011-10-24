/*
 * Tests for lib/Parser.js
 * Run with `expresso -I lib`
 */

/*
 * Module dependencies
 */

var parser = require('Parser').parser,
		Lexer = require('Lexer'),
		nodes = require('Nodes');

parser.lexer = new Lexer();
parser.yy.nodes = nodes;

/*
 * Tests
 */

exports['empty program'] = function (beforeExit, assert) {

	assert.eql(parser.parse('').statements, []);

};
