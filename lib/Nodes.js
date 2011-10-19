var IndentHandler = require('./IndentHandler');

var Nodes = module.exports = (function (indentHandler) {

	return {

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
				this.statements.forEach(function (s) {
					code += indentHandler.getIndent() +
						s.compile() + (s.type !== 'Conditional' ? ';\n' : '\n');
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

			this.compile = function () {
				return 'var ' + this.variable.compile() +
					' = ' + this.to.compile();
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

			this.compile = function () {
				var code = '{';
				indentHandler.nextIndent();
				propertyList.forEach(function (prop) {
					code += '\n' + indentHandler.getIndent() +
						'"' + prop[0].compile() + '" : ' + prop[1].compile() + ',';
				});
				indentHandler.prevIndent();
				return code.substr(0, code.length - 1) + '\n}';
			};

		},

		Function : function (statementList) {

			this.type = 'Function';
			this.statementList = statementList;
			
			this.print = function () {
				var output = 'function->\n';
				indentHandler.nextIndent();
				output += this.statementList.print();
				indentHandler.prevIndent();
				return output;
			};

			this.compile = function () {
				indentHandler.nextIndent();
				var code = 'function () {\n' +
					this.statementList.compile() + '}';
				indentHandler.prevIndent();
				return code;
				
			};
		},

		Call : function (identifier, args) {

			this.type = 'Call';
			this.identifier = identifier;
			this.args = args || ['none'];

			this.print = function (options) {
				var args = '';
				this.args.forEach(function (a) {
					args += a.print() + ', ';
				});
				return options && options.assign
					? 'the result of function \'' +
						identifier.print() + '\' with args: (' +
						args.substr(0, args.length - 2) + ')'
					: 'Call to function \'' +
						identifier.print() + '\' with args: (' +
						args.substr(0, args.length - 2) + ')';
			};

			this.compile = function () {
				var args = '';
				this.args.forEach(function (a) {
					args += a.compile() + ', ';
				});
				return this.identifier.compile() +
					'(' + args.substr(0, args.length - 2) + ')';
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
				code += this.ifTrue.compile() + '}';
				if (this.ifFalse) {
					code += ' else {\n' + this.ifFalse.compile() + '}';
				}
				indentHandler.prevIndent();
				return code;
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

			this.compile = function () {
				return this.value;
			};

		}
	};

}(new IndentHandler()));
