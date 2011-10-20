var jade = require('jade'),
		stylus = require('stylus'),
		fs = require('fs'),
		exec = require('child_process').exec;

var getTemplate = function (callback) {
	fs.readFile(__dirname + '/layout.jade', 'utf8', function (err, data) {
		if (err) throw err;
		callback(jade.compile(data));
	});
};

var renderForFile = function (template, filename, callback) {
	
	exec('dox < ' + __dirname + '/../../lib/' + filename, function (err, stdout, stderr) {
		if (err) throw err;
		var output = JSON.parse(stdout);
		callback(template({ dox : output }));
	});

};

var writeToFile = function (filename, output) {
	fs.writeFile(__dirname + '/../' + filename, output);
};

var collectSourceFiles = function (callback) {

	fs.readdir(__dirname + '/../../lib/', function (err, files) {
		files = files.filter(function (filename) {
			return (/(\.js)$/).test(filename) && filename !== 'parser.js';
		});
		callback(files);
	});

};

getTemplate(function (template) {
	collectSourceFiles(function (files) {
		files.forEach(function (file) {
			renderForFile(template, file, function (output) {
				writeToFile(file + '.html', output);
			});
		});
	});
});
