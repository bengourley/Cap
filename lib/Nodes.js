
// Module dependencies

var IndentHandler = require('./IndentHandler');

// Nodes object. Contains constructors for
// the different AST node types.
var Nodes = module.exports = (function (indentHandler) {

	return {

		Program : function (statementList) {
			
			this.statementList = statementList;

			this.print = function () {
				return 'Program:\n' + this.statementList.print();
			};

			this.compile = function () {
				indentHandler.nextIndent();
				return '(function () {\n' + this.statementList.compile() + '}());';
			};

		},

		// ## StatementList
		StatementList : function (statements) {
			
			this.statements = statements;
			
			this.print = function () {
				var output = '', s;
				this.statements.forEach(function (s) {
					output += indentHandler.getIndent() + s.print() + '\n';
				});
				return output.substr(0, output.length - 1);
			};

			this.compile = function () {
				var code = '';
				this.statements.forEach(function (s, i, arr) {
					var shouldReturn = i === arr.length - 1 ? true : false;
					code += indentHandler.getIndent() +
						s.compile({ shouldReturn : shouldReturn }) + (/^(Conditional|Where)$/.test(s.type) ? '\n' : ';\n');
				});
				return code;
			};

		},

		Assign : function (variable, to) {
			
			this.type = 'Assignment';
			this.variable = variable;
			this.to = to;
			
			this.print = function () {
				return 'Assign ' + this.variable.print() +
					' to ' + this.to.print({ assign : true });
			};

			this.compile = function (options) {
				var output = options.shouldReturn ? 'return ' : 'var ';
				output += this.variable.compile() + ' = '; 
				return output + this.to.compile({ shouldReturn : false });
			};

		},

		Object : function (propertyList) {

			this.type = 'Object';
			this.propertyList = propertyList;

			this.print = function () {
				var output = 'object->';
				indentHandler.nextIndent();
				propertyList.forEach(function (prop) {
					output += '\n' + indentHandler.getIndent() +
						prop[0].print() + ': ' + prop[1].print({ assign : true });
				});
				indentHandler.prevIndent();
				return output;
			};

			this.compile = function (options) {
				var code = options.shouldReturn ? 'return {' : '{';
				indentHandler.nextIndent();
				propertyList.forEach(function (prop, i, arr) {
					code += '\n' + indentHandler.getIndent() +
						'"' + prop[0].compile() + '" : ' + prop[1].compile() + (i < arr.length - 1 ? ',' : '');
				});
				indentHandler.prevIndent();
				code += '\n' + indentHandler.getIndent() + '}';
				return code;
			};

		},

		Function : function (statementList, params) {

			this.type = 'Function';
			this.statementList = statementList;
			this.params = params;
			
			this.print = function () {
				var output = 'function->\n';
				indentHandler.nextIndent();
				output += this.statementList.print();
				indentHandler.prevIndent();
				return output;
			};

			this.compile = function (options) {
				indentHandler.nextIndent();
				var code = options.shouldReturn ? 'return ' : '';
				code += 'function (' + this.params + ') {\n' +
					this.statementList.compile();
				indentHandler.prevIndent();
				code += indentHandler.getIndent() + '}';
				return code;
				
			};
		},

		Call : function (fn, argument) {

			this.type = 'Call';
			this.fn = fn;
			this.argument = argument;

			this.print = function (options) {
				return 'The function is: ' + this.fn.print() + ' and the argument is: ' + this.argument.print();
			};

			this.compile = function (options) {
				var output = '';
				if (options.storeReturnValue) {
					output += 'var _rv = ';
				} else if (options.shouldReturn) {
					output += 'return ';
				}
				output += this.fn.compile();
				if (this.argument) {
					if (Array.isArray(argument)) {
						output += '(';
						argument.forEach(function (a) {
							output += a.compile() + ', ';
						});
						output = output.substr(0, output.length - 2) + ')';
					} else {
						output += '(' + this.argument.compile() + ')';
					}
				} else {
					output += '()';
				}
				return output;
			};

		},

		Conditional : function (condition, ifTrue, ifFalse) {

			this.type = 'Conditional';
			this.condition = condition;
			this.ifTrue = ifTrue;
			this.ifFalse = ifFalse;
			
			this.print = function () {
				var output = '';
				indentHandler.nextIndent();
				output += 'if (' + this.condition.print() + ') do \n' +
					indentHandler.getIndent() + this.ifTrue.print();
				output += this.ifFalse
					? '\nelse\n' + indentHandler.getIndent() + this.ifFalse.print()
					: '';
				indentHandler.prevIndent();
				return output;
			};

			this.compile = function () {
				var code = 'if (' + this.condition.compile() + ') {\n';
				indentHandler.nextIndent();
				code += this.ifTrue.compile();
				indentHandler.prevIndent();
				code += indentHandler.getIndent() + '}';
				if (this.ifFalse) {
					indentHandler.nextIndent();
					code += ' else {\n' + this.ifFalse.compile();
					indentHandler.prevIndent();
					code += indentHandler.getIndent() + '}';
				}
				return code;
			};
		},

		Where : function (call, pre) {
			this.type = 'Where';
			this.call = call;
			this.pre = pre;
			
			this.print = function () {
				console.log('TODO: Where clause');
			};

			this.compile = function (options) {
				var output = '';
				this.pre.forEach(function (p) {
					output += p.compile({ shouldReturn : false }) + ';\n' + indentHandler.getIndent();
				});
				options.storeReturnValue = options.shouldReturn;
				output += this.call.compile(options) + ';\n' + indentHandler.getIndent();
				this.pre.forEach(function (p, i, arr) {
					output += 'delete ' + p.variable.compile() + ';';
					if (i < arr.length - 1) {
						output += '\n' + indentHandler.getIndent();
					}
				});
				output += '\n' + indentHandler.getIndent() + 'return _rv;';
				return output;
			};
		},

		DynamicId : function (call, property) {

			this.call = call;
			this.property = property;

			this.print = function () {
				return '<< ' + this.call.print() + ' >>.' + this.property;
			};

			this.compile = function () {
				return this.call.compile() + '.' + this.property;
			};

		},

		Primative : function (value) {
			
			this.value = value;
			
			this.print = function () {
				return this.value;
			};

			this.compile = function (options) {
				return this.value;
			};

		}
	};

}(new IndentHandler()));
