var fs = require('fs'),
		pegjs = require('pegjs');

fs.readFile('./cap.pegjs', 'utf8', function (err, data) {
  if (err) throw err;
  var parser = pegjs.buildParser(data);
	console.log(data);
	parser.parse('object:\n  b aba');
});
