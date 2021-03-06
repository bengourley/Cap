
// A list of pre-defined global variables

var createProgramScope = function () {
  return [
    'console', 'require', 'module', 'JSON',
    'window', 'document', 'throw', 'typeof',
    'extend', 'trait', 'this', 'super', 'setTimeout',
    'setInterval', 'clearTimeout', 'clearInterval',
    'Math', 'Array', 'Object', 'Function', 'RegExp',
    'String', 'Date', 'Number'
  ];
};

// A list of JavaScript reserved words

var reservedWords = [
  'abstract', 'else', 'instanceof', 'super',
  'boolean', 'enum', 'int', 'switch',
  'break', 'export', 'interface', 'synchronized',
  'byte', 'extends', 'let',
  'case', 'false', 'long', 'throw',
  'catch', 'final', 'native', 'throws',
  'char', 'finally', 'new', 'transient',
  'class', 'float', 'null', 'true',
  'const', 'for', 'package', 'try',
  'continue', 'function', 'private', 'typeof',
  'debugger', 'goto', 'protected', 'var',
  'default', 'if', 'public', 'void',
  'delete', 'implements', 'return', 'volatile',
  'do', 'import', 'short', 'while',
  'double', 'in', 'static', 'with', 'require'
];

module.exports.createProgramScope = createProgramScope;
module.exports.reservedWords = reservedWords;