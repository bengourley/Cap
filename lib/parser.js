var lexer = require('./lexer')(),
	nodes = require('./nodes');

var parser = function (spec) {

	var parser = {},
		token;


	var program,
		statement,
		assign,
		expression,
		call,
		concatenation,
		number,
		string,
		id,
		parseError,
		next,
		accept,
		lookahead;


	parser.parse = function (data) {
		
		lexer.setInput(data);
		var p = program();
		accept('eof');
		return p;

	};

	program = function () {
		var statementList = [];
		do {
			statementList.push(statement());
			accept('vwhitespace');
		} while (lookahead(1).type !== 'eof');
		return nodes.program({ statementList : nodes.statementList({ statements : statementList }) });
	};

	statement = function () {
		return expression({});
	};

	assign = function () {
		return false;
	};

	expression = function (opts) {

		var expr, op, second, arg;

		// Look ahead one token and decide
		// what to parse next
		switch (lookahead(1).type) {
		case 'number': expr = number(); break;
		case 'string': expr = string(); break;
		case 'identifier': expr = id(); break;
		case '(': next(); expr = expression({ bracketed : true }); accept(')'); break;
		default: return false;
		}

		if (['+', '-', '*', '/'].indexOf(lookahead(1).type) !== -1) {
			op = next();
			return nodes.mathsy({
				left : expr,
				right : expression({}),
				op : op.type,
				fix : 'in',
				bracketed : opts && opts.bracketed
			});
		} else if (lookahead(1).type === '&') {
			next();
			return concatenation(expr);
		} else {
			return opts.insidecall ? expr : call(expr);
		}

	};

	call = function (expr) {

		var exprs = [expr], call,
			arg = expression({ insidecall : true });

		if (!arg) {
			return expr;
		}
		
		while (arg) {
			exprs.push(arg);
			arg = expression({ insidecall : true });
		}

		call = (function reduce(exprs) {
			var arg = exprs.pop();
			return nodes.call({ fn : exprs.length === 1 ? exprs[0] : reduce(exprs), arg : arg });
		}(exprs));

		return call;

	};

	concatenation = function (first) {
		
		var concats = [first], expr;
		do {
			expr = expression({});
			if (expr) {
				concats.push(expr);
				expr = lookahead(1).type === '&';
			}
		} while (expr);

		return nodes.concatenation({ exprList : concats });

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

	accept = function (type) {
		var n = next().type;
		if (n === type) {
			return true;
		} else {
			parseError('Expecting ' + type + ', found ' + n);
		}
	};

	id = function () {
		var t = next();
		if (t.type === 'identifier') {
			return nodes.node({ value : t.value });
		}
	};

	parseError = function (msg) {
		throw {
			type : 'ParseError',
			message : 'Parse error on line ' + lexer.lineno + ': ' + msg
		}
	};

	next = function () {
		var n = lexer.lex();
		//console.log(n);
		return n;
	};

	lookahead = function (n) {
		var lh = lexer.lookahead(n);
		//console.log(lh);
		return lh;
	};

	return parser;

};

module.exports = parser;
