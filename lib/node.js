var node = function (spec) {
  
  var node = {};
  
  node.type = spec.type || 'leaf';
  node.meta = spec.meta;
  node.childNodes = spec.childNodes || [];
  node.value = spec.value;
  
  node.longPrint = function () {
    var output = '--------------------------\n';

    output += 'Node type: ' + node.type + '\n';

    output += '--------------------------\n';

    if (node.value) {
      output += 'Value: ' + node.value + '\n';
    }
    
    if (node.meta) {
      output += 'Meta: \n';
      Object.keys(node.meta).forEach(function (key) {
        if (node.meta.hasOwnProperty(key)) {
          output += '  ' + key + ': ' + node.meta[key] + '\n';
        }
      });
    }
    return output;
  };

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
    return '- ' + node.type + ': ' + (node.value || '') + meta;
  };

  return node;

};

module.exports = node;
