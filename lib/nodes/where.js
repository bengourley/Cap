
// Module dependencies
var node = require('./node');

// This function returns a `where` constructor.
// It takes a shared `indentHandler` as an argument.
var where = function (indentHandler) {
	
	// The actual `where` constructor
	return function (spec) {

		spec.type = 'where';

		// Extend the generic node object
		var where = node(spec),
			call = spec.call,
			pre = spec.pre;

		// Returns a human readable representation of the node
		where.print = function () {
			console.log('TODO: Where clause');
		};

		// Returns the node compiled to js
		where.compile = function (options) {
			var output = '';
			pre.forEach(function (p) {
				output += p.compile({ shouldReturn : false }) + ';\n' + indentHandler.getIndent();
			});
			options.storeReturnValue = options.shouldReturn;
			output += call.compile(options) + ';\n' + indentHandler.getIndent();
			pre.forEach(function (p, i, arr) {
				output += 'delete ' + p.id.compile() + ';';
				if (i < arr.length - 1) {
					output += '\n' + indentHandler.getIndent();
				}
			});
			output += '\n' + indentHandler.getIndent() + 'return _rv;';
			return output;

		};

		return where;

	};

};

module.exports = where;
