
// Module dependencies
var node = require('./node');

// This function returns a `mathsy` constructor.
// It takes a shared `indentHandler` as an argument.
var mathsy = function (indentHandler) {
	
	// The actual `mathsy` constructor
	return function (spec) {

		spec.type = 'fn';

		// Extend the generic node object
		var mathsy = node(spec),
			left = spec.left,
			right = spec.right,
			op = spec.op,
			fix = spec.fix;

		// Returns a human readable representation of the node
		mathsy.print = function () {
			var output = 'Mathsy expr: TODO';
			return output;
		};

		// Returns the node compiled to js
		mathsy.compile = function (options) {
			switch (fix) {
			case 'in': return left.compile() + ' ' + op + ' ' + right.compile();
			case 'post': return left.compile() + op;
			case 'pre': return op + left.compile();
			}
		};

		return mathsy;

	};

};

module.exports = mathsy;

