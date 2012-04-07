// A module that scans an input string
// recognising sequences of characters
// and creating tokens.

/*
 * Module dependencies.
 */
var fs = require('fs'),
    token = require('./token');

// Instantiates a `lexer` object.
var createLexer = function () {

  // Define the `lexer` and instance variables.
  var lexer = {},
      input = '',
      completeInput = '',
      indentStack = [''],
      tokens = [],
      tokenStash = [],
      position = 0,
      startOfFile = true,
      reservedWords = [
        'if',
        'else',
        'for',
        'while',
        'true',
        'false',
        'local',
        'where',
        'try',
        'catch'
      ],
      allowedSymbols = [
        '+', '-', '/', '*', '(', ')', ':', '=',
        '?', ',', '.', '|', '&', '!', '<', '>',
        '[', ']', '{', '}', '\''
      ];

  // `lex()` creates a token representing the
  // next (set of) character(s) on the input string.
  // When the end of the input is reached, this
  // function returns an `eof` token.
  var lex = function () {

    // Deal with the special case of whitespace at the
    // start of a file, which would otherwise be consumed
    // without error.
    if (startOfFile) {

      if (/^[ \t]+/.exec(input)) {
        tokenStash.push(token({
          type : 'error',
          value : 'File starts with an indent'
        }));
      }
      startOfFile = false;
    }

    // Set the token to return. Check in the `tokenStash`
    // before reading in new input, in case more than one
    // token was generate in a previous call to `next()`.
    var t = tokenStash.length > 0
      ? tokenStash.shift()
      : next();

    // If the next token is actually an array of tokens,
    // store them in the `tokenStash`.
    if (Array.isArray(t)) {
      tokenStash = tokenStash.concat(t);
      t = tokenStash.shift();
    }

    return t;

  };

  // `setInput()` sets the input of the `lexer` to
  // the given string `str`.
  var setInput = function (str) {
    // Set the input to the given string.
    // Add a newline to the end of the file
    // in there isn't one already -- this
    // is to implicitely close any remaining
    // indents
    input = str + '\n';
    completeInput = input;
    return lexer;
  };

  // `advance()` discards `num` characters
  // from the start of the input.
  var advance = function (num) {
    input = input.substr(num);
    position += num;
  };

  // `next()` retrieves the next token recognised on the input.
  var next = function () {

    // Each of these methods only return a truthy value
    // if they return a token. The order of these functions
    // matter, since `linearWhitespace()`, `newline()` and
    // `comment()` may consume input without returning anything.
    // A call to `single()` will always return a token, which
    // will be an allowed single character of the language, or
    // an 'unrecognised character' error token.

    return linearWhitespace()
      || comment()
      || newline()
      || eof()
      || identifier()
      || number()
      || string()
      || single();

  };

  // `lookahead()` looks ahead `n` tokens
  // but does not advance the input.
  var lookahead = function (n) {

    while (tokenStash.length < n) {
      var l = lex();
      tokenStash.unshift(l);
    }

    return tokenStash[n - 1];

  };

  // `linearWhitespace()` recognises linear whitespace: ` ` and `\t`
  var linearWhitespace = function () {
    var res = /^[ \t]+/.exec(input);
    if (res) {
      advance(res[0].length);
    }
  };

  // `determineIndent()` analyses a change in
  // indent and produces a token if required,
  // which may turn out to be an indent, a
  // newline or an error (inconsistent indentation).
  var determineIndent = function (indentString) {

    if (indentString.indexOf(indentStack[indentStack.length - 1]) === 0) {
      indentStack.push(indentString);
      return [
        token({ type : 'vwhitespace' }),
        token({ type : 'indent' }),
        token({ type : 'vwhitespace' })
      ];
    } else {

      var dedentCount = 0, dedents, i;
      while (indentStack[indentStack.length - 1] !== indentString && indentStack.pop()) {
        dedentCount++;
      }

      if (indentStack[indentStack.length - 1] !== indentString) {
        return token({
          type : 'error',
          value : 'Inconsistent indentation'
        });
      } else {
        dedents = [token({ type : 'vwhitespace' })];
        for (i = 0; i < dedentCount; i++) {
          dedents.push(token({ type : 'dedent'}),
            token({ type : 'vwhitespace' }));
        }
        return dedents;
      }

    }

  };

  // `newline()` recognises a newline character and
  // sends off the following whitespace
  // to be analysed for indents.
  var newline = function () {
    var res = /^[\n\r\u2028\u2029]+([\t ]*)/.exec(input), indent, ts;
    if (res) {
      ts = [token({ type : 'vwhitespace'})];
      advance(res[0].length);
      indent = res[1];
      if (indent !== indentStack[indentStack.length - 1]) {
        ts = determineIndent(indent);
      }
      return ts.length === 1 ? ts[0] : ts;
    }
  };

  // `eof()` recognises the end of the file
  var eof = function () {
    if (input.length === 0) {
      return [token({ type : 'eof' })];
    }
  };

  // `comment()` recognises a comment
  var comment = function () {
    var res = /^#.*[\n\r\u2028\u2029]+([\t ]*)/.exec(input);
    while (res) {
      advance(res[0].length);
      res = /^#.*[\n\r\u2028\u2029]+([\t ]*)/.exec(input);
    }
  };

  // `identifier()` recognises an identifier eg.
  // `foo`, `bar`. It also recognises reserved words
  // by matching against the whitelist of reserved words.
  var identifier = function () {
    var res = /^([A-Za-z]+)[\W]/.exec(input);
    if (res) {
      advance(res[1].length);
      if (reservedWords.indexOf(res[1]) === -1) {
        return token({
          type : 'identifier',
          value : res[1]
        });
      } else {
        return token({ type : res[1] });
      }
    }
  };

  // `number()` recognises a number eg. `12`, `3.142`
  var number = function () {
    var res = /^\d+(\.?\d+)?/.exec(input);
    if (res) {
      advance(res[0].length);
      return token({
        type : 'number',
        value : res[0]
      });
    }
  };

  // `string()` recognises a string. e.g `'Hello, World!'`
  var string = function () {

    var pointer = 0,
        end = false,
        escaped = false;

    if (input.charAt(pointer) === '\'') {

      while (!end) {

        pointer++;

        if (pointer === input.length) {
          return token({
            type : 'error',
            value : 'Unterminated string'
          });
        }

        if (input.charAt(pointer) === '\\') {
          escaped = true;
        } else if (input.charAt(pointer) === '\'' && !escaped) {
          end = true;
        } else if (escaped) {
          escaped = false;
        }

      }

      var res = input.substr(0, pointer + 1);
      advance(pointer + 1);

      return token({
        type : 'string',
        value : res
      });
    }
  };

  // `single()` recognises any allowed single
  // character. If this fails, it creates an error
  // token with the offending character.
  var single = function () {

    var c = input.substr(0, 1);
    advance(1);

    return (allowedSymbols.indexOf(c) === -1)
      ? token({
        type : 'error',
        value : '`' + c + '` (illegal token)'
        })
      : token({ type : c });

  };

  // Expose `lex` and `setInput` methods
  // publicly (to the parser).
  lexer.lex = lex;
  lexer.setInput = setInput;
  lexer.lookahead = lookahead;

  // `getPosition()` is a public method that gets
  // the current position of the lexer on its input.
  // It is used to create meaningful error messages.
  lexer.getPosition = function () {
    return position;
  };

  return lexer;

};

module.exports = createLexer;