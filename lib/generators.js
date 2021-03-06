// A module that contains methods for compiling
// each syntax tree node into JS source code.
//
// Each node type has its own method on the `generators`
// object and can be dynamically looked up using the JS
// subscript notation e.g. `generators['functionLiteral']`.

/*
 * Module dependencies
 */
var helpers = require('./helpers'),
    createProgramScope = helpers.createProgramScope,
    reservedWords = helpers.reservedWords;

// Instantiates a generators object. Takes a single
// argument: a pre-instantiated `errorReporter` to
// gracefully handle semantic errors during the
// code generation pass.
var createGenerators = function (filename, errorReporter) {

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
    // to annotate the nodes with
    // information on the generation
    // phase
    var meta = {};

    // Import the top-level program scope
    // (i.e global variables)
    meta.scope = createProgramScope();
    var output = '(function () {\n';
    output += generate(node.childNodes[0], meta);
    output += '}());\n';

    return output;

  };

  // **Generator for** `statementList` **nodes**:
  generators['statementList'] = function (node, meta) {

    var output = '';

    // Loop over each of the statements in the list
    node.childNodes.forEach(function (statement, i, arr) {

      if (i === arr.length - 1 && !meta.omitReturn &&
            ['conditional', 'where', 'assignment'].indexOf(statement.type) === -1) {
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
      : node.childNodes[0].childNodes[node.childNodes[0].childNodes.length - 1];

    var isIdentifier = node.childNodes[0].type === 'identifier' ||
          (node.childNodes[0].type === 'reference' &&
            node.childNodes[0].childNodes.length === 1);

    var output = '';
    if (isIdentifier && meta.scope.indexOf(symbol.value) === -1 &&
        meta.parentNode !== 'objectLiteral' && !meta.omitVar) {
      output += 'var ';
    }

    var newmeta = Object.create(meta);
    newmeta.ignoreScope = true;
    newmeta.objectLiteral = false;
    if (node.childNodes[0].type === 'identifier' ||
        (node.childNodes[0].type === 'reference' && node.childNodes[0].childNodes.length === 1))
      newmeta.addToScope = true;

    output += generate(node.childNodes[0], newmeta);

    var exprmeta = Object.create(meta);

    // Create a fresh copy of the scope so the
    // parent is not mutated
    exprmeta.scope = exprmeta.scope.slice(0);

    if (node.childNodes[0].type === 'identifier' &&
          exprmeta.scope.indexOf(symbol.value) === -1) {
      exprmeta.scope = exprmeta.scope.push(symbol.value);
    }

    // If the expression is a function definition, use the
    // its name to define it, which will create a more helpful
    // stack trace should a runtime error occur
    exprmeta.assignSymbol = generate(symbol, newmeta);
    exprmeta.parentNode = 'assignment';
    exprmeta.omitVar = false;

    output += meta.parentNode === 'objectLiteral' ? ':' : '=';
    output += generate(node.childNodes[1], exprmeta);

    if (!meta.omitReturn)
      output += ';\nreturn ' + generate(node.childNodes[0], newmeta);

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
      var newmeta = Object.create(meta);
      newmeta.omitVar = i > 0;
      output += generate(childNode, newmeta);
      output += i < arr.length - 1 ? ',' : '';
    });
    return output;
  };

  // **Generator for** `functionLiteral` **nodes**:
  generators['functionLiteral'] = function (node, meta) {

    // Create a new scope for the function
    var newmeta = Object.create(meta);

    newmeta.parentNode = 'functionLiteral';

    // `newmeta` has scope inherited from `meta`.
    // From here on, things added to `newmeta`'s
    // scope shouldn't mutate the parent scope, so
    // create a copy.
    newmeta.scope = meta.scope.slice(0);

    // Add the parameters to function scope
    newmeta.addToScope = true;

    // Output the function signature
    var output = 'function ' +
      (meta.assignSymbol || '__anon' + idx++) +
      '(' + generate(node.childNodes[0], newmeta) + ') {\n';

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

    node.childNodes[0].childNodes.forEach(function (assign) {
      assign.childNodes[0].value = '__' + assign.childNodes[0].value;
    });

    var newmeta = Object.create(meta);
    newmeta.addToScope = false;
    newmeta.omitReturn = true;
    output += generate(node.childNodes[0], newmeta) + ';\n';
    output += meta.omitReturn ? '' : 'return ';
    output += generate(node.childNodes[1], newmeta) + ';\n';

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

  // **Generator for** `trycatch` **nodes**:
  generators['trycatch'] = function (node, meta) {

    var output = 'try {\n';

    generate(node.childNodes[0], meta);

    var newmeta = Object.create(meta);
    newmeta.scope = meta.scope.slice(0);
    newmeta.addToScope = true;
    newmeta.ignoreScope = true;

    output += '\n} catch (';
    output += generate(node.childNodes[1], newmeta);

    newmeta.addToScope = false;
    newmeta.ignoreScope = false;

    output += ') {\n';
    output += generate(node.childNodes[2], newmeta);
    output += '}';

    return output;
  };

  // **Generator for** `operator` **nodes**:
  generators['operator'] = function (node, meta) {

    var output = '';

    var ops = function (op) {
      if (op === '|') {
        return '||';
      } else if (op === '&') {
        return '&&';
      } else if (op === '==') {
        return '===';
      } else if (op === '!=') {
        return '!==';
      } else {
        return op;
      }
    };

    // Determine where to place the operator and
    // output the child node(s)
    switch (node.meta.fix) {
    case 'in':
      output += generate(node.childNodes[0], meta);
      output += ops(node.meta.op);
      output += generate(node.childNodes[1], meta);
      break;
    case 'pre':
      output += ops(node.meta.op);
      output += generate(node.childNodes[0], meta);
      break;
    case 'post':
      output += generate(node.childNodes[0], meta);
      output += ops(node.meta.op);
      break;
    default:
      throw new Error('Unknown operator position');
    }

    return output;

  };

  // **Generator for** `arrayAccessor` **nodes**:
  generators['arrayAccessor'] = function (node, meta) {

    var output = generate(node.childNodes[0], meta);
    output += '[' + generate(node.childNodes[1], meta) + ']';

    return output;

  };

  // **Generator for** `tuple` **nodes**:
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
        output += generate(childNode, meta);
      }

      output  += (i < arr.length - 1 ? '.' : '');

    });

    return output;

  };

  // **Generator for** `identifier` **nodes**:
  generators['identifier'] = function (node, meta) {

    var prefix = '';

    // Check if this identifier is in the current
    // scope, unless it's not required to be.
    if (!meta.ignoreScope) {
      if (meta.scope.indexOf(node.value) === -1) {
        if (meta.scope.indexOf('__' + node.value) !== -1) {
          prefix = '__';
        } else {
          semanticError(node);
        }
      }
    }

    // If required (and if not already there) add the
    // identifier to the current scope.
    if (meta.addToScope && meta.scope.indexOf(node.value) === -1) {
      meta.scope.push(node.value);
    }

    var output = node.value;
    if (reservedWords.indexOf(node.value) !== -1) output = '_' + output;
    return prefix + output;

  };

  // **Generator for** `leaf` **nodes**:
  generators['leaf'] = function (node, meta) {
    // Simply return the node's value. If the node has
    // a falsy value, check whether this is a value for
    // an assignment, in which case null should be passed
    // so as to assign a variable to null and declare it in
    // the current scope
    return node.value || (meta.parentNode === 'assignment' ? 'null' : '');
  };

  return generators;

};

module.exports = createGenerators;