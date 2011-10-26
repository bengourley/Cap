/*
 * Tests for lib/Parser.js
 * Run with `expresso -I lib`
 */

/*
 * Module dependencies
 */

var parser = require('Parser').parser,
	lexer = require('Lexer'),
	nodes = require('Nodes');

parser.lexer =  lexer();
parser.yy.nodes = nodes;

/*
 * Tests
 */

exports['empty program'] = function (beforeExit, assert) {

	assert.eql(parser.parse('').compile(), '(function () {\n}());');

};
