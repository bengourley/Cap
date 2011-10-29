/* Jison generated parser */
var cap = (function(){

var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"S":3,"PROGRAM_BLOCK":4,"STATEMENT_LIST":5,"STATEMENT":6,"EMPTY":7,"ASSIGNMENT":8,"vwhitespace":9,"CONDITIONAL":10,"EXPRESSION":11,"WHERE":12,"FUNCTION_CALL":13,"FUNCTION_POINTER":14,"ARGUMENT":15,"TUPLE":16,"leftbracket":17,"TUPLE_LIST":18,"rightbracket":19,"comma":20,"ID":21,"equals":22,"IF_CLAUSE":23,"ELSE_CLAUSE":24,"ELSE_IF_CLAUSE":25,"if":26,"indent":27,"dedent":28,"ELSEIF_CLAUSES":29,"else":30,"where":31,"ASSIGNMENT_LIST":32,"NUMBER":33,"STRING":34,"OBJECT_LITERAL":35,"FUNCTION_LITERAL":36,"UNIT":37,"CONCATENATION":38,"dot":39,"objectliteral":40,"PROPERTY_LIST":41,"functionliteral":42,"PARAM":43,"IDENTIFIER":44,"REFERENCE":45,"DYNAMIC_REFERENCE":46,"number":47,"identifier":48,"string":49,"OPT_VWHITESPACE":50,"$accept":0,"$end":1},
terminals_: {2:"error",9:"vwhitespace",17:"leftbracket",19:"rightbracket",20:"comma",22:"equals",25:"ELSE_IF_CLAUSE",26:"if",27:"indent",28:"dedent",30:"else",31:"where",39:"dot",40:"objectliteral",42:"functionliteral",47:"number",48:"identifier",49:"string"},
productions_: [0,[3,1],[4,1],[5,2],[5,1],[6,2],[6,1],[6,2],[6,2],[13,2],[14,1],[14,1],[15,1],[16,3],[18,3],[18,3],[8,3],[10,2],[10,4],[10,6],[23,7],[29,1],[24,6],[12,8],[32,1],[32,3],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,3],[11,1],[11,1],[11,1],[38,3],[38,3],[35,7],[36,7],[41,4],[41,2],[43,2],[43,1],[21,1],[21,1],[45,3],[45,1],[46,5],[33,1],[44,1],[34,1],[50,1],[50,1],[37,2],[7,0]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return yy.nodes.program({ statementList : $$[$0] }); 
break;
case 2: this.$ = yy.nodes.statementList({ statements : $$[$0] }); 
break;
case 3: this.$ = $$[$0-1].concat([$$[$0]]); 
break;
case 4: this.$ = []; 
break;
case 9: this.$ = yy.nodes.call({ fn : $$[$0-1], arg : $$[$0] }); 
break;
case 13: this.$ = $$[$0-1] 
break;
case 14: this.$ = [$$[$0-2], $$[$0]] 
break;
case 15: this.$ = $$[$0-2].concat($$[$0]) 
break;
case 16: this.$ = yy.nodes.assign({ id : $$[$0-2], expr : $$[$0] }); 
break;
case 17: this.$ = yy.nodes.conditional({ ifClause : $$[$0-1][0], ifBody : $$[$0-1][1] }); 
break;
case 18: this.$ = yy.nodes.conditional({ ifClause : $$[$0-3][0], ifBody : $$[$0-3][1], elseBody : $$[$0-1] }); 
break;
case 19: this.$ = yy.nodes.conditional({ ifClause : $$[$0-5][0], ifBody : $$[$0-5][1], elseBody : $$[$0-1] }); 
break;
case 20: this.$ = [$$[$0-5], $$[$0-1]] 
break;
case 22: this.$ = $$[$0-1]; 
break;
case 23: this.$ = yy.nodes.where({ call : $$[$0-7], pre : $$[$0-2] }); 
break;
case 24: this.$ = [$$[$0]] 
break;
case 25: this.$ = $$[$0-2].concat([$$[$0]]); 
break;
case 32: this.$ = $$[$0-1]; 
break;
case 35: this.$ = yy.nodes.concatenation({ exprList : $$[$0] }); 
break;
case 36: this.$ = $$[$0-2].concat([$$[$0]]); 
break;
case 37: this.$ = [$$[$0-2], $$[$0]]; 
break;
case 38: this.$ = yy.nodes.object({ propList : $$[$0-2] }); 
break;
case 39: this.$ = yy.nodes.fn({ body : $$[$0-1], param : $$[$0-5] }); 
break;
case 40: this.$ = $$[$0-3].concat([[$$[$0-1], $$[$0]]]); 
break;
case 41: this.$ = [[$$[$0-1], $$[$0]]]; 
break;
case 44: this.$ = yy.nodes.node({ value : $$[$0] }) 
break;
case 46: this.$ = $$[$0-2] + '.' + $$[$0] 
break;
case 48: this.$ = yy.nodes.dynamicId({ call : $$[$0-3], prop : $$[$0] }); 
break;
case 49: this.$ = yy.nodes.node({ value : yytext }); 
break;
case 50: this.$ = yytext; 
break;
case 51: this.$ = yy.nodes.node({ value : yytext }); 
break;
}
},
table: [{1:[2,55],3:1,4:2,5:3,7:4,17:[2,55],26:[2,55],40:[2,55],42:[2,55],47:[2,55],48:[2,55],49:[2,55]},{1:[3]},{1:[2,1]},{1:[2,2],6:5,8:6,10:7,11:8,12:9,13:18,14:28,16:19,17:[1,17],21:10,23:11,26:[1,23],28:[2,2],33:12,34:13,35:14,36:15,37:16,38:20,40:[1,26],42:[1,27],44:29,45:21,46:22,47:[1,24],48:[1,30],49:[1,25]},{1:[2,4],17:[2,4],26:[2,4],28:[2,4],40:[2,4],42:[2,4],47:[2,4],48:[2,4],49:[2,4]},{1:[2,3],17:[2,3],26:[2,3],28:[2,3],40:[2,3],42:[2,3],47:[2,3],48:[2,3],49:[2,3]},{9:[1,31]},{1:[2,6],17:[2,6],26:[2,6],28:[2,6],40:[2,6],42:[2,6],47:[2,6],48:[2,6],49:[2,6]},{9:[1,32],17:[2,11],39:[1,33],40:[2,11],42:[2,11],47:[2,11],48:[2,11],49:[2,11]},{9:[1,34]},{9:[2,28],17:[2,28],22:[1,35],39:[2,28],40:[2,28],42:[2,28],47:[2,28],48:[2,28],49:[2,28]},{9:[1,36]},{9:[2,26],17:[2,26],19:[2,26],20:[2,26],31:[2,26],39:[2,26],40:[2,26],42:[2,26],47:[2,26],48:[2,26],49:[2,26]},{9:[2,27],17:[2,27],19:[2,27],20:[2,27],31:[2,27],39:[2,27],40:[2,27],42:[2,27],47:[2,27],48:[2,27],49:[2,27]},{9:[2,29],17:[2,29],19:[2,29],20:[2,29],31:[2,29],39:[2,29],40:[2,29],42:[2,29],47:[2,29],48:[2,29],49:[2,29]},{9:[2,30],17:[2,30],19:[2,30],20:[2,30],31:[2,30],39:[2,30],40:[2,30],42:[2,30],47:[2,30],48:[2,30],49:[2,30]},{9:[2,31],17:[2,31],19:[2,31],20:[2,31],31:[2,31],39:[2,31],40:[2,31],42:[2,31],47:[2,31],48:[2,31],49:[2,31]},{11:37,13:40,14:28,16:19,17:[1,17],18:39,19:[1,38],21:41,33:12,34:13,35:14,36:15,37:16,38:20,40:[1,26],42:[1,27],44:29,45:21,46:22,47:[1,24],48:[1,30],49:[1,25]},{9:[2,33],17:[2,33],31:[1,42],39:[2,33],40:[2,33],42:[2,33],47:[2,33],48:[2,33],49:[2,33]},{9:[2,34],17:[2,34],19:[2,34],20:[2,34],31:[2,34],39:[2,34],40:[2,34],42:[2,34],47:[2,34],48:[2,34],49:[2,34]},{9:[2,35],17:[2,35],19:[2,35],20:[2,35],31:[2,35],39:[1,43],40:[2,35],42:[2,35],47:[2,35],48:[2,35],49:[2,35]},{9:[2,44],17:[2,44],19:[2,44],20:[2,44],22:[2,44],31:[2,44],39:[1,44],40:[2,44],42:[2,44],47:[2,44],48:[2,44],49:[2,44]},{9:[2,45],17:[2,45],19:[2,45],20:[2,45],22:[2,45],31:[2,45],39:[2,45],40:[2,45],42:[2,45],47:[2,45],48:[2,45],49:[2,45]},{11:45,13:46,14:28,16:19,17:[1,17],21:41,33:12,34:13,35:14,36:15,37:16,38:20,40:[1,26],42:[1,27],44:29,45:21,46:22,47:[1,24],48:[1,30],49:[1,25]},{9:[2,49],17:[2,49],19:[2,49],20:[2,49],31:[2,49],39:[2,49],40:[2,49],42:[2,49],47:[2,49],48:[2,49],49:[2,49]},{9:[2,51],17:[2,51],19:[2,51],20:[2,51],31:[2,51],39:[2,51],40:[2,51],42:[2,51],47:[2,51],48:[2,51],49:[2,51]},{9:[1,47]},{7:50,9:[2,55],43:48,44:49,48:[1,30]},{11:52,13:46,14:28,15:51,16:19,17:[1,17],21:41,33:12,34:13,35:14,36:15,37:16,38:20,40:[1,26],42:[1,27],44:29,45:21,46:22,47:[1,24],48:[1,30],49:[1,25]},{9:[2,47],17:[2,47],19:[2,47],20:[2,47],22:[2,47],31:[2,47],39:[2,47],40:[2,47],42:[2,47],47:[2,47],48:[2,47],49:[2,47]},{9:[2,50],17:[2,50],19:[2,50],20:[2,50],22:[2,50],31:[2,50],39:[2,50],40:[2,50],42:[2,50],47:[2,50],48:[2,50],49:[2,50]},{1:[2,5],17:[2,5],26:[2,5],28:[2,5],40:[2,5],42:[2,5],47:[2,5],48:[2,5],49:[2,5]},{1:[2,7],17:[2,7],26:[2,7],28:[2,7],40:[2,7],42:[2,7],47:[2,7],48:[2,7],49:[2,7]},{11:53,13:46,14:28,16:19,17:[1,17],21:41,33:12,34:13,35:14,36:15,37:16,38:20,40:[1,26],42:[1,27],44:29,45:21,46:22,47:[1,24],48:[1,30],49:[1,25]},{1:[2,8],17:[2,8],26:[2,8],28:[2,8],40:[2,8],42:[2,8],47:[2,8],48:[2,8],49:[2,8]},{11:54,13:46,14:28,16:19,17:[1,17],21:41,33:12,34:13,35:14,36:15,37:16,38:20,40:[1,26],42:[1,27],44:29,45:21,46:22,47:[1,24],48:[1,30],49:[1,25]},{1:[2,17],17:[2,17],24:55,25:[1,56],26:[2,17],28:[2,17],30:[1,57],40:[2,17],42:[2,17],47:[2,17],48:[2,17],49:[2,17]},{17:[2,11],19:[1,58],20:[1,59],39:[1,33],40:[2,11],42:[2,11],47:[2,11],48:[2,11],49:[2,11]},{9:[2,54],17:[2,54],19:[2,54],20:[2,54],31:[2,54],39:[2,54],40:[2,54],42:[2,54],47:[2,54],48:[2,54],49:[2,54]},{19:[1,60],20:[1,61]},{17:[2,33],19:[1,62],20:[2,33],39:[2,33],40:[2,33],42:[2,33],47:[2,33],48:[2,33],49:[2,33]},{9:[2,28],17:[2,28],19:[2,28],20:[2,28],31:[2,28],39:[2,28],40:[2,28],42:[2,28],47:[2,28],48:[2,28],49:[2,28]},{9:[1,63]},{11:64,13:46,14:28,16:19,17:[1,17],21:41,33:12,34:13,35:14,36:15,37:16,38:20,40:[1,26],42:[1,27],44:29,45:21,46:22,47:[1,24],48:[1,30],49:[1,25]},{44:65,48:[1,30]},{9:[1,66],17:[2,11],39:[1,33],40:[2,11],42:[2,11],47:[2,11],48:[2,11],49:[2,11]},{9:[2,33],17:[2,33],19:[2,33],20:[2,33],31:[2,33],39:[2,33],40:[2,33],42:[2,33],47:[2,33],48:[2,33],49:[2,33]},{27:[1,67]},{9:[1,68]},{7:50,9:[2,55],43:69,44:49,48:[1,30]},{9:[2,43]},{9:[2,9],17:[2,9],19:[2,9],20:[2,9],31:[2,9],39:[2,9],40:[2,9],42:[2,9],47:[2,9],48:[2,9],49:[2,9]},{9:[2,12],17:[2,12],19:[2,12],20:[2,12],31:[2,12],39:[1,33],40:[2,12],42:[2,12],47:[2,12],48:[2,12],49:[2,12]},{9:[2,37],17:[2,37],19:[2,37],20:[2,37],31:[2,37],39:[1,33],40:[2,37],42:[2,37],47:[2,37],48:[2,37],49:[2,37]},{9:[2,16],17:[2,11],39:[1,33],40:[2,11],42:[2,11],47:[2,11],48:[2,11],49:[2,11]},{9:[1,70]},{9:[1,71]},{9:[1,72]},{9:[2,32],17:[2,32],19:[2,32],20:[2,32],31:[2,32],39:[2,32],40:[2,32],42:[2,32],47:[2,32],48:[2,32],49:[2,32]},{11:73,13:46,14:28,16:19,17:[1,17],21:41,33:12,34:13,35:14,36:15,37:16,38:20,40:[1,26],42:[1,27],44:29,45:21,46:22,47:[1,24],48:[1,30],49:[1,25]},{9:[2,13],17:[2,13],19:[2,13],20:[2,13],31:[2,13],39:[2,13],40:[2,13],42:[2,13],47:[2,13],48:[2,13],49:[2,13]},{11:74,13:46,14:28,16:19,17:[1,17],21:41,33:12,34:13,35:14,36:15,37:16,38:20,40:[1,26],42:[1,27],44:29,45:21,46:22,47:[1,24],48:[1,30],49:[1,25]},{39:[1,75]},{27:[1,76]},{9:[2,36],17:[2,36],19:[2,36],20:[2,36],31:[2,36],39:[1,33],40:[2,36],42:[2,36],47:[2,36],48:[2,36],49:[2,36]},{9:[2,46],17:[2,46],19:[2,46],20:[2,46],22:[2,46],31:[2,46],39:[2,46],40:[2,46],42:[2,46],47:[2,46],48:[2,46],49:[2,46]},{27:[1,77]},{9:[1,78]},{27:[1,79]},{9:[2,42]},{1:[2,18],17:[2,18],26:[2,18],28:[2,18],40:[2,18],42:[2,18],47:[2,18],48:[2,18],49:[2,18]},{24:80,30:[1,57]},{27:[1,81]},{17:[2,11],19:[2,14],20:[2,14],39:[1,33],40:[2,11],42:[2,11],47:[2,11],48:[2,11],49:[2,11]},{17:[2,11],19:[2,15],20:[2,15],39:[1,33],40:[2,11],42:[2,11],47:[2,11],48:[2,11],49:[2,11]},{44:29,45:82,48:[1,30]},{9:[1,83]},{9:[1,84]},{17:[1,87],21:86,41:85,44:29,45:21,46:22,48:[1,30]},{9:[1,88]},{9:[1,89]},{9:[1,90]},{9:[2,48],17:[2,48],19:[2,48],20:[2,48],22:[2,48],31:[2,48],39:[1,44],40:[2,48],42:[2,48],47:[2,48],48:[2,48],49:[2,48]},{8:92,17:[1,87],21:93,32:91,44:29,45:21,46:22,48:[1,30]},{4:94,5:3,7:4,17:[2,55],26:[2,55],28:[2,55],40:[2,55],42:[2,55],47:[2,55],48:[2,55],49:[2,55]},{9:[1,95]},{11:96,13:46,14:28,16:19,17:[1,17],21:41,33:12,34:13,35:14,36:15,37:16,38:20,40:[1,26],42:[1,27],44:29,45:21,46:22,47:[1,24],48:[1,30],49:[1,25]},{11:97,13:40,14:28,16:19,17:[1,17],21:41,33:12,34:13,35:14,36:15,37:16,38:20,40:[1,26],42:[1,27],44:29,45:21,46:22,47:[1,24],48:[1,30],49:[1,25]},{4:98,5:3,7:4,17:[2,55],26:[2,55],28:[2,55],40:[2,55],42:[2,55],47:[2,55],48:[2,55],49:[2,55]},{1:[2,19],17:[2,19],26:[2,19],28:[2,19],40:[2,19],42:[2,19],47:[2,19],48:[2,19],49:[2,19]},{4:99,5:3,7:4,17:[2,55],26:[2,55],28:[2,55],40:[2,55],42:[2,55],47:[2,55],48:[2,55],49:[2,55]},{9:[1,100]},{9:[2,24]},{22:[1,35]},{28:[1,101]},{17:[1,87],21:103,28:[1,102],44:29,45:21,46:22,48:[1,30]},{9:[2,41],17:[2,11],39:[1,33],40:[2,11],42:[2,11],47:[2,11],48:[2,11],49:[2,11]},{17:[2,11],39:[1,33],40:[2,11],42:[2,11],47:[2,11],48:[2,11],49:[2,11]},{28:[1,104]},{28:[1,105]},{8:107,17:[1,87],21:93,28:[1,106],44:29,45:21,46:22,48:[1,30]},{9:[2,20]},{9:[2,38],17:[2,38],19:[2,38],20:[2,38],31:[2,38],39:[2,38],40:[2,38],42:[2,38],47:[2,38],48:[2,38],49:[2,38]},{11:108,13:46,14:28,16:19,17:[1,17],21:41,33:12,34:13,35:14,36:15,37:16,38:20,40:[1,26],42:[1,27],44:29,45:21,46:22,47:[1,24],48:[1,30],49:[1,25]},{9:[2,39],17:[2,39],19:[2,39],20:[2,39],31:[2,39],39:[2,39],40:[2,39],42:[2,39],47:[2,39],48:[2,39],49:[2,39]},{9:[2,22]},{9:[2,23]},{9:[2,25]},{9:[2,40],17:[2,11],39:[1,33],40:[2,11],42:[2,11],47:[2,11],48:[2,11],49:[2,11]}],
defaultActions: {2:[2,1],50:[2,43],69:[2,42],92:[2,24],101:[2,20],105:[2,22],106:[2,23],107:[2,25]},
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
exports.parser = cap;
exports.parse = function () { return cap.parse.apply(cap, arguments); }
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