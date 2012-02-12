// Module dependecies
var createLexer = require('./lexer'),
  node = require('./node');

var createParser = function () {

  var parser = {},
    token,
    lexer = createLexer();

  // Parse the given `data`. Returns
  // and AST of of the parse, or throws
  // a `parseError` if something went wrong.
  parser.parse = function (data) {
    lexer.setInput(data);
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
      childNodes : [statements]
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
      childNodes : statements
    });
  };

  // Parses a statement
  var statement = function () {

    // Try to match an expression.
    var expr = expression({}), node;

    // Try to match a statement type
    // that starts with and expression
    if (expr) {

      // See if the statement is an assignment
      if (expr.type === 'reference' && lookahead(1).type === '=') {
        node = assign(expr);
        return node;
      // Or a where clause
      } else if (expr.type === 'call' && lookahead(1).type === 'where') {
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
        default: return false;
      }
    }
  };

  // Parses an assignment
  var assign = function (expr, opts) {
    var a = expression({});
    if (a && lookahead(1).type === 'vwhitespace') { 
      accept('vwhitespace');
    }
    if (a) {
      return node({
        type : 'assignment',
        childNodes : [expr, a]
      });
    } else {
      return false;
    }
  };

  // Parses an expression
  var expression = function (opts) {

    // TODO: Check for a modifier (i.e `!`, `-`)

    var expr, op, second, arg;

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
      next();
      expr = tuple();
      if (expr.type && expr.type === 'call') {
        next();
        expr = node({
          type : 'dynamicReference',
          childNodes : [expr, id()]
        });
      }
      break;
    default:
      if (opts.singleLine) expr = literal();
      if (!expr) return false;
    }

    // An expression has been matched, now see
    // if this is an operator expression, a concatenation,
    // or a function call.

    if (['+', '-', '*', '/', '&', '|'].indexOf(lookahead(1).type) !== -1) {
      op = next().type;
      return node({
        type : 'operator',
        meta : {
          fix : 'in',
          op : op
        },
        childNodes : [
          expr,
          expression({})
        ]
      });
    } else if (['<', '>'].indexOf(lookahead(1).type) !== -1) {
      op = next().type;
      if (lookahead(1).type === '=') {
        op += next().type;
      }
      return node({
        type : 'operator',
        childNodes : [expr, expression({})],
        meta : {
          op : op,
          fix : 'in'
        }
      });
    } else if (lookahead(1).type === '=') {
      accept('=');
      if (lookahead(1).type === '=') {
        accept('=');
        return node({
          type : 'operator',
          childNodes : [expr, expression({})],
          meta : {
            op : '===',
            fix : 'in'
          }
        });
      } else {
        return assign(expr, {}); 
      }
    } else if (lookahead(1).type === ':') {
      next();
      return concatenation(expr);
    } else {
      return opts.noCall ? expr : call(expr);
    }

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
        childNodes : [fn, arg]
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
      childNodes : childNodes
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
        if (i) nodes.push(i);
        return lookahead(1).type !== '|' ?
          collect(nodes) :
          nodes;
        }([]))
      });
      accept('|');
      return {
        type : 'functionLiteral',
        params : [params]
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
          nodes.push(a);
          if (lookahead(1).type !== 'dedent') {
            return collect(nodes);
          } else {
            return nodes;
          }
        } else {
          return nodes;
        }
      }([]))
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
      }([]))
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
      if (!condition) parseError('Invalid expression in if clause')
      if (lookahead(1).type === 'vwhitespace') accept('vwhitespace');
      accept('indent');
      accept('vwhitespace');
      body = statementList();
      accept('dedent');
      accept('vwhitespace');
      return node({
        type : 'ifFragment',
        childNodes : [
          condition,
          body
        ]
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
        childNodes : [body]
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
      childNodes : childNodes
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
      childNodes : [cond, statement()]
    }), elsee;

    // If the conditional only has one clause,
    // build the node now
    if (lookahead(1).type === 'dedent') {
      accept('dedent');
      return node({
        type : 'conditional',
        childNodes : [iff]
      });

    // If is has two, build it now
    } else {
      elsee = node({
          type : 'elseFragment',
          childNodes : [statement()]
      });
      accept('dedent');
      return node({
        type : 'conditional',
        childNodes : [iff, elsee]
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
        node({ type : 'loopSignature', childNodes : signature }),
        statements
      ]
    });
  };

  // Parses a where clause
  var where = function (call) {
    accept('where');
    accept('vwhitespace');
    accept('indent');
    accept('vwhitespace');
    var pre = assign(id());
    accept('vwhitespace');
    accept('dedent');
    return node({
      type : 'where',
      childNodes : [pre, call]
    });
  };

  // Parses a concatenation expression
  var concatenation = function (first) {

    var concats = [first], expr;
    do {
      expr = expression({});
      if (expr) {
        concats.push(expr);
        expr = lookahead(1).type === '&';
      }
    } while (expr);

    return node({
      type : 'concatenation',
      childNodes : concats
    });

  };

  // Parses a tuple
  var tuple = function (opts) {

    // Match one exprssion
    var exprs = [], expr;
    
    expr = expression({});

    if (expr) {

      exprs.push(expr);

      // While successive expressions are
      // delimited by commas, keep them coming
      while (lookahead(1).type === ',') {
        next();
        expr = expression({});
        if (expr) {
          exprs.push(expr);
        } else {
          parseError('expecting an expression');
        }
      }
    }
    
    accept(')');

    switch (exprs.length) {
    case 0: return node({ value : '' });
    case 1:
      expr = exprs[0];
      return expr;
    default: return exprs;
    }

  };

  // Parses a number
  var number = function () {
    var t = lookahead(1);
    if (t.type === 'number') {
      next();
      return node({ value : t.value });
    } else {
      return false;
    }
  };

  // Parses a boolean
  var bool = function () {
    var t = lookahead(1);
    if (t.type === 'true' || t.type === 'false') {
      next();
      return node({ value : t.type });
    } else {
      return false;
    }
  };

  // Parses a string
  var string = function () {
    var t = lookahead(1);
    if (t.type === 'string') {
      next();
      return node({ value : t.value });
    } else {
      return false;
    }
  };

  // Parses a reference
  var reference = function () {
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
    }([]));

    return node({
      type : 'reference',
      childNodes : path
    });

  };

  // Parses an identifier
  var id = function () {
    var t = lookahead(1);
    if (t.type === 'identifier') {
      next();
      return node({
        value : t.value
      });
    } else {
      return false;
    }
  };

  // Accepts a single token
  // of the given `type`
  var accept = function (type) {
    var n = next().type;
    if (n === type) {
      return true;
    } else {
      parseError('Expecting ' + type + ', found ' + n);
    }
  };

  // Takes a string `msg` and throws
  // an error. Adds more information to
  // the message.
  var parseError = function (msg) {

    var ParseError = new Error(
      'Parse error on line ' + lexer.lineno + ': ' + msg
    );

    ParseError.type = 'ParseError';

    throw ParseError;
  };

  // Shortcut to the lexer's
  // `lex` function.
  var next = function () {
    var n = lexer.lex();
    // console.log(n);
    return n;
  };

  // Shortcut to the lexer's
  // `lookahead` function
  var lookahead = function (n) {
    var lh = lexer.lookahead(n);
    return lh;
  };

  return parser;

};

module.exports = createParser;
