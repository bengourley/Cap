
// Module dependencies
var node = require('./node');

// This function returns an `fn` constructor.
// It takes a shared `indentHandler` as an argument.
var fn = function (indentHandler) {
	
	// The actual `fn` constructor
	return function (spec) {

		spec.type = 'fn';

		// Extend the generic node object
		var fn = node(spec),
			body = spec.body,
			param = spec.param;

		// Returns a human readable representation of the node
		fn.print = function () {
			var output = 'function->\n';
			indentHandler.nextIndent();
			output += body.print();
			indentHandler.prevIndent();
			return output;
		};

		// Returns the node compiled to js
		fn.compile = function (options) {
			indentHandler.nextIndent();
			var code = options.shouldReturn ? 'return ' : '';
			code += 'function (' + param + ') {\n' +
				body.compile();
			indentHandler.prevIndent();
			code += indentHandler.getIndent() + '}';
			return code;
		};

		return fn;

	};

};

module.exports = fn;
