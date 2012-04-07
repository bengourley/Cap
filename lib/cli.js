/*
 * Module dependencies
 */
var async = require('async'),
    fs = require('fs'),
    createCompiler = require('./compiler');


var createCli = function (program) {

  var cli = {};

  //
  // Asynchronously recurse from a starting
  // directory and callback with all of the
  // containing `.cap` files.
  //
  var collectFilenames = function(dir, callback) {

    var filenames = [];

    // Read the current directory
    fs.readdir(dir, function (err, files) {
      if (err) callback(err);

      var paths = [];
      files.forEach(function (file) {
        paths.push(dir + file);
      });

      // Get stats on the contents of the directory.
      // Keep them in order so that their index can be used.
      async.mapSeries(paths, fs.stat, function (err, stats) {
        if (err) callback(err);

        var capfiles = [],
            dirs = [];

        stats.forEach(function (stat, i) {
          if (stat.isDirectory() && files[i].indexOf('.') !== 0) {
            // If this is a directory, and isn't hidden
            // add it to the list of directories to descend
            dirs.push(dir + files[i] + '/');
          } else if (stat.isFile() && files[i].substr(files[i].length - 4) === '.cap') {
            // If this is a file that ends in `.cap`,
            // add it to the list to return
            capfiles.push(dir + files[i]);
          }
        });

        if (dirs.length > 0) {

          // If there are directories to descend,
          // recursively traverse them and fold out
          // the `.cap` files that they find.

          async.map(dirs, collectFilenames, function (err, files) {
            if (err) callback(err);
            files.forEach(function (file) {
              capfiles = capfiles.concat(file);
            });
            callback(null, capfiles);
          });

        } else {

          // No directories to traverse, so
          // callback with the list of `.cap` files
          callback(null, capfiles);

        }

      });
    });

  };

  var compile = function (source, callback) {

    try {
      var output = createCompiler(source.filename).compile(source.data, {
        tree : program.printtree,
        compress : program.compress
      });

      callback(null, {
        name : source.filename,
        output : output
      });

    } catch (e) {
      callback(e);
    }

  };

  var write = function (file, callback) {
    fs.writeFile(file.name + '.js', file.output, function (err) {
      if (err) callback(err);
      callback(null);
    });
  };

  var run = function () {

    if (!program.files) {

      // No file args supplied, so recurse the
      // directory and comile all of the source
      // files that are found
      collectFilenames('./', function (err, capfiles) {
        if (err) throw err;

        async.map(capfiles, function (capfile, callback) {
          fs.readFile(capfile, function (err, data) {
            if (err) callback(err);
            callback(null, { filename : capfile, data : data });
          });
        }, function (err, sources) {

          if (err) throw err;

          async.map(sources, compile, function (err, out) {
            if (err) {
              if (['ParseError', 'SemanticError'].indexOf(err.type) !== -1) {
                console.log(err.message);
              } else {
                throw err;
              }
            } else {

              if (program.target === 'node') {

                out.forEach(function (file) {
                  file = 'require(\'Cap\');';
                  if (program.print || program.printtree) {
                      console.log(file.output);
                  } else {
                    write(file, function (err) {
                      if (err) throw err;
                      console.log(file.name + ' \u2192 ' + file.name + '.js');
                    });
                  }
                });

              } else if (program.target === 'browser') {

                if (!program.args[0]) {
                  console.log('Please supply a module entry point for your browser bundle, e.g `app`');
                  return;
                }

                var output = '';

                fs.readFile(__dirname + '/runtime/browser.min.js', function (err, browser) {
                  if (err) throw err;
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
                    if (err) throw err;
                    console.log('Compiled browser bundle to: ' + name + '.js');
                  });
                });

              } else {
                console.log('Target environment not supported. Use `-t browser` or `-t node`');
              }
            }

          });

        });

      });


    } else {

      // Specific files were passed, compile those
      // instead of recursing the directory
      program.args.forEach(function (arg) {

        // Read the file from the path supplied
        fs.readFile(arg, 'utf8', function (err, data) {

          if (err) {
            if (err.code === 'ENOENT') {
              console.log('No file at `' + arg + '`');
              return;
            } else {
              throw err;
            }
          }

          try {

            compile({
              filename : arg + '.js',
              data : data
            }, function (err, file) {

              if (err) throw err;

              if (program.print || program.printtree) {
                console.log(file.output);
              } else {
                write(file, function (err) {
                  if (err) throw err;
                });
                console.log(arg + ' \u2192 ' + arg + '.js');
              }

            });

          } catch (e) {

            if (['ParseError', 'SemanticError'].indexOf(e.type) !== -1) {
              console.log(e.message);
            } else {
              throw e;
            }

          }

        });

      });

    }
  };

  cli.run = run;

  return cli;

};

module.exports = createCli;