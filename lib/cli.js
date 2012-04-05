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
      console.log(file.name + ' \u2192 ' + file.name + '.js');
      callback(null);
    });
  };

  var run = function () {

    if (!program.args[0]) {

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
                console.log(e.message);
              } else {
                throw err;
              }
            } else {
              out.forEach(function (file) {
                if (program.print || program.printtree) {
                    console.log(file.output);
                } else {
                  write(file, function (err) {
                    if (err) throw err;
                  });
                }
              });
            }

          });

        });

      });


    } else {

      // Specific files were passed, compile those
      // instead of recursing the directory

      // Read the file from the path supplied
      fs.readFile(program.args[0], 'utf8', function (err, data) {

        if (err) {
          if (err.code === 'ENOENT') {
            console.log('No file at `' + program.args[0] + '`');
            return;
          } else {
            throw err;
          }
        }

        try {

          compile({
            filename : program.args[0],
            data : data
          }, function (err, file) {

            if (program.print || program.printtree) {
              console.log(file.output);
            } else {
              write(file, function (err) {
                if (err) throw err;
              });
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

    }
  };

  cli.run = run;

  return cli;

};

module.exports = createCli;