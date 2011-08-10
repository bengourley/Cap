# Grammar

This document outlines the proposed Cap grammar.

## Expressions:

Expressions return a value. In Cap, a value can one of the following generalised
types: a string, a number, an object, an array or a function. // TODO have I missed any other types?

The following are examples of Cap expressions:

	2+3

	object:
		property value
		function arg1 arg2 arg3
			return arg1 + arg2 + arg3

	array 'dog' 'cat' 'human'

	array:
		'dog'
		'cat'
		'human'

	function arg1 arg2 arg3
		return arg1 + arg2 + arg3

## Assignment:

The equals sign is used to assign a value to a variable for later use. Variables do
not have to declared before they are used. Like JavaScript, variables have function-scope.

The following are examples of assignments:

	result = 2+3

	variableName = object
		property value
		etc etc

	myArray = array 'dog' 'cat' 'human'

	my2dArray = array
		array 'dog' 'cat' 'human'
		array 'fish' 'crab' 'duck'

	myComplexObject = object
		underwater array
			'fish'
			'dog'
			'cat'
		land array
			'dog'
			'cat'
			'human'

	myFunction = function arg1 arg2 arg3
		return arg1 + arg2 + arg3

## Accessing object properties:

Using the . syntax

	myObject.prop

// TODO Decide whether to allow ['xyz'] syntax for building strings programmatically


## Invocation:

A function is invoked by wrapping it's name and arguments in parens.

	(myFunction 1 2 3)


## Using a returned value

A function invokation can be used as an expression. The result is the value that is returned
by the function (if anything).

	result = (myFunction 1 2 3)
	
	// Nested function calls
	(myFunction (myOtherFunction 1 2 3) 2 3)


## Function Chaining

The colon operator can be used to chain function calls (if the returned value from
one function is an object with functions).

myObject:(setName 'bob'):(concat 'Hi ')

## Annonymous Functions

Annoymous functions can only be passed as the last argument.
This is common practice as they are normally used to define
trivial callbacks anyway.

All functions defined in Cap have an implicit callback argument.

	($ '#id'):(bind 'click'),
		console:(log 'Click')
