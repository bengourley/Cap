
/**
 * Constructor for token objects.
 *
 * @param {String} type of the token
 * @param {String} token value (optional)
 * @return {Token} the generated token
 * @api public
 */

var fs = require('fs'),
	Token = require('./Token');

var Lexer = module.exports = function () {
	this.input = '';
	this.indentStack = [''];
	this.tokens = [];
	this.tokenStash = [];
	this.yytext = null;
	this.yylineno = 0;
	this.startOfFile = true;
};

var ReservedWords = [
	"if", "else"
];

Lexer.prototype = {

	/*
	 * Runs the lexical analysis and prints tokens.
	 */
	lex : function () {

		if (this.startOfFile) {
			if (/^[ \t]+/.exec(this.input)) {
				this.tokenStash.push(new Token('error', 'File starts with an indent'));
			}
			this.startOfFile = false;
		}

		var token = this.tokenStash.length > 0
			? this.tokenStash.shift()
			: this.next();
		if (Array.isArray(token)) {
			this.tokenStash = this.tokenStash.concat(token);
			token = this.tokenStash.shift();
		}

		//console.log(token);

		this.yytext = token.value || null;

		return token.type;
		
	},
	
	setInput : function (str) {
		this.input = str;
	},

	showPosition : function () {
		return this.input.substr(0, 20);
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
	next : function () {

		return this.linearWhitespace()
			|| this.newline()
			|| this.eof()
			|| this.literal()
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
			return new Token('$end');
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
		var res = /^[\n\r\u2028\u2029]+([\t ]*)/.exec(this.input), indent;
		if (res) {
			var tokens = [new Token('vwhitespace')];
			this.advance(res[0].length);
			this.yylineno += /^[\n\r\u2028\u2029]+/.exec(res[0])[0].length;
			indent = res[1];
			// Only create a token for changes in indent
			if (indent !== this.indentStack[this.indentStack.length - 1]) {
				var tokens = this.determineIndent(indent);
			}
			return tokens;
		}
	},

	/*
	 * Analyses a change in indent and produces
	 * a token if required, which may turn out
	 * to be an indent, a newline or an error
	 * (inconsistent indentation).
	 */
	determineIndent : function (indentString) {

		if (indentString.indexOf(this.indentStack.join('')) === 0) {
			this.indentStack.push(indentString);
			return [new Token('vwhitespace'), new Token('indent'), new Token('vwhitespace')];
		} else {

			var dedentCount = 0;
			while (this.indentStack.join('') !== indentString && this.indentStack.pop()) {
				dedentCount++;
			}

			if (this.indentStack.join('') !== indentString) {
				return new Token('error', 'Inconsistent indentation');
			} else {
				var dedents = [new Token('vwhitespace')];
				for (var i = 0; i < dedentCount; i++) {
					dedents.push(new Token('dedent'), new Token('vwhitespace'));
				}
				return dedents;
			}

		}

	},

	/*
	 * Recognises a literal.
	 */
	literal : function () {
		var res = /^(object|function|array):/.exec(this.input);
		if (res) {
			this.advance(res[0].length);
			return new Token(res[1] + 'literal');
		}
	},

	/*
	 * Recognises an identifier.
	 */
	identifier : function () {
		var res = /^([A-Z|a-z]+)[\s\S]/.exec(this.input);
		if (res) {
			this.advance(res[1].length);
			if (ReservedWords.indexOf(res[1]) === -1) {
				return new Token('identifier', res[1]);
			} else {
				return new Token(res[1]);
			}
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
		var res = /^'([^'])*'/.exec(this.input);
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
		case '=': return new Token('equals'); break;
		case '.': return new Token('dot'); break;
		case '{': return new Token('leftbrace'); break;
		case '}': return new Token('rightbrace'); break;
		case '[': return new Token('leftsquarebracket'); break;
		case ']': return new Token('rightsquarebracket'); break;
		case '"': return new Token('speechmark'); break;
		case '~': return new Token('tilde'); break;
		case '+': return new Token('plus'); break;
		case '(': return new Token('leftbracket'); break;
		case ')': return new Token('rightbracket'); break;
		default: return new Token('error', 'Unrecognized character: ' + c);
		}

	}

};

/*fs.readFile('example.cap', 'utf8', function (err, data) {
	if (err) {
		throw err;
	} else {
		var l = new Lexer();
		l.setInput(data);
		var t = {};
		while (t !== '$end') {
			t = l.lex();
		}
	}
});*/
