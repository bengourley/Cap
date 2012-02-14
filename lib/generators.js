var generators = {},
    programScope = require('./runtime/programScope'),
    parser;

// Proxy to a given node's generator return value.
// Looks up the generator function on the generators
// object with the node's type, then passes in the node
// and the given meta object.
var generate = function (node, meta) {
  return generators[node.type](node, meta);
};

generators['program'] = function (node) {
  var meta = {};
  meta.scope = [programScope];
  var output = '(function () {\n';
  output += generate(node.childNodes[0], meta);
  output += '}());';
  return output;
};

generators['statementList'] = function (node, meta) {

  var output = '';
  node.childNodes.forEach(function (statement, i, arr) {
    
    if (i === arr.length - 1 && statement.type !== 'conditional' &&
        !meta.omitReturn) {
      output += 'return ';
    }

    var newmeta = Object.create(meta);
    newmeta.omitReturn = i < arr.length - 1;
    output += generate(statement, newmeta);
    output += statement.type === 'conditional' ? '\n' : ';\n';

  });
  return output;
};

generators['assignment'] = function (node, meta) {
  var output = generators[node.childNodes[0].type](node.childNodes[0], meta);
  output += meta.objectLiteral ? ':' : '=';
  output += generate(node.childNodes[1], meta);
  return output;
};

generators['vectorLiteral'] = function (node, meta) {
  var output = '[';
  output += generate(node.childNodes[0], meta);
  output += ']';
  return output;
};

generators['expressionList'] = function (node, meta) {
  var output = '';
  node.childNodes.forEach(function (childNode, i, arr) {
    output += generate(childNode, meta);
    output += i < arr.length - 1 ? ',' : '';
  });
  return output;
};

generators['objectLiteral'] = function (node, meta) {
  var newmeta = Object.create(meta);
  newmeta.objectLiteral = true;
  var output = '{';
  output += generate(node.childNodes[0], newmeta);
  output += '}';
  return output;
};

generators['assignmentList'] = function (node, meta) {
  var output = '';
  node.childNodes.forEach(function (childNode, i, arr) {
    output += generate(childNode, meta);
    output += i < arr.length - 1 ? ',' : '';
  });
  return output;
};

generators['call'] = function (node, meta) {
  var output = '';
  output += generate(node.childNodes[0], meta);
  output += '(';
  output += generate(node.childNodes[1], meta);
  output += ')';
  return output;
};

generators['conditional'] = function (node, meta) {
  var output = '';
  node.childNodes.forEach(function (childNode, i) {
    if (i > 0 && childNode.type === 'ifFragment') {
      output += ' else ';
    }
    output += generate(childNode, meta);
  });
  return output;
};

generators['ifFragment'] = function (node, meta) {
  var output = 'if (';
  output += generate(node.childNodes[0], meta);
  output += ') {\n';
  output += generate(node.childNodes[1], meta);
  output += '}';
  return output;
};

generators['elseFragment'] = function (node, meta) {
  var output = ' else {\n';
  output += generate(node.childNodes[0], meta);
  output += '}';
  return output;
};

generators['operator'] = function (node, meta) {
  var output = '';
  switch (node.meta.fix) {
  case 'in':
    output += generate(node.childNodes[0], meta);
    output += node.meta.op;
    output += generate(node.childNodes[1], meta);
    break;
  case 'post':
    output += node.meta.op;
    output += generate(node.childNodes[0], meta);
    break;
  case 'post':
    output += node.meta.op;
    output += generate(node.childNodes[0], meta);
    break;
  default:
    throw new Error('Unknown operator position');
  }
  return output;
};

generators['concatenation'] = function (node, meta) {
  var output = '\'\'';
  node.childNodes.forEach(function (childNode) {
    output += ' + ';
    output += generate(childNode, meta);
  });
  return output;
};

generators['reference'] = function (node, meta) {
  var output = '';
  node.childNodes.forEach(function (childNode, i, arr) {
    if (i > 0) {
      var newmeta = Object.create(meta);
      newmeta.ignoreScope = true;
      output += generate(childNode, newmeta);
    } else {
      output += generate(childNode, meta) + (i < arr.length - 1 ? '.' : '');
    }
  });
  return output;
};

generators['identifier'] = function (node, meta) {
  var output = node.value;
  if (!meta.ignoreScope) {
    meta.scope.forEach(function (scope) {
      if (scope.indexOf(node.value) === -1) {
        semanticError(node);
      }
    });
  }
  return output;
};

generators['leaf'] = function (node, meta) {
  var output = node.value;
  return output;
};

// Takes a string `msg` and throws
// an error. Adds more information to
// the message.
var semanticError = function (node, msg) {

  var semanticError = new Error(
    'Semantic error on line ' +
      node.lineno + ' - variable `' +
      node.value + '` not in scope' +
      parser.location()
  );

  semanticError.type = 'SemanticError';

  throw semanticError;
};

module.exports = function (p) {
  parser = p;
  return generators;
};