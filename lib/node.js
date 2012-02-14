// A node in the syntax tree
var node = function (spec) {
  
  var node = {};
  
  node.type = spec.type || 'leaf';
  node.meta = spec.meta;
  node.childNodes = spec.childNodes || [];
  node.value = spec.value || '';
  node.lineno = spec.lineno || '??';

  node.print = function () {
    var meta = '';
    if (node.meta) {
      Object.keys(node.meta).forEach(function (key) {
        meta += '[';
        if (node.meta.hasOwnProperty(key)) {
          meta += key + ': ' + node.meta[key];
        }
        meta += ']';
      });
    }
    return '- ' + node.type + ': ' + node.value + meta;
  };

  node.toString = function () {
    return '[Node ' + node.type + ']';
  };

  return node;

};

module.exports = node;
