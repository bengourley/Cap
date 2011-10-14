%start S

%%

S
	: PROGRAM_BLOCK
		{ return $$; }
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
	: TOP_LEVEL_FUNCTION_CALL vwhitespace
	| ASSIGNMENT vwhitespace
	| CONDITIONAL
	;

/*
	Function calls
*/

TOP_LEVEL_FUNCTION_CALL
	: ID tilde ARG_LIST
		{ $$ = new yy.nodes.Call($1, $3); }
	;

/*
	In order to acheive nested function calls
	without making the grammar ambiguous, there
	must be a differentiation between top-level
	and nested function calls.
	A nested function call may only take arguments
	if it is bracketed, otherwise all following
	arguments are passed to the parent function call.
*/

NESTED_FUNCTION_CALL
	: leftbracket TOP_LEVEL_FUNCTION_CALL rightbracket
		{ $$ = $2 }
	| ID tilde
		{ $$ = new yy.nodes.Call($1, []); }
	;

/*
	A list of arguments for a function
	call. May be empty.
*/
ARG_LIST
	: ARG_LIST ARG_EXPRESSION
		{ $$ = $1.concat([$2]); }
	| EMPTY
		{ $$ = []; }
	;

/*
	Assignment
*/

ASSIGNMENT
	: ID equals ASSIGN_EXPRESSION
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
	: if ASSIGN_EXPRESSION vwhitespace indent vwhitespace PROGRAM_BLOCK dedent
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
	Expressions
*/

/*
	There are different rules
	depending on the context.
*/

EXPRESSION 
	: NUMBER
	| STRING
	| ID
	| OBJECT_LITERAL
	| FUNCTION_LITERAL
	;

ASSIGN_EXPRESSION
	: EXPRESSION
	| TOP_LEVEL_FUNCTION_CALL
	;

ARG_EXPRESSION
	: NUMBER
	| STRING
	| ID
	| NESTED_FUNCTION_CALL
	;

/*
	Object and function literals
*/

OBJECT_LITERAL
	: objectliteral vwhitespace indent vwhitespace PROPERTY_LIST vwhitespace dedent
		{ $$ = new yy.nodes.Object($5); }
	;

FUNCTION_LITERAL
	: functionliteral vwhitespace indent vwhitespace PROGRAM_BLOCK dedent
		{ $$ = new yy.nodes.Function($5); }
	;

PROPERTY_LIST
	: PROPERTY_LIST vwhitespace ID ASSIGN_EXPRESSION
		{ $$ = $1.concat([[$3, $4]]); }
	| ID ASSIGN_EXPRESSION
		{ $$ = [[$1, $2]]; }
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
	: leftbracket TOP_LEVEL_FUNCTION_CALL rightbracket dot REFERENCE
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

EMPTY
	:
	;
