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

	array: 'dog' 'cat' 'human' or ['dog' 'cat' 'human']

	array:
		'dog'
		'cat'
		'human'

	function: arg1 arg2 arg3
		return arg1 + arg2 + arg3

## Assignment:

The equals sign is used to assign a value to a variable for later use. Variables do
not have to declared before they are used. Like JavaScript, variables have function-scope.

The following are examples of assignments:

	result = 2+3

	variableName = object:
		property value
		etc etc

	myArray = array: 'dog' 'cat' 'human'

	my2dArray = array:
		array 'dog' 'cat' 'human'
		array 'fish' 'crab' 'duck'

	myComplexObject = object:
		underwater array:
			'fish'
			'dog'
			'cat'
		land array:
			'dog'
			'cat'
			'human'

	myFunction = function: arg1 arg2 arg3
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

## Lazy arguments

Lazy arguments serve two purposes: 1. to enable passing annonymous functions
as arguments and 2. to enhance legibility.

A placeholder is named with curly braces '{}', and must be defined immediately after the
closing parenthesis of the function call, with an indent.

(doSomething {options})
	options = object:
		speed 10
		onEnd function:
			return 'hello'

## Annonymous Functions as arguments

Functions can be passed as the last argument to a function with the comma, since this is
the most common behviour (for use as a callback function).

The following code is equivalent:

	($ '#id'):(bind 'click' function:e),
			console:(log e.target)

	($ '#id'):(bind 'click' {callback})
		callback = function: e
			console:(log e.target)


## Objects and inheritance

Like JavaScript, Cap uses prototype inheritance. To reinforce this, there is no 'new' keyword.
'new' implies classical inheritance, which leads to confusion in javascript. All new objects must
be created (cloned) from a previous object, known as its prototype. Object is always at the root of the
prototype chain.

The syntax:

obj = object:
	key 'val'

is essentially shorthand for

obj = Object:(clone)
obj.key = 'val'


A simple example:

Human = Object:(clone)
	hands 2
	legs 2
	move function: dist
		console:(log 'Walking ' . dist . ' paces')

Man = Object:(clone Human)
	speakGender 'male'

ben = Object:(clone Man)
ben:(walk 10)
//-> Walking 10 paces
ben:(speakGender)
//-> Male
