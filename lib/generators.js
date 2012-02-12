var generators = {};

// Proxy to a given node's generator return value.
// Looks up the generator function on the generators
// object with the node's type, then passes in the node
// and the given scope object.
var generate = function (node, scope) {
  return generators[node.type](node, scope);
};

generators['program'] = function (node, scope) {
  var output = '(function () {\n';
  output += generate(node.childNodes[0], scope);
  output += '}());';
  return output;
};

generators['statementList'] = function (node, scope) {
  var output = '';
  node.childNodes.forEach(function (statement) {
    output += generate(statement, scope);
    output += statement.type === 'conditional' ? '\n' : ';\n';
  });
  return output;
};

generators['assignment'] = function (node, scope) {
  var output = generators[node.childNodes[0].type](node.childNodes[0], scope);
  output += scope.objectLiteral ? ':' : '=';
  output += generate(node.childNodes[1], scope);
  return output;
};

generators['vectorLiteral'] = function (node, scope) {
  var output = '[';
  output += generate(node.childNodes[0], scope);
  output += ']';
  return output;
};

generators['expressionList'] = function (node, scope) {
  var output = '';
  node.childNodes.forEach(function (childNode, i, arr) {
    output += generate(childNode, scope);
    output += i < arr.length - 1 ? ',' : '';
  });
  return output;
};

generators['objectLiteral'] = function (node, scope) {
  var newScope = scope;
  newScope.objectLiteral = true;
  var output = '{';
  output += generate(node.childNodes[0], newScope);
  output += '}';
  return output;
};

generators['assignmentList'] = function (node, scope) {
  var output = '';
  node.childNodes.forEach(function (childNode, i, arr) {
    output += generate(childNode, scope);
    output += i < arr.length - 1 ? ',' : '';
  });
  return output;
};

generators['call'] = function (node, scope) {
  var output = '';
  output += generate(node.childNodes[0]);
  output += '(';
  output += generate(node.childNodes[1]);
  output += ')';
  return output;
};

generators['conditional'] = function (node, scope) {
  var output = '';
  node.childNodes.forEach(function (childNode) {
    output += generate(childNode, scope);
  });
  return output;
};

generators['ifFragment'] = function (node, scope) {
  var output = 'if (';
  output += generate(node.childNodes[0], scope);
  output += ') {\n';
  output += generate(node.childNodes[1], scope);
  output += '}';
  return output;
};

generators['elseFragment'] = function (node, scope) {
  var output = ' else {\n';
  output += generate(node.childNodes[0], scope);
  output += '}';
  return output;
};

generators['reference'] = function (node, scope) {
  var output = '';
  node.childNodes.forEach(function (childNodes, i, arr) {
    output += childNodes.value + (i < arr.length - 1 ? '.' : '');
  });
  return output;
};

generators['identifier'] = function (node, scope) {
  var output = node.value;
  return output;
};

generators['leaf'] = function (node, scope) {
  var output = node.value;
  return output;
};

generators['operator'] = function (node, scope) {
  var output = '';
  switch (node.meta.fix) {
  case 'in':
    output += generate(node.childNodes[0], scope);
    output += node.meta.op;
    output += generate(node.childNodes[1], scope);
    break;
  }
  return output;
};

module.exports = generators;