var generators = {};

generators['program'] = function (node, scope) {
  var output = '(function () {\n';
  output += generators[node.childNodes[0].type](node.childNodes[0], scope);
  output += '}());';
  return output;
};

generators['statementList'] = function (node, scope) {
  var output = '';
  node.childNodes.forEach(function (statement) {
    output += generators[statement.type](statement, scope);
    output += statement.type === 'conditional' ? '\n' : ';\n';
  });
  return output;
};

generators['assignment'] = function (node, scope) {
  var output = generators[node.childNodes[0].type](node.childNodes[0], scope);
  output += scope.objectLiteral ? ':' : '=';
  output += generators[node.childNodes[1].type](node.childNodes[1], scope);
  return output;
};

generators['vectorLiteral'] = function (node, scope) {
  var output = '[';
  output += generators[node.childNodes[0].type](node.childNodes[0], scope);
  output += ']';
  return output;
};

generators['expressionList'] = function (node, scope) {
  var output = '';
  node.childNodes.forEach(function (childNode, i, arr) {
    output += generators[childNode.type](childNode, scope);
    output += i < arr.length - 1 ? ',' : '';
  });
  return output;
};

generators['objectLiteral'] = function (node, scope) {
  var newScope = scope;
  newScope.objectLiteral = true;
  var output = '{';
  output += generators[node.childNodes[0].type](node.childNodes[0], newScope);
  output += '}';
  return output;
};

generators['assignmentList'] = function (node, scope) {
  var output = '';
  node.childNodes.forEach(function (childNode, i, arr) {
    output += generators[childNode.type](childNode, scope);
    output += i < arr.length - 1 ? ',' : '';
  });
  return output;
};

generators['call'] = function (node, scope) {
  var output = '';
  output += generators[node.childNodes[0].type](node.childNodes[0]);
  output += '(';
  output += generators[node.childNodes[1].type](node.childNodes[1]);
  output += ')';
  return output;
};

generators['conditional'] = function (node, scope) {
  var output = '';
  node.childNodes.forEach(function (childNode) {
    output += generators[childNode.type](childNode, scope);
  });
  return output;
};

generators['ifFragment'] = function (node, scope) {
  var output = 'if (';
  output += generators[node.childNodes[0].type](node.childNodes[0], scope);
  output += ') {\n';
  output += generators[node.childNodes[1].type](node.childNodes[1], scope);
  output += '}';
  return output;
};

generators['elseFragment'] = function (node, scope) {
  var output = ' else {\n';
  output += generators[node.childNodes[0].type](node.childNodes[0], scope);
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
    output += generators[node.childNodes[0].type](node.childNodes[0], scope);
    output += node.meta.op;
    output += generators[node.childNodes[1].type](node.childNodes[1], scope);
    break;
  }
  return output;
};

module.exports = generators;