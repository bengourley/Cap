
// Indent handler constructor.

var indentHandler = function (spec) {

  var indentHandler = {},
    unit = (spec && spec.unit) || '  ',
    indent = 0;

  // Augments the current indent
  indentHandler.nextIndent = function () {
    indent++;
  };

  // Decrements the current indent.
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

  // Returns the current indentation level
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

module.exports = indentHandler;
