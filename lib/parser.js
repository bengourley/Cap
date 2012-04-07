// Module dependecies
var node = require('./node');

var createParser = function (lexer, errorReporter) {

  var parser = {},
      token;

  // Parse the given `data`. Returns
  // and AST of of the parse, or throws
  // a `parseError` if something went wrong.
  parser.parse = function (data) {
    lexer.setInput(data);
    if (lookahead(1).type === 'vwhitespace') accept('vwhitespace');
    var p = program();
    return p;
  };

  // Parses a `statementList` and
  // checks that the end of file has been
  // reached
  var program = function () {
    var statements = statementList();
    while (lookahead(1).type === 'vwhitespace') {
      next();
    }
    accept('eof');
    return node({
      type : 'program',
      childNodes : [statements],
      sourceLocation : lexer.getPosition()
    });
  };

  // Parses a list of statements, the building
  // blocks of the language
  var statementList = function () {
    var statements = [], s;
    do {
      s = statement();
      if (s) {
        statements.push(s);
      }
    } while (s);
    return node({
      type : 'statementList',
      childNodes : statements,
      sourceLocation : lexer.getPosition()
    });
  };

  // Parses a statement
  var statement = function () {

    // Try to match an expression.
    var expr = expression({}), node;

    // Try to match a statement type
    // that starts with and expression
    if (expr) {

      // See if the statement is a where
      if (['call', 'assignment'].indexOf(expr.type) !== -1 &&
            lookahead(1).type === 'where') {
        node = where(expr);
        accept('vwhitespace');
        return node;
      // Or a shorthand conditional
      } else if (lookahead(1).type === '?') {
        node = shorthandConditional(expr);
        accept('vwhitespace');
        return node;
      } else {
        // The statement is just an expression
        if (lookahead(1).type === 'vwhitespace') accept('vwhitespace');
        return expr;
      }

    } else {
      // The statement does not begin with
      // and expression. Match other possibilities.
      switch (lookahead(1).type) {
        case 'if': return conditional();
        case 'while': return loop();
        case 'try': return trycatch();
        default: return false;
      }
    }
  };

  // Parses an assignment
  var assign = function (expr, opts) {

    // Match an expression
    var a = expression({});

    // Prevent trailing expressions after multi-line
    // assignments (i.e. literals)
    if (a.type === 'call' &&
        [ 'objectLiteral',
          'vectorLiteral',
          'functionLiteral' ]
            .indexOf(a.childNodes[0].type) !== -1) {
      parseError('Trailing expression after literal');
    }

    if (a) {

      // Accept trailing whitespace
      if (lookahead(1).type === 'vwhitespace') accept('vwhitespace');

      // Create an assignment node (if we have an expression)
      return node({
        type : 'assignment',
        childNodes : [expr, a],
        sourceLocation : lexer.getPosition()
      });

    } else {

      // No assignment here
      return false;

    }
  };

  // Parses an expression
  var expression = function (opts) {

    var expr, op, second, arg, modifier;

    if (['!', '-'].indexOf(lookahead(1).type) !== -1) {
      modifier = next().type;
    }

    // Look ahead one token and decide
    // what to parse next
    switch (lookahead(1).type) {
    case 'number':
      expr = number(); break;
    case 'true':
    case 'false':
      expr = bool(); break;
    case 'string':
      expr = string(); break;
    case 'identifier':
      expr = reference(); break;
    case '(':
      expr = tuple();
      break;
    default:
      if (modifier) parseError('Unexpected prefix `' + modifier + '`');
      if (!opts.singleLine) expr = literal();
      return expr;
    }

    if (expr && lookahead(1).type === '[') {
      next();
      expr = arrayAccessor(expr);
    }

    // An expression has been matched, now see
    // if this is an operator expression, a concatenation,
    // or a function call.

    if (['+', '-', '*', '/', '&', '|'].indexOf(lookahead(1).type) !== -1) {
      op = next().type;
      expr = node({
        type : 'operator',
        meta : { fix : 'in', op : op },
        childNodes : [expr, expression({})],
        sourceLocation : lexer.getPosition()
      });
    } else if (['<', '>', '!'].indexOf(lookahead(1).type) !== -1) {
      op = next().type;
      if (lookahead(1).type === '=') {
        op += next().type;
      }
      expr = node({
        type : 'operator',
        childNodes : [expr, expression({})],
        meta : { op : op, fix : 'in' },
        sourceLocation : lexer.getPosition()
      });
    } else if (lookahead(1).type === '=') {
      if (modifier)
        parseError('`' + modifier + '` modifier cannot be used before assignment');
      accept('=');
      if (lookahead(1).type === '=') {
        accept('=');
        expr = node({
          type : 'operator',
          childNodes : [expr, expression({})],
          meta : { op : '==', fix : 'in' },
          sourceLocation : lexer.getPosition()
        });
      } else {
        expr = assign(expr, {});
      }
    } else if (lookahead(1).type === ':') {
      next();
      expr = concatenation(expr);
    } else {
      expr = opts.noCall ? expr : call(expr);
    }

    return !modifier ? expr : node({
      type : 'operator',
      meta : { fix : 'pre', op : modifier },
      childNodes : [expr]
    });

  };

  // Parses a function call
  var call = function (expr) {

    var exprs = [expr], arg = expression({
      noCall : true
    });

    // If another expression could not be matched,
    // just return the single expression
    if (!arg) return expr;

    var fn = expr;

    while (arg) {
      fn = node({
        type : 'call',
        childNodes : [fn, arg],
        sourceLocation : lexer.getPosition()
      });
      arg = expression({
        noCall : true
      });
    }

    return fn;

  };

  var literal = function () {
    var def = literalDef();
    if (!def || lookahead(1).type !== 'vwhitespace') return false;
    accept('vwhitespace');
    var childNodes = [];
    if (def.type === 'functionLiteral') {
      childNodes.push(def.params);
    }
    if (lookahead(1).type === 'indent') {
      childNodes.push(literalContents(def.type));
    }
    return node({
      type : def.type,
      childNodes : childNodes,
      sourceLocation : lexer.getPosition()
    });
  };

  var literalDef = function () {
    switch(lookahead(1).type) {
    case '{':
      next();
      accept('}');
      return {
        type : 'objectLiteral'
      };
    case '[':
      next();
      accept(']');
      return {
        type : 'vectorLiteral'
      };
    case '|':
      next();
      var params = node({
        type : 'params',
        childNodes : (function collect(nodes) {
          var i = id();
          if (i) {
            nodes.push(i);
          } else if (lookahead(1).type !== '|') {
            parseError('Unexpected token `' + lookahead(1).type +
              '` in param definition');
          }
          return lookahead(1).type !== '|' ?
            collect(nodes) :
            nodes;
          }([])),
        sourceLocation : lexer.getPosition()
      });
      accept('|');
      return {
        type : 'functionLiteral',
        params : params
      };
    default:
      return false;
    }
  };

  var literalContents = function (def) {
    var contents;
    switch (def) {
    case 'objectLiteral':
      accept('indent');
      accept('vwhitespace');
      contents = assignList();
      if (lookahead(1).type === 'vwhitespace') {
        accept('vwhitespace');
      }
      accept('dedent');
      accept('vwhitespace');
      break;
    case 'vectorLiteral':
      accept('indent');
      accept('vwhitespace');
      contents = expressionList();
      if (lookahead(1).type === 'vwhitespace') {
        accept('vwhitespace');
      }
      accept('dedent');
      accept('vwhitespace');
      break;
    case 'functionLiteral':
      accept('indent');
      accept('vwhitespace');
      contents = statementList();
      if (lookahead(1).type === 'vwhitespace') {
        accept('vwhitespace');
      }
      accept('dedent');
      accept('vwhitespace');
      break;
    default:
      parseError('Unknown literal definition');
    }
    return contents;
  };

  var assignList = function () {

    return node({
      type : 'assignmentList',
      childNodes : (function collect(nodes) {
        var i, a;
        i = id();
        if (i) {
          accept('=');
          a = assign(i);
          if (!a) throw parseError('Failed to match an assignment');
          nodes.push(a);
          if (lookahead(1).type !== 'dedent') {
            return collect(nodes);
          } else {
            return nodes;
          }
        } else {
          return nodes;
        }
      }([])),
      sourceLocation : lexer.getPosition()
    });

  };

  var expressionList = function () {

    return node({
      type : 'expressionList',
      childNodes : (function collect(nodes) {
        var e = expression({});
        nodes.push(e);
        if (lookahead(1).type === 'vwhitespace') {
          accept('vwhitespace');
        }
        if (lookahead(1).type !== 'dedent') {
          return collect(nodes);
        } else {
          return nodes;
        }
      }([])),
      sourceLocation : lexer.getPosition()
    });

  };

  // Parses a conditional
  var conditional = function () {

    var iff, elseIfs, elsee,
      recogniseIf, recogniseElse;

    // Helper function to recognise
    // `if`s (and `else if`s)
    recogniseIf = function () {
      var condition, body;
      accept('if');
      condition = expression({
        singleLine : true
      });
      if (!condition) parseError('Invalid expression in if clause');
      if (lookahead(1).type === 'vwhitespace') accept('vwhitespace');
      accept('indent');
      accept('vwhitespace');
      body = statementList();
      accept('dedent');
      accept('vwhitespace');
      return node({
        type : 'ifFragment',
        childNodes : [condition, body],
        sourceLocation : lexer.getPosition()
      });
    };

    // Helper function to recognise
    // `else`s
    recogniseElse = function () {
      accept('vwhitespace');
      accept('indent');
      accept('vwhitespace');
      var body = statementList();
      accept('dedent');
      accept('vwhitespace');
      return node({
        type : 'elseFragment',
        childNodes : [body],
        sourceLocation : lexer.getPosition()
      });
    };

    // Recognise an `if`
    iff = recogniseIf();

    // If followed by an `else` token,
    // there's more of this conditional
    // to parse
    if (lookahead(1).type === 'else') {
      next();

      // Is this an `else` or an `else if`?
      if (lookahead(1).type === 'if') {

        elseIfs = (function collect() {

          if (lookahead(1).type === 'if') {
            var elseIf = recogniseIf();
            if (lookahead(1).type === 'else') {
              next();
              return [elseIf].concat(collect());
            } else {
              return [elseIf];
            }
          } else {
            elsee = recogniseElse();
            return [];
          }

        }());

      } else {
        // Recognise a lone `else`
        elsee = recogniseElse();
      }
    }

    var childNodes = [iff];
    if (elseIfs) childNodes = childNodes.concat(elseIfs);
    if (elsee) childNodes = childNodes.concat(elsee);

    return node({
      type : 'conditional',
      childNodes : childNodes,
      sourceLocation : lexer.getPosition()
    });

  };

  // Parses a shorthand conditional
  var shorthandConditional = function (cond) {
    accept('?');
    accept('vwhitespace');
    accept('indent');
    accept('vwhitespace');
    var iff = node({
      type : 'ifFragment',
      childNodes : [cond, statement()],
      sourceLocation : lexer.getPosition()
    }), elsee;

    // If the conditional only has one clause,
    // build the node now
    if (lookahead(1).type === 'dedent') {
      accept('dedent');
      return node({
        type : 'conditional',
        childNodes : [iff],
        sourceLocation : lexer.getPosition()
      });

    // If is has two, build it now
    } else {
      elsee = node({
          type : 'elseFragment',
          childNodes : [statement()],
          sourceLocation : lexer.getPosition()
      });
      accept('dedent');
      return node({
        type : 'conditional',
        childNodes : [iff, elsee],
        sourceLocation : lexer.getPosition()
      });
    }

  };

  // Parses a loop definition
  var loop = function () {
    var form = next().type,
        signature = [];
    if (form === 'while') {
      signature.push(expression({}));
    } else if (form === 'loop') {
      signature.push(expression({}));
    } else if (form === 'for') {
      signature.push(assign(expression({})));
      accept(',');
      signature.push(expression({}));
      accept(',');
      signature.push(expression({}));
    }
    accept('vwhitespace');
    accept('indent');
    accept('vwhitespace');
    var statements = statementList();
    accept('dedent');
    accept('vwhitespace');

    return node({
      type : 'loop',
      meta: {
        form : form
      },
      childNodes : [
        node({
          type : 'loopSignature',
          childNodes : signature,
          sourceLocation : lexer.getPosition()
        }),
        statements
      ]
    });
  };

  // Parses a try/catch block
  var trycatch = function () {
    accept('try');
    accept('vwhitespace');
    accept('indent');
    accept('vwhitespace');
    var tryblock = statementList();
    accept('dedent');
    accept('vwhitespace');
    accept('catch');
    var i = id();
    accept('vwhitespace');
    accept('indent');
    accept('vwhitespace');
    var catchblock = statementList();
    accept('dedent');
    accept('vwhitespace');
    return node({
      type : 'trycatch',
      childNodes : [tryblock, i, catchblock],
      sourceLocation : lexer.getPosition()
    });
  };

  // Parses a where clause
  var where = function (call) {
    accept('where');
    accept('vwhitespace');
    accept('indent');
    accept('vwhitespace');
    var pre = assignList();
    accept('dedent');
    return node({
      type : 'where',
      childNodes : [pre, call],
      sourceLocation : lexer.getPosition()
    });
  };

  // Parses a tuple
  var tuple = function () {
    next();
    var expr = [];
    expr.push(expression({}) || node({}));
    while (lookahead(1).type === ',') {
      accept(',');
      expr.push(expression({}));
    }
    accept(')');

    expr = node({
      type : 'tuple',
      childNodes : expr,
      sourceLocation : lexer.getPosition()
    });

    if (lookahead(1).type === '.') {
      if (expr.childNodes.length > 1) parseError('Tuple is not accessible using `.`');
      next();
      expr = reference(expr);
    }
    return expr;
  };

  // Parses a concatenation expression
  var concatenation = function (first) {

    var concats = [first], expr;
    expr = expression({});
    if (expr) {
      concats.push(expr);
      expr = lookahead(1).type === ':';
    }

    return node({
      type : 'concatenation',
      childNodes : concats,
      sourceLocation : lexer.getPosition()
    });

  };

  var arrayAccessor = function (expr) {
    var accessor = node({
      type : 'arrayAccessor',
      childNodes : [expr, expression({})],
      sourceLocation : lexer.getPosition()
    });
    accept(']');
    return accessor;
  };

  // Parses a number
  var number = function () {
    var t = lookahead(1);
    if (t.type === 'number') {
      next();
      return node({ value : t.value, sourceLocation : lexer.getPosition() });
    } else {
      return false;
    }
  };

  // Parses a boolean
  var bool = function () {
    var t = lookahead(1);
    if (t.type === 'true' || t.type === 'false') {
      next();
      return node({ value : t.type, sourceLocation : lexer.getPosition() });
    } else {
      return false;
    }
  };

  // Parses a string
  var string = function () {
    var t = lookahead(1);
    if (t.type === 'string') {
      next();
      return node({ value : t.value, sourceLocation : lexer.getPosition() });
    } else {
      return false;
    }
  };

  // Parses a reference
  var reference = function (expr) {
    var path = (function collect(ids) {
      var i = id();
      if (i) {
        ids.push(i);
        if (lookahead(1).type === '.') {
          next();
          return collect(ids);
        } else {
          return ids;
        }
      } else {
        parseError('Trailing \'.\' after reference');
      }
    }(expr ? [expr] : []));

    return node({
      type : 'reference',
      childNodes : path,
      sourceLocation : lexer.getPosition()
    });

  };

  // Parses an identifier
  var id = function () {
    var t = lookahead(1);
    if (t.type === 'identifier') {
      next();
      return node({
        type : 'identifier',
        value : t.value,
        sourceLocation : lexer.getPosition()
      });
    } else {
      return false;
    }
  };

  // Accepts a single token
  // of the given `type`. If
  // not found, creates an error.
  var accept = function (type) {
    var n = next();
    if (n.type === type) {
      return true;
    } else {
      parseError('Expecting `' + type + '` token, found `' + n.type + '`');
    }
  };

  // Takes a string `msg` and throws
  // an error. Uses an error reporter
  // to provide meaningful error
  var parseError = function (msg) {

    var ParseError = new Error(
      errorReporter.getReport(msg, lexer.getPosition())
    );

    ParseError.type = 'ParseError';
    throw ParseError;

  };

  // Shortcut to the lexer's
  // `lex` function.
  var next = function () {
    var n = lexer.lex();
    return n;
  };

  // Shortcut to the lexer's
  // `lookahead` function, but
  // intercept error tokens and
  // report them
  var lookahead = function (n) {
    var lh = lexer.lookahead(n);
    if (lh.type === 'error') parseError(lh.value);
    return lh;
  };

  // Shortcut to the lexer's
  // `location` function
  parser.position = function (n) {
    return lexer.location();
  };

  return parser;

};

module.exports = createParser;
