var fs = require('fs'),
	Parser = require('jison').Parser,
	Lexer = require('./Lexer'),
	nodes = require('./Nodes');

// Read in sample program
fs.readFile('./example.cap', 'utf8', function (err, data) {

	// Read in grammar
	fs.readFile('./cap.jison', 'utf8', function (err, data2) {

		// Generate a parser
		var parser = new Parser(data2);

		// Assign custom lexer
		parser.lexer = new Lexer();
		// Add AST nodes for use in grammar
		parser.yy.nodes = nodes;

		try {
			
			// Parse sample program
			var AST = parser.parse(data);
			//console.log(AST);
			console.log(AST.print());

		} catch (e) {
			throw e;
		}
	});
});
