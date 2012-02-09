
// Module dependencies.
var fs = require('fs'),
  token = require('./token');


var createLexer = function (spec) {

  // `lexer` and instance variables
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
      '...',
      'for',
      'while',
      'to',
      'true',
      'false',
      'local',
      '{}',
      '[]',
      'where'
    ],
    allowedSymbols = [
      '+', '-', '/', '*', '(', ')', ':', '=',
      '?', ',', '.', '|', '&', '!', '<', '>'
    ];

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

    // Return the token
    //console.log(t);
    return t;

  };

  // Sets the input of the `lexer` to
  // the given string.
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

  // Discards `num` characters
  // from the start of the input.
  var advance = function (num) {
    input = input.substr(num);
    position += num;
  };

  // Retrieves the next token recognised on the input.
  var next = function () {

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
      || identifier()
      || number()
      || string()
      || single();

  };

  var lookahead = function (n) {

    while (tokenStash.length < n) {
      var l = lex();
      tokenStash.unshift(l);
    }

    return tokenStash[n - 1];

  };

  // Recognises linear whitespace: ` ` and `\t`

  var linearWhitespace = function () {
    var res = /^[ \t]+/.exec(input);
    if (res) {
      advance(res[0].length);
    }
  };

  // Recognises a newline character and
  // sends off the following whitespace
  // to be analysed for indents.
  var newline = function () {
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
  var eof = function () {
    if (input.length === 0) {
      return [token({ type : 'eof' })];
    }
  };

  // Analyses a change in indent and produces
  // a token if required, which may turn out
  // to be an indent, a newline or an error
  // (inconsistent indentation).
  var determineIndent = function (indentString) {

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

   // Recognises an identifier eg. `foo`, `bar`.
   // Also recognised reserved words by matching
   // against the whitelist of reserved words.
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

  // Recognises a number eg. `12`, `3.142`
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

  // Recognises a string. e.g `'Hello, World!'`
  var string = function () {
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
  var single = function () {
    
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

module.exports = createLexer;
