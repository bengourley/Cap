
// Module dependencies
var node = require('./node');

// This function returns a `call` constructor.
// It takes a shared `indentHandler` as an argument.
var call = function (indentHandler) {
  
  // The actual `call` constructor
  return function (spec) {

    spec.type = 'call';

    // Extend the generic node object
    var call = node(spec),
      fn = spec.fn,
      arg = spec.arg;

    // Returns a human readable representation of the node
    call.print = function () {
      var args = '(';
      if (arg && Array.isArray(arg)) {
        arg.forEach(function (a, i, arr) {
          args += a.print() + (i < arr.length - 1 ? ', ' : '');
        });
      } else if (arg) {
        args += arg.print();
      }
      args += ')';
      return 'Call to function: \'' + fn.print() + '\' with argument: ' + args;
    };

    // Returns the node compiled to js
    call.compile = function (options) {
      var output = '';
      if (options.storeReturnValue) {
        output += 'var _rv = ';
      } else if (options.shouldReturn) {
        output += 'return ';
      }
      output += fn.compile({ storeReturnValue : false, temps : options.temps });
      if (arg && Array.isArray(arg)) {
        output += '(';
        arg.forEach(function (a, i, arr) {
          if (options.temps && options.temps.indexOf(a.compile()) !== -1) {
            output += '_';
          }
          output += a.compile({}) + (i < arr.length - 1 ? ', ' : '');
        });
        output += ')';
      } else if (arg) {
        output += '(';
        if (options.temps && options.temps.indexOf(arg.compile({})) !== -1) {
          output += '_tmp';
        }
        output += arg.compile({ storeReturnValue : false }) + ')';
      } else {
        output += '()';
      }
      return output;

    };

    return call;

  };

};

module.exports = call;
