/* Jison generated parser */
var parser = (function(){
undefined
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"S":3,"PROGRAM_BLOCK":4,"STATEMENT_LIST":5,"STATEMENT":6,"EMPTY":7,"TOP_LEVEL_FUNCTION_CALL":8,"vwhitespace":9,"ASSIGNMENT":10,"CONDITIONAL":11,"ID":12,"tilde":13,"ARG_LIST":14,"NESTED_FUNCTION_CALL":15,"leftbracket":16,"rightbracket":17,"ARG_EXPRESSION":18,"equals":19,"ASSIGN_EXPRESSION":20,"IF_CLAUSE":21,"ELSE_CLAUSE":22,"ELSE_IF_CLAUSE":23,"if":24,"indent":25,"dedent":26,"ELSEIF_CLAUSES":27,"else":28,"EXPRESSION":29,"NUMBER":30,"STRING":31,"OBJECT_LITERAL":32,"FUNCTION_LITERAL":33,"objectliteral":34,"PROPERTY_LIST":35,"functionliteral":36,"REFERENCE":37,"DYNAMIC_REFERENCE":38,"dot":39,"IDENTIFIER":40,"number":41,"identifier":42,"string":43,"OPT_VWHITESPACE":44,"$accept":0,"$end":1},
terminals_: {2:"error",9:"vwhitespace",13:"tilde",16:"leftbracket",17:"rightbracket",19:"equals",23:"ELSE_IF_CLAUSE",24:"if",25:"indent",26:"dedent",28:"else",34:"objectliteral",36:"functionliteral",39:"dot",41:"number",42:"identifier",43:"string"},
productions_: [0,[3,1],[4,1],[5,2],[5,1],[6,2],[6,2],[6,1],[8,3],[15,3],[15,2],[14,2],[14,1],[10,3],[11,2],[11,4],[11,6],[21,7],[27,1],[22,6],[29,1],[29,1],[29,1],[29,1],[29,1],[20,1],[20,1],[18,1],[18,1],[18,1],[18,1],[32,7],[33,6],[35,4],[35,2],[12,1],[12,1],[37,3],[37,1],[38,5],[30,1],[40,1],[31,1],[44,1],[44,1],[7,0]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return this.$; 
break;
case 2: this.$ = new yy.nodes.StatementList($$[$0]); 
break;
case 3: this.$ = $$[$0-1].concat([$$[$0]]); 
break;
case 4: this.$ = []; 
break;
case 8: this.$ = new yy.nodes.Call($$[$0-2], $$[$0]); 
break;
case 9: this.$ = $$[$0-1] 
break;
case 10: this.$ = new yy.nodes.Call($$[$0-1], []); 
break;
case 11: this.$ = $$[$0-1].concat([$$[$0]]); 
break;
case 12: this.$ = []; 
break;
case 13: this.$ = new yy.nodes.Assign($$[$0-2], $$[$0]); 
break;
case 14: this.$ = new yy.nodes.Conditional($$[$0-1][0], $$[$0-1][1], ''); 
break;
case 15: this.$ = new yy.nodes.Conditional($$[$0-3][0], $$[$0-3][1], $$[$0-1]); 
break;
case 16: this.$ = new yy.nodes.Conditional($$[$0-5][0], $$[$0-5][1], $$[$0-1]); 
break;
case 17: this.$ = [$$[$0-5], $$[$0-1]] 
break;
case 19: this.$ = $$[$0-1]; 
break;
case 31: this.$ = new yy.nodes.Object($$[$0-2]); 
break;
case 32: this.$ = new yy.nodes.Function($$[$0-1]); 
break;
case 33: this.$ = $$[$0-3].concat([[$$[$0-1], $$[$0]]]); 
break;
case 34: this.$ = [[$$[$0-1], $$[$0]]]; 
break;
case 35: this.$ = new yy.nodes.Primative($$[$0]) 
break;
case 37: this.$ = $$[$0-2] + '.' + $$[$0] 
break;
case 39: this.$ = new yy.nodes.DynamicId($$[$0-3], $$[$0]); 
break;
case 40: this.$ = new yy.nodes.Primative(yytext); 
break;
case 41: this.$ = yytext; 
break;
case 42: this.$ = new yy.nodes.Primative(yytext); 
break;
}
},
table: [{1:[2,45],3:1,4:2,5:3,7:4,16:[2,45],24:[2,45],42:[2,45]},{1:[3]},{1:[2,1]},{1:[2,2],6:5,8:6,10:7,11:8,12:9,16:[1,15],21:10,24:[1,13],26:[2,2],37:11,38:12,40:14,42:[1,16]},{1:[2,4],16:[2,4],24:[2,4],26:[2,4],42:[2,4]},{1:[2,3],16:[2,3],24:[2,3],26:[2,3],42:[2,3]},{9:[1,17]},{9:[1,18]},{1:[2,7],16:[2,7],24:[2,7],26:[2,7],42:[2,7]},{13:[1,19],19:[1,20]},{9:[1,21]},{9:[2,35],13:[2,35],16:[2,35],17:[2,35],19:[2,35],34:[2,35],36:[2,35],39:[1,22],41:[2,35],42:[2,35],43:[2,35]},{9:[2,36],13:[2,36],16:[2,36],17:[2,36],19:[2,36],34:[2,36],36:[2,36],41:[2,36],42:[2,36],43:[2,36]},{8:25,12:28,16:[1,15],20:23,29:24,30:26,31:27,32:29,33:30,34:[1,33],36:[1,34],37:11,38:12,40:14,41:[1,31],42:[1,16],43:[1,32]},{9:[2,38],13:[2,38],16:[2,38],17:[2,38],19:[2,38],34:[2,38],36:[2,38],39:[2,38],41:[2,38],42:[2,38],43:[2,38]},{8:35,12:36,16:[1,15],37:11,38:12,40:14,42:[1,16]},{9:[2,41],13:[2,41],16:[2,41],17:[2,41],19:[2,41],34:[2,41],36:[2,41],39:[2,41],41:[2,41],42:[2,41],43:[2,41]},{1:[2,5],16:[2,5],24:[2,5],26:[2,5],42:[2,5]},{1:[2,6],16:[2,6],24:[2,6],26:[2,6],42:[2,6]},{7:38,9:[2,45],14:37,16:[2,45],17:[2,45],41:[2,45],42:[2,45],43:[2,45]},{8:25,12:28,16:[1,15],20:39,29:24,30:26,31:27,32:29,33:30,34:[1,33],36:[1,34],37:11,38:12,40:14,41:[1,31],42:[1,16],43:[1,32]},{1:[2,14],16:[2,14],22:40,23:[1,41],24:[2,14],26:[2,14],28:[1,42],42:[2,14]},{40:43,42:[1,16]},{9:[1,44]},{9:[2,25]},{9:[2,26]},{9:[2,20]},{9:[2,21]},{9:[2,22],13:[1,19]},{9:[2,23]},{9:[2,24]},{9:[2,40],16:[2,40],17:[2,40],41:[2,40],42:[2,40],43:[2,40]},{9:[2,42],16:[2,42],17:[2,42],41:[2,42],42:[2,42],43:[2,42]},{9:[1,45]},{9:[1,46]},{17:[1,47]},{13:[1,19]},{9:[2,8],12:51,15:52,16:[1,53],17:[2,8],18:48,30:49,31:50,37:11,38:12,40:14,41:[1,31],42:[1,16],43:[1,32]},{9:[2,12],16:[2,12],17:[2,12],41:[2,12],42:[2,12],43:[2,12]},{9:[2,13]},{9:[1,54]},{9:[1,55]},{9:[1,56]},{9:[2,37],13:[2,37],16:[2,37],17:[2,37],19:[2,37],34:[2,37],36:[2,37],39:[2,37],41:[2,37],42:[2,37],43:[2,37]},{25:[1,57]},{25:[1,58]},{25:[1,59]},{39:[1,60]},{9:[2,11],16:[2,11],17:[2,11],41:[2,11],42:[2,11],43:[2,11]},{9:[2,27],16:[2,27],17:[2,27],41:[2,27],42:[2,27],43:[2,27]},{9:[2,28],16:[2,28],17:[2,28],41:[2,28],42:[2,28],43:[2,28]},{9:[2,29],13:[1,61],16:[2,29],17:[2,29],41:[2,29],42:[2,29],43:[2,29]},{9:[2,30],16:[2,30],17:[2,30],41:[2,30],42:[2,30],43:[2,30]},{8:62,12:36,16:[1,15],37:11,38:12,40:14,42:[1,16]},{1:[2,15],16:[2,15],24:[2,15],26:[2,15],42:[2,15]},{22:63,28:[1,42]},{25:[1,64]},{9:[1,65]},{9:[1,66]},{9:[1,67]},{37:68,40:14,42:[1,16]},{9:[2,10],16:[2,10],17:[2,10],41:[2,10],42:[2,10],43:[2,10]},{17:[1,69]},{9:[1,70]},{9:[1,71]},{4:72,5:3,7:4,16:[2,45],24:[2,45],26:[2,45],42:[2,45]},{12:74,16:[1,15],35:73,37:11,38:12,40:14,42:[1,16]},{4:75,5:3,7:4,16:[2,45],24:[2,45],26:[2,45],42:[2,45]},{9:[2,39],13:[2,39],16:[2,39],17:[2,39],19:[2,39],34:[2,39],36:[2,39],39:[1,22],41:[2,39],42:[2,39],43:[2,39]},{9:[2,9],16:[2,9],17:[2,9],39:[1,60],41:[2,9],42:[2,9],43:[2,9]},{1:[2,16],16:[2,16],24:[2,16],26:[2,16],42:[2,16]},{4:76,5:3,7:4,16:[2,45],24:[2,45],26:[2,45],42:[2,45]},{26:[1,77]},{9:[1,78]},{8:25,12:28,16:[1,15],20:79,29:24,30:26,31:27,32:29,33:30,34:[1,33],36:[1,34],37:11,38:12,40:14,41:[1,31],42:[1,16],43:[1,32]},{26:[1,80]},{26:[1,81]},{9:[2,17]},{12:83,16:[1,15],26:[1,82],37:11,38:12,40:14,42:[1,16]},{9:[2,34]},{9:[2,32]},{9:[2,19]},{9:[2,31]},{8:25,12:28,16:[1,15],20:84,29:24,30:26,31:27,32:29,33:30,34:[1,33],36:[1,34],37:11,38:12,40:14,41:[1,31],42:[1,16],43:[1,32]},{9:[2,33]}],
defaultActions: {2:[2,1],24:[2,25],25:[2,26],26:[2,20],27:[2,21],29:[2,23],30:[2,24],39:[2,13],77:[2,17],79:[2,34],80:[2,32],81:[2,19],82:[2,31],84:[2,33]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    };

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+'\nExpecting '+expected.join(', ');
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};
return parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    if (typeof process !== 'undefined') {
        var source = require('fs').readFileSync(require('path').join(process.cwd(), args[1]), "utf8");
    } else {
        var cwd = require("file").path(require("file").cwd());
        var source = cwd.join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
}