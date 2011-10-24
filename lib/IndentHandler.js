

// Indent handler constructor.

var IndentHandler = module.exports = function () {

	this.indent = 0;
	
	// Augments the current indent
	this.nextIndent = function () {
		this.indent++;
	};

	// Decrements the current indent.
	// If the indentation level is already at
	// zero, an exception is thrown.
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

	// Returns the current indentation level
	// as a string (two spaces per indent).
	this.getIndent = function () {
		var output = '';
		for (i = 0; i < this.indent; i++) {
			output += '  ';
		}
		return output;
	};

};
