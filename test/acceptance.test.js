/*
 * Scans the `./acceptance` directory
 * an checks that all of the examples
 * parse and generate without errors.
 *
 * Run with `make test`
 */

var createCompiler = require('../').compiler,
    assert = require('assert'),
    fs = require('fs');

describe('acceptance tests', function () {

  it('should parse all acceptance examples without errors', function () {
    var files = fs.readdirSync(__dirname + '/acceptance/');
    files.forEach(function (filename) {
      var input = fs.readFileSync(__dirname + '/acceptance/' + filename);
      assert.doesNotThrow(function () {
        console.log(createCompiler(filename).compile(input, { compress : false }));
      });
    });
  });

});