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
		},

		Assign : function (variable, to) {
			this.variable = variable;
			this.to = to;
			this.type = 'Assignment';
			this.print = function () {
				return 'Assign ' + this.variable.print() + ' to ' + this.to.print({ assign : true });
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
		},

		Call : function (identifier, args) {
			this.type = 'Call';
			this.identifier = identifier;
			this.args = args || ['none'];
			this.print = function () {
				var args = '';
				this.args.forEach(function (a) {
					args += a.print() + ', ';
				});
				return arguments.length && arguments[0].assign
					? 'the result of function \'' +
						identifier.print() + '\' with args: (' +
						args.substr(0, args.length - 2) + ')'
					: 'Call to function \'' +
						identifier.print() + '\' with args: (' +
						args.substr(0, args.length - 2) + ')';
			};
		},

		Primative : function (value) {
			this.value = value;
			this.print = function () {
				return this.value;
			};
		}
	};

}(new IndentHandler()));
