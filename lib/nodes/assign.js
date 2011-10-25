
// Module dependencies
var node = require('./node');

// This function returns an `assign` constructor.
// It takes a shared `indentHandler` as an argument.
var assign = function (indentHandler) {
	
	// The actual `assign` constructor
	return function (spec) {

		spec.type = 'assign';

		// Extend the generic node object
		var assign = node(spec),
			id = spec.id,
			expr = spec.expr;

		// Returns a human readable representation of the node
		assign.print = function () {
			return 'Assign ' + id.print() +
				' to ' + expr.print({ assign : true });
		};

		// Returns the node compiled to js
		assign.compile = function (options) {
			var output = options.shouldReturn ? 'return ' : 'var ';
			output += id.compile() + ' = '; 
			return output + expr.compile({ shouldReturn : false });
		};

		// Expose the id publicly
		assign.id = id;

		return assign;

	};

};

module.exports = assign;
