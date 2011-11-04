
// Module dependencies
var node = require('./node');

// This function returns a `mathsy` constructor.
// It takes a shared `indentHandler` as an argument.
var mathsy = function (indentHandler) {
	
	// The actual `mathsy` constructor
	return function (spec) {

		spec.type = 'mathsy';

		// Extend the generic node object
		var mathsy = node(spec),
			left = spec.left,
			right = spec.right,
			op = spec.op,
			fix = spec.fix,
			bracketed = spec.bracketed;

		// Returns a human readable representation of the node
		mathsy.print = function () {
			var output = 'Mathsy expr: ';
			output += 'Left: ' + left.print();
			output += ' Right: ' + right.print();
			output += ' Op: ' + op;
			output += ' Fix: ' + fix;
			output += ' Bracketed: ' + bracketed;
			return output;
		};

		// Returns the node compiled to js
		mathsy.compile = function (options) {
			switch (fix) {
			case 'in': return (bracketed ? '(' : '')
					+ left.compile() + ' ' + op + ' ' + right.compile()
					+ (bracketed ? ')' : '');
			case 'post': return left.compile() + op;
			case 'pre': return op + left.compile();
			}
		};

		return mathsy;

	};

};

module.exports = mathsy;

