%start S

%%

S
	: PROGRAM_BLOCK
		{ return yy.nodes.program({ statementList : $1 }); }
	;

/*
	Brings what is returned from the statement
	list rule into a linear data structure
*/
PROGRAM_BLOCK
	: STATEMENT_LIST
		{ $$ = yy.nodes.statementList({ statements : $1 }); }
	;

STATEMENT_LIST
	: STATEMENT_LIST STATEMENT
		{ $$ = $1.concat([$2]); }
	| EMPTY
		{ $$ = []; }
	;

/*
	Statement is the fundamental building block
	of the language. A cap program is a list of
	statements.
*/
STATEMENT
	: ASSIGNMENT vwhitespace
	| CONDITIONAL
	| EXPRESSION vwhitespace
	| WHERE vwhitespace
	;

/*
	Function calls
*/

FUNCTION_CALL
	: FUNCTION_POINTER ARGUMENT
		{ $$ = yy.nodes.call({ fn : $1, arg : $2 }); }
	;

FUNCTION_POINTER
	: EXPRESSION
	;

ARGUMENT
	: EXPRESSION
	;

/*
	Assignment
*/

ASSIGNMENT
	: ID equals EXPRESSION
		{ $$ = yy.nodes.assign({ id : $1, expr : $3 }); }
	;

/*
	Conditionals
*/

CONDITIONAL
	: IF_CLAUSE vwhitespace
		{ $$ = yy.nodes.conditional({ ifClause : $1[0], ifBody : $1[1] }); }
	| IF_CLAUSE vwhitespace ELSE_CLAUSE vwhitespace
		{ $$ = yy.nodes.conditional({ ifClause : $1[0], ifBody : $1[1], elseBody : $3 }); }
	| IF_CLAUSE vwhitespace ELSE_IF_CLAUSE vwhitespace ELSE_CLAUSE vwhitespace
		{ $$ = yy.nodes.conditional({ ifClause : $1[0], ifBody : $1[1], elseBody : $5 }); }
	;

IF_CLAUSE
	: if EXPRESSION vwhitespace indent vwhitespace PROGRAM_BLOCK dedent
		{ $$ = [$2, $6] }
	;

ELSEIF_CLAUSES
	: EMPTY
	;

ELSE_CLAUSE
	: else vwhitespace indent vwhitespace PROGRAM_BLOCK dedent
		{ $$ = $5; }
	;

/*
	Where clause
*/

WHERE
	: FUNCTION_CALL where vwhitespace indent vwhitespace ASSIGNMENT_LIST vwhitespace dedent
		{ $$ = yy.nodes.where({ call : $1, pre : $6 }); }
	;

ASSIGNMENT_LIST
	: ASSIGNMENT
		{ $$ = [$1] }
	| ASSIGNMENT_LIST vwhitespace ASSIGNMENT
		{ $$ = $1.concat([$3]); }
	;


/*
	Expressions
*/

EXPRESSION 
	: NUMBER
	| STRING
	| ID
	| OBJECT_LITERAL
	| FUNCTION_LITERAL
	| UNIT
	| leftbracket EXPRESSION rightbracket
		{ $$ = $2; }
	| leftbracket TUPLE_LIST rightbracket
		{ $$ = $2; }
	| FUNCTION_CALL
	| CONCATENATION
		{ $$ = yy.nodes.concatenation({ exprList : $1 }); }
	| MATHSY
	;

TUPLE_LIST
	: EXPRESSION comma EXPRESSION
		{ $$ = [$1, $3] }
	| TUPLE_LIST comma EXPRESSION
		{ $$ = $1.concat($3) }
	;

CONCATENATION
	: CONCATENATION dot EXPRESSION
		{ $$ = $1.concat([$3]); }
	|	EXPRESSION dot EXPRESSION
		{ $$ = [$1, $3]; }
	;

MATHSY
	: EXPRESSION plus EXPRESSION
		{ $$ = yy.nodes.mathsy({ fix : 'in', left : $1, right : $3, op : '+' }); }
	| EXPRESSION forwardslash EXPRESSION
		{ $$ = yy.nodes.mathsy({ fix : 'in', left : $1, right : $3, op : '/' }); }
	| EXPRESSION asterisk EXPRESSION
		{ $$ = yy.nodes.mathsy({ fix : 'in', left : $1, right : $3, op : '*' }); }
	| EXPRESSION minus EXPRESSION
		{ $$ = yy.nodes.mathsy({ fix : 'in', left : $1, right : $3, op : '-' }); }
	| minus EXPRESSION
		{ $$ = yy.nodes.mathsy({ fix : 'pre', left : $2, op : '-' }); }
	;

/*
	Object and function literals
*/

OBJECT_LITERAL
	: objectliteral vwhitespace indent vwhitespace PROPERTY_LIST vwhitespace dedent
		{ $$ = yy.nodes.object({ propList : $5 }); }
	;

FUNCTION_LITERAL
	: functionliteral PARAM vwhitespace indent vwhitespace PROGRAM_BLOCK dedent
		{ $$ = yy.nodes.fn({ body : $6, param : $2 }); }
	;

PROPERTY_LIST
	: PROPERTY_LIST vwhitespace ID EXPRESSION
		{ $$ = $1.concat([[$3, $4]]); }
	| ID EXPRESSION
		{ $$ = [[$1, $2]]; }
	;

PARAM
	:	IDENTIFIER PARAM
	| EMPTY
	;

/*
 Compound identifiers
*/

ID
	: REFERENCE
		{ $$ = yy.nodes.node({ value : $1 }) }
	| DYNAMIC_REFERENCE
	;

REFERENCE
	: REFERENCE dot IDENTIFIER
		{ $$ = $1 + '.' + $3 }
	| IDENTIFIER
	;

DYNAMIC_REFERENCE
	: EXPRESSION dot REFERENCE
		{ $$ = yy.nodes.dynamicId({ call : $2, prop : $5 }); }
	;

/*
	Primative types that can just wrap
	their text in a generic node
*/

NUMBER
	: number
		{ $$ = yy.nodes.node({ value : yytext }); }
	;

IDENTIFIER
	: identifier
		{ $$ = yytext; }
	;

STRING
	: string
		{ $$ = yy.nodes.node({ value : yytext }); }
	;
OPT_VWHITESPACE
	: vwhitespace
	| EMPTY
	;

UNIT
	: leftbracket rightbracket
	;

EMPTY
	:
	;
