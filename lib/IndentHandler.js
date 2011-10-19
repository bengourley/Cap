var IndentHandler = module.exports = function () {

	this.indent = 0;
	
	this.nextIndent = function () {
		this.indent++;
	};

	this.prevIndent = function () {
		if (this.indent - 1 < 0) {
			throw {
				name : 'IndentException',
				message : 'Indentation level already at zero'
			};
		} else {
			this.indent--;
		}
	};

	this.getIndent = function () {
		var output = '';
		for (i = 0; i < this.indent; i++) {
			output += '  ';
		}
		return output;
	};

};
