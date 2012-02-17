/*global task desc */

/*
 * Module dependencies
 */
var spawn = require('child_process').spawn;

function print(out) {
  process.stdout.write(out);
}

/*
 * Run tests: uses the mocha TDD framework
 */
desc('Run tests');
task('test', function () {

  var test = spawn('./node_modules/mocha/bin/mocha',
      ['--ui', 'bdd', '--colors', '--reporter', 'spec']);

  test.stdout.on('data', print);
  test.stderr.on('data', print);

});

desc('Make documentation');
task('docs', function () {

  var fs = require('fs');

  var createDocs = function (err, files) {
    files.forEach(function (file) {
      if (!/.js$/.test(file)) return;
      var docs = spawn('docco', [__dirname + '/lib/' + file]);
      docs.stdout.on('data', print);
      docs.stderr.on('data', print);
    });
  };

  var rm = spawn('rm', ['-rf', __dirname + '/docs']);

  rm.stdout.on('data', print);
  rm.stderr.on('data', print);

  rm.on('exit', function () {
    fs.readdir(__dirname + '/lib/', createDocs);
  });

});