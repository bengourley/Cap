
// Module dependencies
var node = require('./node');

// This function returns a `conditional` constructor.
// It takes a shared `indentHandler` as an argument.
var conditional = function (indentHandler) {
	
	// The actual `conditional` constructor
	return function (spec) {

		spec.type = 'conditional';

		// Extend the generic node object
		var conditional = node(spec),
			cond = spec.cond,
			ifBody = spec.ifBody,
			elseBody = spec.elseBody;

		// Returns a human readable representation of the node
		conditional.print = function () {
			var output = '';
			indentHandler.nextIndent();
			output += 'if (' + cond.print() + ') do \n' +
				indentHandler.getIndent() + ifBody.print();
			output += elseBody
				? '\nelse\n' + indentHandler.getIndent() + elseBody.print()
				: '';
			indentHandler.prevIndent();
			return output;
		};

		// Returns the node compiled to js
		conditional.compile = function (options) {
			var code = 'if (' + cond.compile() + ') {\n';
			indentHandler.nextIndent();
			code += ifBody.compile();
			indentHandler.prevIndent();
			code += indentHandler.getIndent() + '}';
			if (elseBody) {
				indentHandler.nextIndent();
				code += ' else {\n' + elseBody.compile();
				indentHandler.prevIndent();
				code += indentHandler.getIndent() + '}';
			}
			return code;

		};

		return conditional;

	};

};

module.exports = conditional;
