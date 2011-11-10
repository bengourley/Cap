var lexer = require('./lexer')(),
  nodes = require('./nodes');

var parser = function (spec) {

  var parser = {},
    token,

    // Methods
    program,
    statementList,
    statement,
    assign,
    expression,
    call,
    where,
    conditional,
    shorthandConditional,
    concatenation,
    literal,
    assignList,
    tuple,
    number,
    string,
    id,
    parseError,
    next,
    accept,
    lookahead;


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
  program = function () {
    var statements = statementList();
    accept('eof');
    return nodes.program({ statementList : statements });
  };

  // Parses a list of statements, the building
  // blocks of the language
  statementList = function () {
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
  statement = function () {

    // Try to match an expression.
    var expr = expression({}), node;

    // Try to match a statement type
    // that starts with and expression
    if (expr) {

      // See if the statement is an assignment
      if (expr.type === 'primitive' && lookahead(1).type === '=') {
        node = assign(expr);
        accept('vwhitespace');
        return node;
      // Or a where clause
      } else if (expr.type === 'call' && lookahead(1).type === 'where') {
        node = where(expr);
        accept('vwhitespace');
        return node;
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
      if (lookahead(1).type === 'if') {
        return conditional();
      } else {
        return false;
      }
    }
  };

  // Parses an assignment
  assign = function (expr) {
    accept('=');
    var a = expression({}) || literal();
    return nodes.assign({ id : expr, expr : a });
  };

  // Parses an expression
  expression = function (opts) {

    var expr, op, second, arg;

    // Look ahead one token and decide
    // what to parse next
    switch (lookahead(1).type) {
    case 'number': expr = number(); break;
    case 'string': expr = string(); break;
    case 'identifier': expr = id(); break;
    case '(': next(); expr = tuple(); break;
    default: return false;
    }

    // An expression has been matched, now see
    // if this is a mathsy expression, a concatenation,
    // or a function call.

    if (['+', '-', '*', '/'].indexOf(lookahead(1).type) !== -1) {
      op = next();
      return nodes.mathsy({
        left : expr,
        right : expression({}),
        op : op.type,
        fix : 'in',
        bracketed : opts && opts.bracketed
      });
    } else if (lookahead(1).type === '&') {
      next();
      return concatenation(expr);
    } else {
      return opts.insidecall ? expr : call(expr);
    }

  };

  // Parses a function call
  call = function (expr) {

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
      return nodes.call({ fn : exprs.length === 1 ? exprs[0] : reduce(exprs), arg : arg });
    }(exprs));

    // Return the call
    return call;

  };

  literal = function () {
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
    }
    return lit;
  };

  assignList = function () {
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
  conditional = function () {
    var cond, ifBody, elseBody;
    accept('if');
    cond = expression({});
    accept('vwhitespace');
    accept('indent');
    accept('vwhitespace');
    ifBody = statementList();
    accept('dedent');
    accept('vwhitespace');
    if (lookahead(1).type === 'else') {
      next();
      accept('vwhitespace');
      accept('indent');
      accept('vwhitespace');
      elseBody = statementList();
      accept('dedent');
      accept('vwhitespace');
    }
    return nodes.conditional({ cond : cond, ifBody : ifBody, elseBody : elseBody });
  };

  // Parses a shorthand conditional
  shorthandConditional = function (cond) {
    accept('?');
    accept('vwhitespace');
    accept('indent');
    accept('vwhitespace');
    var ifBody = statement(), elseBody;

    // If the conditional only has one clause,
    // build the node now
    if (lookahead(1).type === 'dedent') {
      accept('dedent');
      return nodes.conditional({
        cond : cond,
        ifBody : nodes.statementList({
          statements : [ifBody]
        })
      });

    // If is has two, build it now
    } else {
      elseBody = statement();
      accept('dedent');
      return nodes.conditional({
        cond : cond,
        ifBody : nodes.statementList({
          statements : [ifBody]
        }),
        elseBody : nodes.statementList({
          statements : [elseBody]
        })
      });
    }

  };

  // Parses a where clause
  where = function (call) {
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
  concatenation = function (first) {

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
  tuple = function (opts) {

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
  number = function () {
    var t = lookahead(1);
    if (t.type === 'number') {
      next();
      return nodes.node({ value : t.value });
    } else {
      return false;
    }
  };

  // Parses a string
  string = function () {
    var t = lookahead(1);
    if (t.type === 'string') {
      next();
      return nodes.node({ value : t.value });
    } else {
      return false;
    }
  };

  // Parses an identifier
  id = function () {
    var t = lookahead(1);
    if (t.type === 'identifier') {
      next();
      return nodes.node({ value : t.value });
    } else {
      return false;
    }
  };

  // Accepts a single token
  // of the given `type`
  accept = function (type) {
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
  parseError = function (msg) {
    throw {
      type : 'ParseError',
      message : 'Parse error on line ' + lexer.lineno + ': ' + msg
    }
  };

  // Shortcut to the lexer's
  // `lex` function.
  next = function () {
    var n = lexer.lex();
    //console.log(n);
    return n;
  };

  // Shortcut to the lexer's
  // `lookahead` function
  lookahead = function (n) {
    var lh = lexer.lookahead(n);
    //console.log(lh);
    return lh;
  };

  return parser;

};

module.exports = parser;
