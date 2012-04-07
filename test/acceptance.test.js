/*
 * Scans the `./acceptance` directory
 * an checks that all of the examples
 * parse and generate without errors.
 *
 * Run with `make test`
 */

var createCompiler = require('../index').compiler,
    assert = require('assert'),
    fs = require('fs');

describe('acceptance tests', function () {

  it('should parse all examples labelled `parse` without errors', function () {
    var files = fs.readdirSync(__dirname + '/acceptance/');
    files.forEach(function (filename) {
      if (filename.indexOf('parse') !== 0) return;
      var input = fs.readFileSync(__dirname + '/acceptance/' + filename);
      assert.doesNotThrow(function () {
        createCompiler(filename).compile(input, { compress : true });
      });
    });
  });

  it('should error on parsing all examples labelled `error`', function () {
    var files = fs.readdirSync(__dirname + '/acceptance/');
    files.forEach(function (filename) {
      if (filename.indexOf('error') !== 0) return;
      var input = fs.readFileSync(__dirname + '/acceptance/' + filename);
      assert.throws(function () {
        createCompiler(filename).compile(input, { compress : true });
      });
    });
  });

});