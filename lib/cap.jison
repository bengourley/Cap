%start S

%%

S
	: objectliteral indent identifier NUMBER dedent
		{ console.log($4); }
	;

NUMBER
	: number
		{ return yy.yytext }
	;
