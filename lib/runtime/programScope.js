
// A list of pre-defined global variables

var createProgramScope = function () {
  return [
    'console', 'require', 'module', 'JSON',
    'window', 'document', 'throw'
  ];
};

module.exports = createProgramScope;