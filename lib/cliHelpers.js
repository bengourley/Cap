/*
 * Module dependencies
 */
var createCompiler = require('./compiler'),
    async = require('async'),
    fs = require('fs');

var createCliHelpers = function (program) {

  var cliHelpers = {};

  //
  // Asynchronously recurse from a starting
  // directory and callback with all of the
  // containing `.cap` files.
  //
  var collectFilenames = function(dir, callback) {

    var filenames = [];

    // Read the current directory
    fs.readdir(dir, function (err, files) {
      if (err) return callback(err);

      var paths = [];
      files.forEach(function (file) {
        paths.push(dir + file);
      });

      // Get stats on the contents of the directory.
      // Keep them in order so that their index can be used.
      async.mapSeries(paths, fs.stat, function (err, stats) {
        if (err) return callback(err);

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
            if (err) return callback(err);
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

  // Takes an array of filenames
  // and calls back with their contents
  var readFiles = function (filenames, callback) {
    async.map(filenames, function (filename, cb) {
      fs.readFile(filename, function (err, data) {
        if (err) return cb(err);
        cb(null, { filename : filename, data : data });
      });
    }, function (err, files) {
      if (err) return callback(err);
      callback(null, files);
    });
  };

  // Compiles a source. Calls back with the result.
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

  // Compiles a batch of source files.
  // Calls back with and array of results.
  var compileBatch = function (sources, callback) {
    async.map(sources, compile, function (err, out) {
      callback(err, out);
    });
  };

  // Writes a to file given a name and
  // some data. Calls back with an error
  // or null.
  var write = function (file, callback) {
    fs.writeFile(file.name + '.js', file.output, function (err) {
      if (err) return callback(err);
      callback(null);
    });
  };

  // Expose the exports on the cliHelpers object
  cliHelpers.collectFilenames = collectFilenames;
  cliHelpers.readFiles = readFiles;
  cliHelpers.compileBatch = compileBatch;
  cliHelpers.write = write;

  return cliHelpers;

};

module.exports = createCliHelpers;