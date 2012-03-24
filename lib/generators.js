// A module that contains methods for compiling
// each syntax tree node into JS source code.
//
// Each node type has its own method on the `generators`
// object and can be dynamically looked up using the JS
// subscript notation e.g. `generators['functionLiteral']`.

/*
 * Module dependencies
 */
var programScope = require('./runtime/programScope');

// Instantiates a generators object. Takes a single
// argument: a pre-instantiated `errorReporter` to
// gracefully handle semantic errors during the
// code generation pass.
var createGenerators = function (errorReporter) {

  var generators = {},
      idx = 1;

  // ### Utilities

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

  // ## Generators

  // **Generator for** `program` **nodes**:
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

  // **Generator for** `statementList` **nodes**:
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
      output += ['conditional', 'where'].indexOf(statement.type) !== -1
        ? '\n'
        : ';\n';

    });

    return output;

  };

  // **Generator for** `assignment` **nodes**:
  generators['assignment'] = function (node, meta) {

    var symbol = node.childNodes[0].type === 'identifier'
      ? node.childNodes[0]
      : node.childNodes[0].childNodes[0];

    var output = meta.scope.indexOf(symbol.value) === -1 &&
                  meta.omitReturn &&
                    meta.parentNode !== 'objectLiteral'
                      ? 'var '
                      : '';

    var newmeta = Object.create(meta);
    newmeta.ignoreScope = true;
    newmeta.objectLiteral = false;

    if (meta.omitReturn) output += generate(node.childNodes[0], newmeta);

    var exprmeta = Object.create(meta);

    exprmeta.scope.push(symbol.value);
    exprmeta.assignSymbol = generate(symbol, newmeta);

    if (meta.omitReturn) output += meta.parentNode === 'objectLiteral' ? ':' : '=';
    output += generate(node.childNodes[1], exprmeta);

    return output;

  };

  // **Generator for** `vectorLiteral` **nodes**:
  generators['vectorLiteral'] = function (node, meta) {
    var output = '[';
    if (node.childNodes[0]) {
      output += generate(node.childNodes[0], meta);
    }
    output += ']';
    return output;
  };

  // **Generator for** `expressionList` **nodes**:
  generators['expressionList'] = function (node, meta) {
    var output = '';
    node.childNodes.forEach(function (childNode, i, arr) {
      output += generate(childNode, meta);
      output += i < arr.length - 1 ? ',' : '';
    });
    return output;
  };

  // **Generator for** `objectLiteral` **nodes**:
  generators['objectLiteral'] = function (node, meta) {
    var newmeta = Object.create(meta);
    newmeta.parentNode = 'objectLiteral';
    var output = '{';
    if (node.childNodes[0]) {
      output += generate(node.childNodes[0], newmeta);
    }
    output += '}';
    return output;
  };

  // **Generator for** `assignmentList` **nodes**:
  generators['assignmentList'] = function (node, meta) {
    var output = '';
    node.childNodes.forEach(function (childNode, i, arr) {
      output += generate(childNode, meta);
      output += i < arr.length - 1 ? ',' : '';
    });
    return output;
  };

  // **Generator for** `functionLiteral` **nodes**:
  generators['functionLiteral'] = function (node, meta) {

    // Create a new scope for the function
    var newmeta = Object.create(meta);

    newmeta.parentNode = 'functionLiteral';

    // Add the parameters to function scope
    newmeta.addToScope = true;

    // Output the function signature
    var output = 'function ' +
      (meta.assignSymbol || '__anon' + idx++) +
      '(' + generate(node.childNodes[0], newmeta) + ') {';

    // The assignSymbol was used, now unset it.
    meta.assignSymbol = null;

    // Stop adding things to scope
    newmeta.addToScope = false;

    // Reset `omitReturn` so that the last
    // statement returns in subsequent calls
    meta.omitReturn = false;

    // Generate the function body
    if (node.childNodes[1]) {
      output += generate(node.childNodes[1], newmeta);
    }

    // Close the function
    output += '}';

    return output;

  };

  // **Generator for** `params` **nodes**:
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

  // **Generator for** `call` **nodes**:
  generators['call'] = function (node, meta) {
    var output = '';
    output += generate(node.childNodes[0], meta);
    output += '(';
    output += generate(node.childNodes[1], meta);
    output += ')';
    return output;
  };

  // **Generator for** `where` **nodes**:
  generators['where'] = function (node, meta) {

    var output = '';

    var symbolmeta = Object.create(meta);
    symbolmeta.addToScope = true;
    symbolmeta.ignoreScope = true;

    if (node.childNodes[0].type === 'assignmentList') {
      var symbol = node.childNodes[1].childNodes[0].childNodes[0];
      output += 'var _' + generate(symbol, symbolmeta) + ';\n';
    }
    // If the return value of the call needs to be
    // returned, create a var outside of the temp
    // scope
    output += (meta.omitReturn ? '' : 'return \n');

    // Create new scope to house temporary vars
    var newmeta = Object.create(meta);
    newmeta.omitReturn = true;

    // Create an anonymous fn to get a new scope
    output += '(function () {\n';

    output += (node.childNodes[0].type === 'assignmentList')
      ? ''
      : 'var ';
    output += generate(node.childNodes[0], newmeta) + ';';

    output += '_' + generate(node.childNodes[1], newmeta) + ';';

    // Close and invoke the annonymous fn
    output += '}());';
    return output;

  };

  // **Generator for** `conditional` **nodes**:
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

  // **Generator for** `ifFragment` **nodes**:
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

  // **Generator for** `elseFragment` **nodes**:
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

  // **Generator for** `operator` **nodes**:
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

  generators['tuple'] = function (node, meta) {
    var output = '';
    node.childNodes.forEach(function (term, i, arr) {
      output += generate(term, meta);
      output += i < arr.length - 1 ? ', ' : '';
    });
    return output;
  };

  // **Generator for** `concatenation` **nodes**:
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

  // **Generator for** `reference` **nodes**:
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
        output += generate(childNode, meta) +
          (i < arr.length - 1 ? '.' : '');
      }

    });

    return output;

  };

  // **Generator for** `identifier` **nodes**:
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

    return node.value;

  };

  // **Generator for** `leaf` **nodes**:
  generators['leaf'] = function (node, meta) {
    return node.value;
  };

  return generators;

};

module.exports = createGenerators;