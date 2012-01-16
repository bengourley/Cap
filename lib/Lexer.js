
// Module dependencies.
var fs = require('fs'),
  token = require('./token');


var lexer = function (spec) {

  // `lexer` and instance variables
  var lexer = {},
    input = '',
    completeInput = '',
    indentStack = [''],
    tokens = [],
    tokenStash = [],
    position = 0,
    startOfFile = true,
    reservedWords = ['if', 'else', 'where', 'for', 'each', 'while', 'true', 'false'],
    allowedSymbols = ['+', '-', '/', '*', '(', ')', ':', '=', '?', ',', '.', '|', '&', '!'],

    // Methods
    lex,
    setInput,
    advance,
    next,
    lookahead,
    linearWhitespace,
    determineIndent,
    newline,
    eof,
    literal,
    identifier,
    number,
    string,
    single;

  lex = function () {

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
    // token was generate in a previous pass.
    var t = tokenStash.length > 0
      ? tokenStash.shift()
      : next();

    // If the next token is actually an array of tokens,
    // store them in the `tokenStash`.
    if (Array.isArray(t)) {
      tokenStash = tokenStash.concat(t);
      t = tokenStash.shift();
    }

    // Return the token.
    return t;

  };

  // Sets the input of the `lexer` to
  // the given string.
  setInput = function (str) {
    input = str;
    completeInput = str;
    return lexer;
  };

  // Discards `num` characters
  // from the start of the input.
  advance = function (num) {
    input = input.substr(num);
    position += num;
  };

  // Retrieves the next token recognised on the input.
  next = function () {

    // Each of these methods only return a truthy value
    // if they return a token. The order of these functions
    // matter, since `linearWhitespace()` and `newline()` can
    // consume input without returning anything.
    // A call to `single()` will always return a token, which
    // will be an allowed single character of the language, or
    // an 'unrecognised character' error token.

    return linearWhitespace()
      || newline()
      || eof()
      || literal()
      || identifier()
      || number()
      || string()
      || single();

  };

  lookahead = function (n) {

    while (tokenStash.length < n) {
      var l = lex();
      tokenStash.unshift(l);
    }

    return tokenStash[n - 1];

  };

  // Recognises linear whitespace: ` ` and `\t`

  linearWhitespace = function () {
    var res = /^[ \t]+/.exec(input);
    if (res) {
      advance(res[0].length);
    }
  };

  // Recognises a newline character and
  // sends off the following whitespace
  // to be analysed for indents.
  newline = function () {
    var res = /^[\n\r\u2028\u2029]+([\t ]*)/.exec(input), indent, ts;
    if (res) {
      ts = [token({ type : 'vwhitespace'})];
      advance(res[0].length);
      lexer.lineno += /^[\n\r\u2028\u2029]+/.exec(res[0])[0].length;
      indent = res[1];
      // Determine indent
      if (indent !== indentStack[indentStack.length - 1]) {
        ts = determineIndent(indent);
      }
      return ts.length === 1 ? ts[0] : ts;
    }
  };

  // Recognises the end of the file
  eof = function () {
    if (input.length === 0) {
      return token({ type : 'eof' });
    }
  };

   // Analyses a change in indent and produces
   // a token if required, which may turn out
   // to be an indent, a newline or an error
   // (inconsistent indentation).
  determineIndent = function (indentString) {

    if (indentString.indexOf(indentStack.join('')) === 0) {
      indentStack.push(indentString);
      return [
        token({ type : 'vwhitespace' }),
        token({ type : 'indent' }),
        token({ type : 'vwhitespace' })
      ];
    } else {

      var dedentCount = 0, dedents, i;
      while (indentStack.join('') !== indentString && indentStack.pop()) {
        dedentCount++;
      }

      if (indentStack.join('') !== indentString) {
        return token({ type : 'error', value : 'Inconsistent indentation' });
      } else {
        dedents = [token({ type : 'vwhitespace' })];
        for (i = 0; i < dedentCount; i++) {
          dedents.push(token({ type : 'dedent'}), token({ type : 'vwhitespace' }));
        }
        return dedents;
      }

    }

  };

  // Recognises a literal: `object:`, `function:` or `array:`
  literal = function () {
    var res = /^(obj|fun|arr):/.exec(input);
    if (res) {
      advance(res[0].length);
      return token({ type : res[1] + 'literal' });
    }
  };

   // Recognises an identifier eg. `foo`, `bar`.
   // Also recognised reserved words by matching
   // against the whitelist of reserved words.
  identifier = function () {
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

  // Recognises a number eg. `12`, `3.142`
  number = function () {
    var res = /^\d+(\.?\d+)?/.exec(input);
    if (res) {
      advance(res[0].length);
      return token({
        type : 'number',
        value : res[0]
      });
    }
  };

  // Recognises a string. e.g `'Hello, World!'`
  string = function () {
    var res = /^'([^'])*'/.exec(input);
    if (res) {
      advance(res[0].length);
      return token({
        type : 'string',
        value : res[0]
      });
    }
  };

  // Recognises any allowed single character.
  // If this fails, create an error token
  // with the offending character.
  single = function () {
    
    var c = input.substr(0, 1);
    advance(1);

    return (allowedSymbols.indexOf(c) === -1)
      ? token({
        type : 'error',
        value : 'Unrecognized character: ' + c
        })
      : token({ type : c });

  };

  // Expose `lex` and `setInput` to the parser
  lexer.lex = lex;
  lexer.setInput = setInput;
  lexer.lookahead = lookahead;
  lexer.lineno = 1;

  return lexer;

};

module.exports = lexer;
