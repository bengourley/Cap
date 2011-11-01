var lexer = require('./lexer'),
	nodes = require('./nodes');

var parser = function (spec) {

	var parser = {},
		l = lexer(),
		token,

		// Methods
		program,
		statement,
		assign,
		expression,
		single,
		number,
		string,
		id,
		next,
		lookahead,
		parseError;

	parser.parse = function (data) {
		
		l.setInput(data);

		return program();

	};

	program = function () {
		return statement();
	};

	statement = function () {
		return expression();
	};

	assign = function () {
		return false;
	};

	expression = function () {
		switch (lookahead(1).type) {
		case 'number': return number();
		case 'string': return string();
		case 'leftbracket': return id();
		case 'identifier': return id();
		default: return false;
		}
	};

	number = function () {
		var t = next();
		if (t.type === 'number') {
			return nodes.node({ value : t.value });
		}
	};

	string = function () {
		var t = next();
		if (t.type === 'string') {
			return nodes.node({ value : t.value });
		}
	};

	id = function () {
	};

	parseError = function (msg) {
		throw {
			type : 'ParseError',
			message : 'Parse error: ' + msg
		}
	};

	next = function (n) {
		return l.lex();
	};

	lookahead = function (n) {
		return l.lookahead(n);
	};

	return parser;

};

module.exports = parser;
