
// Module dependencies
var node = require('./node');

var where = function (spec) {

  spec.type = 'where';

  // Extend the generic node object
  var where = node(spec),
    call = spec.call,
    pre = spec.pre;

  // Returns a human readable representation of the node
  where.print = function () {
    var output = '';
    output += call.print() + ' but first, temporarily:\n';
    pre.forEach(function (p, i, arr) {
      output += p.print();
    });
    return output;
  };

  // Returns the node compiled to js
  where.compile = function (options) {
    var output = '';
    options.temps = [];
    pre.forEach(function (p) {
      output += p.compile({ shouldReturn : false, namespace : '_tmp' }) + ';\n';
      options.temps.push(p.id.compile({}));
    });
    options.storeReturnValue = options.shouldReturn;
    output += call.compile(options) + ';\n';
    pre.forEach(function (p, i, arr) {
      output += 'delete _tmp' + p.id.compile({}) + ';';
      if (i < arr.length - 1) {
        output += '\n';
      }
    });
    output += (options.shouldReturn ?
        '\n' + 'return _rv;' : '');
    return output;

  };

  return where;

};

module.exports = where;
