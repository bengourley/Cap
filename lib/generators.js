var programScope = require('./runtime/programScope');

var createGenerators = function (parser, errorReporter) {

  var generators = {},
      idx = 1;

  // Proxy to a given node's generator return value.
  // Looks up the generator function on the generators
  // object with the node's type, then passes in the node
  // and the given meta object.
  var generate = function (node, meta) {
    return generators[node.type](node, meta);
  };

  // Takes a string `msg` and throws
  // an error. Adds more information to
  // the message.
  var semanticError = function (node) {

    var semanticError = new Error(
        errorReporter.getReport(
          '`' + node.value + '` is not defined in the current scope',
          node.sourceLocation
        )
    );

    semanticError.type = 'SemanticError';
    throw semanticError;

  };

  /*
   * Generates JS for a program node
   */
  generators['program'] = function (node) {

    // Create root meta object
    var meta = {};

    // Import the top-level program scope
    // (i.e global variables)
    meta.scope = programScope;

    // Wrap the entire output in an annonymous function
    // to avoid polluting the global scope
    var output = '(function () {\n';
    output += generate(node.childNodes[0], meta);
    output += '}());';
    return output;

  };

  /*
   * Generates JS for a statementList node
   */
  generators['statementList'] = function (node, meta) {

    var output = '';

    // Loop over each of the statements in the list
    node.childNodes.forEach(function (statement, i, arr) {
      
      if (i === arr.length - 1 && !meta.omitReturn &&
            ['conditional', 'where'].indexOf(statement.type) === -1) {
        output += 'return ';
      }

      var newmeta = Object.create(meta);
      newmeta.omitReturn = i < arr.length - 1;
      newmeta.parentNode = 'statementList';
      output += generate(statement, newmeta);
      output += ['conditional', 'where'].indexOf(statement.type) !== -1 ? '\n' : ';\n';

    });

    return output;

  };

  /*
   * Generates JS for an assignment node
   */
  generators['assignment'] = function (node, meta) {

    var symbol = node.childNodes[0].type === 'identifier'
      ? node.childNodes[0]
      : node.childNodes[0].childNodes[0];

    var output = meta.scope.indexOf(symbol.value) === -1 &&
                  meta.omitReturn && meta.parentNode !== 'objectLiteral'
                    ? 'var '
                    : '';

    var newmeta = Object.create(meta);
    newmeta.ignoreScope = true;
    newmeta.objectLiteral = false;
    output += generate(node.childNodes[0], newmeta);

    var exprmeta = Object.create(meta);

    exprmeta.scope.push(symbol.value);
    exprmeta.assignSymbol = generate(symbol, newmeta);

    output += meta.parentNode === 'objectLiteral' ? ':' : '=';
    output += generate(node.childNodes[1], exprmeta);

    return output;

  };

  /*
   * Generates JS for a vectorLiteral node
   */
  generators['vectorLiteral'] = function (node, meta) {
    var output = '[';
    if (node.childNodes[0]) output += generate(node.childNodes[0], meta);
    output += ']';
    return output;
  };

  /*
   * Generates JS for an expressionList node
   */
  generators['expressionList'] = function (node, meta) {
    var output = '';
    node.childNodes.forEach(function (childNode, i, arr) {
      output += generate(childNode, meta);
      output += i < arr.length - 1 ? ',' : '';
    });
    return output;
  };

  /*
   * Generates JS for an objectLiteral node
   */
  generators['objectLiteral'] = function (node, meta) {
    var newmeta = Object.create(meta);
    newmeta.parentNode = 'objectLiteral';
    var output = '{';
    if (node.childNodes[0]) output += generate(node.childNodes[0], newmeta);
    output += '}';
    return output;
  };

  /*
   * Generates JS for an assignmentList node
   */
  generators['assignmentList'] = function (node, meta) {
    var output = '';
    node.childNodes.forEach(function (childNode, i, arr) {
      output += generate(childNode, meta);
      output += i < arr.length - 1 ? ',' : '';
    });
    return output;
  };

  /*
   * Generates JS for a functionLiteral node
   */
  generators['functionLiteral'] = function (node, meta) {

    // Create a new scope for the function
    var newmeta = Object.create(meta);

    newmeta.parentNode = 'functionLiteral';

    // Add the parameters to function scope
    newmeta.addToScope = true;

    // Output the function signature
    var output = 'function ' + (meta.assignSymbol || '__anon' + idx++) +
      '(' + generate(node.childNodes[0], newmeta) + ') {';
    
    // Stop adding things to scope
    newmeta.addToScope = false;

    // Reset `omitReturn` so that the last
    // statement returns in subsequent calls
    meta.omitReturn = false;

    // Generate the function body
    if (node.childNodes[1]) output += generate(node.childNodes[1], newmeta);

    // Close the function
    output += '}';

    return output;

  };

  /*
   * Generates JS for a params node
   */
  generators['params'] = function (node, meta) {
    var output = '';
    node.childNodes.forEach(function (childNode, i) {
      var newmeta = Object.create(meta);
      newmeta.ignoreScope = true;
      if (i > 0) output += ', ';
      output += generate(childNode, newmeta);
    });
    return output;
  };

  /*
   * Generates JS for a call node
   */
  generators['call'] = function (node, meta) {
    var output = '';
    output += generate(node.childNodes[0], meta);
    output += '(';
    output += generate(node.childNodes[1], meta);
    output += ')';
    return output;
  };

  /*
   * Generates JS for a where node
   */
  generators['where'] = function (node, meta) {

    // If the return value of the call needs to be
    // returned, create a var outside of the temp
    // scope
    var output = (meta.omitReturn ? '' : 'return \n');

    var symbolmeta = Object.create(meta);
    symbolmeta.addToScope = true;
    symbolmeta.ignoreScope = true;

    if (node.childNodes[0].type === 'assignmentList') {
      var symbol = node.childNodes[1].childNodes[0].childNodes[0];
      output += 'var ' + generate(symbol, symbolmeta) + ';\n';
    }

    // Create new scope to house temporary vars
    var newmeta = Object.create(meta);

    // Create an anonymous fn to get a new scope
    output += '(function () {\n';

    output += (node.childNodes[0].type === 'assignmentList') ? '' : 'var ';
    output += generate(node.childNodes[0], newmeta) + ';';

    output += (meta.omitReturn ? '' : 'return ') + generate(node.childNodes[1], newmeta);

    // Close and invoke the annonymous fn
    output += '}())';
    return output;

  };

  /*
   * Generates JS for a conditional node
   */
  generators['conditional'] = function (node, meta) {

    var output = '';

    // Loop over the if and else fragments
    // and output their contents.
    node.childNodes.forEach(function (childNode, i) {
      if (i > 0 && childNode.type === 'ifFragment') {
        output += ' else ';
      }
      output += generate(childNode, meta);
    });
    return output;
  };

  /*
   * Generates JS for an ifFragment node
   */
  generators['ifFragment'] = function (node, meta) {

    // Create a new meta object
    // as this node has its own scope
    var newmeta = Object.create(meta);
    var output = 'if (';

    output += generate(node.childNodes[0], meta);
    output += ') {\n';

    // Wrap in self-executing fn to acheive
    // block scope
    output += '(function () {\n';
    output += generate(node.childNodes[1], newmeta);
    output += '}());';

    output += '}';
    return output;

  };

  /*
   * Generates JS for an elseFragment node
   */
  generators['elseFragment'] = function (node, meta) {

    // Create a new meta object
    // as this node has its own scope
    var newmeta = Object.create(meta);
    var output = ' else {\n';

    // Wrap in self-executing fn to acheive
    // block scope
    output += '(function () {\n';
    output += generate(node.childNodes[0], newmeta);
    output += '}());';

    output += '}';
    return output;

  };

  /*
   * Generates JS for an operator node
   */
  generators['operator'] = function (node, meta) {

    var output = '';

    // Determine where to place the operator and
    // output the child node(s)
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

  /*
   * Generates JS for a concatenation node
   */
  generators['concatenation'] = function (node, meta) {
    
    var output = '\'\'';

    // Loop through and output the expressions delimited
    // with the JS concat operator (+)
    node.childNodes.forEach(function (childNode) {
      output += ' + ';
      output += generate(childNode, meta);
    });

    return output;

  };

  /*
   * Generates JS for a reference node
   */
  generators['reference'] = function (node, meta) {
    
    var output = '';

    // A reference is made up of a sequence of period (.)
    // delimited ids. Loop through these and output them
    node.childNodes.forEach(function (childNode, i, arr) {

      if (i > 0) {
        // All but the first needn't be scope checked
        var newmeta = Object.create(meta);
        newmeta.ignoreScope = true;
        output += generate(childNode, newmeta);
      } else {
        output += generate(childNode, meta) + (i < arr.length - 1 ? '.' : '');
      }

    });

    return output;

  };

  /*
   * Generates JS for an identifier node
   */
  generators['identifier'] = function (node, meta) {
    
    // Check if it's in scope, (if it's required to be)
    if (!meta.ignoreScope) {
      if (meta.scope.indexOf(node.value) === -1) {
        semanticError(node);
      }
    }

    // Add to scope, if required (eg. function
    // parameters or assignment)
    if (meta.addToScope) {
      meta.scope.push(node.value);  
    }

    return  '_' + node.value;

  };

  /*
   * Generates JS for a generic leaf node
   */
  generators['leaf'] = function (node, meta) {
    return node.value;
  };

  return generators;

};

module.exports = createGenerators;