var fs = require('fs'),
	Token = require('./Token');

var Lexer = function (input) {
	this.input = input;
	this.indent = '';
	this.indentCount = 0;
	this.token = { type : null };
};

Lexer.prototype = {

	/*
	 * Runs the lexical analysis and prints tokens.
	 */
	lex : function (data) {

		while (this.token.type !== 'eof') {
			console.log(this.token = this.getNextToken());
		}

	},

	/*
	 * Discards an amount of characters
	 * from the start of the input.
	 */
	advance : function (num) {
		this.input = this.input.substr(num);
	},

	/*
	 * Retrieves the next token recognised on the input.
	 */
	getNextToken : function () {

		return this.eof()
			|| this.linearWhitespace()
			|| this.newline()
			|| this.literal()
			|| this.keyword()
			|| this.identifier()
			|| this.number()
			|| this.string()
			|| this.single();
	},

	/*
	 * Recognises the end of the input.
	 */
	eof : function () {
		if (this.input.length === 0) {
			return new Token('eof');
		}
	},

	linearWhitespace : function () {
		var res = /^[ \t]+/.exec(this.input);
		if (res) {
			this.advance(res[0].length);
		}
	},

	/*
	 * Consumes a newline character and
	 * sends off the following whitespace
	 * to be analysed for indents.
	 */
	newline : function () {
		var res = /^\n+([\t ]*)/.exec(this.input), indent;
		if (res) {
			this.advance(res[0].length);
			indent = res[1];
			// Only create a token for changes in indent
			if (indent !== this.indent) {
				return this.determineIndent(indent);
			}
		}
	},

	/*
	 * Analyses a change in indent and produces
	 * a token if required, which may turn out
	 * to be an indent, a newline or an error
	 * (inconsistent indentation).
	 */
	determineIndent : function (indent) {
		if (this.indent.indexOf(indent) === 0) {
			this.indentCount--;
			this.indent = indent;
			return new Token('outdent', this.indentCount);
		} else if (indent.indexOf(this.indent) === 0) {
			this.indentCount++;
			this.indent = indent;
			return new Token('indent', this.indentCount);
		} else {
			return new Token('error', 'Inconsistent indentation');
		}
	},

	/*
	 * Recognises a literal.
	 */
	literal : function () {
		var res = /^(object|function|array):/.exec(this.input);
		if (res) {
			this.advance(res[0].length);
			return new Token(res[1] + ' literal');
		}
	},

	/*
	 * Recognises a keyword.
	 */
	keyword : function () {
		var res = /^(return)[\s\S]/.exec(this.input);
		if (res) {
			this.advance(res[1].length);
			return new Token('keyword', res[1]);
		}
	},

	/*
	 * Recognises an identifier.
	 */
	identifier : function () {
		var res = /^([A-Za-z]+)[\s\S]/.exec(this.input);
		if (res) {
			this.advance(res[1].length);
			return new Token('identifier', res[1]);
		}
	},

	/*
	 * Recognises a number.
	 */
	number : function () {
		var res = /^\d+(\.?\d+)?/.exec(this.input);
		if (res) {
			this.advance(res[0].length);
			return new Token('number', res[0]);
		}
	},

	/*
	 * Recognises a string.
	 */
	string : function () {
		var res = /^'(\\'|[\s\S])*'/.exec(this.input);
		if (res) {
			this.advance(res[0].length);
			return new Token('string', res[0]);
		}
	},

	/*
	 * Match any allowed single character.
	 * If this fails, create an error token
	 * with the offending character.
	 */
	single : function () {
		
		var c = this.input.substr(0, 1);
		this.advance(1);

		switch (c) {
		case '=': return new Token('equals');
		case '.': return new Token('dot');
		case '{': return new Token('left brace');
		case '}': return new Token('right brace');
		case '[': return new Token('left square bracket');
		case ']': return new Token('right square bracket');
		case '"': return new Token('speech mark');
		default: return new Token('error', 'Unrecognized character: ' + c);
		}

	}

};

fs.readFile('example.cap', 'utf8', function (err, data) {
	if (err) {
		throw err;
	} else {
		new Lexer(data).lex();
	}
});
