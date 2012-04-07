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
    out.forEach(function (file) {
      file.output = 'require(\'Cap\');' + file.output;
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

      output += '\nrequire(\'./' + program.args[0] + '.cap\');';

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

  var run = function () {

    if (program.args.length === 0) {

      // No file args supplied, so recurse the
      // directory and compile all of the source
      // files that are found.

      collectFilenames('./', function (err, filenames) {
        if (err) return handle(err);

        // Read in all of the contents of
        // the found source files.

        readFiles(filenames, function (err, contents) {
          if (err) return handle(err);
          compileBatch(contents, function (err, sources) {
            if (err) return handle(err);
            console.log(sources);
          });
        });

      });

    } else {

      // Specific source files were passed in.
      // Read in their contents.

      readFiles(program.args, function (err, contents) {
        if (err && err.code === 'ENOENT') {
          return console.log('Could not find a source file at `' + err.path + '`');
        } else if (err) {
          return handle(err);
        } else {
          compileBatch(contents, function (err, sources) {
            if (err) return handle(err);
            console.log(sources);
          });
        }
      });

    }

    //     if (err) throw err;

    //   });

    // } else {

    //   // Specific files were passed, compile those
    //   // instead of recursing the directory
    //   program.args.forEach(function (arg) {

    //     // Read the file from the path supplied
    //     fs.readFile(arg, 'utf8', function (err, data) {

    //       if (err) {
    //         if (err.code === 'ENOENT') {
    //           console.log('No file at `' + arg + '`');
    //           return;
    //         } else {
    //           throw err;
    //         }
    //       }

    //       try {

    //         compile({
    //           filename : arg,
    //           data : data
    //         }, function (err, file) {

    //           if (err) throw err;

    //           if (program.print || program.printtree) {
    //             console.log(file.output);
    //           } else {
    //             write(file, function (err) {
    //               if (err) throw err;
    //             });
    //             if (program.targetenv) console.log('`targetenv` option ignored.');
    //             console.log(arg + ' \u2192 ' + arg + '.js');
    //           }

    //         });

    //       } catch (e) {

    //         if (['ParseError', 'SemanticError'].indexOf(e.type) !== -1) {
    //           console.log(e.message);
    //         } else {
    //           throw e;
    //         }

    //       }

    //     });

    //   });
  };


  cli.run = run;

  return cli;

};

module.exports = createCli;