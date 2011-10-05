var fs = require('fs'),
		jison = require('jison').Parser,
		Lexer = require('./Lexer');

fs.readFile('./example.cap', 'utf8', function (err, data) {
  if (err) throw err;
	fs.readFile('./cap.jison', 'utf8', function (err, data2) {
		var parser = new jison(data2);
		parser.lexer = new Lexer();
		console.log(parser.parse(data));
		//console.log(parser);
	});
});
