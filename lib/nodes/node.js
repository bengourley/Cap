var node = function (spec) {
  
  var node = {};
  
  node.type = spec.type || 'primitive';
  
  node.print = function () {
    return '\n--------------------------\n' +
           'Node type: ' + node.type + '\n' +
           'Value: ' + spec.value +
           '\n--------------------------\n';
  };

  node.compile = function (options) {
    var value = spec.value;
    if (options.temps &&
          options.temps.indexOf(spec.value) !== -1) {
      value = '_tmp_' + value;
    } else if (spec.type === 'id') {
      value = '__' + value;
    }
    return (options && options.shouldReturn ? 'return ' : '') + value;
  };

  node.value = spec.value;

  return node;

};

module.exports = node;
