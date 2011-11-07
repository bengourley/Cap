var node = function (spec) {
  
  var node = {};
  
  node.type = spec.type || 'primitive';
  
  node.print = function () {
    return spec.value;
  };

  node.compile = function (options) {
    var value = spec.value;
    if (options && options.temps
        && options.temps.indexOf(spec.value) !== -1) {
      value = '_' + value;
    }
    return (options && options.shouldReturn ? 'return ' : '') + value;
  };

  return node;

};

module.exports = node;
