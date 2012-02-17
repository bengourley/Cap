// A module to manage indents. This module is used
// by `generator.js` to format the output when printing
// the syntax tree.

var createIndentHandler = function () {

  var indentHandler = {},
      unit = '  ',
      indent = 0;

  // `nextIndent()` augments the current indent
  indentHandler.nextIndent = function () {
    indent++;
  };

  // `prevIndent()` decrements the current indent.
  // If the indentation level is already at
  // zero, an exception is thrown.
  indentHandler.prevIndent = function () {
    if (indent - 1 < 0) {
      throw {
        name : 'IndentException',
        message : 'Indentation level already at zero'
      };
    } else {
      indent--;
    }
  };

  // `getIndent()` returns the current indentation level
  // as a string (two spaces per indent).
  indentHandler.getIndent = function () {
    var output = '', i;
    for (i = 0; i < indent; i++) {
      output += '  ';
    }
    return output;
  };

  return indentHandler;

};

module.exports = createIndentHandler;
