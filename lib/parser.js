var lexer = require('./lexer')(),
  nodes = require('./nodes');

var parser = function (spec) {

  var parser = {},
    token;


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
    return nodes.program({ statementList : statements });
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
    return nodes.statementList({ statements : statements });
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
        accept('vwhitespace');
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
        accept('vwhitespace');
        return expr;
      }

    } else {
      // The statement does not begin with
      // and expression. Match other possibilities.
      switch (lookahead(1).type) {
        case 'if': return conditional();
        case 'for': return loop();
        case 'while': return loop();
        case 'each': return loop();
        case 'loop': return loop();
        default: return false;
      }
    }
  };

  // Parses an assignment
  var assign = function (expr) {
    accept('=');
    var a = expression({}) || literal();
    return nodes.assign({ id : expr, expr : a });
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
        expr = nodes.dynamicId({ call : expr, prop : id() });
      }
      break;
    default: return false;
    }

    // An expression has been matched, now see
    // if this is an operator expression, a concatenation,
    // or a function call.

    if (['+', '-', '*', '/', '&', '|'].indexOf(lookahead(1).type) !== -1) {
      op = next().type;
      return nodes.operator({
        left : expr,
        right : expression({}),
        op : op,
        fix : 'in',
        bracketed : opts && opts.bracketed
      });
    } else if (['<', '>'].indexOf(lookahead(1).type) !== -1) {
      op = next().type;
      if (lookahead(1).type === '=') {
        op += next().type;
      }
      return nodes.operator({
        left : expr,
        right : expression({}),
        op : op,
        fix : 'in',
        bracketed : opts && opts.bracketed
      });
    } else if (lookahead(1).type === ':') {
      next();
      return concatenation(expr);
    } else {
      return opts.insidecall ? expr : call(expr);
    }

  };

  // Parses a function call
  var call = function (expr) {

    // One expression has aleady been matched,
    // try to match another.
    var exprs = [expr], call,
      arg = expression({ insidecall : true });

    // If another expression could not be matched,
    // just return the single expression
    if (!arg) {
      return expr;
    }

    // Collected as many subsequent expressions
    // as possible
    (function collect(a) {
      if (a) {
        exprs.push(a);
        collect(expression({ insideCall : true }));
      }
    }(arg));

    // Recursively reduce the list of expressions
    // into a sequence of calls.
    call = (function reduce(exprs) {
      var arg = exprs.pop();
      return nodes.call({
        fn : exprs.length === 1
          ? exprs[0]
          : reduce(exprs),
        arg : arg
      });
    }(exprs));

    // Return the call
    return call;

  };

  var literal = function () {
    var lit, params;
    switch (next().type) {
    case 'objliteral':
      accept('vwhitespace');
      accept('indent');
      accept('vwhitespace');
      lit = nodes.object({ propList : assignList() });
      accept('dedent');
      break;
    case 'funliteral':
      params = (function collect() {
        var i = id();
        return lookahead(1).type !== 'vwhitespace'
          ? [i].concat(collect())
          : [i];
      }());
      accept('vwhitespace');
      accept('indent');
      accept('vwhitespace');
      lit = nodes.fn({ body : statementList(), params : params });
      accept('dedent');
      break;
    case 'arrliteral':
      accept('vwhitespace');
      accept('indent');
      accept('vwhitespace');
      lit = null; //TODO!
      accept('dedent');
      break;
    default:
      parseError('Failed to match a literal');
    }
    return lit;
  };

  var assignList = function () {
    var assigns = [];

    (function collect() {
      var a = assign(id());
      if (a) {
        assigns.push(a);
        accept('vwhitespace');
        if (lookahead(1).type !== 'dedent') {
          collect();
        }
      }
    }());

    return assigns;

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
      condition = expression({});
      accept('vwhitespace');
      accept('indent');
      accept('vwhitespace');
      body = statementList();
      accept('dedent');
      accept('vwhitespace');
      return {
        condition : condition,
        body : body
      };
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
      return {
        body : body
      };
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
            if (lookahead(1).type === 'else' && next()) {
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
    return nodes.conditional({ iff : iff, elseIfs : elseIfs, elsee : elsee });
  };

  // Parses a shorthand conditional
  var shorthandConditional = function (cond) {
    accept('?');
    accept('vwhitespace');
    accept('indent');
    accept('vwhitespace');
    var iff = {
      condition : cond,
      body : nodes.statementList({
        statements : [statement()]
      })
    }, elsee;

    // If the conditional only has one clause,
    // build the node now
    if (lookahead(1).type === 'dedent') {
      accept('dedent');
      return nodes.conditional({
        iff : iff
      });

    // If is has two, build it now
    } else {
      elsee = {
        body : nodes.statementList({
          statements : [statement()]
        })
      };
      accept('dedent');
      return nodes.conditional({
        iff : iff,
        elsee : elsee
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
    return nodes.loop({
      form : form,
      signature : signature,
      statements : statements
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
    return nodes.where({ call : call, pre : [pre] });
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

    return nodes.concatenation({ exprList : concats });

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
    case 0: return nodes.node({ value : '' });
    case 1:
      expr = exprs[0];
      expr.bracketed = true;
      return expr;
    default: return exprs;
    }

  };

  // Parses a number
  var number = function () {
    var t = lookahead(1);
    if (t.type === 'number') {
      next();
      return nodes.node({ value : t.value });
    } else {
      return false;
    }
  };

  // Parses a boolean
  var bool = function () {
    var t = lookahead(1);
    if (t.type === 'true' || t.type === 'false') {
      next();
      return nodes.node({ value : t.type });
    } else {
      return false;
    }
  };

  // Parses a string
  var string = function () {
    var t = lookahead(1);
    if (t.type === 'string') {
      next();
      return nodes.node({ value : t.value });
    } else {
      return false;
    }
  };

  // Parses a reference
  var reference = function () {
    var path = (function collect() {
      var i = id();
      if (i) {
        if (lookahead(1).type === '.') {
          next();
          return [i].concat(collect());
        } else {
          return [i];
        }
      } else {
        return false;
      }
    }());

    return nodes.reference({ path : path });

  };

  // Parses an identifier
  var id = function () {
    var t = lookahead(1);
    if (t.type === 'identifier') {
      next();
      return nodes.node({ value : t.value, type : 'id' });
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
    throw {
      type : 'ParseError',
      message : 'Parse error on line ' + lexer.lineno + ': ' + msg
    };
  };

  // Shortcut to the lexer's
  // `lex` function.
  var next = function () {
    var n = lexer.lex();
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

module.exports = parser;
