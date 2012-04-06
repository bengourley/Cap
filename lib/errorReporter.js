// Takes information about an error during the
// compilation process and returns a meaningful
// error message.
//
// **Sample output:**
//
//      - Error on line 2:
//      `y` is not defined in the current scope
//
//             +
//             |
//           1 |  myFunc = |x|
//      >    2 |    x + y
//             |
//             +

// Function to instantiate an error reporter.
// The input string `source` must be passed in
// on creation.
var createErrorReporter = function (source) {

  source = source + '';

  var errorReporter = {};

  // ### Utilities

  // Work out the line number from the
  // `errorLocation`, which is a linear
  // offset in the source string.
  //
  // This basically walks the input string and
  // counts the number of newline characters
  // before the `errorLocation is reached.
  var getLineNumber = function (errorLocation) {
    var lineno = 1;
    for (var i = 0; i < errorLocation; i++) {
      if (source.charAt(i) === '\n') {
        lineno++;
      }
    }
    return lineno;
  };

  // Pads a string with spaces until its length === `length`.
  // (Spaces are added to the front of the string).
  var pad = function (string, length) {
    string = '' + string;
    while (string.length < length) {
      string = ' ' + string;
    }
    return string;
  };

  // ### Reporter

  // `getReport()` takes two arguments: `msg`, the message to
  // display, and `errorLocation`, the linear offset of the
  // error in the source code.
  //
  // A formatted error report is return for printing to an
  // ascii environment, e.g. the terminal.
  errorReporter.getReport = function (msg, errorLocation) {

    // Initialise the output. Split the source by newlines
    // and get the line that the error occurred on.
    var output = '',
        lines = source.split('\n'),
        errorLine = getLineNumber(errorLocation);

    // Add the surrounding lines to the output, and mark
    // the offending line with a `>` symbol.
    lines.forEach(function (line, i, arr) {
      if (errorLine === i + 1) {
        output += ' > ' + pad(i + 1, 4) + ' |  ' + line + '\n';
      } else if (i > errorLine - 6 && i < errorLine + 4) {
        output += '   ' + pad(i + 1, 4) + ' |  ' + line + '\n';
      }
    });

    // Prepend the error message with the line number and return
    // the whole output.
    return '\n- ' + 'Error on line ' + errorLine + ':\n' +
            msg + '\n\n        +\n        |\n' +
            output + '        |\n        +\n';
  };


  // Expose `getLineNumber()` on the error
  // reporter so it can be used by other objects
  errorReporter.getLineNumber = getLineNumber;
  return errorReporter;

};

module.exports = createErrorReporter;