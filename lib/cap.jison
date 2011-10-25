%start S

%%

S
	: PROGRAM_BLOCK
		{ return new yy.nodes.Program($1); }
	;

/*
	Brings what is returned from the statement
	list rule into a linear data structure
*/
PROGRAM_BLOCK
	: STATEMENT_LIST
		{ $$ = new yy.nodes.StatementList($1); }
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
		{ $$ = new yy.nodes.Call($1, $2); }
	;

FUNCTION_POINTER
	: FUNCTION_CALL
	| EXPRESSION
	;

ARGUMENT
	: EXPRESSION
	;

/*
	Tuples
*/

TUPLE
	: leftbracket TUPLE_LIST rightbracket
		{ $$ = $2 }
	;

TUPLE_LIST
	: EXPRESSION comma EXPRESSION
		{ $$ = [$1, $3] }
	| TUPLE_LIST comma EXPRESSION
		{ $$ = $1.concat($3) }
	;

/*
	Assignment
*/

ASSIGNMENT
	: ID equals EXPRESSION
		{ $$ = new yy.nodes.Assign($1, $3); }
	;

/*
	Conditionals
*/

CONDITIONAL
	: IF_CLAUSE vwhitespace
		{ $$ = new yy.nodes.Conditional($1[0], $1[1], ''); }
	| IF_CLAUSE vwhitespace ELSE_CLAUSE vwhitespace
		{ $$ = new yy.nodes.Conditional($1[0], $1[1], $3); }
	| IF_CLAUSE vwhitespace ELSE_IF_CLAUSE vwhitespace ELSE_CLAUSE vwhitespace
		{ $$ = new yy.nodes.Conditional($1[0], $1[1], $5); }
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
		{ $$ = new yy.nodes.Where($1, $6); }
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
		{ $$ = $2 }
	| FUNCTION_CALL
	| TUPLE
	;

/*
	Object and function literals
*/

OBJECT_LITERAL
	: objectliteral vwhitespace indent vwhitespace PROPERTY_LIST vwhitespace dedent
		{ $$ = new yy.nodes.Object($5); }
	;

FUNCTION_LITERAL
	: functionliteral PARAM vwhitespace indent vwhitespace PROGRAM_BLOCK dedent
		{ $$ = new yy.nodes.Function($6, $2); }
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
		{ $$ = new yy.nodes.Primative($1) }
	| DYNAMIC_REFERENCE
	;

REFERENCE
	: REFERENCE dot IDENTIFIER
		{ $$ = $1 + '.' + $3 }
	| IDENTIFIER
	;

DYNAMIC_REFERENCE
	: leftbracket FUNCTION_CALL rightbracket dot REFERENCE
		{ $$ = new yy.nodes.DynamicId($2, $5); }
	;

/*
	Primative types that can just wrap
	their text in a generic node
*/

NUMBER
	: number
		{ $$ = new yy.nodes.Primative(yytext); }
	;

IDENTIFIER
	: identifier
		{ $$ = yytext; }
	;

STRING
	: string
		{ $$ = new yy.nodes.Primative(yytext); }
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
