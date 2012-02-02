var spawn = require('child_process').spawn;

desc('Run tests');
task('test', function () {
  var test = spawn('mocha', ['--ui', 'bdd', '--colors', '--reporter', 'spec']);

  function print(out) {
    process.stdout.write(out);
  }

  test.stdout.on('data', print);
  test.stderr.on('data', print);

});
