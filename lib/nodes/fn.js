
// Module dependencies
var node = require('./node');

var fn = function (spec) {

  spec.type = 'fn';

  // Extend the generic node object
  var fn = node(spec),
    body = spec.body,
    params = spec.params;

  // Returns a human readable representation of the node
  fn.print = function () {
    return spec.type;
  };

  // Returns the node compiled to js
  fn.compile = function (options) {
    var code = options.shouldReturn ? 'return ' : '';
    params.forEach(function (p, i, arr) {
      code += i ? 'return ' : '';
      code += 'function(' + p.compile({}) + ') {\n';
    });
    code += body.compile({});
    params.forEach(function (p, i, arr) {
      code += '}' + (i < arr.length - 1 ? ';\n' : '');
    });
    return code;
  };

  return fn;

};

module.exports = fn;
