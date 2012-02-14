var createErrorReporter = function (source) {
  
  var errorReporter = {};

  var getLineNumber = function (errorLocation) {
    var lineno = 1;
    for (var i = 0; i < errorLocation; i++) {
      if (source.charAt(i) === '\n') {
        lineno++;
      }
    }
    return lineno;
  };

  var pad = function (string, length) {
    string = '' + string;
    while (string.length < length) {
      string = ' ' + string;
    }
    return string;
  };

  errorReporter.getReport = function (msg, errorLocation) {

    var output = '',
        lines = source.split('\n'),
        errorLine = getLineNumber(errorLocation);

    lines.forEach(function (line, i, arr) {
      if (errorLine === i + 1) {
        output += ' > ' + pad(i + 1, 4) + ' |  ' + line + '\n';
      } else if (i > errorLine - 6 && i < errorLine + 4) {
        output += '   ' + pad(i + 1, 4) + ' |  ' + line + '\n';
      }
    });

    return '\n- ' + 'Error on line ' + errorLine + ':\n' +
            msg + '\n\n        +\n        |\n' +
            output + '        |\n        +\n';
  };

  return errorReporter;

};

module.exports = createErrorReporter;