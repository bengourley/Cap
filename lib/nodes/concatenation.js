
// Module dependencies
var node = require('./node');

// This function returns a `concatenation` constructor.
// It takes a shared `indentHandler` as an argument.
var concatenation = function (indentHandler) {
	
	// The actual `concatenation` constructor
	return function (spec) {

		spec.type = 'concatenation';

		// Extend the generic node object
		var concatenation = node(spec),
			exprList = spec.exprList;

		// Returns a human readable representation of the node
		concatenation.print = function () {
			var output = 'concat ( TODO )';
			return output;
		};

		// Returns the node compiled to js
		concatenation.compile = function (options) {
			var output = (options && options.shouldReturn) ? 'return ' : '';
			exprList.forEach(function (expr, i, arr) {
				output += expr.compile() + (i < arr.length - 1 ? ' + ' : '');
			});
			return output;
		};

		return concatenation;

	};

};

module.exports = concatenation;
