/*
 * Module dependencies
 */
var fs = require('fs'),
    createCliHelpers = require('./cliHelpers');


var createCli = function (program, handle) {

  var cli = {};

  // Get helper functions
  var helpers = createCliHelpers(program),
      collectFilenames = helpers.collectFilenames,
      readFiles = helpers.readFiles,
      compileBatch = helpers.compileBatch,
      write = helpers.write;

  var compileForNode = function(out) {
    var header = 'require(\'Cap\');\n';
    header += 'function _require(module) {\n  return require(module +\'.cap.js\');\n}\n';
    out.forEach(function (file) {
      file.output = header + file.output;
      if (program.print || program.printtree) {
          console.log(file.output);
      } else {
        write(file, function (err) {
          if (err) return handle(err);
          console.log(file.name + ' \u2192 ' + file.name + '.js');
        });
      }
    });
  };

  var compileForBrowser = function (out) {

    if (!program.args[0]) {
      console.log('Please supply a module entry point for your browser bundle, e.g `app`');
      return;
    }

    var output = '';

    fs.readFile(__dirname + '/env/browser.min.js', function (err, browser) {
      if (err) return handle(err);
      output += browser;
      out.forEach(function (file) {
        output += '\n_module(\'' + file.name + '\', function (module, exports) {\n';
        output += file.output;
        output += '\nreturn exports;';
        output += '\n});';
      });

      output += '\n_require(\'./' + program.args[0] + '.cap\');';

      var name = program.args[0] ? program.args[0] + '.browser.cap' : 'browser.cap';
      write({
        name : name,
        output : output
      }, function (err) {
        if (err) return handle(err);
        console.log('Compiled browser bundle to: ' + name + '.js');
      });
    });
  };

  var output = function (sources) {
    compileBatch(sources, function (err, outputs) {
      if (err) return handle(err);

      if (program.printtree || program.print) {
        outputs.forEach(function (output) {
          console.log('+ ' + output.name + ' +\n');
          console.log(output.output);
          console.log('\n --- \n');
        });
      } else {
        if (program.targetenv === 'node') {
          compileForNode(outputs);
        } else if (program.targetenv === 'browser') {
          compileForBrowser(outputs);
        } else {
          console.log('Unsupported targetenv `' + program.targetenv + '`. Use `node` or `browser`');
        }
      }
    });
  };

  var run = function () {

    if (!program.files) {

      // No file args supplied, so recurse the
      // directory and compile all of the source
      // files that are found.

      collectFilenames('./', function (err, filenames) {
        if (err) return handle(err);

        // Read in all of the contents of
        // the found source files.

        readFiles(filenames, function (err, contents) {
          if (err) return handle(err);
          output(contents);
        });

      });

    } else {

      // Specific source files were passed in.
      // Read in their contents.

      readFiles(program.files, function (err, contents) {
        if (err && err.code === 'ENOENT') {
          return console.log('Could not find a source file at `' + err.path + '`');
        } else if (err) {
          return handle(err);
        } else {
          if (err) return handle(err);
          output(contents);
        }
      });

    }

  };


  cli.run = run;

  return cli;

};

module.exports = createCli;