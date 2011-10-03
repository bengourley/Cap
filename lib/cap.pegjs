start
	= Expression

Expression
	= ObjectLiteral

ObjectLiteral
	= "object:" LineTerminator ObjectProp*

ObjectProp
	= Indent ObjectKeyDef

ObjectKeyDef
	= Identifier " " [a-z]+

LineTerminator
	= [\n\r\u2028\u2029]

Indent
	= "  "

Identifier
	= [a-z]+
